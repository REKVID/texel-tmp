#!/usr/bin/env python3
"""
🐛 Debug Test Script
Скрипт для отладки проблем с микросервисом
"""

import asyncio
import aiohttp
import json
import os
from pathlib import Path


async def debug_chat():
    """Отладка chat endpoint"""
    base_url = "http://localhost:8001"

    print("🐛 Debug AI Chat Microservice")
    print("=" * 50)

    # Test data
    test_message = {
        "message": "Привет! Это тестовое сообщение для отладки.",
        "conversation_id": "debug-test-123",
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "temperature": 0.7,
    }

    print(f"📝 Test message: {json.dumps(test_message, indent=2, ensure_ascii=False)}")

    async with aiohttp.ClientSession() as session:
        # 1. Test health endpoint
        print(f"\n🏥 Testing health endpoint...")
        try:
            async with session.get(f"{base_url}/health") as response:
                print(f"   Status: {response.status} {response.reason}")
                if response.status == 200:
                    data = await response.json()
                    print(f"   Response: {json.dumps(data, indent=2)}")
                else:
                    error_text = await response.text()
                    print(f"   Error: {error_text}")
        except Exception as e:
            print(f"   ❌ Health check failed: {e}")
            return

        # 2. Test chat endpoint
        print(f"\n💬 Testing chat endpoint...")
        try:
            async with session.post(
                f"{base_url}/chat",
                headers={
                    "Content-Type": "application/json",
                    "Origin": "http://localhost:8080",
                },
                json=test_message,
            ) as response:
                print(f"   Status: {response.status} {response.reason}")

                if response.status == 200:
                    data = await response.json()
                    print(f"   ✅ Success! Response preview:")
                    print(f"      Model: {data.get('model_used')}")
                    print(f"      Tokens: {data.get('tokens_used')}")
                    print(f"      Response: {data.get('response', '')[:100]}...")
                else:
                    error_text = await response.text()
                    print(f"   ❌ Error response: {error_text}")

                    # Try to parse error as JSON
                    try:
                        error_data = json.loads(error_text)
                        print(f"   📋 Error details: {error_data}")
                    except:
                        pass

        except Exception as e:
            print(f"   💥 Request failed: {e}")


def check_env_file():
    """Проверка .env файла"""
    print(f"\n🔧 Checking environment configuration...")

    env_file = Path(".env")
    if not env_file.exists():
        print("   ⚠️  .env file not found")
        return False

    print("   ✅ .env file exists")

    # Check OpenRouter API key
    with open(env_file, "r") as f:
        content = f.read()
        if "OPENROUTER_API_KEY=" in content:
            # Extract the key value
            for line in content.split("\n"):
                if line.startswith("OPENROUTER_API_KEY="):
                    key = line.split("=", 1)[1]
                    if key and key != "your_openrouter_api_key_here":
                        print(
                            f"   🔑 OpenRouter API key: {key[:10]}...{key[-5:] if len(key) > 15 else key}"
                        )
                        return True
                    else:
                        print("   ❌ OpenRouter API key not configured")
                        return False

    print("   ❌ OPENROUTER_API_KEY not found in .env")
    return False


async def main():
    """Главная функция отладки"""
    print("🐛 AI Chat Microservice Debug")
    print("=" * 50)

    # Check if we're in the right directory
    if not Path("app/main.py").exists():
        print("❌ Not in ai-chat-microservice directory!")
        print("📁 Please cd to ai-chat-microservice/ first")
        return

    # Check environment
    env_ok = check_env_file()

    if not env_ok:
        print("\n💡 To fix:")
        print("   1. Copy: cp env.example .env")
        print("   2. Edit .env and set your OpenRouter API key")
        print("   3. Get key from: https://openrouter.ai/keys")
        return

    # Test API
    await debug_chat()

    print(f"\n📋 Summary:")
    print(f"   • If health check works but chat fails → Check OpenRouter API key")
    print(f"   • If both fail → Check if microservice is running")
    print(f"   • To start microservice: python run.py")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Debug cancelled")
    except Exception as e:
        print(f"\n❌ Debug failed: {e}")
