#!/usr/bin/env python3
"""
Тестовый скрипт для проверки API микросервиса
"""
import requests
import json

def test_health():
    """Проверка health endpoint"""
    print("Checking /health...")
    response = requests.get("http://localhost:8001/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()

def test_chat():
    """Проверка chat endpoint"""
    print("Checking /chat...")
    payload = {
        "message": "Hello, test message",
        "conversation_id": "test-123",
        "model": "deepseek/deepseek-chat-v3-0324:free",
        "temperature": 0.7
    }
    
    try:
        response = requests.post(
            "http://localhost:8001/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Status: {response.status_code}")
            print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)[:500]}...")
        else:
            print(f"Error! Status: {response.status_code}")
            print(f"Error details: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")
    print()

if __name__ == "__main__":
    test_health()
    test_chat()

