const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationNumber: {
    type: String,
    unique: true,
    required: true
  },
  applicationType: {
    type: String,
    enum: ['new', 'renewal', 'reissue'],
    default: 'new'
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    spouseName: { type: String },
    dateOfBirth: { type: Date, required: true },
    placeOfBirth: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], required: true },
    occupation: { type: String, required: true },
    education: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },
  addressInfo: {
    presentAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    permanentAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    sameAsPresent: { type: Boolean, default: false }
  },
  documents: {
    idProof: { type: String, required: true }, // URL or file path
    addressProof: { type: String, required: true },
    birthCertificate: { type: String },
    photo: { type: String, required: true },
    signature: { type: String, required: true }
  },
  biometricData: {
    captured: { type: Boolean, default: false },
    capturedAt: { type: Date },
    fingerprintData: { type: String }, // Dummy data
    irisData: { type: String } // Dummy data
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_verification', 'police_verification', 'approved', 'rejected', 'dispatched'],
    default: 'draft'
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    remarks: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  remarks: {
    type: String,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  policeVerification: {
    status: { type: String, enum: ['pending', 'cleared', 'failed'], default: 'pending' },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
    remarks: { type: String }
  },
  payment: {
    amount: { type: Number, default: 1500 },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: String },
    paidAt: { type: Date }
  },
  passportDetails: {
    passportNumber: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    issuedAt: { type: String }
  },
  priority: {
    type: String,
    enum: ['normal', 'tatkal'],
    default: 'normal'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate application number before saving
applicationSchema.pre('save', async function(next) {
  if (this.isNew && !this.applicationNumber) {
    const count = await mongoose.model('Application').countDocuments();
    this.applicationNumber = `PSP${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Add status to history when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      remarks: this.remarks || 'Status updated'
    });
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);

