const Quest = require('../models/Quest');
const User = require('../models/User');

exports.getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ active: true });
    res.status(200).json(quests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuestById = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.status(200).json(quest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateQuestProgress = async (req, res) => {
  try {
    const { stageIndex, status } = req.body;
    const questIdOrSlug = req.params.id;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find quest by ID or slug
    const mongoose = require('mongoose');
    let quest;
    if (mongoose.Types.ObjectId.isValid(questIdOrSlug) && questIdOrSlug.length === 24) {
      quest = await Quest.findById(questIdOrSlug);
    } else {
      quest = await Quest.findOne({ slug: questIdOrSlug });
    }

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    const questId = quest._id.toString();

    // Find existing progress entry - match by both _id and slug
    const questProgress = user.questsProgress.find(p => {
      if (!p.questId) return false;
      const pQuestId = p.questId.toString();
      return pQuestId === questId || pQuestId === quest.slug || p.questId === quest.slug;
    });

    if (questProgress) {
      questProgress.questId = questId;
      questProgress.stageIndex = stageIndex !== undefined ? stageIndex : questProgress.stageIndex;
      questProgress.status = status || questProgress.status;
    } else {
      user.questsProgress.push({ questId: questId, stageIndex: stageIndex || 0, status: status || 'in-progress' });
    }

    await user.save();
    console.log('Quest progress updated:', { userId: user._id, questId, stageIndex, status });
    res.status(200).json(user.questsProgress);
  } catch (error) {
    console.error('Update quest progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
