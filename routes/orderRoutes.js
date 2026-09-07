import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  verifyPayment,
  updateTransferStatus,
  getAdminStats,
} from '../controllers/orderController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Endpoints
router.get('/', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.put('/:id/verify', protect, adminOnly, verifyPayment);
router.put('/:id/transfer', protect, adminOnly, updateTransferStatus);

// User & Public Endpoints
router.post('/', optionalProtect, createOrder);
router.get('/my-orders', optionalProtect, getMyOrders);
router.get('/:id', getOrderById);

export default router;
