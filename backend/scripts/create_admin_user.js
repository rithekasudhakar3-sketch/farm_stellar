require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../src/models/Admin');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection failed', err);
        process.exit(1);
    }
};

const createAdmin = async () => {
    await connectDB();
    const email = 'admin@gmail.com';
    const password = 'admin'; // Default password
    const name = 'Admin User';

    // Check if exists
    const existing = await Admin.findOne({ email });
    if (existing) {
        console.log('Admin already exists. Updating password...');
        existing.passwordHash = await bcrypt.hash(password, 10);
        await existing.save();
        console.log('Admin password updated to: admin');
    } else {
        const passwordHash = await bcrypt.hash(password, 10);
        const admin = new Admin({
            name,
            email,
            passwordHash,
            organization: 'Farm Stellar',
            role: 'super_admin'
        });
        await admin.save();
        console.log('Admin created successfully.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }
    process.exit();
};

createAdmin();
