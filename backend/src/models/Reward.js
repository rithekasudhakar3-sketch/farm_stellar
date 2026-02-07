const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  xpCost: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Reward', RewardSchema);
