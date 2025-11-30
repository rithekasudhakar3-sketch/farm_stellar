const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, rewardController.getRewards);
router.post('/redeem', authMiddleware, rewardController.redeemReward);

module.exports = router;
