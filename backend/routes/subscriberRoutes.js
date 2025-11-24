import express from 'express';
import asyncHandler from 'express-async-handler';
import Subscriber from '../models/subscriberModel.js';

const router = express.Router();

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Check if email already exists
  const subscriberExists = await Subscriber.findOne({ email });
  if (subscriberExists) {
    res.status(400);
    throw new Error('You are already subscribed!');
  }

  // 2. Create new subscriber
  const subscriber = await Subscriber.create({ email });

  if (subscriber) {
    res.status(201).json({
      message: 'Subscription successful',
      email: subscriber.email
    });
  } else {
    res.status(400);
    throw new Error('Invalid subscriber data');
  }
}));

export default router;