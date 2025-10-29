import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: String,
    rating: {
      rate: Number,
      count: Number
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  userId: {
    type: String,
    required: true,
    default: 'default-user'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;