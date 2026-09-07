import Internship from '../models/Internship.js';
import Application from '../models/Application.js';

// @desc    Get all internships
// @route   GET /api/internships
export const getInternships = async (req, res) => {
  try {
    const { domain, search } = req.query;
    let query = { status: 'active' };

    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const internships = await Internship.find(query).sort({ createdAt: -1 });
    const domains = await Internship.distinct('domain');

    res.json({
      success: true,
      count: internships.length,
      domains: ['All', ...domains],
      internships,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship position not found' });
    }
    res.json({ success: true, internship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for an internship
// @route   POST /api/internships/:id/apply
export const applyForInternship = async (req, res) => {
  try {
    const { applicantName, email, phone, experienceLevel, portfolioUrl, githubUrl, linkedinUrl, whyJoin } = req.body;

    if (!applicantName || !email || !phone || !whyJoin) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone number, and statement of purpose',
      });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship position not found' });
    }

    // Check if duplicate application within 30 days
    const existingApplication = await Application.findOne({
      internship: internship._id,
      email: email.toLowerCase().trim(),
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this specific position.',
      });
    }

    const application = await Application.create({
      internship: internship._id,
      internshipTitle: internship.title,
      user: req.user ? req.user._id : null,
      applicantName: applicantName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      domain: internship.domain,
      experienceLevel: experienceLevel || 'Student/Self-taught',
      portfolioUrl: portfolioUrl || '',
      githubUrl: githubUrl || '',
      linkedinUrl: linkedinUrl || '',
      whyJoin: whyJoin.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been received successfully! Our talent acquisition team will review your profile within 48 hours.',
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
