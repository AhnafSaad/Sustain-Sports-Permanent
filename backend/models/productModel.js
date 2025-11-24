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
  image: {
    type: String,
    required: false, 
  },
  images: {
    type: [String], 
    default: [],  
  },
  ecoTag: {
    type: String,
  },
  // --- ADDED: Quantity Field ---
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  // ---------------------------
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