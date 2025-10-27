#!/usr/bin/env python3
"""
Быстрый запуск переписанного микросервиса
"""
import sys
from app.config import settings
import uvicorn

def main():
    print("AI Chat Microservice (Rewritten) - Starting...")
    print(f"Host: {settings.AI_CHAT_HOST}:{settings.AI_CHAT_PORT}")
    print(f"Debug mode: {settings.DEBUG}")
    uvicorn.run("app.main:app", host=settings.AI_CHAT_HOST, port=settings.AI_CHAT_PORT, reload=settings.DEBUG)

if __name__ == "__main__":
    if sys.version_info < (3, 9):
        print("Требуется Python 3.9+")
        sys.exit(1)
    main()
