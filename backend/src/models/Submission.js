const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questId: { type: String, required: true },
  stageIndex: { type: Number, default: 0 },
  media: [
    {
      key: { type: String },
      mimeType: { type: String },
      sizeBytes: { type: Number },
    },
  ],
  notes: { type: String },
  checklist: [{ type: String }],
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  xpAwarded: { type: Boolean, default: false },
  proofType: { type: String, default: 'text' },
  proofUrl: { type: String, default: '' },
  cottonVerification: {
    success: { type: Boolean },
    has_cotton: { type: Boolean },
    is_healthy: { type: Boolean },
    detected_classes: [{ type: String }],
    detection_count: { type: Number },
    message: { type: String },
    error: { type: String }
  },
  questVerification: {
    success: { type: Boolean },
    verified: { type: Boolean },
    response: { type: String },
    error: { type: String }
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
