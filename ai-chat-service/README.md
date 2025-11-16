# AI Chat Microservice

Простой микросервис для работы с OpenRouter API через FastAPI.

## Установка

```bash
cd ai-chat-service
pip install -r requirements.txt
```

## Запуск

```bash
python main.py
```

Или через uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Сервис будет доступен на `http://localhost:8001`

## API Endpoints

- `GET /health` - Проверка состояния сервиса
- `GET /models` - Список доступных моделей
- `POST /chat` - Отправка сообщения в чат
- `GET /conversations/{conversation_id}` - Получить историю разговора
- `POST /conversations` - Создать новую беседу
- `DELETE /conversations/{conversation_id}` - Очистить историю разговора

## Переменные окружения

- `OPENROUTER_API_KEY` - API ключ OpenRouter (по умолчанию используется встроенный)

## Доступные модели

- tngtech/deepseek-r1t2-chimera:free
- kwaipilot/kat-coder-pro:free
- z-ai/glm-4.5-air:free
- deepseek/deepseek-chat-v3-0324:free
- google/gemma-3-27b-it:free
- meta-llama/llama-3.3-70b-instruct:free

