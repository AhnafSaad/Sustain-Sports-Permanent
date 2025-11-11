import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Donation from '../models/donationModel.js';

// --- User Management ---

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    // You might want to add a check here to prevent deleting the root admin
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- Product Management ---

// @desc    Get all products
// @route   GET /api/admin/products
export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('category', 'name');
    res.json(products);
});

// @desc    Create a product
// @route   POST /api/admin/products
export const createProduct = asyncHandler(async (req, res) => {
  const defaultCategory = await Category.findOne();
  if (!defaultCategory) {
    res.status(400);
    throw new Error('No categories found. Please create a category first.');
  }

  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    images: ['/images/sample.jpg'], // <-- এই লাইনটি যোগ করা হয়েছে
    category: defaultCategory._id,
    description: 'Sample description',
    inStock: false,
    originalPrice: 0,
    fullDescription: 'This is a sample product. Please update its details.',
    ecoTag: 'Eco Friendly',
    features: ['Feature 1', 'Feature 2'],
  });
  
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get product by ID
// @route   GET /api/admin/products/:id
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});


// @desc    Update a product
// @route   PUT /api/admin/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  // --- 'images' এখানে যোগ করা হয়েছে ---
  const { name, price, description, image, category, inStock, originalPrice, fullDescription, ecoTag, features, images } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price === undefined ? product.price : price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;
    product.inStock = inStock === undefined ? product.inStock : inStock;
    product.originalPrice = originalPrice === undefined ? product.originalPrice : originalPrice;
    product.fullDescription = fullDescription || product.fullDescription;
    product.ecoTag = ecoTag || product.ecoTag;
    product.features = features || product.features;
    product.images = images || product.images; // <-- এই লাইনটি যোগ করা হয়েছে

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// @desc    Get app statistics (users, products, etc.)
// @route   GET /api/admin/stats
export const getAppStats = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    res.json({ userCount, productCount });
});


// --- Donation Management ---

// @desc    Get all donations
// @route   GET /api/admin/donations
export const getDonations = asyncHandler(async (req, res) => {
    const donations = await Donation.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(donations);
});

// @desc    Update a donation's status
// @route   PUT /api/admin/donations/:id
export const updateDonationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['Approved', 'Disapproved', 'Pending'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
    }

    const donation = await Donation.findById(req.params.id);

    if (donation) {
        donation.status = status;
        const updatedDonation = await donation.save();
        res.json(updatedDonation);
    } else {
        res.status(404);
        throw new Error('Donation not found');
    }
});