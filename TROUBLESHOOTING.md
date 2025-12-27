# Troubleshooting Guide - Passport Automation System

## ✅ Fixed Issues

1. **Missing AdminRoute component** - Created separate file
2. **Import errors in App.jsx** - Fixed import statements to use default exports
3. **Missing postcss.config.js** - Created configuration file
4. **Missing .eslintrc.cjs** - Created ESLint configuration

## 🚀 Now Run These Commands

### Step 1: Install Dependencies (if not done already)
```bash
npm run install-all
```

### Step 2: Create .env File
```bash
# Create the .env file in root directory
copy env.example .env

# Edit .env file with your MongoDB Atlas connection string
notepad .env
```

### Step 3: Start the Application
```bash
npm run dev
```

This will start both frontend (port 5173) and backend (port 5000)

### Step 4: In a NEW terminal, seed the database
```bash
cd backend
npm run seed
```

## ✅ Verification Steps

### Check if servers are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Test the application:
1. Open browser to http://localhost:5173
2. Try to register a new user or login with:
   - `user@demo.com` / `demo123`
   - `admin@demo.com` / `admin123`

## 🐛 Common Errors and Fixes

### Error: "Cannot find module 'xxx'"
**Solution:** 
```bash
cd frontend
npm install
cd ../backend
npm install
```

### Error: "MongoDB connection failed"
**Solution:** 
1. Check your .env file has correct MONGODB_URI
2. Make sure MongoDB Atlas allows connections from your IP
3. Check if your internet connection is working

### Error: "Port already in use"
**Solution:**
```bash
# Find and kill the process using port 5000 or 5173
netstat -ano | findstr :5000
netstat -ano | findstr :5173
taskkill /PID <process_id> /F
```

### Error: Frontend shows blank page
**Solution:**
1. Check browser console for errors (F12)
2. Make sure backend is running on port 5000
3. Check if all dependencies are installed

## 📁 File Structure Verification

Run this to verify all files exist:
```bash
node test-setup.js
```

## 🔄 If Everything Fails

### Complete Fresh Install:
```bash
# Delete node_modules
rmdir /s /q node_modules
rmdir /s /q frontend/node_modules
rmdir /s /q backend/node_modules

# Clean install
npm install
cd frontend && npm install
cd ../backend && npm install

# Start again
cd ..
npm run dev
```

## ✅ Success Indicators

You'll know it's working when:
- ✅ Both servers start without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Backend API responds at http://localhost:5000/api
- ✅ You can register/login with demo credentials
- ✅ Dashboard shows without errors

## 🆘 Still Having Issues?

1. Check Node.js version (should be 16+)
2. Check npm version (should be 8+)
3. Check MongoDB Atlas connection
4. Check all .env variables are set
5. Try running `npm cache clean --force`

## 📞 Quick Test Commands

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test if frontend is running
curl http://localhost:5173

# Check Node version
node --version

# Check npm version
npm --version
```
