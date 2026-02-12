const Submission = require('../models/Submission');
const User = require('../models/User');
const Quest = require('../models/Quest');
const mongoose = require('mongoose');

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

    // Validate uploads
    if (media && media.length > 0) {
      // Simplified validation: just check if keys/urls are present.
      // We trust the upload flow returned valid keys/urls.
      for (const m of media) {
        if (!m.key && !m.url) {
          return res.status(400).json({ message: 'Invalid media item: missing key or url' });
        }
      }
    }

    const isVerified = questVerification && (questVerification.success || questVerification.verified);

    const submission = new Submission({
      userId: req.user.userId,
      questId: questId || req.params.id,
      stageIndex: stageIndex || 0,
      media: media || [],
      notes: notes || description || '',
      checklist: checklist || [],
      status: isVerified ? 'approved' : 'pending',
      proofType: proofType || 'text',
      proofUrl: proofUrl || '',
      cottonVerification: cottonVerification || undefined,
      questVerification: questVerification || undefined,
      xpAwarded: isVerified // Will be true if we award XP now
    });

    await submission.save();

    // Update user's quest progress
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine Status
    let newStatus = 'submitted';
    if (isVerified) {
      newStatus = 'completed';

      // --- XP AWARD LOGIC ---
      // Fetch Quest XP logic
      let quest;
      // Check if submission.questId is Hex ObjectId or slug
      if (mongoose.Types.ObjectId.isValid(questId) && questId.length === 24) {
        quest = await Quest.findById(questId);
      } else {
        quest = await Quest.findOne({ slug: questId });
      }

      // Fallback XP if quest not found or no reward set
      const rewardAmount = quest?.xpReward || QUEST_XP_REWARDS[questId] || 50;

      // Award XP
      user.xp = (user.xp || 0) + rewardAmount;
      user.xpLevel = Math.floor(user.xp / 100) + 1;

      // Add to completed quests
      if (!user.completedQuests) user.completedQuests = [];
      if (!user.completedQuests.includes(questId)) {
        user.completedQuests.push(questId);
      }

      console.log(`Auto-awarded XP to user ${user._id}: +${rewardAmount} XP for quest ${questId}`);
    }

    const questProgress = user.questsProgress.find(p => {
      const pQuestId = p.questId ? (typeof p.questId === 'string' ? p.questId : p.questId.toString()) : null;
      return pQuestId === questId;
    });

    if (questProgress) {
      questProgress.status = newStatus;
    } else {
      user.questsProgress.push({
        questId: questId,
        stageIndex: stageIndex || 0,
        status: newStatus
      });
    }

    await user.save();

    console.log(`Submission created (${newStatus}):`, { questId, submissionId: submission._id });

    res.status(201).json({
      message: isVerified ? 'Submission verified and approved!' : 'Submission received. Verification pending.',
      submission,
      status: isVerified ? 'approved' : 'pending',
      xpAwarded: isVerified
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

// NEW: Verify Submission (Admin Only)
// Only awards XP if status is 'approved' and not already awarded
exports.verifySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, adminComment } = req.body; // status: 'approved' or 'rejected'

    console.log(`Verifying submission ${submissionId}: status=${status}`);

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected".' });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // prevent double verification
    if (submission.status === 'approved' && status === 'approved') {
      return res.status(400).json({ message: 'Submission is already approved.' });
    }

    // Update submission status
    submission.status = status;
    submission.reviewedBy = req.user.userId;
    submission.reviewedAt = new Date();
    submission.feedback = adminComment || '';

    let xpAwarded = 0;

    if (status === 'approved') {
      // ONLY award XP if not already awarded
      if (!submission.xpAwarded) {
        // Fetch Quest XP logic
        let quest;
        // Check if submission.questId is Hex ObjectId or slug
        if (mongoose.Types.ObjectId.isValid(submission.questId) && submission.questId.length === 24) {
          quest = await Quest.findById(submission.questId);
        } else {
          quest = await Quest.findOne({ slug: submission.questId });
        }

        // Fallback XP if quest not found or no reward set
        const rewardAmount = quest?.xpReward || (quest && QUEST_XP_REWARDS[quest.id || quest.slug]) || QUEST_XP_REWARDS[submission.questId] || 50;

        const user = await User.findById(submission.userId);
        if (user) {
          // Award XP
          user.xp = (user.xp || 0) + rewardAmount;
          user.xpLevel = Math.floor(user.xp / 100) + 1;

          // Add to completed quests
          if (!user.completedQuests) user.completedQuests = [];
          if (!user.completedQuests.includes(submission.questId)) {
            user.completedQuests.push(submission.questId);
          }

          // Update quest progress status to 'completed'
          const progress = user.questsProgress.find(p => {
            const pId = p.questId ? (p.questId.toString ? p.questId.toString() : p.questId) : null;
            return pId === submission.questId;
          });

          if (progress) {
            progress.status = 'completed';
          } else {
            user.questsProgress.push({
              questId: submission.questId,
              status: 'completed',
              stageIndex: 0
            });
          }

          await user.save();

          // Mark submission as XP awarded so we don't do it twice
          submission.xpAwarded = true;
          xpAwarded = rewardAmount;
          console.log(`XP Awarded to user ${user._id}: +${xpAwarded} XP`);
        }
      }
    } else if (status === 'rejected') {
      // If rejected, ensure we revert status to 'in-progress'
      const user = await User.findById(submission.userId);
      if (user) {
        const progress = user.questsProgress.find(p => {
          const pId = p.questId ? (p.questId.toString ? p.questId.toString() : p.questId) : null;
          return pId === submission.questId;
        });

        if (progress) {
          progress.status = 'in-progress';
          await user.save();
        }
      }
    }

    await submission.save();

    res.status(200).json({
      message: `Submission ${status}`,
      submission,
      xpAwarded
    });

  } catch (error) {
    console.error('Verify submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
