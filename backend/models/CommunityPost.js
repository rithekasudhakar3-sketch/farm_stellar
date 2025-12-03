const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
