const mongoose = require('mongoose');

const VerificationPhotoSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    gpsAccuracy: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    distanceFromFarm: {
        type: Number
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'Flagged'],
        default: 'Pending'
    },
    metadata: {
        deviceIntegrity: { type: Boolean, default: true },
        isMockGPS: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('VerificationPhoto', VerificationPhotoSchema);
