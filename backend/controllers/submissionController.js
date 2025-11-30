const Submission = require('../models/Submission');
const User = require('../models/User');
const s3Service = require('../services/s3Service');

exports.createSubmission = async (req, res) => {
  try {
    const { questId, stageIndex, media, notes, checklist, proofType, proofUrl, description } = req.body;

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
      proofUrl: proofUrl || ''
    });

    await submission.save();

    // Update user's quest progress to "submitted" status
    const user = await User.findById(req.user.userId);
    const questProgress = user.questsProgress.find(p => p.questId === questId || p.questId.toString() === questId);
    if (questProgress) {
      questProgress.status = 'submitted';
    } else {
      user.questsProgress.push({ 
        questId: questId, 
        stageIndex: stageIndex || 0, 
        status: 'submitted' 
      });
    }
    await user.save();

    res.status(201).json(submission);
  } catch (error) {
    console.error('Create submission error:', error);
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
