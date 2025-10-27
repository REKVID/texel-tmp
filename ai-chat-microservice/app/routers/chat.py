# app/routers/chat.py
from fastapi import APIRouter, HTTPException, Depends
from typing import Any
import traceback
import sys
from ..models import ChatMessage, ChatResponse
from ..storage import store
from ..deps import get_openrouter_client

SYSTEM_PROMPT = (
    "You are a helpful AI assistant for an online learning platform. "
    "You speak Russian and provide clear, practical advice and explanations."
)

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, client: Any = Depends(get_openrouter_client)) -> ChatResponse:
    try:
        if not message.message.strip():
            raise HTTPException(status_code=400, detail="Empty message")

        # Build context: system prompt + last 10 messages
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        history = store.get_messages(message.conversation_id, last_n=10)
        messages.extend(history)
        messages.append({"role": "user", "content": message.message})

        # Call OpenRouter
        ai = await client.chat(
            messages,
            model=message.model,
            temperature=message.temperature,
            max_tokens=message.max_tokens,
        )

        # Store exchange
        store.add_exchange(message.conversation_id, message.message, ai.response)

        # Return response
        ai.conversation_id = message.conversation_id
        return ai
    
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR in /chat endpoint: {error_msg}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        raise HTTPException(status_code=500, detail=f"Server error: {error_msg}")
