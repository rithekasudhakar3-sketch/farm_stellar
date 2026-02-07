const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get community posts with filters
exports.getPosts = async (req, res) => {
  try {
    const { level, location, limit = 20, skip = 0 } = req.query;

    // Build query based on level (village, panchayat, block, or all)
    let query = { isPublic: true };

    if (level && location) {
      query[level] = location;
    }

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    // Add like count and comment count
    const postsWithCounts = posts.map(post => ({
      ...post,
      likesCount: post.likes?.length || 0,
      commentsCount: post.comments?.length || 0,
      isLikedByUser: post.likes?.includes(req.user.userId) || false
    }));

    res.status(200).json(postsWithCounts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { content, images, postType, relatedQuestId, cropType, method } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    // Get user data for location info
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = new CommunityPost({
      userId: req.user.userId,
      userName: user.name,
      userAvatar: user.name.charAt(0).toUpperCase(),
      content: content.trim(),
      images: images || [],
      village: user.village,
      panchayat: user.panchayat,
      block: user.block,
      district: user.district || user.city,
      postType: postType || 'general',
      relatedQuestId,
      cropType,
      method,
      likes: [],
      comments: []
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post.toObject(),
        likesCount: 0,
        commentsCount: 0,
        isLikedByUser: false
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like/unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likesCount: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      userId: req.user.userId,
      userName: user.name,
      content: content.trim(),
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment,
      commentsCount: post.comments.length
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get leaderboard data
exports.getLeaderboard = async (req, res) => {
  try {
    const { level, location } = req.query;

    // Build query based on level
    let matchQuery = {};
    if (level && location) {
      matchQuery[level] = location;
    }

    // Aggregate users by sustainability score (XP + completed quests)
    const leaderboard = await User.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          completedQuestsCount: {
            $size: {
              $filter: {
                input: '$questsProgress',
                as: 'quest',
                cond: { $eq: ['$$quest.status', 'completed'] }
              }
            }
          },
          sustainabilityScore: {
            $add: [
              '$xp',
              {
                $multiply: [
                  {
                    $size: {
                      $filter: {
                        input: '$questsProgress',
                        as: 'quest',
                        cond: { $eq: ['$$quest.status', 'completed'] }
                      }
                    }
                  },
                  10 // 10 points per completed quest
                ]
              }
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          city: 1,
          village: 1,
          panchayat: 1,
          block: 1,
          xp: 1,
          xpLevel: 1,
          completedQuestsCount: 1,
          sustainabilityScore: 1
        }
      },
      { $sort: { sustainabilityScore: -1 } },
      { $limit: 50 }
    ]);

    // Add rank
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      avatar: user.name.charAt(0).toUpperCase()
    }));

    res.status(200).json(rankedLeaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's community stats
exports.getCommunityStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [postCount, totalLikes, totalComments] = await Promise.all([
      CommunityPost.countDocuments({ userId }),
      CommunityPost.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $project: { likesCount: { $size: '$likes' } } },
        { $group: { _id: null, total: { $sum: '$likesCount' } } }
      ]),
      CommunityPost.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $project: { commentsCount: { $size: '$comments' } } },
        { $group: { _id: null, total: { $sum: '$commentsCount' } } }
      ])
    ]);

    res.status(200).json({
      postsCount: postCount,
      totalLikes: totalLikes[0]?.total || 0,
      totalComments: totalComments[0]?.total || 0
    });
  } catch (error) {
    console.error('Get community stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
