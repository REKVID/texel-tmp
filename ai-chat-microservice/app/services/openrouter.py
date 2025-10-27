"""
🛰️ Клиент для OpenRouter API
"""
from __future__ import annotations

import time
from typing import List, Dict, Any
import httpx

from ..config import settings
from ..models import ChatResponse

OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models"

class OpenRouterClient:
    def __init__(self, http_client: httpx.AsyncClient):
        self.client = http_client

    def _headers(self) -> Dict[str, str]:
        if not settings.OPENROUTER_API_KEY:
            raise RuntimeError("OpenRouter API key is not configured")
        return {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://texel-ai-forge.com",
            "X-Title": "Texel AI Learning Platform",
        }

    async def chat(self, messages: List[Dict[str, str]], model: str, temperature: float, max_tokens: int) -> ChatResponse:
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        start = time.time()
        resp = await self.client.post(OPENROUTER_CHAT_URL, headers=self._headers(), json=payload, timeout=60.0)
        if resp.status_code != 200:
            raise RuntimeError(f"OpenRouter error {resp.status_code}: {resp.text}")

        data = resp.json()
        try:
            content = data["choices"][0]["message"]["content"]
            tokens = int(data.get("usage", {}).get("total_tokens", 0))
            model_used = data.get("model") or model
        except Exception as e:
            raise RuntimeError(f"Unexpected OpenRouter response format: {e}; payload keys: {list(data.keys())}")

        elapsed = int((time.time() - start) * 1000)
        return ChatResponse(
            response=content,
            model_used=str(model_used),
            tokens_used=tokens,
            conversation_id="",  # будет заполнен в роутере
            timestamp=__import__("datetime").datetime.utcnow().isoformat(),
            response_time_ms=elapsed,
        )

    async def list_models(self) -> List[Dict[str, str]]:
        # Пытаемся получить модели с OpenRouter, при ошибке — возвращаем базовый список
        try:
            resp = await self.client.get(OPENROUTER_MODELS_URL, headers=self._headers(), timeout=30.0)
            if resp.status_code == 200:
                data = resp.json()
                out = []
                for m in data.get("data", []):
                    out.append({
                        "id": m.get("id", ""),
                        "name": m.get("name", m.get("id", "")),
                        "description": (m.get("description") or "Модель OpenRouter"),
                        "provider": (m.get("provider", {}).get("name") or "OpenRouter"),
                    })
                if out:
                    return out
        except Exception:
            pass

        # Фоллбэк
        return [
            {
                "id": "deepseek/deepseek-chat-v3-0324:free",
                "name": "DeepSeek Chat v3-0324",
                "description": "Стабильная бесплатная модель для программирования и общения",
                "provider": "DeepSeek",
            },
            {
                "id": "openai/gpt-4o-mini",
                "name": "GPT-4o mini",
                "description": "Баланс качества и стоимости от OpenAI",
                "provider": "OpenAI",
            },
            {
                "id": "anthropic/claude-3.5-sonnet",
                "name": "Claude 3.5 Sonnet",
                "description": "Сильная рассуждающая модель от Anthropic",
                "provider": "Anthropic",
            },
        ]
