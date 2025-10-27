#!/usr/bin/env python3
"""
Тест запуска приложения для выявления ошибок
"""
import sys
import traceback

try:
    print("Importing app...")
    from app.main import app
    from app.config import settings
    
    print("App imported successfully!")
    print(f"API Key configured: {bool(settings.OPENROUTER_API_KEY)}")
    print(f"Host: {settings.AI_CHAT_HOST}:{settings.AI_CHAT_PORT}")
    print(f"CORS origins: {settings.ALLOWED_ORIGINS}")
    print("\nApp routes:")
    for route in app.routes:
        print(f"  {route}")
        
    print("\nStarting uvicorn...")
    import uvicorn
    uvicorn.run(app, host=settings.AI_CHAT_HOST, port=settings.AI_CHAT_PORT)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)

