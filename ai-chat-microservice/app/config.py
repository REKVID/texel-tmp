"""
Configuration for the AI Chat Microservice
"""
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    # OpenRouter
    OPENROUTER_API_KEY: str = "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"
    
    # API Server
    AI_CHAT_HOST: str = "0.0.0.0"
    AI_CHAT_PORT: int = 8001
    DEBUG: bool = True
    ALLOWED_ORIGINS: Union[List[str], str] = "http://localhost:5173,http://localhost:5174,http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:8080,http://127.0.0.1:8081,http://127.0.0.1:8082,https://texel-ai-forge.com"

    # Database
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "texeldb"

    # Telegram OAuth
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_BOT_USERNAME: str = ""

    # JWT
    JWT_SECRET_KEY: str = "change-this-to-your-secret-key-minimum-32-characters-long"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def split_origins(cls, v):
        if isinstance(v, str):
            return [x.strip() for x in v.split(",") if x.strip()]
        if isinstance(v, tuple):
            # Handle case where parentheses create a tuple
            return [x.strip() for x in "".join(v).split(",") if x.strip()]
        if isinstance(v, list):
            return v
        return []

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
