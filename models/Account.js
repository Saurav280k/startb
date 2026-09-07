import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  platform: {
    type: String,
    enum: ['Instagram', 'YouTube', 'TikTok', 'X/Twitter', 'Telegram', 'LinkedIn'],
    required: true,
  },
  handle: {
    type: String,
    required: true,
    trim: true,
  },
  followersCount: {
    type: Number,
    required: true,
  },
  engagementRate: {
    type: Number,
    required: true,
  },
  niche: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  verifiedBadge: {
    type: Boolean,
    default: false,
  },
  monetizationEnabled: {
    type: Boolean,
    default: false,
  },
  monthlyRevenue: {
    type: Number,
    default: 0,
  },
  accountAgeYears: {
    type: Number,
    default: 2,
  },
  audienceStats: {
    topCountries: [String],
    genderDistribution: String,
    primaryAgeGroup: String,
  },
  screenshots: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  highlights: [String],
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available',
  },
  transferTimeHours: {
    type: Number,
    default: 2,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Account', accountSchema);
