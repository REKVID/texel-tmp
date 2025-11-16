#!/bin/bash

# Скрипт для запуска News микросервиса

echo "Запуск News микросервиса..."
echo "Порт: 8002"
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
echo "Запуск сервиса на http://localhost:8002"
echo "Документация API: http://localhost:8002/docs"
echo ""
uvicorn main:app --host 0.0.0.0 --port 8002 --reload

