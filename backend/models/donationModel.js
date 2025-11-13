import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Disapproved'],
    default: 'Pending',
  },
  // --- ADDED: Field to store the generated promo code ---
  promoCode: {
    type: String,
  },
}, {
  timestamps: true,
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
