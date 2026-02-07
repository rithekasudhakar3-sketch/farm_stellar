const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/adminAuth');

// Admin authentication routes
router.post('/login', adminController.adminLogin);
router.post('/create', adminController.createAdmin); // For initial setup only

// Protected admin routes
router.get('/profile', verifyAdmin, adminController.getAdminProfile);
router.get('/farmers', verifyAdmin, adminController.getAllFarmers);
router.patch('/farmers/:farmerId', verifyAdmin, adminController.updateFarmer);
router.get('/stats', verifyAdmin, adminController.getDashboardStats);
router.get('/submissions', verifyAdmin, adminController.getPendingSubmissions);
router.patch('/submissions/:submissionId/approve', verifyAdmin, adminController.approveSubmission);
router.patch('/submissions/:submissionId/reject', verifyAdmin, adminController.rejectSubmission);

module.exports = router;
