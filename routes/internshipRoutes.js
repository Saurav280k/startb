import express from 'express';
import {
  getInternships,
  getInternshipById,
  applyForInternship,
} from '../controllers/internshipController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getInternships);
router.get('/:id', getInternshipById);
router.post('/:id/apply', optionalProtect, applyForInternship);

export default router;
