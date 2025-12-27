<img width="1893" height="912" alt="register-page" src="https://github.com/user-attachments/assets/acb71879-a54c-433a-a5d4-fa166790b1ad" /># Passport Automation System

A complete demo web application simulating the Indian Passport Seva portal with realistic workflows and professional government-style design.

## 🎯 Features

- **User Registration & Authentication** - JWT-based auth with user/admin roles
- **Multi-step Passport Application** - Personal details, address, document upload, biometric simulation
- **Real-time Status Tracking** - Timeline view of application progress
- **Admin Dashboard** - Manage applications, approve/reject, police verification
- **Passport Renewal** - Simplified renewal process with auto-filled data
- **Dummy Payment Integration** - Simulated payment processing
- **Responsive Design** - Mobile and desktop optimized
- **Professional UI** - Government-style design with clean, official appearance

## 🛠 Tech Stack

- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Styling**: Government-style design (navy blue, white, light gray)
  <img width="1895" height="910" alt="Home" src="https://github.com/user-attachments/assets/4e15bad4-7ff9-420b-8f78-cf12a81c553a" />
  <img width="1893" height="912" alt="register-page" src="https://github.com/user-attachments/assets/45ef81c3-1690-4fb9-afec-bb8f1f49d152" />



## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
setup.bat
```

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your MongoDB Atlas connection string
```

3. **Start development servers:**
```bash
npm run dev
```

4. **Seed the database with demo data:**
```bash
cd backend
npm run seed
```

5. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👤 Demo Credentials

**Regular User:**
- Email: `user@demo.com`
- Password: `demo123`

**Admin User:**
- Email: `admin@demo.com`
- Password: `admin123`

**Additional Demo Users:**
- Email: `john@demo.com` / Password: `demo123`
- Email: `jane@demo.com` / Password: `demo123`

## 📁 Project Structure

```
passport-automation-system/
├── backend/                    # Node.js + Express API
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── middleware/             # Authentication middleware
│   ├── server.js              # Main server file
│   ├── seed.js                # Database seeding script
│   └── package.json
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── pages/             # Application pages
│   │   ├── components/        # Reusable components
│   │   ├── contexts/          # React contexts
│   │   └── App.jsx            # Main app component
│   ├── package.json
│   └── vite.config.js
├── package.json               # Root package configuration
├── setup.sh                   # Setup script (macOS/Linux)
├── setup.bat                  # Setup script (Windows)
├── env.example                # Environment variables template
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Applications
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `POST /api/applications/:id/submit` - Submit application
- `POST /api/applications/:id/biometric` - Capture biometric data
- `POST /api/applications/:id/payment` - Process payment

### Admin
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/applications/:id` - Get specific application
- `PUT /api/admin/applications/:id/status` - Update application status
- `PUT /api/admin/applications/:id/police-verification` - Update police verification
- `GET /api/admin/users` - Get all users

### Renewal
- `GET /api/renewal/eligible` - Check renewal eligibility
- `POST /api/renewal` - Create renewal application
- `POST /api/renewal/:id/submit` - Submit renewal application
- `GET /api/renewal/history` - Get renewal history

## 🎨 User Flows

### Regular User Flow
1. **Register/Login** → Create account or sign in
2. **Apply for Passport** → Fill multi-step application form
3. **Upload Documents** → Submit required documents
4. **Biometric Capture** → Simulate biometric data capture
5. **Review & Submit** → Review and submit application
6. **Payment** → Process payment (simulated)
7. **Track Status** → Monitor application progress

### Admin Flow
1. **Login** → Sign in as admin
2. **Dashboard** → View application statistics
3. **Manage Applications** → Review and process applications
4. **Update Status** → Approve/reject applications
5. **Police Verification** → Manage police verification process

### Renewal Flow
1. **Check Eligibility** → View eligible passports
2. **Select Passport** → Choose passport to renew
3. **Fill Renewal Form** → Provide renewal information
4. **Submit** → Submit renewal application

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passport-demo?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## 🎭 Demo Features

- **Realistic UI** - Professional government portal design
- **Multi-step Forms** - Complete application process
- **Status Tracking** - Real-time application progress
- **Admin Controls** - Full administrative functionality
- **Payment Simulation** - Dummy payment processing
- **Biometric Simulation** - Mock biometric capture
- **Document Upload** - File upload simulation
- **Notifications** - Toast notifications for actions
- **Responsive Design** - Works on all devices

## 🚨 Important Notes

- This is a **demo application** for educational purposes
- No real passport data is processed
- All payments are simulated
- Biometric capture is mocked
- Document uploads are simulated
- Use demo credentials provided above

## 📝 License

MIT License - Demo purposes only

## 🤝 Contributing

This is a demo project. Feel free to fork and modify for your own use.

## 📞 Support

For questions or issues, please check the demo credentials and ensure all setup steps are completed correctly.
