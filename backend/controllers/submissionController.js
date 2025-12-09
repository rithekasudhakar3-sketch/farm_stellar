const Submission = require('../models/Submission');
const User = require('../models/User');
const s3Service = require('../services/s3Service');

// Quest XP rewards mapping - matches frontend constants/quests.js
const QUEST_XP_REWARDS = {
  'soil_scout': 10,
  'crop_quest': 75,
  'compost_kickoff': 40,
  'zero_waste': 85,
  'mini_garden': 100,
  'mulch_master': 60,
  'boll_keeper': 150,
  'coconut_basin': 140,
  'coconut_bioenzyme': 180,
  'rust_shield': 160,
  'biodiversity_strip': 190,
  'rainwater_hero': 185,
  'biochar_maker': 200,
  'jeevamrutham': 150,
  // Legacy quest IDs
  'crops': 75,
  'soil': 10,
  'compost': 40,
};

exports.createSubmission = async (req, res) => {
  try {
    const { questId, stageIndex, media, notes, checklist, proofType, proofUrl, description, cottonVerification, questVerification } = req.body;

    // Validate S3 uploads if media keys are provided
    if (media && media.length > 0) {
      for (const m of media) {
        try {
          await s3Service.headObject(m.key);
        } catch (error) {
          return res.status(400).json({ message: 'File not found in S3 storage.' });
        }
      }
    }

    const submission = new Submission({
      userId: req.user.userId,
      questId: questId || req.params.id,
      stageIndex: stageIndex || 0,
      media: media || [],
      notes: notes || description || '',
      checklist: checklist || [],
      status: 'pending',
      proofType: proofType || 'text',
      proofUrl: proofUrl || '',
      cottonVerification: cottonVerification || undefined,
      questVerification: questVerification || undefined
    });

    await submission.save();

    // Fetch quest to get XP reward
    const Quest = require('../models/Quest');
    const mongoose = require('mongoose');
    
    // Check if questId is a valid ObjectId or a slug
    let quest;
    if (mongoose.Types.ObjectId.isValid(questId) && questId.length === 24) {
      quest = await Quest.findById(questId);
    } else {
      quest = await Quest.findOne({ slug: questId });
    }
    
    const xpReward = quest?.xpReward || 0;

    // Update user's quest progress to "completed" status and award XP immediately
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const questProgress = user.questsProgress.find(p => {
      const pQuestId = p.questId ? (typeof p.questId === 'string' ? p.questId : p.questId.toString()) : null;
      return pQuestId === questId;
    });
    
    if (questProgress) {
      questProgress.status = 'completed';
    } else {
      user.questsProgress.push({ 
        questId: questId, 
        stageIndex: stageIndex || 0, 
        status: 'completed' 
      });
    }

    // Award XP immediately
    user.xp = (user.xp || 0) + xpReward;

    // Calculate and update level
    const newLevel = Math.floor(user.xp / 100) + 1;
    user.xpLevel = newLevel;

    // Add to completed quests if not already there
    if (!user.completedQuests) {
      user.completedQuests = [];
    }
    if (!user.completedQuests.includes(questId)) {
      user.completedQuests.push(questId);
    }

    await user.save();

    console.log('Submission created and XP awarded:', { questId, xpReward, newXP: user.xp, newLevel: user.xpLevel });

    res.status(201).json({ 
      submission,
      xpAwarded: xpReward,
      newXP: user.xp,
      newLevel: user.xpLevel
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Auto-complete quest (for quests that don't require admin approval)
exports.autoCompleteQuest = async (req, res) => {
  try {
    const { questId } = req.body;

    if (!questId) {
      return res.status(400).json({ message: 'Quest ID is required' });
    }

    const xpReward = QUEST_XP_REWARDS[questId] || 0;

    if (xpReward === 0) {
      return res.status(400).json({ message: 'Invalid quest ID or quest has no XP reward' });
    }

    // Update user's quest progress and award XP
    const user = await User.findById(req.user.userId);

    // Check if quest is already completed
    const existingProgress = user.questsProgress.find(p =>
      (p.questId === questId || p.questId.toString() === questId) && p.status === 'completed'
    );

    if (existingProgress) {
      return res.status(400).json({ message: 'Quest already completed' });
    }

    // Update or add quest progress
    const questProgress = user.questsProgress.find(p => p.questId === questId || p.questId.toString() === questId);
    if (questProgress) {
      questProgress.status = 'completed';
    } else {
      user.questsProgress.push({
        questId: questId,
        stageIndex: 0,
        status: 'completed'
      });
    }

    // Award XP
    user.xp += xpReward;

    // Calculate new level
    const newLevel = Math.floor(user.xp / 100) + 1;
    if (newLevel !== user.xpLevel) {
      user.xpLevel = newLevel;
    }

    await user.save();

    res.status(200).json({
      message: 'Quest completed successfully',
      questId,
      xpAwarded: xpReward,
      updatedXP: user.xp,
      updatedLevel: user.xpLevel,
      leveledUp: newLevel > (user.xpLevel || 0)
    });
  } catch (error) {
    console.error('Auto-complete quest error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSubmissionsForQuest = async (req, res) => {
  try {
    const submissions = await Submission.find({ questId: req.params.id, userId: req.user.userId });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserSubmissions = async (req, res) => {
  try {
    const { questId } = req.query;
    const query = { userId: req.user.userId };
    
    if (questId) {
      query.questId = questId;
    }
    
    const submissions = await Submission.find(query).sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findOne({ _id: req.params.submissionId, userId: req.user.userId });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
