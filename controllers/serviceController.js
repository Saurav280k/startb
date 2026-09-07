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
