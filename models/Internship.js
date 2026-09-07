import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full Stack', 'UI/UX Design', 'AI & Machine Learning', 'Cloud & DevOps', 'Digital Marketing'],
    required: true,
  },
  stipend: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: 'Remote / Global',
  },
  openings: {
    type: Number,
    default: 3,
  },
  deadline: {
    type: String,
    default: 'Rolling basis',
  },
  summary: {
    type: String,
    required: true,
  },
  responsibilities: [String],
  requirements: [String],
  perks: [String],
  skills: [String],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Internship', internshipSchema);
