import express from 'express';
import {
  getInternships,
  getInternshipById,
  applyForInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/internshipController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getInternships);
router.get('/:id', getInternshipById);
router.post('/:id/apply', optionalProtect, applyForInternship);

// Admin Endpoints
router.get('/admin/applications', protect, adminOnly, getAllApplications);
router.put('/admin/applications/:id', protect, adminOnly, updateApplicationStatus);
router.post('/', protect, adminOnly, createInternship);
router.put('/:id', protect, adminOnly, updateInternship);
router.delete('/:id', protect, adminOnly, deleteInternship);

export default router;
