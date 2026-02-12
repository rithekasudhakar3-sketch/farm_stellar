const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  address: { type: String },
  landSize: { type: Number, required: true },
  unit: { type: String, enum: ['acres', 'hectares'], default: 'acres' },
  farmLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  geofence: {
    radius: { type: Number } // in meters
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected', 'Flagged', 'Not Registered'], // Added 'Not Registered' just in case, though usually handled by absence of record
    default: 'Pending'
  },
  primaryCrop: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
