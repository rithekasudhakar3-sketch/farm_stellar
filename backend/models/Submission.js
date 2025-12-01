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
  status: { type: String, default: 'pending' },
  proofType: { type: String, default: 'text' },
  proofUrl: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
