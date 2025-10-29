import mongoose from 'mongoose';

const fakeStoreProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// Add a virtual getter for _id that returns the id field
fakeStoreProductSchema.virtual('_id').get(function() {
  return this.id;
});

export default mongoose.model('FakeStoreProduct', fakeStoreProductSchema);