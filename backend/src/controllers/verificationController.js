const Farm = require('../models/Farm');
const VerificationPhoto = require('../models/VerificationPhoto');
const { calculateGeofenceRadius, getDistanceFromLatLonInM } = require('../utils/geoUtils');
const { cloudinary } = require('../config/cloudinary');

// Phase 1: Farmer Signup & Land Registration
exports.registerFarm = async (req, res) => {
    try {
        const { landSize, unit, farmLocation, deviceAccuracy } = req.body;
        const userId = req.user.userId;

        // 1. Calculate Geofence Radius
        const radius = calculateGeofenceRadius(landSize, unit);

        let farm = await Farm.findOne({ userId });

        if (farm) {
            farm.landSize = landSize;
            farm.unit = unit;
            farm.farmLocation = farmLocation;
            farm.geofence = { radius };
            farm.verificationStatus = 'Pending';
            await farm.save();
        } else {
            farm = new Farm({
                userId,
                name: `Farm-${Date.now()}`,
                landSize,
                unit,
                farmLocation,
                geofence: { radius },
                verificationStatus: 'Pending'
            });
            await farm.save();
        }

        res.status(201).json({
            success: true,
            message: 'Farm registered successfully',
            data: farm
        });

    } catch (error) {
        console.error('Error registering farm:', error);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// Phase 2: Photo-Based Location Verification
exports.verifyPhoto = async (req, res) => {
    try {
        const { photoUrl, location, deviceAccuracy, timestamp } = req.body;
        const userId = req.user.userId;

        // Upload image to Cloudinary if it's base64
        let storedPhotoUrl = photoUrl;
        if (photoUrl && photoUrl.startsWith('data:image')) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(photoUrl, {
                    folder: 'farm_stellar_verification',
                    public_id: `verify_${userId}_${Date.now()}`,
                    resource_type: 'image'
                });
                storedPhotoUrl = uploadResponse.secure_url;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({ success: false, message: 'Failed to upload verification photo' });
            }
        }

        const farm = await Farm.findOne({ userId });
        if (!farm) {
            return res.status(404).json({ success: false, message: 'Farm not found' });
        }

        // --- Anti-Fraud Checks ---

        // Relaxed accuracy for testing/development
        if (deviceAccuracy > 1000) {
            return res.status(400).json({
                success: false,
                message: 'GPS accuracy too low (must be < 1000m). Please try to get a better signal.',
                confidenceScore: 0
            });
        }

        const requestTime = new Date();
        const photoTime = new Date(timestamp);
        const timeDiffSeconds = Math.abs((requestTime - photoTime) / 1000);

        let timePenalty = 0;
        if (timeDiffSeconds > 60) {
            timePenalty = 20;
        }

        // --- Verification Logic ---
        const dist = getDistanceFromLatLonInM(
            farm.farmLocation.lat,
            farm.farmLocation.lng,
            location.lat,
            location.lng
        );

        const allowedRadius = farm.geofence.radius;

        let status = 'Pending';
        let confidenceScore = 100;

        if (dist > allowedRadius * 2) {
            status = 'Rejected';
            confidenceScore = 0;
        } else {
            status = 'Verified';

            if (dist > allowedRadius) {
                // Buffer zone
                confidenceScore -= 30;
                status = 'Flagged';
            }

            // Edge penalty
            if (dist > allowedRadius * 0.9) {
                confidenceScore -= 10;
            }

            confidenceScore -= deviceAccuracy;
            confidenceScore -= timePenalty;

            if (req.body.isMockGPS) {
                status = 'Flagged';
                confidenceScore = 0;
            }
        }

        confidenceScore = Math.max(0, Math.min(100, Math.round(confidenceScore)));

        const verification = new VerificationPhoto({
            farmerId: userId,
            photoUrl: storedPhotoUrl,
            lat: location.lat,
            lng: location.lng,
            gpsAccuracy: deviceAccuracy,
            timestamp: photoTime,
            distanceFromFarm: dist,
            confidenceScore,
            status,
            metadata: {
                isMockGPS: req.body.isMockGPS || false
            }
        });

        await verification.save();

        if (status === 'Verified') {
            farm.verificationStatus = 'Verified';
            await farm.save();
        }

        res.json({
            success: true,
            data: {
                verificationId: verification._id,
                status,
                confidenceScore,
                distance: dist,
                message: status === 'Verified' ? 'Verification Successful' : 'Verification Failed or Flagged'
            }
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getVerificationStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const farm = await Farm.findOne({ userId });

        if (!farm) {
            return res.json({ status: 'Not Registered' });
        }

        res.json({
            status: farm.verificationStatus,
            farmDetails: farm
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
