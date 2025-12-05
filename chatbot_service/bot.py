import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, List

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load environment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

# Create FastAPI app
app = FastAPI(title="FarmStellar Chatbot")

# CORS setup (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main LLM
chat_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0
)

# Classifier LLM
classifier_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0
)

# --------------------------
# Session-based chat history
# --------------------------
SESSIONS: Dict[str, List[Dict]] = {}


# ------------------------
# MULTILINGUAL AI MODERATOR
# ------------------------
def is_farm_related_llm(query: str) -> bool:
    moderation_prompt = f"""
    You are a multilingual classifier. Understand the question in ANY language.
    You are FarmStellar, an agricultural expert chatbot.
    You ALWAYS use previous conversation context.
    If the user’s question is unclear or short (e.g., “what method?”, “which one?”, “how?”),
    you infer the meaning from previous messages.

    Do NOT refuse unless the user is clearly asking outside agriculture.
    Your goal is to guide farmers clearly and helpfully.


    Determine if this question is ONLY about:
    ✔ Farming, crops, soil, irrigation
    ✔ Seeds, fertilizers, pests
    ✔ Weather impact on crops
    ✔ Farm tools, tractors
    ✔ Sustainable agriculture
    ✔ FarmStellar app (login, rewards, quests)

    If the question is not about these topics, answer: no  
    If it is related, answer: yes

    Question: "{query}"

    Reply with only: yes or no.
    """

    result = classifier_model.invoke([
        HumanMessage(content=moderation_prompt)
    ]).content.strip().lower()

    return result == "yes"


# Request model
class Query(BaseModel):
    message: str
    session_id: Optional[str] = "default"


# ---------------------------
# MAIN CHAT ENDPOINT
# ---------------------------
@app.post("/ask")
async def ask(query: Query):
    user_msg = query.message.strip()
    session_id = query.session_id

    if not user_msg:
        return {"answer": "Please type something to ask. 🌱"}

    # Create session if not present
    if session_id not in SESSIONS:
        SESSIONS[session_id] = []

    # ---- Moderation ----
    if not is_farm_related_llm(user_msg):
        return {
            "answer": (
                "❌ I can answer only **farming, agriculture, or FarmStellar app** related questions. "
                "Please ask about crops, soil, fertilizers, pests, irrigation, weather, or sustainable farming. 🌾"
            ),
            "session_id": session_id
        }

    # Add user message
    SESSIONS[session_id].append({"role": "user", "content": user_msg})

    # Limit last 20 messages
    SESSIONS[session_id] = SESSIONS[session_id][-20:]

    # Prepare history context
    history_context = ""
    for msg in SESSIONS[session_id]:
        if msg["role"] == "user":
            history_context += f"Farmer: '{msg['content']}'\n"
        else:
            history_context += f"FarmStellar: '{msg['content']}'\n"

    # System prompt
    system_prompt = f"""
    You are FarmStellar Bot – a friendly farming assistant for Indian farmers.

    Conversation history:
    {history_context}

    Follow these rules:
    • Respond in the SAME language the user uses  
    • Use simple, farmer-friendly words  
    • Max 100–150 words  
    • Use bullet points (• or -)  
    • Bold important terms  
    • Be kind and helpful 🌱  
    """

    # Generate answer
    response = chat_model.invoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_msg)
    ])

    bot_reply = response.content

    # Save bot response
    SESSIONS[session_id].append({"role": "bot", "content": bot_reply})

    return {
        "answer": bot_reply,
        "session_id": session_id,
        "history_length": len(SESSIONS[session_id])
    }


# ---------------------------
# GET HISTORY
# ---------------------------
@app.get("/history")
async def get_history(session_id: Optional[str] = "default"):
    return {
        "session_id": session_id,
        "history": SESSIONS.get(session_id, []),
        "total": len(SESSIONS.get(session_id, []))
    }


# ---------------------------
# CLEAR HISTORY
# ---------------------------
@app.post("/clear")
async def clear_history(session_id: Optional[str] = "default"):
    if session_id in SESSIONS:
        SESSIONS[session_id] = []
    return {"message": "Chat history cleared 🌱", "session_id": session_id}


# ---------------------------
# ROOT ENDPOINT
# ---------------------------
@app.get("/")
async def root():
    return {
        "message": "🌱 FarmStellar Chatbot is running!",
        "endpoints": {
            "POST /ask": "{ message, session_id }",
            "GET /history": "?session_id=",
            "POST /clear": "Clears chat history"
        }
    }
