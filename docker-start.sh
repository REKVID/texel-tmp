#!/bin/bash

# Используем "docker compose" (v2) или "docker-compose" (v1)
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
else
  DOCKER_COMPOSE="docker-compose"
fi

echo "🐳 Запуск Texel AI микросервисов в Docker..."
echo ""

# Остановка существующих контейнеров
echo "Остановка старых контейнеров..."
$DOCKER_COMPOSE down 2>/dev/null

# Сборка и запуск всех сервисов
echo ""
echo "Сборка и запуск контейнеров (ai-chat, news, auth)..."
$DOCKER_COMPOSE up -d --build

# Ожидание запуска
echo ""
echo "Ожидание запуска сервисов..."
sleep 5

# Проверка статуса
echo ""
echo "📊 Статус контейнеров:"
$DOCKER_COMPOSE ps

# Проверка health
echo ""
echo "🏥 Проверка здоровья сервисов:"
echo ""

echo "AI Chat Service (8001):"
curl -s http://localhost:8001/health | python3 -m json.tool 2>/dev/null || echo "❌ Не доступен"

echo ""
echo "News Service (8002):"
curl -s http://localhost:8002/health | python3 -m json.tool 2>/dev/null || echo "❌ Не доступен"

echo ""
echo "Auth Service (8003):"
curl -s http://localhost:8003/health | python3 -m json.tool 2>/dev/null || echo "❌ Не доступен"

echo ""
echo "✅ Все микросервисы запущены!"
echo ""
echo "📍 Доступные endpoints:"
echo "   - AI Chat API:  http://localhost:8001  (docs: http://localhost:8001/docs)"
echo "   - News API:     http://localhost:8002  (docs: http://localhost:8002/docs)"
echo "   - Auth API:     http://localhost:8003  (docs: http://localhost:8003/docs)"
echo ""
echo "📝 Полезные команды:"
echo "   $DOCKER_COMPOSE logs -f          # Посмотреть логи"
echo "   $DOCKER_COMPOSE ps               # Статус контейнеров"
echo "   $DOCKER_COMPOSE down             # Остановить контейнеры"
echo "   $DOCKER_COMPOSE restart          # Перезапустить"
echo ""
echo "Запустите фронтенд: npm run dev"

