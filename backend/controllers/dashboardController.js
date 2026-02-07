const User = require('../models/User');
const Quest = require('../models/Quest');

const Submission = require('../models/Submission');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('farm');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For simplicity, get the first active quest as "today's quest"
    const todaysQuest = await Quest.findOne({ active: true });

    // --- Fetch Completed Quests Logic ---
    const completedQuestEntries = user.questsProgress?.filter(q => q.status === 'completed') || [];
    const completedQuestIds = completedQuestEntries.map(q => q.questId);

    // Fetch full quest details
    // We search by 'id' (string ID like 'soil_scout') OR '_id' (Mongo ID) to be safe
    const questDetails = await Quest.find({
      $or: [
        { id: { $in: completedQuestIds } },
        { _id: { $in: completedQuestIds } }
      ]
    });

    // Fetch submissions to get actual completion dates
    const submissions = await Submission.find({
      userId: user._id,
      questId: { $in: completedQuestIds },
      status: { $in: ['completed', 'approved', 'accepted', 'pending'] } // Includes pending if auto-completed via submission, but strictly we want completed
    }).sort({ createdAt: -1 });

    const completedQuests = completedQuestEntries.map(entry => {
      // Find quest details
      const quest = questDetails.find(q =>
        q.id === entry.questId || q._id.toString() === entry.questId
      );

      // Find submission (fallback to entry timestamp if submission missing or just now)
      // Note: User model progress doesn't have timestamp, so we really rely on Submission or fallback
      const submission = submissions.find(s =>
        s.questId === entry.questId
      );

      return {
        id: entry.questId,
        title: quest?.title || 'Unknown Quest',
        category: quest?.category || quest?.cropType || 'General',
        xp: quest?.xpReward || 0,
        completedAt: submission?.createdAt || submission?.updatedAt || new Date().toISOString(), // Fallback
        image: quest?.image,
        status: 'completed'
      };
    });

    res.status(200).json({
      name: user.name,
      farmLocation: user.location,
      farmingLevel: user.level,
      xp: user.xp,
      todaysQuest: todaysQuest,
      completedQuests: completedQuests,
      streak: 0, // Streak logic to be implemented
      navbarItems: ['Dashboard', 'Quests', 'Community', 'Rewards', 'Profile', 'Settings'],
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
