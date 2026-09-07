import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/services
export const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDesc: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ rating: -1 });
    const categories = await Service.distinct('category');

    res.json({
      success: true,
      count: services.length,
      categories: ['All', ...categories],
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new digital service (Admin only)
// @route   POST /api/services
export const createService = async (req, res) => {
  try {
    const { title, shortDesc, description, category, pricingTiers, icon, deliverables, turnaroundDays } = req.body;

    if (!title || !category || !pricingTiers || pricingTiers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service title, category, and at least one pricing tier',
      });
    }

    const service = await Service.create({
      title: title.trim(),
      shortDesc: shortDesc ? shortDesc.trim() : title,
      description: description ? description.trim() : shortDesc,
      category: category.trim(),
      pricingTiers,
      icon: icon || 'Sparkles',
      deliverables: deliverables || ['Full source code', 'Deployment guide', '14 days post-launch support'],
      turnaroundDays: Number(turnaroundDays) || 5,
    });

    res.status(201).json({
      success: true,
      message: 'Digital service created successfully!',
      service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a digital service (Admin only)
// @route   PUT /api/services/:id
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Service updated successfully!',
      service: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a digital service (Admin only)
// @route   DELETE /api/services/:id
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Digital service deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

