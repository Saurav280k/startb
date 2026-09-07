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
