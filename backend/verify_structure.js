require('dotenv').config();
const mongoose = require('mongoose');

try {
    const User = require('./src/models/User');
    const authController = require('./src/controllers/authController');
    const db = require('./src/config/db');
    console.log("Imports Successful!");
} catch (error) {
    console.error("Import Failed:", error);
    process.exit(1);
}
console.log("Backend structure verification passed.");
process.exit(0);
