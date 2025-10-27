"""
🗄️ Простое in-memory хранилище разговоров.
Для продакшена замените на Redis/БД.
"""
from __future__ import annotations
from typing import Dict, List, TypedDict
from datetime import datetime
from threading import RLock

class Message(TypedDict):
    role: str
    content: str

class MemoryStore:
    def __init__(self) -> None:
        self._conversations: Dict[str, List[Message]] = {}
        self._meta: Dict[str, Dict[str, str | int]] = {}
        self._lock = RLock()

    def add_exchange(self, conv_id: str, user_content: str, assistant_content: str) -> None:
        with self._lock:
            bucket = self._conversations.setdefault(conv_id, [])
            bucket.extend([{"role": "user", "content": user_content},
                           {"role": "assistant", "content": assistant_content}])
            meta = self._meta.setdefault(conv_id, {
                "created_at": datetime.utcnow().isoformat(),
                "messages_count": 0
            })
            meta["updated_at"] = datetime.utcnow().isoformat()
            meta["messages_count"] = len(bucket)

    def get_messages(self, conv_id: str, last_n: int | None = None) -> List[Message]:
        with self._lock:
            data = self._conversations.get(conv_id, [])
            return data[-last_n:] if last_n else list(data)

    def get_meta(self, conv_id: str):
        with self._lock:
            meta = self._meta.get(conv_id)
            return dict(meta) if meta else None

    def clear(self, conv_id: str) -> bool:
        with self._lock:
            existed = conv_id in self._conversations
            self._conversations.pop(conv_id, None)
            self._meta.pop(conv_id, None)
            return existed

    def stats(self) -> dict:
        with self._lock:
            total_messages = sum(len(v) for v in self._conversations.values())
            return {
                "total_conversations": len(self._conversations),
                "total_messages": total_messages,
                "active_conversations": len([v for v in self._conversations.values() if v]),
            }

store = MemoryStore()
