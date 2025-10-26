#!/usr/bin/env python3
"""
🚀 AI Chat Microservice - Quick Start Script
Простой скрипт для быстрого запуска микросервиса
"""

import os
import sys
import subprocess
from pathlib import Path


def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3, 8):
        print("❌ Требуется Python 3.8 или выше")
        print(f"🐍 Текущая версия: {sys.version}")
        sys.exit(1)
    print(
        f"✅ Python версия: {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    )


def check_env_file():
    """Проверка наличия .env файла"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  Файл .env не найден")
        print("📝 Создаем .env файл из .env.example...")

        example_file = Path(".env.example")
        if example_file.exists():
            import shutil

            shutil.copy(".env.example", ".env")
            print("✅ Файл .env создан")
            print(
                "🔧 Пожалуйста, отредактируйте .env файл и добавьте ваш OPENROUTER_API_KEY"
            )
            return False
        else:
            print("❌ Файл .env.example не найден")
            return False

    # Проверяем наличие API ключа
    with open(".env", "r") as f:
        content = f.read()
        if "OPENROUTER_API_KEY=your_openrouter_api_key_here" in content:
            print("⚠️  OpenRouter API ключ не настроен в .env файле")
            print(
                "🔑 Пожалуйста, замените 'your_openrouter_api_key_here' на реальный ключ"
            )
            return False

    print("✅ Конфигурация .env найдена")
    return True


def install_dependencies():
    """Установка зависимостей"""
    print("📦 Проверка зависимостей...")

    try:
        import fastapi
        import uvicorn
        import aiohttp

        print("✅ Все зависимости установлены")
        return True
    except ImportError:
        print("📥 Устанавливаем зависимости...")
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"]
            )
            print("✅ Зависимости установлены успешно")
            return True
        except subprocess.CalledProcessError:
            print("❌ Ошибка установки зависимостей")
            print("🔧 Попробуйте: pip install -r requirements.txt")
            return False


def main():
    """Главная функция запуска"""
    print("🤖 AI Chat Microservice - Быстрый старт")
    print("=" * 50)

    # Проверки
    check_python_version()

    if not check_env_file():
        print("\n❌ Необходимо настроить .env файл перед запуском")
        sys.exit(1)

    if not install_dependencies():
        print("\n❌ Не удалось установить зависимости")
        sys.exit(1)

    # Запуск
    print("\n🚀 Запускаем микросервис...")
    print("📡 Сервис будет доступен на: http://localhost:8001")
    print("📚 API документация: http://localhost:8001/docs")
    print("🛑 Для остановки: Ctrl+C")
    print("-" * 50)

    try:
        # Импортируем и запускаем
        from app.main import app
        import uvicorn

        uvicorn.run(
            "app.main:app", host="0.0.0.0", port=8001, reload=True, log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Микросервис остановлен")
    except ImportError as e:
        print(f"\n❌ Ошибка импорта: {e}")
        print("🔧 Убедитесь что все зависимости установлены")
    except Exception as e:
        print(f"\n❌ Ошибка запуска: {e}")


if __name__ == "__main__":
    main()
