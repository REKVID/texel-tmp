from app.models import ChatMessage, ChatResponse
from datetime import datetime

def test_chat_message_ok():
    ChatMessage(message="hi", conversation_id="x")

def test_chat_response_ok():
    ChatResponse(
        response="ok",
        model_used="m",
        tokens_used=1,
        conversation_id="x",
        timestamp=datetime.utcnow().isoformat(),
        response_time_ms=10,
    )
