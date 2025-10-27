"""
Telegram Authentication Service
Handles OAuth login and token management
"""
import hashlib
import hmac
import json
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
import secrets
from app.config import settings


class TelegramAuthService:
    """Service for handling Telegram OAuth authentication"""

    @staticmethod
    def verify_telegram_auth_data(telegram_data: Dict[str, Any], bot_token: str) -> bool:
        """
        Verify that the data received from Telegram widget is authentic
        Based on https://core.telegram.org/widgets/login#checking-authorization
        """
        if not isinstance(telegram_data, dict):
            return False

        # Extract hash and remove it from data
        received_hash = telegram_data.get("hash")
        if not received_hash:
            return False

        # Create a copy without the hash
        data_check_string_parts = []
        for key in sorted(telegram_data.keys()):
            if key != "hash":
                data_check_string_parts.append(f"{key}={telegram_data[key]}")

        data_check_string = "\n".join(data_check_string_parts)

        # Compute the hash
        secret_key = hashlib.sha256(bot_token.encode()).digest()
        computed_hash = hmac.new(
            secret_key, data_check_string.encode(), hashlib.sha256
        ).hexdigest()

        return computed_hash == received_hash

    @staticmethod
    def verify_auth_date(auth_date: int, max_age_seconds: int = 86400) -> bool:
        """
        Verify that the authentication is recent (not older than max_age_seconds)
        Default is 24 hours
        """
        auth_time = datetime.fromtimestamp(auth_date)
        now = datetime.utcnow()
        age = (now - auth_time).total_seconds()

        return 0 <= age <= max_age_seconds

    @staticmethod
    def create_access_token(user_id: int, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                hours=settings.JWT_EXPIRATION_HOURS
            )

        to_encode = {
            "sub": str(user_id),
            "exp": expire,
            "iat": datetime.utcnow(),
        }

        encoded_jwt = jwt.encode(
            to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def verify_access_token(token: str) -> Optional[int]:
        """Verify JWT token and return user_id if valid"""
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
            )
            user_id: int = int(payload.get("sub"))
            return user_id
        except (jwt.InvalidTokenError, ValueError):
            return None

    @staticmethod
    def create_session_token() -> str:
        """Create a random session token"""
        return secrets.token_urlsafe(32)
