require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const connectDB = require('../src/config/db');

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
