const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET /api/admin/applications
// @desc    Get all applications for admin
// @access  Private (Admin only)
router.get('/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    let query = { isActive: true };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { applicationNumber: { $regex: search, $options: 'i' } },
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(query)
      .populate('applicantId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get admin applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/applications/:id
// @desc    Get specific application for admin
// @access  Private (Admin only)
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicantId', 'name email phone dateOfBirth gender')
      .populate('statusHistory.updatedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Get admin application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/applications/:id/status
// @desc    Update application status
// @access  Private (Admin only)
router.put('/applications/:id/status', [
  body('status').isIn(['submitted', 'under_verification', 'police_verification', 'approved', 'rejected', 'dispatched']).withMessage('Invalid status'),
  body('remarks').optional().isLength({ max: 500 }).withMessage('Remarks cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, remarks } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const oldStatus = application.status;
    application.status = status;
    application.remarks = remarks || application.remarks;

    await application.save();

    // Create notification for user
    const statusMessages = {
      'under_verification': 'Your application is now under verification.',
      'police_verification': 'Your application has been sent for police verification.',
      'approved': 'Congratulations! Your passport application has been approved.',
      'rejected': 'Your passport application has been rejected. Please check remarks for details.',
      'dispatched': 'Your passport has been dispatched and will be delivered soon.'
    };

    await Notification.create({
      userId: application.applicantId,
      applicationId: application._id,
      type: 'status_update',
      title: 'Application Status Updated',
      message: `Application ${application.applicationNumber}: ${statusMessages[status] || 'Status updated.'}`,
      priority: status === 'approved' || status === 'rejected' ? 'high' : 'medium',
      metadata: {
        oldStatus,
        newStatus: status
      }
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/applications/:id/police-verification
// @desc    Update police verification status
// @access  Private (Admin only)
router.put('/applications/:id/police-verification', [
  body('status').isIn(['pending', 'cleared', 'failed']).withMessage('Invalid police verification status'),
  body('remarks').optional().isLength({ max: 500 }).withMessage('Remarks cannot exceed 500 characters'),
  body('verifiedBy').optional().isLength({ max: 100 }).withMessage('Verified by field cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, remarks, verifiedBy } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.policeVerification = {
      status,
      remarks,
      verifiedBy,
      verifiedAt: status !== 'pending' ? new Date() : null
    };

    await application.save();

    // Create notification for user
    const verificationMessages = {
      'cleared': 'Police verification has been cleared successfully.',
      'failed': 'Police verification failed. Please check remarks for details.'
    };

    if (status !== 'pending') {
      await Notification.create({
        userId: application.applicantId,
        applicationId: application._id,
        type: 'verification_required',
        title: 'Police Verification Update',
        message: `Application ${application.applicationNumber}: ${verificationMessages[status]}`,
        priority: status === 'failed' ? 'high' : 'medium'
      });
    }

    res.json({
      success: true,
      message: 'Police verification status updated successfully',
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Update police verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments({ isActive: true });
    const pendingApplications = await Application.countDocuments({ 
      isActive: true, 
      status: { $in: ['submitted', 'under_verification'] } 
    });
    const approvedApplications = await Application.countDocuments({ 
      isActive: true, 
      status: 'approved' 
    });
    const rejectedApplications = await Application.countDocuments({ 
      isActive: true, 
      status: 'rejected' 
    });
    const policeVerificationPending = await Application.countDocuments({ 
      isActive: true, 
      'policeVerification.status': 'pending' 
    });

    // Recent applications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentApplications = await Application.find({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('applicantId', 'name email')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        statistics: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          policeVerificationPending
        },
        recentApplications
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

