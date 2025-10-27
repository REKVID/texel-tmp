#!/usr/bin/env python3
import asyncio, aiohttp

BASE = "http://localhost:8001"
ORIGIN = "http://localhost:8080"

async def test():
    async with aiohttp.ClientSession() as s:
        for ep in ["/health", "/chat", "/conversations/test-1", "/models"]:
            print(f"\n📡 OPTIONS {ep}")
            async with s.options(f"{BASE}{ep}", headers={
                "Origin": ORIGIN,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            }) as r:
                print("Status:", r.status)
                for h in ["Access-Control-Allow-Origin","Access-Control-Allow-Methods","Access-Control-Allow-Headers"]:
                    print(f"  {h}: {r.headers.get(h)}")

        print("\n🔍 GET /health")
        async with s.get(f"{BASE}/health", headers={"Origin": ORIGIN}) as r:
            print("Status:", r.status, await r.json())

if __name__ == "__main__":
    asyncio.run(test())
