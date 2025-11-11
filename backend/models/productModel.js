import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // --- 1. ADDED: Link to the user who created the product ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // --- End of new field ---
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  fullDescription: {
    type: String,
  },
  // --- এই সেকশনটি পরিবর্তন করা হয়েছে ---
  image: {
    type: String,
    required: false, // এটিকে আর required রাখছি না, কারণ 'images' অ্যারে প্রধান হবে
  },
  images: {
    type: [String], // ছবিকে একটি অ্যারে হিসাবে যোগ করা হয়েছে
    default: [],  // ডিফল্ট হিসাবে একটি খালি অ্যারে দেওয়া হয়েছে
  },
  // --- পরিবর্তন শেষ ---
  ecoTag: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  features: {
    type: [String],
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;