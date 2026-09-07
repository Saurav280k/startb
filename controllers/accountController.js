import Account from '../models/Account.js';

// @desc    Get all accounts with filters & search
// @route   GET /api/accounts
export const getAccounts = async (req, res) => {
  try {
    const { platform, niche, verified, minPrice, maxPrice, minFollowers, search, sort } = req.query;

    let query = { status: 'available' };

    if (platform && platform !== 'All') {
      query.platform = platform;
    }

    if (niche && niche !== 'All') {
      query.niche = niche;
    }

    if (verified === 'true') {
      query.verifiedBadge = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minFollowers) {
      query.followersCount = { $gte: Number(minFollowers) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { handle: { $regex: search, $options: 'i' } },
        { niche: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'followers-high') sortOption = { followersCount: -1 };
    if (sort === 'engagement') sortOption = { engagementRate: -1 };

    const accounts = await Account.find(query).sort(sortOption);

    // Get list of unique platforms and niches for frontend filter pills
    const platforms = await Account.distinct('platform');
    const niches = await Account.distinct('niche');

    res.json({
      success: true,
      count: accounts.length,
      platforms: ['All', ...platforms],
      niches: ['All', ...niches],
      accounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single account by ID
// @route   GET /api/accounts/:id
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found or no longer available' });
    }
    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured top-tier accounts for homepage
// @route   GET /api/accounts/featured
export const getFeaturedAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ status: 'available' })
      .sort({ followersCount: -1 })
      .limit(6);
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
