# 🤖 Переписанный AI Chat Microservice

Полностью переработанный микросервис на **FastAPI** с чёткой архитектурой модулей, аккуратной конфигурацией и безопасной интеграцией с **OpenRouter API**.

## ✨ Что изменилось

- Структура проекта по слоям: `routers/`, `services/`, `models/`, `storage/`, `config.py`
- Единый HTTP-клиент (HTTP/2) через `httpx.AsyncClient` с управлением жизненным циклом
- Чистые эндпойнты и типы Pydantic v2
- Надёжный CORS (только через стандартный `CORSMiddleware`)
- In-memory хранилище вынесено в отдельный модуль (легко заменить на Redis/БД)
- Возможность получать список моделей с OpenRouter (с фоллбэком)
- Тестовые скрипты для быстрой отладки

## 🚀 Быстрый старт

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# отредактируйте .env и установите OPENROUTER_API_KEY

python run.py
# или
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Откройте: http://localhost:8001/docs

## 🔌 Эндпойнты

| Метод | Путь | Описание |
|------|------|----------|
| GET  | `/health` | Состояние сервиса |
| GET  | `/models` | Доступные модели (через OpenRouter или фоллбэк) |
| GET  | `/stats` | Статистика сервиса |
| POST | `/chat` | Сообщение в AI чат |
| POST | `/conversations` | Создать разговор |
| GET  | `/conversations/{id}` | История разговора |
| DELETE | `/conversations/{id}` | Очистить разговор |

## 🧪 Скрипты

```bash
python scripts/debug_test.py
python scripts/test_cors.py
```

## ⚙️ Конфигурация

Файл `.env`:
```env
OPENROUTER_API_KEY=sk-...
AI_CHAT_HOST=0.0.0.0
AI_CHAT_PORT=8001
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## 🐳 Docker

```bash
docker build -t ai-chat-microservice-rewrite .
docker run -p 8001:8001 -e OPENROUTER_API_KEY=sk-... ai-chat-microservice-rewrite
# или
docker compose up --build -d
```

## 🧱 Замена хранилища

Модуль `app/storage.py` изолирует работу с данными. Для Redis/DB реализуйте такой же интерфейс методов:
- `add_exchange(conv_id, user_content, assistant_content)`
- `get_messages(conv_id, last_n=None)`
- `get_meta(conv_id)`
- `clear(conv_id)`
- `stats()`

## 🛡️ Безопасность и продакшен

- Передавайте секреты только через переменные окружения/секрет-менеджер
- Добавьте rate limiting и auth, если требуется
- Включите логирование запросов на уровне прокси (Nginx/Traefik)

---

MIT License
