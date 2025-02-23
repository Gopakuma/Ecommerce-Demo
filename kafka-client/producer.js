import kafka from './kafka.js';

const producer = kafka.producer();

const sendCreateOrderEvent = async (updatedInventoryData) => {
    await producer.connect();

    try {
        const result = await producer.send({
            topic: 'order_created',
            messages: [
                { value: JSON.stringify(updatedInventoryData) },
            ],
        });
        console.log('Message sent successfully', result);
    } catch (error) {
        console.log("Error", error);
    } finally {
        await producer.disconnect();
    }
}

export {
    sendCreateOrderEvent
};