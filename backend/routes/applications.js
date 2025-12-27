const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/applications
// @desc    Get user's applications
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ 
      applicantId: req.user._id,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .populate('applicantId', 'name email phone');

    res.json({
      success: true,
      data: {
        applications
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/applications/:id
// @desc    Get specific application
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id,
      isActive: true
    }).populate('applicantId', 'name email phone');

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
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/applications
// @desc    Create new application
// @access  Private
router.post('/', [
  authMiddleware,
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.fatherName').notEmpty().withMessage('Father name is required'),
  body('personalInfo.motherName').notEmpty().withMessage('Mother name is required'),
  body('personalInfo.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('personalInfo.placeOfBirth').notEmpty().withMessage('Place of birth is required'),
  body('personalInfo.gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('personalInfo.maritalStatus').isIn(['single', 'married', 'divorced', 'widowed']).withMessage('Valid marital status is required'),
  body('personalInfo.occupation').notEmpty().withMessage('Occupation is required'),
  body('personalInfo.education').notEmpty().withMessage('Education is required'),
  body('addressInfo.presentAddress.street').notEmpty().withMessage('Present address street is required'),
  body('addressInfo.presentAddress.city').notEmpty().withMessage('Present address city is required'),
  body('addressInfo.presentAddress.state').notEmpty().withMessage('Present address state is required'),
  body('addressInfo.presentAddress.pincode').notEmpty().withMessage('Present address pincode is required'),
  body('documents.idProof').notEmpty().withMessage('ID proof is required'),
  body('documents.addressProof').notEmpty().withMessage('Address proof is required'),
  body('documents.photo').notEmpty().withMessage('Photo is required'),
  body('documents.signature').notEmpty().withMessage('Signature is required')
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

    const applicationData = {
      applicantId: req.user._id,
      ...req.body
    };

    // If permanent address is same as present address
    if (applicationData.addressInfo.sameAsPresent) {
      applicationData.addressInfo.permanentAddress = applicationData.addressInfo.presentAddress;
    }

    const application = new Application(applicationData);
    await application.save();

    // Create notification
    await Notification.create({
      userId: req.user._id,
      applicationId: application._id,
      type: 'status_update',
      title: 'Application Created',
      message: `Your passport application ${application.applicationNumber} has been created successfully.`,
      priority: 'medium'
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id,
      isActive: true
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Only allow updates if status is draft
    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application after submission'
      });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Application updated successfully',
      data: {
        application: updatedApplication
      }
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/applications/:id/submit
// @desc    Submit application
// @access  Private
router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id,
      isActive: true
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
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
      title: 'Application Submitted',
      message: `Your passport application ${application.applicationNumber} has been submitted successfully and is under review.`,
      priority: 'high'
    });

    res.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/applications/:id/biometric
// @desc    Mark biometric data as captured
// @access  Private
router.post('/:id/biometric', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id,
      isActive: true
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update biometric data
    application.biometricData = {
      captured: true,
      capturedAt: new Date(),
      fingerprintData: 'dummy_fingerprint_data_' + Date.now(),
      irisData: 'dummy_iris_data_' + Date.now()
    };

    await application.save();

    res.json({
      success: true,
      message: 'Biometric data captured successfully',
      data: {
        application
      }
    });
  } catch (error) {
    console.error('Biometric capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/applications/:id/payment
// @desc    Process payment (dummy)
// @access  Private
router.post('/:id/payment', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      applicantId: req.user._id,
      isActive: true
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.payment.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Simulate payment processing delay
    setTimeout(async () => {
      application.payment = {
        amount: 1500,
        status: 'paid',
        transactionId: 'TXN_' + Date.now(),
        paidAt: new Date()
      };

      await application.save();

      // Create notification
      await Notification.create({
        userId: req.user._id,
        applicationId: application._id,
        type: 'payment_success',
        title: 'Payment Successful',
        message: `Payment of ₹${application.payment.amount} for application ${application.applicationNumber} has been processed successfully.`,
        priority: 'high'
      });
    }, 3000); // 3 second delay

    res.json({
      success: true,
      message: 'Payment processing initiated. You will be notified once completed.',
      data: {
        applicationId: application._id
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;

