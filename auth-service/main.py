from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
import secrets

app = FastAPI(title="Auth Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users_by_id: dict[str, dict] = {}
users_by_login: dict[str, str] = {}
sessions: dict[str, str] = {}

SESSION_COOKIE_NAME = "session_id"
SESSION_AGE_SECONDS = 30 * 24 * 60 * 60  # 30 дней


class UserIn(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    username: str
    email: str


class HealthResponse(BaseModel):
    status: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health():
    return {"status": "healthy", "version": "1.0.0"}


@app.post("/auth/register", response_model=UserOut)
async def register(data: UserIn, response: Response):
    username = data.username.strip().lower()
    email = data.email.strip().lower()
    if not username or not email or not data.password:
        raise HTTPException(status_code=400, detail="Логин, почта и пароль обязательны")
    if username in users_by_login:
        raise HTTPException(status_code=400, detail="Такой логин уже занят")
    if email in users_by_login:
        raise HTTPException(status_code=400, detail="Эта почта уже зарегистрирована")
    user_id = secrets.token_hex(16)
    password_hash = pwd_context.hash(data.password)
    user = {
        "id": user_id,
        "username": username,
        "email": email,
        "password_hash": password_hash,
    }
    users_by_id[user_id] = user
    users_by_login[username] = user_id
    users_by_login[email] = user_id
    session_id = secrets.token_hex(32)
    sessions[session_id] = user_id
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_id,
        max_age=SESSION_AGE_SECONDS,
        httponly=True,
        samesite="lax",
        path="/",
    )
    return UserOut(id=user["id"], username=user["username"], email=user["email"])
