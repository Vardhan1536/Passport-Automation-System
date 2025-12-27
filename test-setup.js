// Quick test script to verify the setup
console.log('🔍 Testing Passport Automation System Setup...\n');

// Check if required directories exist
const fs = require('fs');
const path = require('path');

const directories = [
  'backend',
  'backend/models',
  'backend/routes',
  'backend/middleware',
  'frontend/src',
  'frontend/src/pages',
  'frontend/src/components',
  'frontend/src/contexts'
];

console.log('📁 Checking directory structure...');
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING!`);
  }
});

console.log('\n📄 Checking required files...');
const files = [
  'backend/server.js',
  'backend/models/User.js',
  'backend/models/Application.js',
  'backend/models/Notification.js',
  'backend/routes/auth.js',
  'backend/routes/applications.js',
  'backend/routes/admin.js',
  'backend/routes/renewal.js',
  'frontend/src/App.jsx',
  'frontend/src/main.jsx',
  'frontend/vite.config.js',
  'frontend/tailwind.config.js',
  'frontend/postcss.config.js',
  'package.json',
  'backend/package.json',
  'frontend/package.json'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
  }
});

console.log('\n✅ All essential files checked!');
console.log('\n📋 Next steps:');
console.log('1. Make sure you have created the .env file');
console.log('2. Run: npm run dev');
console.log('3. Run: cd backend && npm run seed');
console.log('\n🎉 Setup complete!');
