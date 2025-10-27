# 🚀 Быстрый старт - Texel AI Learning Platform

## 🎉 НОВОЕ В ЭТОМ ОБНОВЛЕНИИ

### ✨ Авторизация полностью переработана
✅ **Демо вход работает!** - больше не нужен Telegram бот для разработки  
✅ **Красивое модальное окно** - синяя обводка как на остальном сайте  
✅ **Анимированный фон** - живые частицы как на главной странице  
✅ **Синяя кнопка входа** - консистентный дизайн на все 100%  

### 🔧 CORS полностью исправлен
✅ **OPTIONS preflight запросы** возвращают 204 ✓  
✅ **Все заголовки установлены** правильно ✓  
✅ **Поддержка всех портов** (5173, 5174, 8080)  

### 🤖 AI Chat работает
✅ **Модель Llama 3.3 70B** (бесплатная и стабильная)  
✅ **История разговоров** сохраняется  
✅ **Красивый UI** с анимацией  

---

## За 2 минуты - полностью рабочая система!

### Шаг 1: Backend (30 сек)

```bash
cd ai-chat-microservice
python run.py
```

✅ Запустится на `http://localhost:8001`

### Шаг 2: Frontend (30 сек)

В новом терминале:

```bash
npm run dev
```

✅ Запустится на `http://localhost:5174`

---

## 🎯 Что работает прямо сейчас

### ✨ AI Chat - вкладка "Обучение"
- Сообщения отправляются в OpenRouter API
- Используется модель `meta-llama/llama-3.3-70b-instruct:free`
- Поддержка история разговоров
- Красивый UI с анимацией

### 🔐 Авторизация - кнопка "Вход"
- **Демо режим** - нажмите "Демо вход" (работает сразу без настроек!)
- Красивое модальное окно с:
  - 🎨 Синей обводкой (как на остальном сайте)
  - ✨ Анимированным фоном с частицами
  - 🔵 Синей кнопкой входа

### 🌐 CORS полностью исправлен
- ✅ OPTIONS preflight запросы возвращают 204
- ✅ Все нужные заголовки установлены
- ✅ Поддержка `http://localhost:5174`

---

## 📝 Структура проекта

```
texel-tmp/
├── frontend/
│   ├── src/components/
│   │   ├── LoginModal.tsx      (красивая авторизация с фоном)
│   │   ├── AIChat.tsx          (чат с ИИ)
│   │   ├── Navigation.tsx       (навигация с кнопкой входа)
│   │   └── ...
│   ├── .env                    (VITE_API_URL, TELEGRAM_BOT_USERNAME)
│   └── package.json
│
├── backend/ (ai-chat-microservice/)
│   ├── app/
│   │   ├── main.py             (FastAPI + CORS + OPTIONS handler)
│   │   ├── config.py           (настройки, ALLOWED_ORIGINS)
│   │   ├── routers/
│   │   │   ├── auth.py         (авторизация, демо режим)
│   │   │   └── chat.py         (API для чата)
│   │   └── services/
│   │       └── openrouter.py   (интеграция с OpenRouter)
│   ├── .env                    (DB, TELEGRAM_BOT_TOKEN, JWT_SECRET_KEY)
│   └── run.py
│
└── docs/
    ├── QUICK_START_AUTH.md     (подробно про авторизацию)
    ├── SETUP_AUTH_SYSTEM.md    (полная настройка с БД)
    └── README.md
```

---

## 🎮 Как использовать

### 1️⃣ Авторизация - Демо вход

1. Нажмите кнопку **"Вход"** в правом верхнем углу (синяя обводка)
2. Откроется красивое окно с:
   - Анимированным фоном
   - Синей обводкой
   - Кнопкой "Демо вход"
3. Нажмите **"Демо вход"** - вы в системе! 🎉
4. Нажмите на свой аватар → "Профиль" для просмотра

### 2️⃣ ИИ Чат - на вкладке "Обучение"

1. Перейдите на вкладку **"Обучение"**
2. Напишите вопрос на **русском языке**
3. Получите ответ от Llama 3.3 модели
4. История разговоров сохраняется

---

## 🔧 Конфигурация

### Frontend (.env в корне)
```
VITE_API_URL=http://localhost:8001
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

### Backend (.env в ai-chat-microservice/)
```
# API
OPENROUTER_API_KEY=sk-or-v1-...

# Server
AI_CHAT_HOST=0.0.0.0
AI_CHAT_PORT=8001

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,...

# JWT (для авторизации)
JWT_SECRET_KEY=ваш_супер_секретный_ключ_32+ символов
JWT_EXPIRATION_HOURS=24

# Telegram (опционально для production)
TELEGRAM_BOT_TOKEN=  (оставьте пусто для демо режима!)
```

---

## 🚨 Если что-то не работает

### "Нет соединения с бэком"
- Проверьте что backend запущен: `http://localhost:8001/health`
- Проверьте `VITE_API_URL` в `.env`

### "Демо вход выдает 401"
- Убедитесь `TELEGRAM_BOT_TOKEN` пуст в `.env` (не удаляйте, оставьте `=""`)
- Перезагрузите backend: `Ctrl+C` и `python run.py`

### "Чат не отправляется"
- Откройте DevTools (F12) → Network tab
- Проверьте что `/chat` запрос успешен (200)
- Проверьте что OPTIONS preflight вернул 204
- Проверьте что у вас есть API ключ в `OPENROUTER_API_KEY`

### "Ошибка 429 от OpenRouter"
- Модель временно заблокирована (rate limit)
- Подождите несколько минут и повторите
- Или используйте другую бесплатную модель

---

## 📚 Дополнительно

- **AI Chat API**: [http://localhost:8001/docs](http://localhost:8001/docs) - Swagger документация
- **Чат микросервис**: `ai-chat-microservice/README.md`
- **Авторизация**: `QUICK_START_AUTH.md`
- **Полная настройка БД**: `SETUP_AUTH_SYSTEM.md`

---

## ✨ Основные фичи

- ✅ **Чат с ИИ** на OpenRouter
- ✅ **Авторизация через Telegram** (с демо режимом)
- ✅ **Красивый UI** - синяя обводка, темная тема, анимации
- ✅ **Профиль пользователя** - статистика и достижения
- ✅ **CORS полностью исправлен** - работает с браузера
- ✅ **Mobile responsive** - работает на телефоне

---

**Готово к использованию! 🎉**

Если вы хотите подключить реальный Telegram бот для production - смотрите `QUICK_START_AUTH.md`

---

## 📋 ЧТО БЫЛО ИСПРАВЛЕНО В ЭТОМ ОБНОВЛЕНИИ

### 🔴 Была ошибка 401: "Unauthorized"
**Причина:** Backend проверял подпись Telegram данных, а фронт отправлял mock данные без подписи.  
**Решение:** Добавили демо режим - если `TELEGRAM_BOT_TOKEN` пуст, система пропускает проверку подписи.

```python
# ai-chat-microservice/app/routers/auth.py
if settings.TELEGRAM_BOT_TOKEN and settings.TELEGRAM_BOT_TOKEN.strip():
    # Production mode - verify signature
    if not TelegramAuthService.verify_telegram_auth_data(...):
        raise HTTPException(status_code=401, detail="Invalid Telegram authentication")
else:
    # Demo mode - allow login without verification
    print("⚠️  Demo mode: Skipping Telegram signature verification")
```

### 🔴 Была ошибка CORS: "No 'Access-Control-Allow-Origin' header"
**Причина:** OPTIONS preflight запросы возвращали 400 вместо нужных заголовков.  
**Решение:** Добавили явный OPTIONS handler перед middleware:

```python
# ai-chat-microservice/app/main.py
@app.options("/{path_name:path}")
async def options_handler(path_name: str, request: Request):
    """Handle CORS preflight requests explicitly"""
    origin = request.headers.get("origin")
    # ... set proper headers and return 204 ...
```

### 🎨 Был старый UI авторизации
**Было:** Простой модальное окно с purple/pink обводкой, без фона.  
**Стало:**
- 🔵 Синяя обводка (`border-blue-500/60`)
- ✨ Анимированный фон с частицами
- 🎭 Градиентный заголовок
- 🔵 Синяя кнопка входа с иконкой Lock
- 📝 Лучшие информационные пункты

### 🎨 Была скучная кнопка входа в Navigation
**Было:** Простая фиолетовая кнопка без стиля.  
**Стало:** 
- 🔵 Синяя обводка (`border-blue-500/60`)
- ✨ Градиент фона (`from-blue-950/30 to-purple-950/30`)
- 🌟 Hover эффект с синим свечением (`shadow-blue-500/30`)
- 📝 Большой шрифт и иконка User

### ⚙️ .env файлы
**Создали:**
- `.env` в корне проекта с `VITE_API_URL=http://localhost:8001`
- `.env` в `ai-chat-microservice/` с полной конфигурацией

### 📚 Документация
**Обновили:**
- `QUICK_START_AUTH.md` - с информацией про демо режим
- `QUICK_START.md` - с полным гайдом на 2 минуты

---

## 🎯 РЕЗУЛЬТАТ

Теперь система **полностью рабочая** без дополнительных настроек:

1. ✅ Запускаете backend: `python run.py`
2. ✅ Запускаете frontend: `npm run dev`
3. ✅ Нажимаете "Вход" → "Демо вход"
4. ✅ Вы в системе!
5. ✅ Идёте на "Обучение" → разговариваете с ИИ

**Всё работает "из коробки"! 🎉**

---

## ИТОГОВЫЙ СТАТУС

### Готово:
- [x] Авторизация (демо и реальная Telegram)
- [x] AI Chat через OpenRouter API
- [x] CORS полностью рабочий
- [x] Красивый UI со скачеными стилями
- [x] Документация

### Быстрый старт:
```
Terminal 1:  cd ai-chat-microservice && python run.py
Terminal 2:  npm run dev
Browser:     http://localhost:5174
```

### Используй:
1. Нажми "Вход" в правом верхнем углу
2. Нажми "Демо вход" 
3. Готово! Авторизован
4. Перейди на "Обучение"
5. Начни беседовать с ИИ

**Система полностью функциональна и готова к использованию!**
