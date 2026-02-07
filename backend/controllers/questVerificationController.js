const { GoogleGenerativeAI } = require("@google/generative-ai");
const s3Service = require('../services/s3Service');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

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

/**
 * Verify quest completion using AI Vision (Gemini)
 * Expects: { imageKey, imageUrl, successCriteria, questId }
 */
exports.verifyQuest = async (req, res) => {
  try {
    const { imageKey, imageUrl, successCriteria } = req.body;

    if ((!imageKey && !imageUrl) || !successCriteria) {
      return res.status(400).json({
        success: false,
        message: 'Image and success criteria are required',
        error: 'Image and success criteria are required'
      });
    }

    console.log('Verifying quest with AI Vision:', successCriteria);

    // 1. Get Image Buffer
    let imageBuffer;
    let mimeType = 'image/jpeg'; // Default assumption, or detect from headers/extension

    if (imageKey) {
      // Check if file exists locally first (Local Storage Fallback)
      const localFilePath = path.join(__dirname, '..', imageKey); // Assumes imageKey = 'uploads/filename'

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
          console.warn("Failed to fetch from S3, trying URL...", s3Error.message);
          // Fallback to URL fetch if S3 fails
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
          imageBuffer = await response.buffer();
        }
      }
    } else {
      // Fetch from URL
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      imageBuffer = await response.buffer();
      const contentType = response.headers.get('content-type');
      if (contentType) mimeType = contentType;
    }

    // 2. Prepare for Gemini
    // Gemini expects base64 inputs for images
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const prompt = `
      You are an agricultural verification expert.
      A user has uploaded an image claiming it completes the following quest task:
      "${successCriteria}"

      Analyze the image carefully. Does it show what is required?
      - If yes, provide a strict confirmation.
      - If no, explain why.
      - Be lenient with "close enough" attempts but reject obvious fakes or irrelevant images.

      Respond ONLY with valid JSON in this format:
      {
        "success": boolean,
        "verified": boolean,
        "response": "Short explanation for validity",
        "error": null
      }
    `;

    // 3. Call Gemini API
    if (!model) {
      // Try to re-init if key is now available (e.g. env reloaded)
      if (process.env.GOOGLE_API_KEY) {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      } else {
        throw new Error("Google API Key is not configured on the server. Please add GOOGLE_API_KEY to backend/.env");
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
    // Find the first '{' and last '}' to extract the JSON object
    const start = textResponse.indexOf('{');
    const end = textResponse.lastIndexOf('}');

    if (start === -1 || end === -1) {
      throw new Error("AI response did not contain valid JSON");
    }

    const jsonString = textResponse.substring(start, end + 1);
    const verificationResult = JSON.parse(jsonString);

    return res.json({
      success: verificationResult.success,
      verified: verificationResult.verified,
      response: verificationResult.response,
      error: verificationResult.error
    });

  } catch (error) {
    console.error('Quest verification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify quest with AI',
      error: error.message // Keep for backward compatibility
    });
  }
};
