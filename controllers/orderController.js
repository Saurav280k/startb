import Order from '../models/Order.js';
import Account from '../models/Account.js';
import Service from '../models/Service.js';

// Helper to generate readable reference IDs
const generateId = (prefix) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
};

// @desc    Create a new order via UPI QR scan & slide-to-confirm
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      buyerEmail,
      buyerPhone,
      transferDestinationEmail,
      itemType,
      itemId,
      tierName,
      cartItems = [],
      upiTransactionId,
      notes = '',
    } = req.body;

    if (!buyerEmail || !buyerPhone || !transferDestinationEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email, phone number, and destination transfer email',
      });
    }

    if (!upiTransactionId || upiTransactionId.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your valid 12-digit UPI UTR / Transaction ID after scanning and paying',
      });
    }

    if (!itemType || (!itemId && itemType !== 'cart')) {
      return res.status(400).json({
        success: false,
        message: 'Order item specifications are missing',
      });
    }

    let amount = 0;
    let itemSnapshot = {};
    let accountItem = null;
    let serviceItem = null;
    let savedCartItems = [];

    if (itemType === 'cart') {
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart has no items' });
      }

      for (const item of cartItems) {
        amount += Number(item.price) || 0;
        if (item.type === 'account') {
          const acc = await Account.findById(item.id);
          if (acc) {
            acc.status = 'sold';
            await acc.save();
          }
        }
        savedCartItems.push({
          id: String(item.id),
          itemType: item.type || 'account',
          title: item.title,
          price: Number(item.price) || 0,
          platform: item.platform || '',
          handle: item.handle || '',
          tierName: item.tierName || '',
          image: item.image || '',
        });
      }

      itemSnapshot = {
        title: `${cartItems.length} Cart Items (${cartItems.map((i) => i.title).slice(0, 2).join(', ')}${cartItems.length > 2 ? '...' : ''})`,
        platform: 'Cart Order',
        handle: `${cartItems.length} Items`,
        price: amount,
        image: cartItems[0]?.image || '',
      };
    } else if (itemType === 'account') {
      const account = await Account.findById(itemId);
      if (!account) {
        return res.status(404).json({ success: false, message: 'The requested social account was not found' });
      }
      if (account.status === 'sold') {
        return res.status(400).json({ success: false, message: 'This account has already been bought by another user' });
      }

      amount = account.price;
      itemSnapshot = {
        title: account.title,
        platform: account.platform,
        handle: account.handle,
        price: account.price,
        image: account.screenshots && account.screenshots[0] ? account.screenshots[0] : '',
      };
      accountItem = account._id;

      // Mark account as sold
      account.status = 'sold';
      await account.save();
    } else if (itemType === 'service') {
      const service = await Service.findById(itemId);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Digital service not found' });
      }

      let selectedTier = service.pricingTiers[0];
      if (tierName) {
        const foundTier = service.pricingTiers.find((t) => t.tierName.toLowerCase() === tierName.toLowerCase());
        if (foundTier) selectedTier = foundTier;
      }

      amount = selectedTier.price;
      itemSnapshot = {
        title: service.title,
        platform: service.category,
        tierName: selectedTier.tierName,
        price: selectedTier.price,
        image: '',
      };
      serviceItem = service._id;
    }

    const orderNumber = generateId('APX-UPI');

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      buyerEmail: buyerEmail.toLowerCase().trim(),
      buyerPhone: buyerPhone.trim(),
      transferDestinationEmail: transferDestinationEmail.toLowerCase().trim(),
      itemType,
      accountItem,
      serviceItem,
      cartItems: savedCartItems,
      itemSnapshot,
      amount,
      currency: 'INR',
      paymentMethod: 'UPI',
      upiTransactionId: upiTransactionId.trim(),
      paymentStatus: 'pending_verification',
      verificationStatus: 'Pending Admin Approval',
      safetyStatus: '100% Safe Buyer Guarantee',
      transferStatus: 'Verification in Progress',
      transferStage: 'payment_submitted',
      transferTimeline: [
        {
          stage: 'payment_submitted',
          title: 'Payment Submitted',
          description: `UPI Transaction ID ${upiTransactionId.trim()} submitted for verification.`,
          timestamp: new Date(),
        },
      ],
      transferEta: 'Within 1 - 2 Hours',
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'UPI payment submitted successfully! Our team will verify your UTR and transfer your account credentials within 1-2 hours.',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('accountItem')
      .populate('serviceItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query.$or = [{ user: req.user._id }, { buyerEmail: req.user.email }];
    } else if (req.query.email) {
      query.buyerEmail = req.query.email.toLowerCase().trim();
    } else {
      return res.json({ success: true, orders: [] });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      if (status === 'Pending') {
        query.verificationStatus = 'Pending Admin Approval';
      } else if (status === 'Approved') {
        query.verificationStatus = 'Approved & Verified';
      } else if (status === 'Rejected') {
        query.verificationStatus = 'Rejected';
      } else if (status === 'Refunds') {
        query['refund.status'] = { $in: ['requested', 'approved', 'rejected'] };
      } else {
        query.verificationStatus = status;
      }
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } },
        { buyerPhone: { $regex: search, $options: 'i' } },
        { transferDestinationEmail: { $regex: search, $options: 'i' } },
        { upiTransactionId: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('accountItem')
      .populate('serviceItem')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject payment (Admin only)
// @route   PUT /api/orders/:id/verify
export const verifyPayment = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: 'Approved & Verified' | 'Rejected'

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status === 'Approved & Verified') {
      order.verificationStatus = 'Approved & Verified';
      order.paymentStatus = 'completed';
      order.transferStage = 'payment_verified';
      if (!order.transferStatus || order.transferStatus === 'Verification in Progress') {
        order.transferStatus = 'Verification in Progress';
      }
      order.transferEta = 'Within 1 - 2 Hours';
      if (!order.transferTimeline) order.transferTimeline = [];
      order.transferTimeline.push({
        stage: 'payment_verified',
        title: 'Payment Verified & Secured',
        description: 'UPI UTR transaction verified with bank. Funds are secured with Modern Teams buyer protection.',
        timestamp: new Date(),
      });
    } else if (status === 'Rejected') {
      order.verificationStatus = 'Rejected';
      order.paymentStatus = 'failed';
      order.transferStage = 'rejected';
      order.transferStatus = 'Verification in Progress';
      if (!order.transferTimeline) order.transferTimeline = [];
      order.transferTimeline.push({
        stage: 'rejected',
        title: 'Payment Verification Failed',
        description: notes || 'UPI UTR transaction could not be verified with bank records. Please contact support via WhatsApp.',
        timestamp: new Date(),
      });
      // If account was reserved, revert it to available
      if (order.accountItem) {
        await Account.findByIdAndUpdate(order.accountItem, { status: 'available' });
      }
    }

    if (notes) {
      order.notes = notes;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order #${order.orderNumber} payment marked as ${order.verificationStatus}!`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Dispatch credentials to buyer (Admin only)
// @route   PUT /api/orders/:id/dispatch-credentials
export const dispatchCredentials = async (req, res) => {
  try {
    const { loginUsername, password, originalEmail, securityNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.transferCredentials = {
      loginUsername: loginUsername || '',
      password: password || '',
      originalEmail: originalEmail || '',
      securityNotes: securityNotes || '',
      dispatchedAt: new Date(),
    };
    order.transferStatus = 'Credentials Sent to Email';
    order.transferStage = 'credentials_dispatched';

    if (!order.transferTimeline) order.transferTimeline = [];
    order.transferTimeline.push({
      stage: 'credentials_dispatched',
      title: 'Credentials Dispatched to Vault',
      description: `Account credentials successfully prepared and dispatched to ${order.transferDestinationEmail}. Details also unlocked in your Secure Credentials Vault below.`,
      timestamp: new Date(),
    });

    await order.save();

    res.json({
      success: true,
      message: `Credentials dispatched to ${order.transferDestinationEmail} for Order #${order.orderNumber}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete entire transfer handoff (Admin only)
// @route   PUT /api/orders/:id/complete-handoff
export const completeHandoff = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.transferStatus = 'Transfer Complete';
    order.transferStage = 'completed';

    if (!order.transferTimeline) order.transferTimeline = [];
    order.transferTimeline.push({
      stage: 'completed',
      title: 'Ownership Handoff Complete',
      description: 'Account login confirmed, recovery credentials verified, and 100% full ownership is transferred.',
      timestamp: new Date(),
    });

    await order.save();

    res.json({
      success: true,
      message: `Order #${order.orderNumber} handoff marked complete!`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update credential transfer status (Admin only legacy endpoint)
// @route   PUT /api/orders/:id/transfer
export const updateTransferStatus = async (req, res) => {
  try {
    const { transferStatus, transferNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (transferStatus) {
      order.transferStatus = transferStatus;
    }
    if (transferNotes) {
      order.notes = transferNotes;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order #${order.orderNumber} transfer status updated to "${order.transferStatus}"`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request refund for an order (Buyer)
// @route   POST /api/orders/:id/refund
export const requestRefund = async (req, res) => {
  try {
    const { reason, upiId, buyerNotes } = req.body;

    if (!reason || !upiId) {
      return res.status(400).json({ success: false, message: 'Reason and receiving UPI ID are required for refund request' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.refund = {
      status: 'requested',
      reason: reason.trim(),
      upiId: upiId.trim(),
      buyerNotes: (buyerNotes || '').trim(),
      requestedAt: new Date(),
    };
    order.transferStage = 'refund_requested';

    if (!order.transferTimeline) order.transferTimeline = [];
    order.transferTimeline.push({
      stage: 'refund_requested',
      title: 'Refund Requested by Buyer',
      description: `Refund claim submitted: "${reason}". Receiving UPI ID: ${upiId}. Modern Teams support is reviewing the claim.`,
      timestamp: new Date(),
    });

    await order.save();

    res.json({
      success: true,
      message: 'Refund request submitted successfully. Our team will review and process your refund within 2-4 hours.',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject refund (Admin only)
// @route   PUT /api/orders/:id/refund-status
export const updateRefundStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body; // 'approved' | 'rejected'

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.refund) {
      order.refund = { status: 'none' };
    }

    order.refund.status = status;
    order.refund.adminNotes = adminNotes || '';
    order.refund.processedAt = new Date();

    if (!order.transferTimeline) order.transferTimeline = [];

    if (status === 'approved') {
      order.paymentStatus = 'refunded';
      order.transferStatus = 'Refunded';
      order.transferStage = 'refunded';
      order.transferTimeline.push({
        stage: 'refund_approved',
        title: 'Refund Approved & Processed',
        description: `Refund of ₹${order.amount} approved and transferred back to UPI ID ${order.refund.upiId}. ${adminNotes || ''}`,
        timestamp: new Date(),
      });

      // Restore account if it was an account item
      if (order.accountItem) {
        await Account.findByIdAndUpdate(order.accountItem, { status: 'available' });
      }
    } else if (status === 'rejected') {
      order.transferStage = 'payment_verified';
      order.transferTimeline.push({
        stage: 'refund_rejected',
        title: 'Refund Request Declined',
        description: adminNotes || 'Refund request was declined after administrative review.',
        timestamp: new Date(),
      });
    }

    await order.save();

    res.json({
      success: true,
      message: `Refund marked as ${status} for Order #${order.orderNumber}!`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Admin Overview KPIs & Stats (Admin only)
// @route   GET /api/orders/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      verificationStatus: 'Pending Admin Approval',
    });
    const approvedOrders = await Order.countDocuments({
      verificationStatus: 'Approved & Verified',
    });
    const rejectedOrders = await Order.countDocuments({
      verificationStatus: 'Rejected',
    });

    const revenueData = await Order.aggregate([
      { $match: { verificationStatus: 'Approved & Verified' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const totalAccounts = await Account.countDocuments();
    const availableAccounts = await Account.countDocuments({ status: 'available' });
    const soldAccounts = await Account.countDocuments({ status: 'sold' });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        approvedOrders,
        rejectedOrders,
        totalAccounts,
        availableAccounts,
        soldAccounts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

