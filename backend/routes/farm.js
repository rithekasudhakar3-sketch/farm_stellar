const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farmController');
const authMiddleware = require('../middleware/authMiddleware');

router.patch('/me', authMiddleware, farmController.updateMyFarm);

module.exports = router;
