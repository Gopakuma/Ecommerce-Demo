import { sendCreateOrderEvent } from '../kafka-client/producer.js';
import Product from '../database/models/Product.js';

async function addProduct(req, res) {
    try {
        const { body } = req;
        const { data } = body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ message: "Data should be an array" });
        }

        const bulkOps = data.map(item => {
            const { _id , name, price, quantity } = item;
            
            return {
                updateOne: {
                    filter: { _id: _id },
                    update: {
                        $set: { name, price, quantity }
                    },
                    upsert: true,
                    ordered: true 
                }
            };
        });

        const result = await Product.bulkWrite(bulkOps);
        
        res.status(200).json({
            message: "Products processed successfully",
            insertedCount: result.upsertedCount,
            modifiedCount: result.modifiedCount
        });

    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({
            message: "Failed to process products",
            error: e.message
        });
    }
}

async function getAllDashboardItems(req, res) {
    try{
        const products = await Product.find({});
        res.send(
            {
                data : [products]
            }
        ).json();
    } catch(e) {
        console.log(e);
    }
}

async function orderItem(req, res) {
    try {
        const { body } = req;
        const { data } = body
        
        const updatedInventoryData = await generateInventoryData(data);
    
        //send kafka event to update inventory
        console.log('orderData', updatedInventoryData);
        await sendCreateOrderEvent(updatedInventoryData)
        res.send("Success")
    } catch(e) {
        console.log(e);
        res.send("Failed")
    }
   
}

async function generateInventoryData(orderDetails) {
    const ids = orderDetails.map((product) => product.id);
    const productsFromInventory = await Product.find({_id: { $in: ids }});
    
    const orders = [];

    for(const product of productsFromInventory) {
        const items = {
            id       : product.id,
            quantity : findNewQuantity(orderDetails, product)
        }
        orders.push(items);
    }

    return orders;
}

function findNewQuantity(orderDetails, product) {
    const productsFromOrder = orderDetails.find((item) => item.id == product.id)
    const updatedQuantity = product.quantity - productsFromOrder.quantity;
    if(updatedQuantity < 0) {
        throw new Error("Out of Stock")
    }
    return updatedQuantity;
}

export {
    addProduct,
    orderItem,
    getAllDashboardItems
};