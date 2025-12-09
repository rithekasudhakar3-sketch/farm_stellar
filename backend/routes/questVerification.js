const express = require('express');
const router = express.Router();
const questVerificationController = require('../controllers/questVerificationController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/quest-verification/verify - Verify quest completion with AI
router.post('/verify', authMiddleware, questVerificationController.verifyQuest);

module.exports = router;
