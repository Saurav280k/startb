import express from 'express';
import Setting from '../models/Setting.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get payments status (public)
// @route   GET /api/settings/payments
router.get('/payments', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'payments_enabled' });
    const paymentsEnabled = setting ? Boolean(setting.value) : true;

    res.json({
      success: true,
      paymentsEnabled,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update payments status (admin only)
// @route   PUT /api/settings/payments
router.put('/payments', protect, adminOnly, async (req, res) => {
  try {
    const { paymentsEnabled } = req.body;
    const isEnabled = paymentsEnabled !== undefined ? Boolean(paymentsEnabled) : true;

    const setting = await Setting.findOneAndUpdate(
      { key: 'payments_enabled' },
      {
        key: 'payments_enabled',
        value: isEnabled,
        description: 'Global toggle to enable or disable marketplace payments',
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      paymentsEnabled: Boolean(setting.value),
      message: isEnabled
        ? 'Marketplace checkout and payments have been enabled.'
        : 'Marketplace checkout and payments have been paused.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
