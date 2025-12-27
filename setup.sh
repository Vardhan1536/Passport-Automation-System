#!/bin/bash

# Passport Automation System Setup Script
echo "🚀 Setting up Passport Automation System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your MongoDB Atlas connection string and JWT secret"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your MongoDB Atlas connection string"
echo "2. Run 'npm run dev' to start both frontend and backend servers"
echo "3. Run 'cd backend && npm run seed' to populate the database with demo data"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000"
echo ""
echo "👤 Demo Credentials:"
echo "   Regular User: user@demo.com / demo123"
echo "   Admin User: admin@demo.com / admin123"
echo ""
echo "📚 For more information, check the README.md file"

