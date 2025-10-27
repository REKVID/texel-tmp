#!/usr/bin/env python3
"""
Прямой тест чата без HTTP
"""
import asyncio
import sys
sys.path.insert(0, ".")

async def test():
    print("Loading modules...")
    from app.main import app
    from app.config import settings
    from app.models import ChatMessage
    from app.deps import get_openrouter_client
    from fastapi import Request
    
    print(f"API Key: {settings.OPENROUTER_API_KEY[:20]}...")
    
    # Create mock request
    class MockApp:
        class State:
            http_client = None
        state = State()
    
    class MockRequest:
        app = MockApp()
    
    # Setup HTTP client
    import httpx
    async with httpx.AsyncClient(http2=True, timeout=60.0) as http_client:
        MockRequest.app.state.http_client = http_client
        
        # Get client
        print("Getting OpenRouter client...")
        client = await get_openrouter_client(MockRequest())
        print(f"Client: {client}")
        
        # Create message
        msg = ChatMessage(
            message="Hello, test",
            conversation_id="test-direct",
            model="deepseek/deepseek-chat-v3-0324:free"
        )
        
        print(f"Message: {msg}")
        print("Calling chat...")
        
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": msg.message}
        ]
        
        try:
            result = await client.chat(
                messages=messages,
                model=msg.model,
                temperature=msg.temperature,
                max_tokens=msg.max_tokens
            )
            print(f"Success! Response: {result.response[:100]}...")
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())

