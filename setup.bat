@echo off
echo 🚀 Setting up Passport Automation System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ⚠️  Please update the .env file with your MongoDB Atlas connection string and JWT secret
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update the .env file with your MongoDB Atlas connection string
echo 2. Run 'npm run dev' to start both frontend and backend servers
echo 3. Run 'cd backend && npm run seed' to populate the database with demo data
echo.
echo 🔗 URLs:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:5000
echo.
echo 👤 Demo Credentials:
echo    Regular User: user@demo.com / demo123
echo    Admin User: admin@demo.com / admin123
echo.
echo 📚 For more information, check the README.md file
pause

