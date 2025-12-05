const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
<<<<<<< HEAD
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  content: { type: String, required: true },
  images: [{
    key: { type: String, required: true },
    mimeType: { type: String },
    sizeBytes: { type: Number }
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  comments: [CommentSchema],
  commentsCount: { type: Number, default: 0 },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  district: { type: String }
}, { timestamps: true });

// Index for geospatial queries
CommunityPostSchema.index({ location: '2dsphere' });
=======
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

    // Visibility
    isPublic: { type: Boolean, default: true },

}, { timestamps: true });

// Index for efficient querying by location
CommunityPostSchema.index({ village: 1, panchayat: 1, block: 1, createdAt: -1 });
CommunityPostSchema.index({ userId: 1, createdAt: -1 });
>>>>>>> 13e2b0a (your message)

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
