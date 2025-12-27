const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Application = require('./models/Application');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/passport-demo');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create demo users
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'user@demo.com',
        password: 'demo123',
        phone: '9876543210',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        role: 'user'
      },
      {
        name: 'Admin Officer',
        email: 'admin@demo.com',
        password: 'admin123',
        phone: '9876543211',
        dateOfBirth: new Date('1985-03-20'),
        gender: 'female',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@demo.com',
        password: 'demo123',
        phone: '9876543212',
        dateOfBirth: new Date('1992-08-10'),
        gender: 'male',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@demo.com',
        password: 'demo123',
        phone: '9876543213',
        dateOfBirth: new Date('1988-12-05'),
        gender: 'female',
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log('👥 Created demo users');

    // Create demo applications
    const demoApplications = [
      {
        applicantId: createdUsers[0]._id,
        applicationType: 'new',
        personalInfo: {
          firstName: 'Demo',
          lastName: 'User',
          fatherName: 'Demo Father',
          motherName: 'Demo Mother',
          dateOfBirth: new Date('1990-05-15'),
          placeOfBirth: 'Mumbai',
          gender: 'male',
          maritalStatus: 'single',
          occupation: 'Software Engineer',
          education: 'Bachelor of Technology',
          emergencyContact: {
            name: 'Emergency Contact',
            relationship: 'Brother',
            phone: '9876543214'
          }
        },
        addressInfo: {
          presentAddress: {
            street: '123 Demo Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          },
          permanentAddress: {
            street: '123 Demo Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          },
          sameAsPresent: true
        },
        documents: {
          idProof: 'https://example.com/id-proof.pdf',
          addressProof: 'https://example.com/address-proof.pdf',
          birthCertificate: 'https://example.com/birth-certificate.pdf',
          photo: 'https://example.com/photo.jpg',
          signature: 'https://example.com/signature.jpg'
        },
        biometricData: {
          captured: true,
          capturedAt: new Date(),
          fingerprintData: 'dummy_fingerprint_data',
          irisData: 'dummy_iris_data'
        },
        status: 'approved',
        payment: {
          amount: 1500,
          status: 'paid',
          transactionId: 'TXN_DEMO_001',
          paidAt: new Date()
        },
        passportDetails: {
          passportNumber: 'A1234567',
          issueDate: new Date(),
          expiryDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years from now
          issuedAt: 'Mumbai'
        }
      },
      {
        applicantId: createdUsers[2]._id,
        applicationType: 'new',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          fatherName: 'Robert Doe',
          motherName: 'Mary Doe',
          dateOfBirth: new Date('1992-08-10'),
          placeOfBirth: 'Delhi',
          gender: 'male',
          maritalStatus: 'married',
          occupation: 'Business Analyst',
          education: 'Master of Business Administration',
          emergencyContact: {
            name: 'Sarah Doe',
            relationship: 'Wife',
            phone: '9876543215'
          }
        },
        addressInfo: {
          presentAddress: {
            street: '456 Business Avenue',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
          },
          permanentAddress: {
            street: '456 Business Avenue',
            city: 'Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
          },
          sameAsPresent: true
        },
        documents: {
          idProof: 'https://example.com/john-id-proof.pdf',
          addressProof: 'https://example.com/john-address-proof.pdf',
          birthCertificate: 'https://example.com/john-birth-certificate.pdf',
          photo: 'https://example.com/john-photo.jpg',
          signature: 'https://example.com/john-signature.jpg'
        },
        biometricData: {
          captured: true,
          capturedAt: new Date(),
          fingerprintData: 'dummy_fingerprint_data_john',
          irisData: 'dummy_iris_data_john'
        },
        status: 'under_verification',
        payment: {
          amount: 1500,
          status: 'paid',
          transactionId: 'TXN_DEMO_002',
          paidAt: new Date()
        }
      },
      {
        applicantId: createdUsers[3]._id,
        applicationType: 'new',
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          fatherName: 'David Smith',
          motherName: 'Lisa Smith',
          dateOfBirth: new Date('1988-12-05'),
          placeOfBirth: 'Bangalore',
          gender: 'female',
          maritalStatus: 'single',
          occupation: 'Doctor',
          education: 'Doctor of Medicine',
          emergencyContact: {
            name: 'Michael Smith',
            relationship: 'Brother',
            phone: '9876543216'
          }
        },
        addressInfo: {
          presentAddress: {
            street: '789 Medical Complex',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
          },
          permanentAddress: {
            street: '789 Medical Complex',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India'
          },
          sameAsPresent: true
        },
        documents: {
          idProof: 'https://example.com/jane-id-proof.pdf',
          addressProof: 'https://example.com/jane-address-proof.pdf',
          birthCertificate: 'https://example.com/jane-birth-certificate.pdf',
          photo: 'https://example.com/jane-photo.jpg',
          signature: 'https://example.com/jane-signature.jpg'
        },
        biometricData: {
          captured: false
        },
        status: 'submitted',
        payment: {
          amount: 1500,
          status: 'pending'
        }
      }
    ];

    const createdApplications = await Application.insertMany(demoApplications);
    console.log('📄 Created demo applications');

    // Create demo notifications
    const demoNotifications = [
      {
        userId: createdUsers[0]._id,
        applicationId: createdApplications[0]._id,
        type: 'status_update',
        title: 'Application Approved',
        message: 'Your passport application has been approved successfully!',
        priority: 'high',
        isRead: false
      },
      {
        userId: createdUsers[2]._id,
        applicationId: createdApplications[1]._id,
        type: 'status_update',
        title: 'Application Under Verification',
        message: 'Your passport application is currently under verification.',
        priority: 'medium',
        isRead: false
      },
      {
        userId: createdUsers[3]._id,
        applicationId: createdApplications[2]._id,
        type: 'status_update',
        title: 'Application Submitted',
        message: 'Your passport application has been submitted successfully.',
        priority: 'medium',
        isRead: true
      }
    ];

    await Notification.insertMany(demoNotifications);
    console.log('🔔 Created demo notifications');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('👤 Regular User: user@demo.com / demo123');
    console.log('👤 John Doe: john@demo.com / demo123');
    console.log('👤 Jane Smith: jane@demo.com / demo123');
    console.log('👨‍💼 Admin: admin@demo.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedData();

