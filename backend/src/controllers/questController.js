const Quest = require('../models/Quest');
const User = require('../models/User');
const s3Service = require('../services/s3Service');

// Helper function to extract S3 key from URL and generate signed URL
const getSignedUrlForImage = async (imageUrl) => {
  if (!imageUrl) return null;
  
  try {
    // Extract the key from S3 URL
    // URL format: https://bucket-name.s3.region.amazonaws.com/key
    const urlPattern = /https?:\/\/[^\/]+\.s3\.[^\/]+\.amazonaws\.com\/(.+)/;
    const match = imageUrl.match(urlPattern);
    
    if (match && match[1]) {
      const key = match[1];
      const signedUrl = await s3Service.getSignedDownloadUrl(key, 3600); // 1 hour expiry
      return signedUrl;
    }
    
    // If URL doesn't match pattern, return original
    return imageUrl;
  } catch (error) {
    console.error('Error generating signed URL for image:', imageUrl, error);
    return imageUrl; // Return original URL on error
  }
};

exports.getQuests = async (req, res) => {
  try {
    // Get all quests, don't filter by active since field may not exist in all documents
    const quests = await Quest.find({});
    
    
    // Generate signed URLs for quest step images
    const questsWithSignedUrls = await Promise.all(
      quests.map(async (quest) => {
        const questObj = quest.toObject();
        
        // Process steps array if it exists
        if (questObj.steps && Array.isArray(questObj.steps)) {
          questObj.steps = await Promise.all(
            questObj.steps.map(async (step) => ({
              ...step,
              image: await getSignedUrlForImage(step.image)
            }))
          );
        }
        
        return questObj;
      })
    );
    
    res.status(200).json(questsWithSignedUrls);
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuestById = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    
    // Generate signed URLs for quest step images
    const questObj = quest.toObject();
    
    if (questObj.steps && Array.isArray(questObj.steps)) {
      questObj.steps = await Promise.all(
        questObj.steps.map(async (step) => ({
          ...step,
          image: await getSignedUrlForImage(step.image)
        }))
      );
    }
    
    res.status(200).json(questObj);
  } catch (error) {
    console.error('Error fetching quest by ID:', error);
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

    // Find quest by _id, id field, or slug
    const mongoose = require('mongoose');
    let quest;
    
    // Try to find by MongoDB _id
    if (mongoose.Types.ObjectId.isValid(questIdOrSlug) && questIdOrSlug.length === 24) {
      quest = await Quest.findById(questIdOrSlug);
    }
    
    // If not found, try to find by custom 'id' field or 'slug'
    if (!quest) {
      quest = await Quest.findOne({ $or: [{ id: questIdOrSlug }, { slug: questIdOrSlug }] });
    }

    if (!quest) {
      console.error('Quest not found:', questIdOrSlug);
      return res.status(404).json({ message: 'Quest not found' });
    }

    const questId = quest._id.toString();
    const customQuestId = quest.id || quest.slug;

    // Find existing progress entry - match by _id, id, or slug
    const questProgress = user.questsProgress.find(p => {
      if (!p.questId) return false;
      const pQuestId = p.questId.toString();
      return pQuestId === questId || 
             pQuestId === customQuestId || 
             p.questId === customQuestId ||
             p.questId === quest.slug;
    });

    if (questProgress) {
      questProgress.questId = questId;
      questProgress.stageIndex = stageIndex !== undefined ? stageIndex : questProgress.stageIndex;
      questProgress.status = status || questProgress.status;
    } else {
      user.questsProgress.push({ questId: questId, stageIndex: stageIndex || 0, status: status || 'in-progress' });
    }

    await user.save();
    console.log('Quest progress updated:', { userId: user._id, questId, customQuestId, stageIndex, status });
    res.status(200).json(user.questsProgress);
  } catch (error) {
    console.error('Update quest progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
