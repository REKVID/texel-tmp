# Docker Development Guide

## Быстрый старт с Docker

### Запуск всех микросервисов

```bash
docker-compose up -d
```

Это запустит:
- **AI Chat Service** на порту 8001
- **News Service** на порту 8002
- **Auth Service** на порту 8003

### Проверка статуса

```bash
# Посмотреть статус контейнеров
docker-compose ps

# Посмотреть логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f ai-chat-service
docker-compose logs -f news-service
docker-compose logs -f auth-service
```

### Остановка сервисов

```bash
# Остановить
docker-compose stop

# Остановить и удалить контейнеры
docker-compose down

# Остановить и удалить контейнеры + volumes
docker-compose down -v
```

### Перезапуск после изменений

```bash
# Пересобрать и перезапустить
docker-compose up -d --build

# Пересобрать конкретный сервис
docker-compose up -d --build ai-chat-service
```

## Отдельные команды для сервисов

### AI Chat Service

```bash
# Сборка
cd ai-chat-service
docker build -t texel-ai-chat .

# Запуск
docker run -d -p 8001:8001 --name texel-ai-chat texel-ai-chat

# Остановка
docker stop texel-ai-chat
docker rm texel-ai-chat
```

### News Service

```bash
# Сборка
cd news-service
docker build -t texel-news .

# Запуск
docker run -d -p 8002:8002 --name texel-news texel-news

# Остановка
docker stop texel-news
docker rm texel-news
```

### Auth Service

```bash
# Сборка
cd auth-service
docker build -t texel-auth .

# Запуск
docker run -d -p 8003:8003 --name texel-auth texel-auth

# Остановка
docker stop texel-auth
docker rm texel-auth
```

## Проверка работы

После запуска проверьте:

```bash
# AI Chat Service
curl http://localhost:8001/health
curl http://localhost:8001/models

# News Service
curl http://localhost:8002/health
curl http://localhost:8002/news?limit=3

# Auth Service
curl http://localhost:8003/health
```

Или откройте в браузере:
- AI Chat API: http://localhost:8001/docs
- News API: http://localhost:8002/docs
- Auth API: http://localhost:8003/docs

## Полный стек (с фронтендом)

```bash
# 1. Запустить микросервисы
docker-compose up -d

# 2. В другом терминале - запустить фронтенд
npm install
npm run dev
```

Фронтенд будет доступен на http://localhost:8080

## Troubleshooting

### Порты уже заняты

```bash
# Найти процессы на портах
lsof -i :8001
lsof -i :8002

# Убить процессы
kill -9 <PID>
```

### Пересоздать всё с нуля

```bash
docker-compose down -v
docker system prune -af
docker-compose up -d --build
```

### Посмотреть логи ошибок

```bash
docker-compose logs ai-chat-service | grep ERROR
docker-compose logs news-service | grep ERROR
```

## Production Deployment

Для продакшена:

1. Измените `OPENROUTER_API_KEY` в `docker-compose.yml`
2. Настройте CORS в микросервисах на конкретные домены
3. Используйте volumes для персистентных данных
4. Добавьте nginx как reverse proxy

```yaml
# docker-compose.prod.yml пример
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - ai-chat-service
      - news-service
```

