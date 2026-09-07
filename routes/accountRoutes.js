import express from 'express';
import {
  getAccounts,
  getAccountById,
  getFeaturedAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '../controllers/accountController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAccounts);
router.get('/featured', getFeaturedAccounts);
router.get('/:id', getAccountById);

// Admin Only
router.post('/', protect, adminOnly, createAccount);
router.put('/:id', protect, adminOnly, updateAccount);
router.delete('/:id', protect, adminOnly, deleteAccount);

export default router;
