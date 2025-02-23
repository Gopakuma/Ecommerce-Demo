import mongoose from 'mongoose';
import config from 'config';

const connectDB = async () => {
  try {
    const uri = config.get('mongoDB.uri');
    await mongoose.connect(uri,
      {
        dbName: 'ecommerce'
      }
    );
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;