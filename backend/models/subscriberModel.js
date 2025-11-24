import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // This prevents the same email from being added twice
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt times automatically
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;