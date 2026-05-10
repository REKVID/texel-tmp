# Texel AI

Учебная AI-платформа. Стек: React + FastAPI + Express + SQLite + Docker.

---

## Запуск

### 1. Создай `.env` в корне проекта

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
```

Ключ получить на [openrouter.ai/keys](https://openrouter.ai/keys).

### 2. Запусти через Docker

```bash
docker compose up --build
```

Открыть: [http://localhost](http://localhost)

---

## Локальная разработка (без Docker)

```bash
# Зависимости
npm install

# Запустить фронт + бэкенд
npm run dev:all
```

AI-чат сервис (отдельно):

```bash
cd ai-chat-service
pip install -r requirements.txt
python main.py
```

---

## Порты

| Сервис         | Порт  |
|----------------|-------|
| Frontend       | 80    |
| Backend API    | 3001  |
| AI Chat        | 8001  |
| News           | 8002  |

---

## Структура

```
/
├── src/               # React фронтенд
├── server/            # Node.js бэкенд (Express + SQLite)
├── ai-chat-service/   # FastAPI AI-чат (Python)
├── news-service/      # Express парсер новостей
├── docker-compose.yml
└── .env               # API ключи (создать вручную)
```
