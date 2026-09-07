import express from 'express';
import { getAccounts, getAccountById, getFeaturedAccounts } from '../controllers/accountController.js';

const router = express.Router();

router.get('/', getAccounts);
router.get('/featured', getFeaturedAccounts);
router.get('/:id', getAccountById);

export default router;
