const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');

// Send message to chatbot (protected route)
router.post('/message', authMiddleware, chatbotController.sendMessage);

module.exports = router;
