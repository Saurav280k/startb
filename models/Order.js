import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  buyerEmail: {
    type: String,
    required: true,
    trim: true,
  },
  buyerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  transferDestinationEmail: {
    type: String,
    required: true,
    trim: true,
  },
  itemType: {
    type: String,
    enum: ['account', 'service', 'cart'],
    required: true,
  },
  cartItems: [
    {
      id: String,
      itemType: String,
      title: String,
      price: Number,
      platform: String,
      handle: String,
      tierName: String,
      image: String,
    },
  ],
  accountItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  serviceItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
  },
  itemSnapshot: {
    title: String,
    platform: String,
    handle: String,
    price: Number,
    image: String,
    tierName: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentMethod: {
    type: String,
    default: 'UPI',
  },
  upiTransactionId: {
    type: String,
    required: true,
    trim: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending_verification', 'completed', 'failed'],
    default: 'pending_verification',
  },
  verificationStatus: {
    type: String,
    enum: ['Pending Admin Approval', 'Approved & Verified', 'Rejected'],
    default: 'Pending Admin Approval',
  },
  safetyStatus: {
    type: String,
    default: '100% Safe Buyer Guarantee',
  },
  transferStatus: {
    type: String,
    enum: ['Verification in Progress', 'Credentials Sent to Email', 'Transfer Complete'],
    default: 'Verification in Progress',
  },
  transferEta: {
    type: String,
    default: 'Within 1 - 2 Hours',
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);
