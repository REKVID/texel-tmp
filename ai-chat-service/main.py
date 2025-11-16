from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
import os
from datetime import datetime

app = FastAPI(title="AI Chat Microservice", version="1.0.0")

# CORS настройка
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenRouter API ключ
OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY",
    "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",
)
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Доступные модели
AVAILABLE_MODELS = [
    "tngtech/deepseek-r1t2-chimera:free",
    "kwaipilot/kat-coder-pro:free",
    "z-ai/glm-4.5-air:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
]

# Модели для ответа с описаниями
MODELS_INFO = [
    {
        "id": "tngtech/deepseek-r1t2-chimera:free",
        "name": "DeepSeek R1T2 Chimera",
        "description": "Мощная модель для рассуждений",
    },
    {
        "id": "kwaipilot/kat-coder-pro:free",
        "name": "Kat Coder Pro",
        "description": "Специализированная модель для программирования",
    },
    {
        "id": "z-ai/glm-4.5-air:free",
        "name": "GLM-4.5 Air",
        "description": "Легкая и быстрая модель",
    },
    {
        "id": "deepseek/deepseek-chat-v3-0324:free",
        "name": "DeepSeek Chat v3",
        "description": "Универсальная модель для диалогов",
    },
    {
        "id": "google/gemma-3-27b-it:free",
        "name": "Gemma 3 27B",
        "description": "Модель от Google",
    },
    {
        "id": "meta-llama/llama-3.3-70b-instruct:free",
        "name": "Llama 3.3 70B",
        "description": "Крупная модель от Meta",
    },
]


# Pydantic модели
class ChatMessage(BaseModel):
    message: str
    conversation_id: str
    model: Optional[str] = "deepseek/deepseek-chat-v3-0324:free"
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    response: str
    model_used: str
    tokens_used: int
    conversation_id: str
    timestamp: str


class ModelInfo(BaseModel):
    id: str
    name: str
    description: str


class HealthResponse(BaseModel):
    status: str
    version: str


# Системный промпт для моделей
SYSTEM_PROMPT = """Ты — ИИ-помощник для обучения на платформе Texel AI. 
Твоя задача — помогать стажерам и студентам осваивать работу с искусственным интеллектом.
Объясняй понятно, приводи практические примеры, помогай с написанием кода и решением задач.
Будь дружелюбным, терпеливым и мотивирующим наставником."""

# In-memory хранилище для истории (простое решение)
conversations: dict = {}


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Проверка состояния микросервиса"""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/models", response_model=List[ModelInfo])
async def get_models():
    """Получить список доступных моделей"""
    return MODELS_INFO


@app.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Отправить сообщение в чат"""

    # Проверка модели
    if message.model not in AVAILABLE_MODELS:
        raise HTTPException(
            status_code=400, detail=f"Модель {message.model} не доступна"
        )

    # Получаем историю разговора
    conversation_history = conversations.get(message.conversation_id, [])

    # Добавляем сообщение пользователя в историю
    conversation_history.append({"role": "user", "content": message.message})

    # Подготовка запроса к OpenRouter с системным промптом
    messages_with_system = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ] + conversation_history

    openrouter_payload = {
        "model": message.model,
        "messages": messages_with_system,
        "temperature": message.temperature,
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://texel-ai.com",
        "X-Title": "Texel AI Chat",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                OPENROUTER_API_URL, json=openrouter_payload, headers=headers
            )
            response.raise_for_status()
            data = response.json()

            # Извлекаем ответ
            assistant_message = data["choices"][0]["message"]["content"]

            # Добавляем ответ в историю
            conversation_history.append(
                {"role": "assistant", "content": assistant_message}
            )

            # Сохраняем обновленную историю
            conversations[message.conversation_id] = conversation_history

            # Получаем информацию об использовании токенов
            usage = data.get("usage", {})
            tokens_used = usage.get("total_tokens", 0)

            return ChatResponse(
                response=assistant_message,
                model_used=message.model,
                tokens_used=tokens_used,
                conversation_id=message.conversation_id,
                timestamp=datetime.now().isoformat(),
            )

    except httpx.HTTPStatusError as e:
        error_detail = "Ошибка при обращении к OpenRouter API"
        if e.response.status_code == 401:
            error_detail = "Неверный API ключ"
        elif e.response.status_code == 429:
            error_detail = "Превышен лимит запросов"
        raise HTTPException(status_code=e.response.status_code, detail=error_detail)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Таймаут при обращении к API")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Внутренняя ошибка: {str(e)}")


@app.get("/conversations/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """Получить историю разговора"""
    history = conversations.get(conversation_id, [])
    return {
        "conversation_id": conversation_id,
        "messages": [
            {
                "role": msg["role"],
                "content": msg["content"],
                "timestamp": datetime.now().isoformat(),
            }
            for msg in history
        ],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }


@app.post("/conversations")
async def create_conversation():
    """Создать новую беседу"""
    conversation_id = f"conv-{datetime.now().timestamp()}"
    conversations[conversation_id] = []
    return {"conversation_id": conversation_id}


@app.delete("/conversations/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Очистить историю разговора"""
    if conversation_id in conversations:
        del conversations[conversation_id]
    return {"success": True}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
