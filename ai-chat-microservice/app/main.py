#!/usr/bin/env python3
"""
AI Chat Microservice with explicit CORS handling for preflight requests
"""
from __future__ import annotations

from typing import AsyncGenerator
from fastapi import FastAPI, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

from .config import settings
from .routers import meta, chat, conversations, auth

async def lifespan(app_: FastAPI) -> AsyncGenerator[None, None]:
    # Create shared HTTP client for all requests
    async with httpx.AsyncClient(http2=True, timeout=60.0) as http_client:
        app_.state.http_client = http_client
        print(f"Starting API on {settings.AI_CHAT_HOST}:{settings.AI_CHAT_PORT}")
        print(f"CORS allowed origins: {settings.ALLOWED_ORIGINS}")
        yield

app = FastAPI(
    title="AI Chat Microservice",
    description="AI Chat API powered by OpenRouter",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware - MUST come first
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,  # We don't use cookies/credentials
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    expose_headers=["Content-Type"],
    max_age=7200,
)

# Explicit preflight handler - catches OPTIONS before routing
@app.options("/{path_name:path}")
async def options_handler(path_name: str, request: Request):
    """Handle CORS preflight requests explicitly"""
    origin = request.headers.get("origin")
    
    # Check if origin is allowed
    allowed = False
    if origin in settings.ALLOWED_ORIGINS:
        allowed = True
    
    headers = {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept",
        "Access-Control-Max-Age": "7200",
    }
    
    # Only set origin if it's allowed, otherwise let browser handle it
    if allowed:
        headers["Access-Control-Allow-Origin"] = origin
    else:
        # Still allow requests but without credentials
        headers["Access-Control-Allow-Origin"] = origin or "*"
    
    return Response(status_code=204, headers=headers)

# Include routers
app.include_router(meta.router)
app.include_router(chat.router)
app.include_router(conversations.router)
app.include_router(auth.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "ai-chat-microservice",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.AI_CHAT_HOST, port=settings.AI_CHAT_PORT, reload=False)
