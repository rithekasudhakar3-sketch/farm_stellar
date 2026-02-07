const express = require('express');
const router = express.Router();
const cottonController = require('../controllers/cottonController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/cotton/verify - Verify cotton boll health from image
router.post('/verify', authMiddleware, cottonController.verifyCotton);

module.exports = router;
