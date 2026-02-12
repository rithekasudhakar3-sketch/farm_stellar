const { GoogleGenerativeAI } = require("@google/generative-ai");
const s3Service = require('../services/s3Service');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const Farm = require('../models/Farm');
const { getDistanceFromLatLonInM } = require('../utils/geoUtils');

// Initialize Gemini
let genAI;
let model;

try {
  if (process.env.GOOGLE_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  } else {
    console.warn("GOOGLE_API_KEY is missing in environment variables.");
  }
} catch (initError) {
  console.error("Gemini Initialization Error:", initError);
}

// Helper to get place name from coordinates using OpenStreetMap (Nominatim)
async function getPlaceName(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FarmStellarApp/1.0'
      }
    });
    if (!response.ok) return "Unknown Location";
    const data = await response.json();

    // Extract meaningful parts
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.county || "";
    const state = address.state || "";

    return [city, state].filter(Boolean).join(", ") || data.display_name.split(',')[0];
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Location lookup failed";
  }
}

/**
 * Verify quest completion using AI Vision (Gemini)
 * Expects: { imageKey, imageUrl, successCriteria, questId }
 */
exports.verifyQuest = async (req, res) => {
  try {
    const { imageKey, imageUrl, successCriteria, gpsCoordinates } = req.body;
    const userId = req.user?.userId; // Ensure authorized

    if ((!imageKey && !imageUrl) || !successCriteria) {
      return res.status(400).json({
        success: false,
        message: 'Image and success criteria are required',
        error: 'Image and success criteria are required'
      });
    }

    // --- 🌍 LOCATION VERIFICATION (STRICT) ---
    if (!userId) {
      return res.status(401).json({ status: 'rejected', reasons: ['User authentication failed'] });
    }

    const farm = await Farm.findOne({ userId });

    if (!farm) {
      return res.json({
        status: 'rejected',
        reasons: ['No registered farm found. Please register your farm location first.']
      });
    }

    if (!gpsCoordinates || !gpsCoordinates.latitude || !gpsCoordinates.longitude) {
      return res.json({
        status: 'rejected',
        reasons: ['GPS location data missing. Please enable location services and try again.']
      });
    }

    const { latitude, longitude, accuracy, timestamp } = gpsCoordinates;

    // 1. GPS Integrity Check
    if (accuracy && accuracy > 200) {
      return res.json({
        status: 'rejected',
        reasons: [`GPS signal too weak (Accuracy: ${Math.round(accuracy)}m). Must be better than 200m.`]
      });
    }

    // Time delay check removed to allow flexible verification (relying on penalty instead)

    // 2. Geofence Check
    const dist = getDistanceFromLatLonInM(
      farm.farmLocation.lat,
      farm.farmLocation.lng,
      latitude,
      longitude
    );

    const allowedRadius = (farm.geofence?.radius || 100) + 100; // Radius + 100m buffer for demo

    console.log(`Quest Verification Location: Farm=[${farm.farmLocation.lat}, ${farm.farmLocation.lng}], Photo=[${latitude}, ${longitude}], Dist=${dist}m, Allowed=${allowedRadius}m`);

    // 3. Prepare detailed location data for response
    let currentPlaceName = "Unknown";
    let registeredPlaceName = "Unknown";
    try {
      currentPlaceName = await getPlaceName(latitude, longitude);
      registeredPlaceName = farm.address || await getPlaceName(farm.farmLocation.lat, farm.farmLocation.lng);
    } catch (e) { console.error("Place name fetch error", e); }

    const locationDetails = {
      registered: {
        lat: farm.farmLocation.lat,
        lng: farm.farmLocation.lng,
        placeName: registeredPlaceName
      },
      current: {
        lat: latitude,
        lng: longitude,
        placeName: currentPlaceName
      },
      distance: Math.round(dist),
      allowedRadius: Math.round(allowedRadius),
      isInside: dist <= allowedRadius
    };

    if (dist > allowedRadius) {
      return res.json({
        status: 'rejected',
        reasons: [`Location verification failed. You are ${Math.round(dist - allowedRadius)}m outside your farm boundary.`],
        suggestions: ['Move inside your registered farm area and try again.'],
        locationDetails // Include details for UI
      });
    }

    // --- ✅ LOCATION PASSED ---

    // Calculate Confidence Score
    let confidenceScore = 100;

    // Penalty for distance from center (clamped)
    const distancePenalty = Math.min(30, (dist / allowedRadius) * 20);
    confidenceScore -= distancePenalty;

    // Penalty for GPS accuracy
    confidenceScore -= (accuracy || 0);

    // Penalty for time delay
    if (timestamp) {
      const photoTime = new Date(timestamp).getTime();
      const serverTime = Date.now();
      const diffSeconds = Math.abs(serverTime - photoTime) / 1000;
      if (diffSeconds > 60) confidenceScore -= 10;
    }

    confidenceScore = Math.max(0, Math.min(100, Math.round(confidenceScore)));


    console.log('Verifying quest with AI Vision:', successCriteria);

    // 1. Get Image Buffer
    let imageBuffer;
    let mimeType = 'image/jpeg'; // Default assumption

    // Prefer fetching from URL (Cloudinary)
    if (imageUrl) {
      console.log('Fetching image from URL:', imageUrl);
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      imageBuffer = await response.buffer();
      const contentType = response.headers.get('content-type');
      if (contentType) mimeType = contentType;
    }
    // Fallback to key if no URL (Legacy / Local / S3 check)
    else if (imageKey) {
      // Check if file exists locally first (Local Storage Fallback)
      const localFilePath = path.join(__dirname, '..', imageKey);

      if (fs.existsSync(localFilePath)) {
        console.log('Reading image from local storage:', localFilePath);
        imageBuffer = fs.readFileSync(localFilePath);
      } else {
        // Fetch from S3
        try {
          const s3Response = await s3Service.getObject(imageKey);

          // S3 response handling based on AWS SDK version
          if (Buffer.isBuffer(s3Response)) {
            imageBuffer = s3Response;
          } else if (s3Response.transformToByteArray) {
            // AWS SDK v3
            imageBuffer = Buffer.from(await s3Response.transformToByteArray());
          } else if (s3Response.Body) {
            // Stream handling
            const chunks = [];
            for await (const chunk of s3Response.Body) {
              chunks.push(chunk);
            }
            imageBuffer = Buffer.concat(chunks);
          } else {
            // Fallback
            imageBuffer = s3Response;
          }
        } catch (s3Error) {
          // If S3 fails and we already tried URL (in previous logic), we are stuck.
          // But here we only enter if !imageUrl.
          throw new Error("Local file and S3 failed, and no URL provided.");
        }
      }
    } else {
      throw new Error("No image key or URL provided.");
    }

    // 2. Prepare for Gemini
    // Gemini expects base64 inputs for images
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const prompt = `
      You are an agricultural verification expert for a gamified farming app.
      A user has uploaded an image claiming it completes the following quest task:
      "${successCriteria}"

      Analyze the image carefully.
      1. Is the image clearly irrelevant (e.g., a selfie, a car, a blurry black screen, unrelated city life)? If so, REJECT it.
      2. Does the image show content related to farming, nature, rural life, OR the specific task described?
         - Even if it's just a hand holding a tool or a patch of soil, if it matches the criteria, allow it.
      3. DOES the image meet the specific success criteria "${successCriteria}"?
      
      Respond ONLY with valid JSON in this strictly defined format:
      {
        "status": "verified" | "rejected",
        "reasons": ["List 1-3 specific reasons in simple language"],
        "suggestions": ["List 1-2 constructive tips if rejected, or 'Good job!' if verified"]
      }
    `;

    // 3. Call Gemini API
    if (!model) {
      if (process.env.GOOGLE_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      } else {
        throw new Error("Google API Key is not configured.");
      }
    }

    console.log("Calling Gemini with prompt length:", prompt.length);
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      }
    ]);

    const textResponse = result.response.text();
    console.log('AI Verification Raw Response:', textResponse);

    // 4. Parse JSON Response
    const start = textResponse.indexOf('{');
    const end = textResponse.lastIndexOf('}');

    if (start === -1 || end === -1) {
      throw new Error("AI response did not contain valid JSON");
    }

    const jsonString = textResponse.substring(start, end + 1);
    const verificationResult = JSON.parse(jsonString);

    // Enforce schema
    const standardizedResult = {
      status: verificationResult.status === 'verified' ? 'verified' : 'rejected',
      reasons: Array.isArray(verificationResult.reasons) ? verificationResult.reasons : [verificationResult.response || 'No reason provided'],
      suggestions: Array.isArray(verificationResult.suggestions) ? verificationResult.suggestions : [],
      confidenceScore: confidenceScore,
      distanceFromFarm: Math.round(dist),
      locationDetails // Include details for UI
    };

    return res.json(standardizedResult);

  } catch (error) {
    console.error('Quest verification error:', error);
    // Return standardized error response
    return res.status(200).json({ // Return 200 so frontend handles it gracefully
      status: 'rejected',
      reasons: ['System error during verification: ' + (error.message || 'Unknown error')],
      suggestions: ['Please try again later or contact support.']
    });
  }
};
