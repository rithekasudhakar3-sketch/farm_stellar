const User = require('../models/User');
const Quest = require('../models/Quest');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('farm');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For simplicity, get the first active quest as "today's quest"
    const todaysQuest = await Quest.findOne({ active: true });

    res.status(200).json({
      name: user.name,
      farmLocation: user.location,
      farmingLevel: user.level,
      xp: user.xp,
      todaysQuest: todaysQuest,
      streak: 0, // Streak logic to be implemented
      navbarItems: ['Dashboard', 'Quests', 'Community', 'Rewards', 'Profile', 'Settings'],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
