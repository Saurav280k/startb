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

// @desc    Create a new internship position (Admin only)
// @route   POST /api/internships
export const createInternship = async (req, res) => {
  try {
    const { title, domain, stipend, duration, location, openings, summary, requirements, responsibilities, perks, skills } = req.body;

    if (!title || !domain || !stipend) {
      return res.status(400).json({
        success: false,
        message: 'Please provide internship title, domain, and stipend',
      });
    }

    const internship = await Internship.create({
      title: title.trim(),
      domain: domain.trim(),
      stipend: stipend.trim(),
      duration: duration || '3 Months',
      location: location || 'Work From Home (Remote)',
      openings: Number(openings) || 2,
      summary: summary || `${title} internship with hands-on mentor support.`,
      requirements: requirements || ['Basic knowledge of domain stack', 'Enthusiastic to learn'],
      responsibilities: responsibilities || ['Build production components', 'Participate in sprint standups'],
      perks: perks || ['Certificate of completion', 'Letter of recommendation', 'PPO opportunity'],
      skills: skills || ['Communication', 'Teamwork', domain],
      status: 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Internship position created successfully!',
      internship,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an internship position (Admin only)
// @route   PUT /api/internships/:id
export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship position not found' });
    }

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Internship updated successfully!',
      internship: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an internship position (Admin only)
// @route   DELETE /api/internships/:id
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship position not found' });
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Internship position deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all internship applications (Admin only)
// @route   GET /api/internships/admin/applications
export const getAllApplications = async (req, res) => {
  try {
    const { status, domain } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (domain && domain !== 'All') {
      query.domain = domain;
    }

    const applications = await Application.find(query)
      .populate('internship')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an application status (Admin only)
// @route   PUT /api/internships/admin/applications/:id
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // ['Pending', 'Reviewing', 'Shortlisted', 'Accepted', 'Rejected']

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (status) {
      application.status = status;
    }

    await application.save();

    res.json({
      success: true,
      message: `Application for ${application.applicantName} marked as ${application.status}!`,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

