import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  internshipTitle: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applicantName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ['Student/Self-taught', '1-2 Years', '3+ Years'],
    default: 'Student/Self-taught',
  },
  portfolioUrl: {
    type: String,
    default: '',
  },
  githubUrl: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  whyJoin: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Application', applicationSchema);
