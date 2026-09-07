import express from 'express';
import { createOrder, getOrderById, getMyOrders } from '../controllers/orderController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalProtect, createOrder);
router.get('/my-orders', optionalProtect, getMyOrders);
router.get('/:id', getOrderById);

export default router;
