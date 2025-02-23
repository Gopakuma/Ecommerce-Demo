import express from 'express';
import config from 'config';
import router from './Api/routes.js';
import connectDB from './database/mongo-connection.js';
import createOrder from './kafka-client/consumer.js';
import cors from 'cors';

const server = config.get('server');
const PORT = server.port;

const app = express();

app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json({ limit: '10mb' }));
app.use(router);
connectDB();

app.listen(PORT, (err) => {
    if(err) console.log("Error connecting to the server", err);
    console.log(`Connected to ${PORT}`)
})

export default app;