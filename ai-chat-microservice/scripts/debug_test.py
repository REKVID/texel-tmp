#!/usr/bin/env python3
import asyncio, json, aiohttp

BASE = "http://localhost:8001"

async def main():
    print("🐛 Debug rewritten microservice")
    async with aiohttp.ClientSession() as s:
        print("\n🏥 /health")
        async with s.get(f"{BASE}/health") as r:
            print(r.status, await r.json())

        print("\n💬 /chat")
        payload = {
            "message": "Привет! Проверь, что всё работает, и ответь коротко.",
            "conversation_id": "debug-123",
            "model": "deepseek/deepseek-chat-v3-0324:free",
            "temperature": 0.7
        }
        async with s.post(f"{BASE}/chat", json=payload, headers={"Origin":"http://localhost:8080"}) as r:
            print(r.status)
            if r.status == 200:
                data = await r.json()
                print(json.dumps({k: data.get(k) for k in ("model_used","tokens_used","response")}, ensure_ascii=False, indent=2)[:400])
            else:
                print(await r.text())

if __name__ == "__main__":
    asyncio.run(main())
