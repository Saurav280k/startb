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

// @desc    Create a new account product (Admin only)
// @route   POST /api/accounts
export const createAccount = async (req, res) => {
  try {
    const {
      title,
      platform,
      handle,
      profileUrl = '',
      followersCount,
      engagementRate,
      niche,
      price,
      originalPrice,
      verifiedBadge = false,
      monetizationEnabled = false,
      monthlyRevenue = 0,
      accountAgeYears = 1,
      audienceStats = {},
      screenshots = [],
      description,
      highlights = [],
      transferTimeHours = 1,
    } = req.body;

    if (!title || !platform || !handle || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, platform, handle, and price',
      });
    }

    const defaultScreenshots = screenshots.length > 0 ? screenshots : [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    ];

    const cleanHandle = handle.trim().replace(/^@/, '');
    let finalProfileUrl = profileUrl ? profileUrl.trim() : '';
    if (!finalProfileUrl) {
      if (platform === 'Instagram') finalProfileUrl = `https://instagram.com/${cleanHandle}`;
      else if (platform === 'YouTube') finalProfileUrl = `https://youtube.com/@${cleanHandle}`;
      else if (platform === 'TikTok') finalProfileUrl = `https://tiktok.com/@${cleanHandle}`;
      else if (platform === 'X/Twitter') finalProfileUrl = `https://x.com/${cleanHandle}`;
      else if (platform === 'Telegram') finalProfileUrl = `https://t.me/${cleanHandle}`;
      else finalProfileUrl = `https://${cleanHandle}`;
    }

    const account = await Account.create({
      title: title.trim(),
      platform: platform.trim(),
      handle: handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      profileUrl: finalProfileUrl,
      followersCount: Number(followersCount) || 10000,
      engagementRate: Number(engagementRate) || 5.0,
      niche: niche ? niche.trim() : 'Creator & Lifestyle',
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) * 1.25,
      verifiedBadge: Boolean(verifiedBadge),
      monetizationEnabled: Boolean(monetizationEnabled),
      monthlyRevenue: Number(monthlyRevenue) || 0,
      accountAgeYears: Number(accountAgeYears) || 1,
      audienceStats: {
        topCountries: audienceStats.topCountries || ['India (50%)', 'United States (30%)'],
        genderDistribution: audienceStats.genderDistribution || '60% Male / 40% Female',
        primaryAgeGroup: audienceStats.primaryAgeGroup || '18-34 years (85%)',
      },
      screenshots: defaultScreenshots,
      description: description ? description.trim() : `${title} verified asset ready for immediate handoff.`,
      highlights: highlights.length > 0 ? highlights : [
        'Full credential ownership handoff',
        'Original recovery email included',
        'Verified clean account with no active strikes',
      ],
      status: 'available',
      transferTimeHours: Number(transferTimeHours) || 1,
    });

    res.status(201).json({
      success: true,
      message: 'New account listing created successfully!',
      account,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an account product (Admin only)
// @route   PUT /api/accounts/:id
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Account updated successfully!',
      account: updatedAccount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an account product (Admin only)
// @route   DELETE /api/accounts/:id
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    await Account.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Account listing deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

