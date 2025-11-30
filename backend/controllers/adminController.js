const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Submission = require('../models/Submission');
const s3Service = require('../services/s3Service');

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, passkey } = req.body;

    if (!email || !passkey) {
      return res.status(400).json({ message: 'Email and passkey are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if admin account is active
    if (!admin.isActive) {
      return res.status(403).json({ message: 'Admin account is deactivated' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(passkey, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token with admin role
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        role: admin.role,
        userType: 'admin'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('Admin logged in:', admin._id);
    res.status(200).json({ 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        organization: admin.organization
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all farmers
exports.getAllFarmers = async (req, res) => {
  try {
    const { search, experience, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (experience) {
      query.level = experience;
    }

    const farmers = await User.find(query)
      .populate('farm')
      .select('-passwordHash')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({ 
      farmers,
      total,
      hasMore: total > parseInt(skip) + farmers.length
    });
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update farmer details
exports.updateFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { name, email, phone, city, level, xp } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (city !== undefined) updateFields.city = city;
    if (level !== undefined) updateFields.level = level;
    if (xp !== undefined) updateFields.xp = xp;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: farmerId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const farmer = await User.findByIdAndUpdate(
      farmerId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    console.log('Farmer updated:', farmerId);
    res.status(200).json({ 
      message: 'Farmer updated successfully',
      farmer 
    });
  } catch (error) {
    console.error('Update farmer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments();
    
    // Get new signups this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newSignups = await User.countDocuments({ 
      createdAt: { $gte: oneWeekAgo } 
    });

    // Get active users (users with quests progress)
    const activeUsers = await User.countDocuments({
      'questsProgress.0': { $exists: true }
    });

    // Get total quests completed
    const users = await User.find({}, 'questsProgress');
    const totalQuestsCompleted = users.reduce((sum, user) => {
      return sum + (user.questsProgress?.filter(q => q.status === 'completed').length || 0);
    }, 0);

    res.status(200).json({
      totalFarmers,
      newSignups,
      activeUsers,
      totalQuestsCompleted
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending submissions
exports.getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ status: 'pending' })
      .populate('userId', 'name phone email')
      .sort({ createdAt: -1 });

    // Generate signed URLs for images
    const submissionsWithSignedUrls = await Promise.all(
      submissions.map(async (submission) => {
        const submissionObj = submission.toObject();
        
        // If submission has media with S3 keys, generate signed URLs
        if (submissionObj.media && submissionObj.media.length > 0) {
          submissionObj.media = await Promise.all(
            submissionObj.media.map(async (item) => {
              if (item.key) {
                try {
                  const signedUrl = await s3Service.getSignedDownloadUrl(item.key, 3600);
                  return { ...item, signedUrl };
                } catch (error) {
                  console.error('Error generating signed URL:', error);
                  return item;
                }
              }
              return item;
            })
          );
          
          // Update proofUrl with signed URL for backward compatibility
          if (submissionObj.media[0]?.signedUrl) {
            submissionObj.proofUrl = submissionObj.media[0].signedUrl;
          }
        } else if (submissionObj.proofUrl && submissionObj.proofUrl.includes('s3.amazonaws.com')) {
          // Extract S3 key from URL and generate signed URL
          try {
            const urlParts = submissionObj.proofUrl.split('.amazonaws.com/');
            if (urlParts.length > 1) {
              const key = urlParts[1].split('?')[0];
              submissionObj.proofUrl = await s3Service.getSignedDownloadUrl(key, 3600);
            }
          } catch (error) {
            console.error('Error generating signed URL for proofUrl:', error);
          }
        }
        
        return submissionObj;
      })
    );

    res.status(200).json({ submissions: submissionsWithSignedUrls });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve submission
exports.approveSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { 
        status: 'approved',
        reviewedBy: req.adminId,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Quest XP rewards mapping
    const questXPRewards = {
      'crops': 60,
      'soil': 5,
      'compost': 45,
      'pest_control': 40,
      'irrigation': 55,
      'organic_fertilizer': 50,
      'crop_rotation': 85,
      'mulching': 85,
      'rainwater_harvesting': 35,
      'greenhouse': 90,
      'seed_selection': 45,
      'pruning': 80,
      'vertical_farming': 100,
      'biogas': 60
    };

    const xpReward = questXPRewards[submission.questId] || 0;

    // Update user's quest progress and award XP
    const user = await User.findByIdAndUpdate(
      submission.userId,
      {
        $set: {
          'questsProgress.$[elem].status': 'completed'
        },
        $inc: {
          xpPoints: xpReward
        },
        $addToSet: {
          completedQuests: submission.questId
        }
      },
      {
        arrayFilters: [{ 'elem.questId': submission.questId }],
        new: true
      }
    );

    // Calculate new level based on XP
    if (user) {
      const newLevel = Math.floor(user.xpPoints / 100) + 1;
      if (newLevel !== user.xpLevel) {
        await User.findByIdAndUpdate(submission.userId, { xpLevel: newLevel });
      }
    }

    res.status(200).json({ 
      message: 'Submission approved successfully',
      submission,
      xpAwarded: xpReward
    });
  } catch (error) {
    console.error('Approve submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject submission
exports.rejectSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: 'Feedback is required' });
    }

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { 
        status: 'rejected',
        feedback,
        reviewedBy: req.adminId,
        reviewedAt: new Date()
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ 
      message: 'Submission rejected successfully',
      submission 
    });
  } catch (error) {
    console.error('Reject submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create initial admin (for setup only - should be protected or removed in production)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, organization, role } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin
    const admin = new Admin({ 
      name, 
      email, 
      passwordHash, 
      organization,
      role: role || 'admin'
    });
    await admin.save();

    console.log('Admin created:', admin._id);
    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        organization: admin.organization,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
