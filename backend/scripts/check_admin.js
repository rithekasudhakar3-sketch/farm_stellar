require('dotenv').config();
const mongoose = require('mongoose');
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

const checkAdmin = async () => {
    await connectDB();
    const email = 'admin@gmail.com';
    const admin = await Admin.findOne({ email });
    if (admin) {
        console.log(`Admin found: ${admin.email}`);
        console.log(`Password Hash: ${admin.passwordHash}`);
    } else {
        console.log('Admin NOT found');
    }
    process.exit();
};

checkAdmin();
