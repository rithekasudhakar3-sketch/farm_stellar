const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const s3Service = require('../services/s3Service');
const os = require('os');
const Farm = require('../models/Farm');
const { getDistanceFromLatLonInM } = require('../utils/geoUtils');

/**
 * Verify cotton boll health from uploaded image
 */
exports.verifyCotton = async (req, res) => {
  let tempFilePath = null;

  try {
    const { imageKey, imageUrl, gpsCoordinates } = req.body;
    const userId = req.user?.userId;

    if (!imageKey && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image key or URL is required'
      });
    }

    // --- 🌍 LOCATION VERIFICATION (STRICT) ---
    if (userId) {
      const farm = await Farm.findOne({ userId });

      if (farm && gpsCoordinates) {
        const { latitude, longitude, accuracy, timestamp } = gpsCoordinates;

        // 1. GPS Integrity Check
        if (accuracy && accuracy > 100) {
          return res.status(400).json({
            success: false,
            message: `GPS signal too weak (Accuracy: ${Math.round(accuracy)}m).`
          });
        }

        // 2. Geofence Check (Demo Friendly: 100m buffer)
        const dist = getDistanceFromLatLonInM(
          farm.farmLocation.lat,
          farm.farmLocation.lng,
          latitude,
          longitude
        );

        const allowedRadius = (farm.geofence?.radius || 100) + 100; // Increased buffer for demo

        console.log(`Cotton Verification Location: Dist=${dist}m, Allowed=${allowedRadius}m`);

        if (dist > allowedRadius) {
          return res.status(400).json({
            success: false,
            message: `Location verification failed. You are ${Math.round(dist - allowedRadius)}m outside your farm boundary.`
          });
        }
      } else if (!farm) {
        console.warn("User has no farm registered, skipping strict location check for cotton (or should we fail?)");
        // The prompt says "If the farmer has no registered farm -> ❌ reject immediately."
        return res.status(400).json({
          success: false,
          message: 'No registered farm found. Please register your farm first.'
        });
      }
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Download image from S3 to temporary file
    // Download image from S3 or Local to buffer
    let imageBuffer;

    // 1. Prefer fetching from URL (Cloudinary)
    if (imageUrl) {
      console.log('Fetching cotton image from URL:', imageUrl);
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    }
    // 2. Fallback to local/S3 if only key is provided (Legacy)
    else if (imageKey) {
      const localPath = path.join(__dirname, '..', imageKey);
      try {
        await fs.access(localPath);
        console.log('Using local file for cotton verification:', localPath);
        imageBuffer = await fs.readFile(localPath);
      } catch (err) {
        // Not local, try S3
        try {
          imageBuffer = await s3Service.getObject(imageKey);
        } catch (s3Err) {
          throw new Error("Local file and S3 failed, and no URL provided.");
        }
      }
    } else {
      throw new Error("No image key or URL provided.");
    }

    // Create temporary file
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `cotton_${Date.now()}.jpg`);
    await fs.writeFile(tempFilePath, imageBuffer);

    // Path to Python script
    const pythonScript = path.join(__dirname, '../ai/cotton/cotton.py');

    // Check if Python script exists
    try {
      await fs.access(pythonScript);
    } catch (error) {
      console.error('Python script not found:', pythonScript);
      return res.status(500).json({
        success: false,
        message: 'Cotton verification script not found'
      });
    }

    // Execute Python script
    const pythonProcess = spawn('python', [pythonScript, tempFilePath]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      // Clean up temporary file
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }

      if (code !== 0) {
        console.error('Python script error:', errorData);
        return res.status(500).json({
          success: false,
          message: 'Cotton verification failed',
          error: errorData
        });
      }

      try {
        // Extract JSON from output (last line should be the JSON result)
        const lines = outputData.trim().split('\n');
        const jsonLine = lines[lines.length - 1];
        const result = JSON.parse(jsonLine);
        console.log('Cotton verification result:', result);

        res.status(200).json(result);
      } catch (parseError) {
        console.error('Failed to parse Python output:', outputData);
        console.error('Parse error:', parseError.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to parse verification result',
          error: parseError.message,
          rawOutput: outputData.substring(0, 500) // Include first 500 chars for debugging
        });
      }
    });

  } catch (error) {
    console.error('Cotton verification error:', error);

    // Clean up temporary file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error during cotton verification',
      error: error.message
    });
  }
};
