require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const createInitialAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farm_stellar2');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists with email: admin@gmail.com');
      console.log('You can use these credentials to login:');
      console.log('Email: admin@gmail.com');
      console.log('Passkey: admin123');
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@gmail.com',
      passwordHash: passwordHash,
      organization: 'FarmQuest',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('==================');
    console.log('Email: admin@gmail.com');
    console.log('Passkey: admin123');
    console.log('Organization: FarmQuest');
    console.log('==================');
    console.log('\nYou can now login to the admin panel with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();
