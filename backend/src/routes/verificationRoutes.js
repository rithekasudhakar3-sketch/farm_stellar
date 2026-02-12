const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for Photo-Based Location Verification
router.post('/photo', authMiddleware, verificationController.verifyPhoto);

// Route to get Verification Status
router.get('/status', authMiddleware, verificationController.getVerificationStatus);

module.exports = router;
