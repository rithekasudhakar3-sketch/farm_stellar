const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Just to instantiate
    // Actually the SDK doesn't expose listModels directly on the main class easily in all versions, 
    // but we can try to access the model manager if available or just infer.
    // Wait, the error message literally says "Call ListModels to see the list of available models".
    // This implies we should be able to.
    
    // In @google/generative-ai, listModels is not a method on GoogleGenerativeAI instance directly usually?
    // Let's rely on documentation or try a known working pattern.
    // Actually, usually it's not needed if we use the right string.
    
    console.log("Defining model...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash:", e.message);
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-latest", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash-latest:", e.message);
  }

    try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-001", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash-001:", e.message);
  }
}

listModels();
