# app/deps.py
from fastapi import Request
from .services.openrouter import OpenRouterClient

async def get_openrouter_client(request: Request) -> OpenRouterClient:
    """Получить клиент OpenRouter с HTTP клиентом из app state"""
    http_client = request.app.state.http_client
    return OpenRouterClient(http_client)
