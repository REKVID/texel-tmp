#!/bin/bash

echo "🐳 Запуск Texel AI микросервисов в Docker..."
echo ""

# Остановка существующих контейнеров
echo "Остановка старых контейнеров..."
docker-compose down 2>/dev/null

# Сборка и запуск
echo ""
echo "Сборка и запуск контейнеров..."
docker-compose up -d --build

# Ожидание запуска
echo ""
echo "Ожидание запуска сервисов..."
sleep 5

# Проверка статуса
echo ""
echo "📊 Статус контейнеров:"
docker-compose ps

# Проверка health
echo ""
echo "🏥 Проверка здоровья сервисов:"
echo ""

echo "AI Chat Service:"
curl -s http://localhost:8001/health | python3 -m json.tool 2>/dev/null || echo "❌ Не доступен"

echo ""
echo "News Service:"
curl -s http://localhost:8002/health | python3 -m json.tool 2>/dev/null || echo "❌ Не доступен"

echo ""
echo "✅ Микросервисы запущены!"
echo ""
echo "📍 Доступные endpoints:"
echo "   - AI Chat API: http://localhost:8001"
echo "   - AI Chat Docs: http://localhost:8001/docs"
echo "   - News API: http://localhost:8002"
echo "   - News Docs: http://localhost:8002/docs"
echo ""
echo "📝 Полезные команды:"
echo "   docker-compose logs -f          # Посмотреть логи"
echo "   docker-compose ps               # Статус контейнеров"
echo "   docker-compose down             # Остановить контейнеры"
echo "   docker-compose restart          # Перезапустить"
echo ""
echo "Запустите фронтенд: npm run dev"

