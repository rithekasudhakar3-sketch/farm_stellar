import "dotenv/config";
import express from "express";
import cors from "cors";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log("API Key loaded:", process.env.GOOGLE_API_KEY ? "YES" : "NO");

/* ---------- SYSTEM PROMPT ---------- */
const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an expert agricultural assistant for farmers.
Rules:
- Explain sustainable farming in SIMPLE language.
- Give low-cost, practical, eco-friendly advice.
- ALWAYS reply in the SAME LANGUAGE as the farmer.
- Do NOT mention language detection.
- Ask a simple follow-up if the question is unclear.`,
    ],
    ["human", "{input}"],
]);

/* ---------- GEMINI MODEL ---------- */
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.6,
    apiKey: process.env.GOOGLE_API_KEY,
});

/* ---------- CHAIN ---------- */
const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
]);

/* ---------- API ENDPOINTS ---------- */

// Health check
app.get("/", (req, res) => {
    res.send("🌾 Farmer Chatbot API is Running!");
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await chain.invoke({ input: message });
        res.json({ reply: response });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to generate response", details: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`👉 POST http://localhost:${PORT}/api/chat`);
});
