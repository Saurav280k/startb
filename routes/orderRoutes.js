import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  verifyPayment,
  updateTransferStatus,
  dispatchCredentials,
  completeHandoff,
  requestRefund,
  updateRefundStatus,
  getAdminStats,
} from '../controllers/orderController.js';
import { protect, optionalProtect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Endpoints
router.get('/', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.put('/:id/verify', protect, adminOnly, verifyPayment);
router.put('/:id/transfer', protect, adminOnly, updateTransferStatus);
router.put('/:id/dispatch-credentials', protect, adminOnly, dispatchCredentials);
router.put('/:id/complete-handoff', protect, adminOnly, completeHandoff);
router.put('/:id/refund-status', protect, adminOnly, updateRefundStatus);

// User & Public Endpoints
router.post('/', optionalProtect, createOrder);
router.get('/my-orders', optionalProtect, getMyOrders);
router.post('/:id/refund', optionalProtect, requestRefund);
router.get('/:id', getOrderById);

export default router;
