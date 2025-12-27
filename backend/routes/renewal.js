const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   POST /api/renewal
// @desc    Create renewal application
// @access  Private
router.post('/', [
  body('existingPassportNumber').notEmpty().withMessage('Existing passport number is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('reason').isIn(['expired', 'damaged', 'lost', 'name_change', 'other']).withMessage('Valid reason is required')
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

    const { existingPassportNumber, expiryDate, reason, additionalInfo } = req.body;

    // Find user's existing application to copy data
    const existingApplication = await Application.findOne({
      applicantId: req.user._id,
      'passportDetails.passportNumber': existingPassportNumber,
      isActive: true
    }).sort({ createdAt: -1 });

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: 'No existing passport application found with this passport number'
      });
    }

    // Create renewal application with existing data
    const renewalData = {
      applicantId: req.user._id,
      applicationType: 'renewal',
      personalInfo: existingApplication.personalInfo,
      addressInfo: existingApplication.addressInfo,
      documents: existingApplication.documents,
      renewalInfo: {
        existingPassportNumber,
        expiryDate: new Date(expiryDate),
        reason,
        additionalInfo
      },
      status: 'draft'
    };

    const renewalApplication = new Application(renewalData);
    await renewalApplication.save();

    // Create notification
    await Notification.create({
      userId: req.user._id,
      applicationId: renewalApplication._id,
      type: 'status_update',
      title: 'Renewal Application Created',
      message: `Your passport renewal application ${renewalApplication.applicationNumber} has been created successfully.`,
      priority: 'medium'
    });

    res.status(201).json({
      success: true,
      message: 'Renewal application created successfully',
      data: {
        application: renewalApplication
      }
    });
  } catch (error) {
    console.error('Create renewal application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/renewal/eligible
// @desc    Check if user is eligible for renewal
// @access  Private
router.get('/eligible', async (req, res) => {
  try {
    // Find user's existing applications
    const existingApplications = await Application.find({
      applicantId: req.user._id,
      status: 'approved',
      isActive: true
    }).sort({ createdAt: -1 });

    const eligiblePassports = existingApplications.map(app => ({
      passportNumber: app.passportDetails?.passportNumber,
      issueDate: app.passportDetails?.issueDate,
      expiryDate: app.passportDetails?.expiryDate,
      applicationNumber: app.applicationNumber
    }));

    res.json({
      success: true,
      data: {
        eligiblePassports,
        canRenew: eligiblePassports.length > 0
      }
    });
  } catch (error) {
    console.error('Check renewal eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/renewal/:id/submit
// @desc    Submit renewal application
// @access  Private
router.post('/:id/submit', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id,
      applicationType: 'renewal',
      isActive: true
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Renewal application not found'
      });
    }

    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Application already submitted'
      });
    }

    // Update status to submitted
    application.status = 'submitted';
    await application.save();

    // Create notification
    await Notification.create({
      userId: req.user._id,
      applicationId: application._id,
      type: 'status_update',
      title: 'Renewal Application Submitted',
      message: `Your passport renewal application ${application.applicationNumber} has been submitted successfully and is under review.`,
      priority: 'high'
    });

    res.json({
      success: true,
      message: 'Renewal application submitted successfully',
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Submit renewal application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/renewal/history
// @desc    Get renewal history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const renewalApplications = await Application.find({
      applicantId: req.user._id,
      applicationType: 'renewal',
      isActive: true
    })
    .sort({ createdAt: -1 })
    .populate('applicantId', 'name email');

    res.json({
      success: true,
      data: {
        applications: renewalApplications
      }
    });
  } catch (error) {
    console.error('Get renewal history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

