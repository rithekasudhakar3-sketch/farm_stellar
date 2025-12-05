const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
<<<<<<< HEAD
const s3Service = require('../services/s3Service');

// Create a new community post
exports.createPost = async (req, res) => {
  try {
    const { title, content, images, district, location } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Validate S3 uploads if image keys are provided
    if (images && images.length > 0) {
      for (const img of images) {
        try {
          await s3Service.headObject(img.key);
        } catch (error) {
          return res.status(400).json({ message: 'Image not found in S3 storage.' });
        }
      }
    }

    const post = new CommunityPost({
      userId: req.user.userId,
      title: title || '',
      content,
      images: images || [],
      district: district || ''
    });

    // Only add location if valid coordinates are provided
    if (location && location.coordinates && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      post.location = {
        type: 'Point',
        coordinates: location.coordinates // [longitude, latitude]
      };
    }

    await post.save();

    // Populate user info
    await post.populate('userId', 'name email');

    console.log('Community post created:', post._id);
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all community posts
exports.getPosts = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const posts = await CommunityPost.find()
      .populate('userId', 'name email city')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Generate signed URLs for images
    const postsWithSignedUrls = await Promise.all(
      posts.map(async (post) => {
        const postObj = post.toObject();
        
        if (postObj.images && postObj.images.length > 0) {
          postObj.images = await Promise.all(
            postObj.images.map(async (img) => {
              if (img.key) {
                try {
                  const signedUrl = await s3Service.getSignedDownloadUrl(img.key, 3600);
                  return { ...img, url: signedUrl };
                } catch (error) {
                  console.error('Error generating signed URL:', error);
                  return img;
                }
              }
              return img;
            })
          );
        }
        
        // Check if current user has liked the post
        postObj.isLiked = req.user && postObj.likes.some(like => like.toString() === req.user.userId.toString());
        
        return postObj;
      })
    );

    res.status(200).json({ posts: postsWithSignedUrls });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single post
exports.getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('userId', 'name email city')
      .populate('comments.userId', 'name email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postObj = post.toObject();
    
    // Generate signed URLs for images
    if (postObj.images && postObj.images.length > 0) {
      postObj.images = await Promise.all(
        postObj.images.map(async (img) => {
          if (img.key) {
            try {
              const signedUrl = await s3Service.getSignedDownloadUrl(img.key, 3600);
              return { ...img, signedUrl };
            } catch (error) {
              console.error('Error generating signed URL:', error);
              return img;
            }
          }
          return img;
        })
      );
    }

    res.status(200).json(postObj);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
=======
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
        const { content, images, postType, relatedQuestId } = req.body;

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
>>>>>>> 13e2b0a (your message)
};

// Like/unlike a post
exports.toggleLike = async (req, res) => {
<<<<<<< HEAD
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.userId;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      post.likesCount = post.likes.length;
    } else {
      // Like
      post.likes.push(userId);
      post.likesCount = post.likes.length;
    }

    await post.save();

    res.status(200).json({ 
      likesCount: post.likesCount, 
      isLiked: likeIndex === -1 
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      userId: req.user.userId,
      content,
      createdAt: new Date()
    });
    post.commentsCount = post.comments.length;

    await post.save();
    await post.populate('comments.userId', 'name email');

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete images from S3
    if (post.images && post.images.length > 0) {
      for (const img of post.images) {
        try {
          await s3Service.deleteObject(img.key);
        } catch (error) {
          console.error('Error deleting image from S3:', error);
        }
      }
    }

    await CommunityPost.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
=======
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
>>>>>>> 13e2b0a (your message)
};
