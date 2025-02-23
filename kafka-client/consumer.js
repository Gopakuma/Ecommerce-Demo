import kafka from './kafka.js';
import Product from '../database/models/Product.js';

const consumer = kafka.consumer({groupId: 'order-group'});

const createOrder = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order_created', fromBeginning: true });

    await consumer.run({
        eachMessage : async ( {topic, partition, message} ) => {
            const orderData = JSON.parse(message.value.toString());
            await updateInventory(orderData);
        }
    });
}

async function updateInventory(updatedInventoryData) {
    try {
        const bulkOps = [];
        if(updatedInventoryData && updatedInventoryData.length) {
            for(const item of updatedInventoryData) {
                const { id , quantity } = item;
                const ops = 
                            {
                                updateOne: {
                                    filter: { _id: id },
                                    update: {
                                        $set: { quantity }
                                    },
                                    ordered: true 
                                }
                            }
                        bulkOps.push(ops);    
                        const result = await Product.bulkWrite(bulkOps);
                        console.log(result);
            }
        }
    } catch(e) {
        console.log(e)
    }
} 

createOrder().catch(console.error);

export default createOrder;