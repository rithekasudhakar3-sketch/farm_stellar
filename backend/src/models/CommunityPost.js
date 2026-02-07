const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String }, // First letter of name or custom avatar
  content: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs

  // Location hierarchy for multi-level leaderboards
  village: { type: String },
  panchayat: { type: String },
  block: { type: String },
  district: { type: String },

  // Engagement metrics
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked
  comments: [CommentSchema],

  // Post metadata
  postType: { type: String, enum: ['progress', 'tip', 'question', 'milestone', 'general'], default: 'general' },
  relatedQuestId: { type: String }, // If post is about a specific quest
  cropType: { type: String },
  method: { type: String },

  // Visibility
  isPublic: { type: Boolean, default: true },

}, { timestamps: true });

// Index for efficient querying by location
CommunityPostSchema.index({ village: 1, panchayat: 1, block: 1, createdAt: -1 });
CommunityPostSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
