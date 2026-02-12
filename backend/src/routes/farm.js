const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const authMiddleware = require('../middleware/authMiddleware');

const verificationController = require('../controllers/verificationController');

router.patch('/me', authMiddleware, farmController.updateMyFarm);
router.post('/register', authMiddleware, verificationController.registerFarm);

module.exports = router;
