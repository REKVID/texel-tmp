#!/usr/bin/env python3
"""
🧪 Pydantic Test Script
Проверка моделей данных Pydantic
"""

import sys
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


# Test models
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    conversation_id: str
    model: Optional[str] = "deepseek/deepseek-chat-v3.1:free"
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(1500, ge=1, le=4000)


class ChatResponse(BaseModel):
    model_config = {"protected_namespaces": ()}  # Fix for model_ namespace conflict

    response: str
    model_used: str
    tokens_used: int
    conversation_id: str
    timestamp: str
    response_time_ms: int


def test_models():
    """Тестирование Pydantic моделей"""
    print("🧪 Testing Pydantic Models")
    print("=" * 40)

    # Test ChatMessage
    print("\n📥 Testing ChatMessage...")
    try:
        message = ChatMessage(
            message="Test message",
            conversation_id="test-123",
            model="deepseek/deepseek-chat-v3.1:free",
            temperature=0.7,
        )
        print(f"✅ ChatMessage created: {message.model_dump()}")
    except Exception as e:
        print(f"❌ ChatMessage failed: {e}")
        return False

    # Test ChatResponse
    print("\n📤 Testing ChatResponse...")
    try:
        response = ChatResponse(
            response="Test response from AI",
            model_used="deepseek/deepseek-chat-v3.1:free",
            tokens_used=42,
            conversation_id="test-123",
            timestamp=datetime.now().isoformat(),
            response_time_ms=1500,
        )
        print(f"✅ ChatResponse created: {response.model_dump()}")
    except Exception as e:
        print(f"❌ ChatResponse failed: {e}")
        return False

    # Test JSON serialization
    print("\n🔄 Testing JSON serialization...")
    try:
        json_data = response.model_dump_json()
        print(f"✅ JSON serialization: {json_data[:100]}...")
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")
        return False

    return True


if __name__ == "__main__":
    print("🔬 Pydantic Model Validation Test")
    print("=" * 50)

    if test_models():
        print("\n🎉 All Pydantic models work correctly!")
        sys.exit(0)
    else:
        print("\n❌ Pydantic model validation failed!")
        sys.exit(1)
