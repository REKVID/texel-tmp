from fastapi import APIRouter
from ..storage import store
import time

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.post("")
async def create_conversation():
    conversation_id = f"conversation-{int(time.time() * 1000)}"
    return {"conversation_id": conversation_id}

@router.get("/{conversation_id}")
async def get_conversation(conversation_id: str):
    msgs = store.get_messages(conversation_id)
    meta = store.get_meta(conversation_id) or {"created_at": None, "updated_at": None, "messages_count": 0}
    return {
        "conversation_id": conversation_id,
        "messages": msgs,
        "messages_count": len(msgs),
        "created_at": meta.get("created_at"),
        "updated_at": meta.get("updated_at"),
    }

@router.delete("/{conversation_id}")
async def clear_conversation(conversation_id: str):
    ok = store.clear(conversation_id)
    return {"success": ok, "message": "Conversation cleared" if ok else "Conversation not found"}
