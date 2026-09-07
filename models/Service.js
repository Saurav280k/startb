import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Development', 'Growth', 'SEO', 'Design', 'Cloud & DevOps'],
    required: true,
  },
  tag: {
    type: String,
    default: 'Popular',
  },
  shortDesc: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    default: 'Code',
  },
  pricingTiers: [
    {
      tierName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      features: [String],
      turnaroundDays: Number,
      isPopular: {
        type: Boolean,
        default: false,
      },
    },
  ],
  rating: {
    type: Number,
    default: 4.9,
  },
  completedProjects: {
    type: Number,
    default: 140,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Service', serviceSchema);
