# app/routers/meta.py
from fastapi import APIRouter, Depends
from typing import Any
from ..config import settings
from ..storage import store
from ..models import ServiceStats
from ..deps import get_openrouter_client

router = APIRouter(tags=["meta"])

@router.get("/health")
async def health():
    stats = store.stats()
    return {
        "status": "healthy",
        "version": "2.0.0",
        "service": "ai-chat-microservice-rewrite",
        "openrouter_configured": bool(settings.OPENROUTER_API_KEY),
        **stats,
    }

@router.get("/models")
async def models(client: Any = Depends(get_openrouter_client)):
    return await client.list_models()

@router.get("/stats", response_model=ServiceStats)
async def service_stats():
    s = store.stats()
    return ServiceStats(
        total_conversations=s["total_conversations"],
        total_messages=s["total_messages"],
        active_conversations=s["active_conversations"],
        openrouter_configured=bool(settings.OPENROUTER_API_KEY),
    )
