from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

from app.ai.copilot import CopilotEngine

router = APIRouter()
copilot_engine = CopilotEngine()

class ChatRequest(BaseModel):
    message: str
    context: str = ""

@router.post("/chat")
def chat_with_copilot(request: ChatRequest):
    response_text = copilot_engine.generate_response(request.message, request.context)
    return {"response": response_text}

@router.get("/history")
def get_chat_history():
    return {"history": []} # Mock history
