
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '.env') });
console.log("API Key present:", process.env.GOOGLE_API_KEY ? "YES" : "NO");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

async function testVision() {
    console.log("Testing Gemini Vision...");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Test Image: A field of corn
        const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Maize_field_in_summer.jpg/640px-Maize_field_in_summer.jpg";
        const criteria = "Check if this image shows a crop field, specifically corn/maize.";

        console.log(`Fetching image: ${imageUrl}`);
        const response = await fetch(imageUrl);
        const buffer = await response.buffer();
        const base64Info = buffer.toString('base64');

        const prompt = `
      Analyze this image for the following criteria: "${criteria}"
      Return ONLY valid JSON: { "success": boolean, "response": "reason" }
    `;

        console.log("Sending to Gemini...");
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Info, mimeType: "image/jpeg" } }
        ]);

        console.log("Result:", result.response.text());

    } catch (error) {
        console.error("Error:", error);
    }
}

testVision();
