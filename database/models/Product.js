import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  }
});

export default mongoose.model('Product', productSchema);