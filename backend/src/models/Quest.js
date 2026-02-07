const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  id: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String },
  activities: [{ type: String }],
  outcomes: [{ type: String }],
  difficulty: { type: String, enum: ['Beginner', 'Pro'] },
  cropType: { type: String },
  xpReward: { type: Number, default: 0 },
  badgeName: { type: String },
  image: { type: String },
  steps: [
    {
      title: { type: String },
      objective: { type: String },
      subSteps: [{ type: String }],
      tip: { type: String },
      reason: { type: String },
      image: { type: String }
    }
  ],
  verification_data: {
    task_name: { type: String },
    success_criteria: { type: String },
    use_before_image: { type: Boolean, default: false }
  },
  active: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Quest', QuestSchema);
