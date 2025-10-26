# 🤖 ИИ Чат Микросервис (AI Chat Microservice)

Отдельный микросервис для обработки ИИ чатов через OpenRouter API.

## 📁 Структура проекта

```
ai-chat-service/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI приложение
│   ├── config.py                # Конфигурация и настройки
│   ├── models/                  # Pydantic модели
│   │   ├── __init__.py
│   │   ├── chat.py              # Модели чата
│   │   └── conversation.py      # Модели разговора
│   ├── services/                # Бизнес логика
│   │   ├── __init__.py
│   │   ├── openrouter.py        # Интеграция с OpenRouter
│   │   ├── conversation.py      # Управление разговорами
│   │   └── prompts.py           # Системные промпты
│   ├── routers/                 # API эндпоинты
│   │   ├── __init__.py
│   │   ├── chat.py              # Чат эндпоинты
│   │   ├── conversation.py      # Управление разговорами
│   │   └── models.py            # Информация о моделях
│   ├── database/                # База данных (опционально)
│   │   ├── __init__.py
│   │   ├── connection.py        # Подключение к БД
│   │   └── schemas.py           # Схемы БД
│   └── middleware/              # Middleware
│       ├── __init__.py
│       ├── cors.py              # CORS настройки
│       └── logging.py           # Логирование
├── requirements.txt             # Зависимости
├── Dockerfile                   # Docker образ
├── docker-compose.yml           # Локальная разработка
├── .env.example                 # Пример переменных окружения
└── README.md                    # Документация
```

## 🔧 Основные файлы микросервиса

### 1. `app/main.py` - Главное FastAPI приложение

\`\`\`python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.routers import chat, conversation, models
from app.config import settings
from app.middleware.logging import setup_logging

# Lifecycle events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    print(f"🤖 AI Chat Microservice starting on port {settings.PORT}")
    yield
    # Shutdown
    print("🤖 AI Chat Microservice shutting down")

# FastAPI app
app = FastAPI(
    title="AI Chat Microservice",
    description="Микросервис для обработки ИИ чатов через OpenRouter API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(conversation.router, prefix="/conversations", tags=["Conversations"])
app.include_router(models.router, prefix="/models", tags=["Models"])

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "ai-chat-microservice"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
\`\`\`

### 2. `app/config.py` - Конфигурация

\`\`\`python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    DEBUG: bool = True
    
    # OpenRouter API
    OPENROUTER_API_KEY: str
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:8080",
        "http://localhost:3000",
        "http://127.0.0.1:8080"
    ]
    
    # Database (если нужна)
    DATABASE_URL: str = "sqlite:///./conversations.db"
    
    # System prompts
    DEFAULT_SYSTEM_PROMPT: str = '''Ты - опытный ИИ-помощник для обучения программированию и работе с искусственным интеллектом. 
    
Твоя роль:
- Помогать студентам изучать программирование, ИИ-технологии и решать задачи
- Давать практические советы и примеры кода
- Объяснять сложные концепции простым языком
- Мотивировать к обучению и развитию

Стиль общения:
- Дружелюбный и поддерживающий
- Структурированные ответы с примерами
- Поощрение самостоятельного мышления
- Готовность объяснить подробнее при необходимости

Отвечай на русском языке, если не указано иное.'''

    class Config:
        env_file = ".env"

settings = Settings()
\`\`\`

### 3. `app/models/chat.py` - Pydantic модели для чата

\`\`\`python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str
    model: Optional[str] = "openai/gpt-3.5-turbo"
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(1000, ge=1, le=4000)
    system_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    model_used: str
    tokens_used: int
    conversation_id: str
    timestamp: datetime
    response_time_ms: int

class MessageHistory(BaseModel):
    role: str  # 'user' | 'assistant' | 'system'
    content: str
    timestamp: datetime

class ConversationSummary(BaseModel):
    conversation_id: str
    messages_count: int
    total_tokens: int
    created_at: datetime
    updated_at: datetime
    last_message: Optional[str] = None
\`\`\`

### 4. `app/services/openrouter.py` - Интеграция с OpenRouter

\`\`\`python
import aiohttp
import json
import time
from typing import List, Dict, Any
from app.config import settings
from app.models.chat import ChatMessage, ChatResponse, MessageHistory

class OpenRouterService:
    def __init__(self):
        self.base_url = settings.OPENROUTER_BASE_URL
        self.api_key = settings.OPENROUTER_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://texel-ai-forge.com",  # Ваш домен
            "X-Title": "Texel AI Learning Platform"
        }
    
    async def send_message(
        self, 
        message: ChatMessage, 
        conversation_history: List[MessageHistory] = None
    ) -> ChatResponse:
        start_time = time.time()
        
        # Подготовка сообщений
        messages = []
        
        # Системный промпт
        system_prompt = message.system_prompt or settings.DEFAULT_SYSTEM_PROMPT
        messages.append({
            "role": "system",
            "content": system_prompt
        })
        
        # История разговора
        if conversation_history:
            for msg in conversation_history[-10:]:  # Последние 10 сообщений
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        # Новое сообщение пользователя
        messages.append({
            "role": "user", 
            "content": message.message
        })
        
        # Запрос к OpenRouter
        payload = {
            "model": message.model,
            "messages": messages,
            "temperature": message.temperature,
            "max_tokens": message.max_tokens,
            "stream": False
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"OpenRouter API error: {response.status} - {error_text}")
                
                data = await response.json()
                
                # Извлечение ответа
                ai_response = data["choices"][0]["message"]["content"]
                tokens_used = data["usage"]["total_tokens"]
                model_used = data["model"]
                
                response_time = int((time.time() - start_time) * 1000)
                
                return ChatResponse(
                    response=ai_response,
                    model_used=model_used,
                    tokens_used=tokens_used,
                    conversation_id=message.conversation_id,
                    timestamp=datetime.now(),
                    response_time_ms=response_time
                )
    
    async def get_available_models(self) -> List[Dict[str, Any]]:
        """Получение списка доступных моделей"""
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/models",
                headers=self.headers
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data["data"]
                return []

# Singleton instance
openrouter_service = OpenRouterService()
\`\`\`

### 5. `app/services/conversation.py` - Управление разговорами

\`\`\`python
from typing import List, Optional
from datetime import datetime
from app.models.chat import MessageHistory, ConversationSummary

class ConversationService:
    def __init__(self):
        # В памяти (для простоты). В продакшене - использовать Redis/БД
        self.conversations: Dict[str, List[MessageHistory]] = {}
        self.conversation_metadata: Dict[str, ConversationSummary] = {}
    
    async def add_message(self, conversation_id: str, role: str, content: str):
        """Добавить сообщение в разговор"""
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
            self.conversation_metadata[conversation_id] = ConversationSummary(
                conversation_id=conversation_id,
                messages_count=0,
                total_tokens=0,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        
        message = MessageHistory(
            role=role,
            content=content,
            timestamp=datetime.now()
        )
        
        self.conversations[conversation_id].append(message)
        
        # Обновление метаданных
        metadata = self.conversation_metadata[conversation_id]
        metadata.messages_count += 1
        metadata.updated_at = datetime.now()
        metadata.last_message = content[:100] + "..." if len(content) > 100 else content
    
    async def get_conversation_history(self, conversation_id: str) -> List[MessageHistory]:
        """Получить историю разговора"""
        return self.conversations.get(conversation_id, [])
    
    async def clear_conversation(self, conversation_id: str) -> bool:
        """Очистить разговор"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            del self.conversation_metadata[conversation_id]
            return True
        return False
    
    async def get_conversation_summary(self, conversation_id: str) -> Optional[ConversationSummary]:
        """Получить информацию о разговоре"""
        return self.conversation_metadata.get(conversation_id)

# Singleton instance
conversation_service = ConversationService()
\`\`\`

### 6. `app/routers/chat.py` - API эндпоинты для чата

\`\`\`python
from fastapi import APIRouter, HTTPException
from app.models.chat import ChatMessage, ChatResponse
from app.services.openrouter import openrouter_service
from app.services.conversation import conversation_service

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def send_chat_message(message: ChatMessage):
    """Отправить сообщение в ИИ чат"""
    try:
        # Получаем историю разговора
        history = await conversation_service.get_conversation_history(message.conversation_id)
        
        # Отправляем запрос к OpenRouter
        response = await openrouter_service.send_message(message, history)
        
        # Сохраняем сообщения в историю
        await conversation_service.add_message(
            message.conversation_id, 
            "user", 
            message.message
        )
        await conversation_service.add_message(
            message.conversation_id, 
            "assistant", 
            response.response
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
\`\`\`

## 🚀 Запуск микросервиса

### Локально:
\`\`\`bash
# Установка зависимостей
pip install fastapi uvicorn aiohttp pydantic-settings python-multipart

# Создание .env файла
echo "OPENROUTER_API_KEY=your_api_key_here" > .env

# Запуск
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
\`\`\`

### Docker:
\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
\`\`\`

## 📋 requirements.txt

\`\`\`
fastapi==0.104.1
uvicorn[standard]==0.24.0
aiohttp==3.9.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-multipart==0.0.6
\`\`\`

## 🔗 Интеграция с фронтендом

Обновите `.env` файл фронтенда:
\`\`\`env
VITE_AI_CHAT_API_URL=http://localhost:8001
\`\`\`

## 🌐 API Endpoints

- **POST** `/chat` - Отправить сообщение
- **GET** `/conversations/{id}` - Получить историю
- **DELETE** `/conversations/{id}` - Очистить историю  
- **POST** `/conversations` - Создать новую беседу
- **GET** `/models` - Доступные ИИ модели
- **GET** `/health` - Состояние сервиса

## 🔑 Получение OpenRouter API ключа

1. Зарегистрируйтесь на [OpenRouter.ai](https://openrouter.ai/)
2. Перейдите в раздел "API Keys"
3. Создайте новый ключ для вашего проекта
4. Добавьте ключ в `.env` файл микросервиса

## 🎯 Преимущества микросервисной архитектуры

✅ **Независимое развертывание** - ИИ сервис можно обновлять отдельно  
✅ **Масштабируемость** - Можно запустить несколько экземпляров  
✅ **Безопасность** - API ключи хранятся только в бэкенде  
✅ **Надёжность** - Изоляция от основного сайта  
✅ **Мониторинг** - Отдельные логи и метрики для ИИ функций
