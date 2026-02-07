const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('farm');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, username, location, level, xp, xpLevel, questsProgress, purchasedRewards } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;

    // Username update logic
    if (username !== undefined) {
      if (username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
      }
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== req.user.userId) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      updateData.username = username;
    }

    if (location !== undefined) updateData.location = location;
    if (level !== undefined) updateData.level = level;
    if (xp !== undefined) updateData.xp = xp;
    if (xpLevel !== undefined) updateData.xpLevel = xpLevel;
    if (questsProgress !== undefined) updateData.questsProgress = questsProgress;
    if (purchasedRewards !== undefined) updateData.purchasedRewards = purchasedRewards;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
