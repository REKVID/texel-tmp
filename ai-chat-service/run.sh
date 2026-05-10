#!/bin/bash

# Скрипт для запуска AI Chat микросервиса

echo "Запуск AI Chat микросервиса..."
echo "Порт: 8001"
echo ""

# Проверка наличия виртуального окружения
if [ ! -d "venv" ]; then
    echo "Создание виртуального окружения..."
    python3 -m venv venv
fi

# Активация виртуального окружения
source venv/bin/activate

# Установка зависимостей
echo "Установка зависимостей..."
pip install -r requirements.txt

# Запуск сервиса
echo ""
echo "Запуск сервиса на http://localhost:8001"
echo "Документация API: http://localhost:8001/docs"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8001 --reload

