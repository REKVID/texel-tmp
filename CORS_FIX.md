# 🔧 CORS Fix - Решение проблемы 400 Bad Request

## 🚨 Проблема

В терминале видна ошибка:
```
INFO:     127.0.0.1:52398 - "OPTIONS /chat HTTP/1.1" 400 Bad Request
```

Это **CORS preflight request** ошибка, которая происходит когда браузер делает предварительный OPTIONS запрос перед отправкой POST запроса к API.

## ✅ Решение

### 1. Обновлены CORS настройки в микросервисе

```python
# В ai-chat-microservice/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # ✅ Явно указаны методы
    allow_headers=[
        "Accept",
        "Accept-Language", 
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
    ],  # ✅ Явно указаны заголовки
    expose_headers=["*"],
)
```

### 2. Добавлен специальный OPTIONS handler

```python
# Обработчик для CORS preflight запросов
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle CORS preflight requests"""
    return {"message": "OK"}
```

### 3. Создан .env.development для фронтенда

```env
# .env.development
VITE_AI_CHAT_API_URL=http://localhost:8001
VITE_APP_NAME=Texel AI Forge
VITE_APP_VERSION=1.0.0
```

## 🔄 Как применить исправления

### 1. Перезапустите микросервис

```bash
cd ai-chat-microservice
# Остановите текущий процесс (Ctrl+C)
# Запустите снова
python run.py
```

### 2. Перезапустите фронтенд

```bash
# В корне проекта
npm run dev
```

### 3. Проверьте работу

1. Откройте [http://localhost:8080/training](http://localhost:8080/training)
2. Нажмите на кнопку чата 💬
3. Отправьте сообщение
4. Проверьте консоль браузера и терминал микросервиса

## 🔍 Диагностика

### Проверка микросервиса

```bash
# Проверка health endpoint
curl http://localhost:8001/health

# Проверка CORS с OPTIONS
curl -X OPTIONS http://localhost:8001/chat \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

### Проверка во фронтенде

Откройте DevTools → Network и посмотрите на запросы:

1. **OPTIONS /chat** - должен возвращать 200 OK
2. **POST /chat** - должен возвращать ответ ИИ

### Ожидаемые заголовки ответа

```
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Accept, Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## 🐛 Дополнительные проблемы

### Если OPTIONS все еще не работает

Добавьте в микросервис более явный CORS handler:

```python
from fastapi.responses import Response

@app.middleware("http")
async def add_cors_headers(request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    
    response = await call_next(request)
    return response
```

### Если порт занят

```bash
# Найти процесс на порту 8001
lsof -i :8001

# Убить процесс
kill -9 <PID>
```

### Если фронтенд не видит .env.development

Убедитесь что переменные загружены:

```javascript
console.log('AI Chat API URL:', import.meta.env.VITE_AI_CHAT_API_URL);
```

## ✅ После исправления

Вы должны увидеть в терминале микросервиса:

```
INFO:     127.0.0.1:52398 - "OPTIONS /chat HTTP/1.1" 200 OK
INFO:     127.0.0.1:52398 - "POST /chat HTTP/1.1" 200 OK
```

А в чате получить ответ от ИИ! 🎉

---

**💡 Tip:** CORS ошибки - это самая частая проблема при интеграции фронтенда с бэкендом. Всегда проверяйте OPTIONS запросы первыми!
