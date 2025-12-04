const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  location: { type: String },
  city: { type: String },
  level: { type: String, enum: ['beginner', 'pro'], default: 'beginner' },
  xp: { type: Number, default: 0 },
  xpLevel: { type: Number, default: 0 },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  purchasedRewards: [{ type: String }], // Array of purchased reward IDs
  questsProgress: [
    {
      questId: { type: String },
      stageIndex: { type: Number },
      status: { type: String, enum: ['not-started', 'in-progress', 'submitted', 'completed'] },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
