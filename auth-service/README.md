# Auth Microservice

Микросервис авторизации (регистрация и вход по логину/почте и паролю, сессии).

## Запуск

```bash
cd auth-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8003 --reload
```

Сервис: http://localhost:8003

## API

- `GET /health` — проверка состояния сервиса
- `POST /auth/register` — регистрация (username, email, password). После регистрации пользователь автоматически авторизован (сессия в cookie).
