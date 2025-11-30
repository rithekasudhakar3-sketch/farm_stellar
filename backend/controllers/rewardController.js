const Reward = require('../models/Reward');
const User = require('../models/User');

exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const user = await User.findById(req.user.userId);
    const reward = await Reward.findById(rewardId);

    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ message: 'Reward out of stock' });
    }

    if (user.xp < reward.xpCost) {
      return res.status(400).json({ message: 'Not enough XP' });
    }

    user.xp -= reward.xpCost;
    reward.stock -= 1;

    await user.save();
    await reward.save();

    res.status(200).json({ message: 'Reward redeemed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
