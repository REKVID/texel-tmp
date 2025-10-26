#!/usr/bin/env python3
"""
🤖 AI Chat Microservice - Main Application
FastAPI приложение для ИИ чатов через OpenRouter API
"""

import os
import asyncio
import aiohttp
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
import uvicorn
from dotenv import load_dotenv

# Загружаем .env файл
load_dotenv()

# Environment variables
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
PORT = int(os.getenv("AI_CHAT_PORT", "8001"))
HOST = os.getenv("AI_CHAT_HOST", "0.0.0.0")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# CORS origins
ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "https://texel-ai-forge.com",  # Production domain
]


# Pydantic Models
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str
    model: Optional[str] = "deepseek/deepseek-chat-v3-0324:free"
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(1500, ge=1, le=4000)


class ChatResponse(BaseModel):
    model_config = {"protected_namespaces": ()}  # Отключаем защиту пространств имен

    response: str
    model_used: str
    tokens_used: int
    conversation_id: str
    timestamp: str
    response_time_ms: int


class ConversationHistory(BaseModel):
    conversation_id: str
    messages: List[Dict[str, str]]
    messages_count: int
    created_at: str
    updated_at: str


# FastAPI App
app = FastAPI(
    title="AI Chat Microservice",
    description="Микросервис для ИИ чатов через OpenRouter API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
    ],
    expose_headers=["*"],
)


# Custom CORS middleware для обработки всех OPTIONS запросов
@app.middleware("http")
async def cors_handler(request: Request, call_next):
    # Handle preflight requests
    if request.method == "OPTIONS":
        origin = request.headers.get("Origin")

        # Check if origin is allowed
        if origin in ALLOWED_ORIGINS or "*" in ALLOWED_ORIGINS:
            allowed_origin = origin
        else:
            # For development, allow localhost variants
            if origin and ("localhost" in origin or "127.0.0.1" in origin):
                allowed_origin = origin
            else:
                allowed_origin = ALLOWED_ORIGINS[0]  # fallback to first allowed origin

        response = Response()
        response.headers["Access-Control-Allow-Origin"] = allowed_origin
        response.headers["Access-Control-Allow-Methods"] = (
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers["Access-Control-Allow-Headers"] = (
            "Accept, Accept-Language, Content-Language, Content-Type, Authorization, X-Requested-With"
        )
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Max-Age"] = "86400"  # 24 hours
        return response

    # For regular requests, let FastAPI CORS middleware handle it
    response = await call_next(request)
    return response


# In-memory storage (в продакшене использовать Redis/БД)
conversations: Dict[str, List[Dict]] = {}
conversation_metadata: Dict[str, Dict] = {}

# Системный промпт для обучающего ассистента
SYSTEM_PROMPT = """Ты - опытный ИИ-помощник для обучения программированию и работе с искусственным интеллектом в центре Texel AI.

Твоя роль:
- Помогать студентам изучать программирование, ИИ-технологии и решать задачи
- Давать практические советы и примеры кода
- Объяснять сложные концепции простым языком  
- Мотивировать к обучению и развитию
- Предлагать пошаговые решения и объяснения

Стиль общения:
- Дружелюбный и поддерживающий
- Структурированные ответы с примерами
- Поощрение самостоятельного мышления
- Готовность объяснить подробнее при необходимости
- Использование эмодзи для лучшего восприятия

Особенности:
- При объяснении кода используй комментарии на русском
- Всегда предлагай несколько подходов к решению
- Задавай уточняющие вопросы если задача не ясна
- Мотивируй продолжать обучение

Отвечай на русском языке, если не указано иное."""


async def call_openrouter(message: ChatMessage) -> ChatResponse:
    """Вызов OpenRouter API для получения ответа от ИИ модели"""
    print(f"🚀 Calling OpenRouter API...")

    if not OPENROUTER_API_KEY:
        print("❌ OpenRouter API key is missing!")
        raise HTTPException(
            status_code=500,
            detail="OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.",
        )

    print(f"🎯 Using model: {message.model}")
    print(f"🌡️ Temperature: {message.temperature}")

    # Подготовка истории разговора
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Добавляем историю (последние 10 сообщений для контекста)
    if message.conversation_id in conversations:
        recent_messages = conversations[message.conversation_id][-10:]
        messages.extend(recent_messages)

    # Новое сообщение пользователя
    messages.append({"role": "user", "content": message.message})

    # Заголовки для OpenRouter API
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://texel-ai-forge.com",
        "X-Title": "Texel AI Learning Platform",
    }

    # Payload для API запроса
    payload = {
        "model": message.model,
        "messages": messages,
        "temperature": message.temperature,
        "max_tokens": message.max_tokens,
    }

    start_time = time.time()

    print(f"📡 Sending request to OpenRouter...")
    print(
        f"📝 Payload: model={payload['model']}, messages_count={len(payload['messages'])}"
    )

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
            ) as response:
                print(f"📨 OpenRouter response status: {response.status}")

                if response.status != 200:
                    error_text = await response.text()
                    print(f"❌ OpenRouter API error: {error_text}")
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"OpenRouter API error: {error_text}",
                    )

                data = await response.json()
                print(f"📋 OpenRouter response keys: {list(data.keys())}")

                # Извлечение ответа с проверкой
                try:
                    ai_response = data["choices"][0]["message"]["content"]
                    tokens_used = data["usage"]["total_tokens"]
                    model_used = data["model"]
                    print(f"📝 Response preview: {ai_response[:100]}...")
                except KeyError as e:
                    print(f"❌ Missing key in OpenRouter response: {e}")
                    print(f"📋 Full response: {data}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Unexpected OpenRouter API response format: missing {e}",
                    )

                # Время ответа
                response_time_ms = int((time.time() - start_time) * 1000)

                # Сохраняем в историю разговора
                if message.conversation_id not in conversations:
                    conversations[message.conversation_id] = []
                    conversation_metadata[message.conversation_id] = {
                        "created_at": datetime.now().isoformat(),
                        "messages_count": 0,
                    }

                # Добавляем сообщения в историю
                conversations[message.conversation_id].extend(
                    [
                        {"role": "user", "content": message.message},
                        {"role": "assistant", "content": ai_response},
                    ]
                )

                # Обновляем метаданные
                metadata = conversation_metadata[message.conversation_id]
                metadata["updated_at"] = datetime.now().isoformat()
                metadata["messages_count"] = len(conversations[message.conversation_id])

                chat_response = ChatResponse(
                    response=ai_response,
                    model_used=model_used,
                    tokens_used=tokens_used,
                    conversation_id=message.conversation_id,
                    timestamp=datetime.now().isoformat(),
                    response_time_ms=response_time_ms,
                )

                print(f"✅ OpenRouter API call successful")
                print(f"📊 Tokens used: {tokens_used}, Time: {response_time_ms}ms")
                return chat_response

    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Network error when calling OpenRouter API: {str(e)}",
        )
    except KeyError as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected API response format: missing {str(e)}"
        )


# API Endpoints


@app.get("/health")
async def health_check():
    """Проверка состояния микросервиса"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "ai-chat-microservice",
        "openrouter_configured": bool(OPENROUTER_API_KEY),
        "active_conversations": len(conversations),
    }


@app.post("/chat", response_model=ChatResponse)
async def send_chat_message(message: ChatMessage):
    """Отправить сообщение в ИИ чат"""
    try:
        print(f"📥 Received chat message: {message.message[:50]}...")
        print(f"🔑 OpenRouter key configured: {bool(OPENROUTER_API_KEY)}")
        print(f"🆔 Conversation ID: {message.conversation_id}")

        if not OPENROUTER_API_KEY:
            print("❌ OpenRouter API key not configured!")
            raise HTTPException(
                status_code=500,
                detail="OpenRouter API key not configured. Please set OPENROUTER_API_KEY in .env file",
            )

        response = await call_openrouter(message)
        print(f"✅ Chat response generated successfully")
        return response

    except HTTPException as e:
        print(f"🚨 HTTP Error: {e.detail}")
        raise e
    except Exception as e:
        print(f"💥 Unexpected error in send_chat_message: {str(e)}")
        print(f"📋 Error type: {type(e).__name__}")
        import traceback

        print(f"📍 Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/conversations/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """Получить историю разговора"""
    history = conversations.get(conversation_id, [])
    metadata = conversation_metadata.get(conversation_id, {})

    return {
        "conversation_id": conversation_id,
        "messages": history,
        "messages_count": len(history),
        "created_at": metadata.get("created_at"),
        "updated_at": metadata.get("updated_at"),
    }


@app.delete("/conversations/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Очистить историю разговора"""
    if conversation_id in conversations:
        del conversations[conversation_id]
        if conversation_id in conversation_metadata:
            del conversation_metadata[conversation_id]
        return {"success": True, "message": "Conversation cleared"}
    return {"success": False, "message": "Conversation not found"}


@app.post("/conversations")
async def create_conversation():
    """Создать новый разговор"""
    conversation_id = f"conversation-{int(time.time() * 1000)}"
    return {"conversation_id": conversation_id}


@app.get("/models")
async def get_available_models():
    """Получить список доступных ИИ моделей"""
    return [
        {
            "id": "deepseek/deepseek-chat-v3-0324:free",
            "name": "DeepSeek Chat v3-0324",
            "description": "Стабильная бесплатная модель для программирования и общения",
            "provider": "OpenAI",
        },
        {
            "id": "openai/gpt-4",
            "name": "GPT-4",
            "description": "Продвинутая модель с лучшим качеством ответов",
            "provider": "OpenAI",
        },
        {
            "id": "openai/gpt-4-turbo",
            "name": "GPT-4 Turbo",
            "description": "Быстрая версия GPT-4 с большим контекстом",
            "provider": "OpenAI",
        },
        {
            "id": "anthropic/claude-3-haiku",
            "name": "Claude 3 Haiku",
            "description": "Быстрая модель Anthropic",
            "provider": "Anthropic",
        },
        {
            "id": "anthropic/claude-3-sonnet",
            "name": "Claude 3 Sonnet",
            "description": "Сбалансированная модель Anthropic",
            "provider": "Anthropic",
        },
        {
            "id": "google/gemini-pro",
            "name": "Gemini Pro",
            "description": "Модель Google для сложных задач",
            "provider": "Google",
        },
    ]


@app.get("/stats")
async def get_service_stats():
    """Получить статистику микросервиса"""
    total_messages = sum(len(conv) for conv in conversations.values())
    return {
        "total_conversations": len(conversations),
        "total_messages": total_messages,
        "active_conversations": len([c for c in conversations.values() if len(c) > 0]),
        "openrouter_configured": bool(OPENROUTER_API_KEY),
    }


if __name__ == "__main__":
    print("🤖 Starting AI Chat Microservice...")
    print(f"📡 Server will be available at: http://{HOST}:{PORT}")
    print(f"🔑 OpenRouter API Key configured: {'✅' if OPENROUTER_API_KEY else '❌'}")
    print(f"📚 API Documentation: http://{HOST}:{PORT}/docs")
    print(f"🔍 ReDoc Documentation: http://{HOST}:{PORT}/redoc")
    print("🚀 Starting server...\n")

    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=DEBUG)
