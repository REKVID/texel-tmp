# 🤖 AI Chat Microservice

Независимый микросервис для обработки ИИ чатов через OpenRouter API для платформы Texel AI.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Создание виртуального окружения (рекомендуется)
python -m venv venv

# Активация виртуального окружения
# Linux/MacOS:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt
```

### 2. Настройка окружения

```bash
# Копирование примера конфигурации
cp .env.example .env

# Редактирование .env файла
nano .env  # или любой другой редактор
```

**Обязательно укажите ваш OpenRouter API ключ в `.env` файле:**

```env
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Получение OpenRouter API ключа

1. Зарегистрируйтесь на [OpenRouter.ai](https://openrouter.ai/)
2. Перейдите в [API Keys](https://openrouter.ai/keys)
3. Создайте новый ключ
4. Скопируйте ключ в `.env` файл

### 4. Запуск микросервиса

```bash
# Запуск через main.py
python app/main.py

# Или через uvicorn напрямую
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Сервис будет доступен по адресу: **http://localhost:8001**

## 📚 API Документация

После запуска сервиса доступна автоматическая документация:

- **Swagger UI**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **ReDoc**: [http://localhost:8001/redoc](http://localhost:8001/redoc)

## 🔌 API Endpoints

### Основные endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `GET` | `/health` | Проверка состояния сервиса |
| `POST` | `/chat` | Отправить сообщение в чат |
| `GET` | `/models` | Список доступных ИИ моделей |
| `GET` | `/stats` | Статистика сервиса |

### Управление разговорами

| Метод | Endpoint | Описание |
|-------|----------|----------|
| `POST` | `/conversations` | Создать новый разговор |
| `GET` | `/conversations/{id}` | Получить историю разговора |
| `DELETE` | `/conversations/{id}` | Очистить историю разговора |

### Примеры использования

#### Отправка сообщения в чат

```bash
curl -X POST "http://localhost:8001/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Как изучать Python?",
    "conversation_id": "training-session-123",
    "model": "deepseek/deepseek-chat-v3.1:free",
    "temperature": 0.7
  }'
```

#### Проверка состояния

```bash
curl "http://localhost:8001/health"
```

#### Получение доступных моделей

```bash
curl "http://localhost:8001/models"
```

## 🐳 Docker

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода
COPY app/ ./app/

# Переменные окружения
ENV AI_CHAT_HOST=0.0.0.0
ENV AI_CHAT_PORT=8001

EXPOSE 8001

# Запуск
CMD ["python", "app/main.py"]
```

### Сборка и запуск

```bash
# Сборка образа
docker build -t ai-chat-microservice .

# Запуск контейнера
docker run -d \
  --name ai-chat-service \
  -p 8001:8001 \
  -e OPENROUTER_API_KEY=your_api_key_here \
  ai-chat-microservice
```

### Docker Compose

```yaml
version: '3.8'

services:
  ai-chat:
    build: .
    ports:
      - "8001:8001"
    environment:
      - OPENROUTER_API_KEY=your_api_key_here
      - DEBUG=false
    restart: unless-stopped
    
  # Опционально: Redis для кэша
  # redis:
  #   image: redis:alpine
  #   ports:
  #     - "6379:6379"
```

## ⚙️ Конфигурация

### Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `OPENROUTER_API_KEY` | - | **Обязательно**: API ключ OpenRouter |
| `AI_CHAT_HOST` | `0.0.0.0` | Хост для привязки сервера |
| `AI_CHAT_PORT` | `8001` | Порт сервера |
| `DEBUG` | `True` | Режим отладки (auto-reload) |

### Поддерживаемые ИИ модели

- **OpenAI**: GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
- **Anthropic**: Claude 3 Haiku, Claude 3 Sonnet
- **Google**: Gemini Pro
- **И многие другие через OpenRouter**

## 🔧 Разработка

### Структура проекта

```
ai-chat-microservice/
├── app/
│   ├── __init__.py
│   └── main.py              # Основное приложение
├── requirements.txt         # Python зависимости
├── .env.example            # Пример конфигурации
├── Dockerfile              # Docker образ
├── docker-compose.yml      # Docker Compose
└── README.md              # Документация
```

### Добавление новых функций

1. **Новые endpoints**: Добавьте в `app/main.py`
2. **Новые модели данных**: Используйте Pydantic BaseModel
3. **Middleware**: Добавьте через `app.add_middleware()`
4. **База данных**: Интегрируйте SQLAlchemy или MongoDB

### Тестирование

```bash
# Установка дополнительных зависимостей для тестов
pip install pytest pytest-asyncio httpx

# Запуск тестов (если созданы)
pytest
```

## 📊 Мониторинг

### Логирование

Микросервис выводит логи в консоль. Для продакшена рекомендуется:

- Структурированное логирование (JSON)
- Отправка в centralized logging (ELK Stack, Loki)
- Уровни логирования

### Метрики

Для мониторинга можно добавить:

- Prometheus metrics
- Health checks
- Performance monitoring
- Error tracking (Sentry)

## 🚀 Деплой

### Production готовность

1. **Переменные окружения**: Все секреты через env vars
2. **База данных**: Замените in-memory на PostgreSQL/MongoDB
3. **Кэширование**: Добавьте Redis для sessions
4. **Reverse proxy**: Nginx или Traefik
5. **SSL/TLS**: HTTPS сертификаты
6. **Rate limiting**: Ограничение запросов
7. **Monitoring**: Логи, метрики, алерты

### Примеры платформ

- **Docker Swarm / Kubernetes**
- **AWS ECS / EKS** 
- **Google Cloud Run**
- **DigitalOcean App Platform**
- **Heroku**

## ❗ Troubleshooting

### Частые проблемы

#### 1. OpenRouter API ошибки

```bash
# Проверьте API ключ
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://openrouter.ai/api/v1/models
```

#### 2. CORS ошибки (400 Bad Request на OPTIONS)

**Симптомы**: `"OPTIONS /chat HTTP/1.1" 400 Bad Request` в логах

**Решение**:
1. Убедитесь что домен фронтенда добавлен в `ALLOWED_ORIGINS` в `app/main.py`
2. Перезапустите микросервис после изменений
3. Проверьте что фронтенд использует правильный URL: `http://localhost:8001`

**Проверка CORS**:
```bash
curl -X OPTIONS http://localhost:8001/chat \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST"
```

#### 3. Порт занят

```bash
# Найти процесс на порту 8001
lsof -i :8001

# Убить процесс
kill -9 <PID>
```

#### 4. Зависимости

```bash
# Переустановка зависимостей
pip install --upgrade -r requirements.txt
```

## 🤝 Интеграция с фронтендом

Микросервис готов к работе с React фронтендом. Убедитесь что:

1. **Фронтенд настроен на**: `http://localhost:8001`
2. **CORS разрешен** для вашего домена
3. **API endpoints соответствуют** ожиданиям фронтенда

## 📝 License

MIT License - см. [LICENSE](../LICENSE) файл в корне проекта.

---

**🎉 Готово!** Микросервис готов к работе и интеграции с любым фронтендом!
