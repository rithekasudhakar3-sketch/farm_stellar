const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  activities: [{ type: String }],
  outcomes: [{ type: String }],
  difficulty: { type: String, enum: ['Beginner', 'Pro'] },
  cropType: { type: String },
  xpReward: { type: Number, default: 0 },
  badgeName: { type: String },
  stages: [
    {
      title: { type: String },
      objective: { type: String },
      subSteps: [{ type: String }],
      tip: { type: String },
      reason: { type: String },
      image: { type: String }
    }
  ],
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Quest', QuestSchema);
