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
    enum: ['pending_verification', 'completed', 'failed', 'refunded'],
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
    default: 'Verification in Progress',
  },
  transferStage: {
    type: String,
    enum: ['payment_submitted', 'payment_verified', 'security_cleared', 'credentials_dispatched', 'completed', 'refund_requested', 'refunded', 'rejected'],
    default: 'payment_submitted',
  },
  transferCredentials: {
    loginUsername: { type: String, default: '' },
    password: { type: String, default: '' },
    originalEmail: { type: String, default: '' },
    securityNotes: { type: String, default: '' },
    dispatchedAt: { type: Date, default: null },
  },
  refund: {
    status: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected'],
      default: 'none',
    },
    reason: { type: String, default: '' },
    upiId: { type: String, default: '' },
    buyerNotes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    requestedAt: { type: Date, default: null },
    processedAt: { type: Date, default: null },
  },
  transferTimeline: [
    {
      stage: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
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
