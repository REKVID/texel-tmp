import logging
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.context import CryptContext
import secrets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Auth Microservice", version="1.0.0")

# Разрешённые origins для CORS (фронт может быть на разных портах и хостах в dev)
_cors_origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://[::1]:8080",
    "http://[::1]:5173",
]


def _is_local_origin(origin: str | None) -> bool:
    if not origin or not origin.startswith("http"):
        return False
    return (
        "localhost" in origin
        or origin.startswith("http://127.")
        or "::1" in origin
        or origin.startswith("http://0.0.0.0")
        or origin.startswith("http://192.168.")
        or origin.startswith("http://10.")
    )


def _cors_headers(request: Request) -> dict:
    """Заголовки CORS для ответа (чтобы при 500 браузер не скрывал ошибку)."""
    origin = request.headers.get("origin")
    if origin and _is_local_origin(origin):
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
        }
    return {}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """При любой необработанной ошибке возвращаем 500 с CORS, чтобы в консоли не путать с CORS."""
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Внутренняя ошибка сервера. Проверьте логи auth-service."},
        headers=_cors_headers(request),
    )


@app.middleware("http")
async def cors_allow_local_origin(request: Request, call_next):
    """В dev разрешаем любой локальный origin (разный порт/IP), чтобы не было Failed to fetch."""
    response = await call_next(request)
    origin = request.headers.get("origin")
    if origin and _is_local_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Используем PBKDF2 по умолчанию, чтобы не упираться в лимит bcrypt в 72 байта.
# bcrypt оставляем в списке для совместимости, если появятся старые хэши.
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

users_by_id: dict[str, dict] = {}
users_by_login: dict[str, str] = {}
sessions: dict[str, str] = {}

SESSION_COOKIE_NAME = "session_id"
SESSION_AGE_SECONDS = 30 * 24 * 60 * 60  # 30 дней


class UserIn(BaseModel):
    username: str
    email: str
    password: str


class LoginIn(BaseModel):
    login_or_email: str
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


@app.post("/auth/login", response_model=UserOut)
async def login(data: LoginIn, response: Response):
    login_key = data.login_or_email.strip().lower()
    if not login_key or not data.password:
        raise HTTPException(status_code=400, detail="Укажите логин или почту и пароль")

    user_id = users_by_login.get(login_key)
    if not user_id:
        raise HTTPException(status_code=401, detail="Неверный логин/почта или пароль")

    user = users_by_id.get(user_id)
    if not user or not pwd_context.verify(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Неверный логин/почта или пароль")

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


@app.get("/auth/me", response_model=UserOut)
async def me(request: Request):
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id or session_id not in sessions:
        raise HTTPException(status_code=401, detail="Не авторизован")

    user_id = sessions[session_id]
    user = users_by_id.get(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="Сессия недействительна")

    return UserOut(id=user["id"], username=user["username"], email=user["email"])


@app.post("/auth/logout")
async def logout(response: Response, request: Request):
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if session_id and session_id in sessions:
        del sessions[session_id]

    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/")
    return {"ok": True}