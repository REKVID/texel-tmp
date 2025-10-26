#!/usr/bin/env python3
"""
🧪 CORS Test Script
Скрипт для проверки CORS настроек микросервиса
"""

import asyncio
import aiohttp
import sys


async def test_cors():
    """Тестирование CORS endpoints"""
    base_url = "http://localhost:8001"

    print("🧪 Testing CORS for AI Chat Microservice")
    print("=" * 50)

    # Test endpoints
    endpoints = ["/health", "/chat", "/conversations/test-123", "/models"]

    async with aiohttp.ClientSession() as session:
        for endpoint in endpoints:
            print(f"\n📡 Testing: {endpoint}")

            try:
                # OPTIONS request (CORS preflight)
                async with session.options(
                    f"{base_url}{endpoint}",
                    headers={
                        "Origin": "http://localhost:8080",
                        "Access-Control-Request-Method": "POST",
                        "Access-Control-Request-Headers": "Content-Type",
                    },
                ) as response:
                    print(f"   OPTIONS: {response.status} {response.reason}")

                    # Check CORS headers
                    cors_headers = {
                        "Access-Control-Allow-Origin",
                        "Access-Control-Allow-Methods",
                        "Access-Control-Allow-Headers",
                    }

                    for header in cors_headers:
                        value = response.headers.get(header, "❌ Missing")
                        print(f"   {header}: {value}")

            except Exception as e:
                print(f"   ❌ Error: {e}")

        # Test actual GET request
        print(f"\n🔍 Testing actual GET request to /health")
        try:
            async with session.get(f"{base_url}/health") as response:
                print(f"   GET /health: {response.status} {response.reason}")
                data = await response.json()
                print(f"   Response: {data}")
        except Exception as e:
            print(f"   ❌ Error: {e}")


if __name__ == "__main__":
    try:
        asyncio.run(test_cors())
    except KeyboardInterrupt:
        print("\n👋 Test cancelled")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)
