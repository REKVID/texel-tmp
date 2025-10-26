#!/usr/bin/env python3
"""
🔄 Restart Script
Скрипт для быстрого перезапуска микросервиса с проверкой
"""

import os
import sys
import time
import subprocess
import requests
from pathlib import Path


def kill_existing_process():
    """Убивает существующий процесс на порту 8001"""
    print("🔍 Проверка существующих процессов на порту 8001...")

    try:
        # Для macOS/Linux
        result = subprocess.run(["lsof", "-i", ":8001"], capture_output=True, text=True)
        if result.returncode == 0 and result.stdout:
            print("📋 Найдены процессы на порту 8001:")
            print(result.stdout)

            # Извлечение PID и убийство процесса
            lines = result.stdout.strip().split("\n")[1:]  # Skip header
            for line in lines:
                parts = line.split()
                if len(parts) > 1:
                    pid = parts[1]
                    try:
                        subprocess.run(["kill", "-9", pid], check=True)
                        print(f"💀 Убит процесс PID: {pid}")
                    except subprocess.CalledProcessError:
                        print(f"⚠️  Не удалось убить процесс PID: {pid}")
        else:
            print("✅ Порт 8001 свободен")

    except FileNotFoundError:
        print("⚠️  lsof не найден (Windows?), пропускаем проверку портов")
    except Exception as e:
        print(f"⚠️  Ошибка проверки портов: {e}")


def check_health():
    """Проверяет health endpoint"""
    print("🏥 Проверка health endpoint...")

    max_attempts = 10
    for i in range(max_attempts):
        try:
            response = requests.get("http://localhost:8001/health", timeout=2)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Сервис запущен успешно!")
                print(f"   Статус: {data.get('status')}")
                print(f"   Версия: {data.get('version')}")
                print(
                    f"   OpenRouter: {'✅' if data.get('openrouter_configured') else '❌'}"
                )
                return True
        except requests.exceptions.RequestException:
            pass

        if i < max_attempts - 1:
            print(f"⏳ Ожидание запуска ({i + 1}/{max_attempts})...")
            time.sleep(1)

    print("❌ Не удалось подключиться к сервису")
    return False


def main():
    """Главная функция перезапуска"""
    print("🔄 AI Chat Microservice - Restart Script")
    print("=" * 50)

    # Проверка директории
    if not Path("app/main.py").exists():
        print("❌ Файл app/main.py не найден!")
        print("📁 Убедитесь что вы в директории ai-chat-microservice/")
        sys.exit(1)

    # Убиваем существующие процессы
    kill_existing_process()

    # Ждем немного
    time.sleep(1)

    # Запускаем новый процесс
    print("🚀 Запуск микросервиса...")
    try:
        # Запускаем в background
        process = subprocess.Popen(
            [sys.executable, "app/main.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        print(f"📡 Процесс запущен с PID: {process.pid}")

        # Ждем запуска
        time.sleep(3)

        # Проверяем health
        if check_health():
            print("\n🎉 Микросервис успешно перезапущен!")
            print("📚 API Docs: http://localhost:8001/docs")
            print("🔧 Test CORS: python test_cors.py")
            print("🛑 Остановка: kill -9", process.pid)
        else:
            print("❌ Ошибка запуска сервиса")
            process.kill()
            sys.exit(1)

    except Exception as e:
        print(f"❌ Ошибка запуска: {e}")
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Перезапуск отменен")
    except Exception as e:
        print(f"\n❌ Ошибка: {e}")
        sys.exit(1)
