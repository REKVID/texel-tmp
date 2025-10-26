# 🚀 Быстрый старт: Вкладка "Обучение" с ИИ чатом

Полная инструкция по запуску сайта с новой вкладкой "Обучение" и интегрированным ИИ чатом.

## 📋 Что реализовано

✅ **Вкладка "Обучение"** - новая страница с программой обучения  
✅ **Particles.js фон** - такой же анимированный фон как на главной  
✅ **ИИ Чат** - разворачивающийся чат справа с кнопкой  
✅ **Микросервис FastAPI** - отдельный сервис для ИИ через OpenRouter API  
✅ **Системные промпты** - настроенные промпты для обучающего ассистента

## 🎯 Архитектура

```
┌─────────────────────┐    HTTP/WebSocket    ┌─────────────────────┐
│   FRONTEND          │ ◄─────────────────► │   AI MICROSERVICE   │
│   React + TypeScript│                     │   FastAPI + Python  │  
│   http://localhost:8080                   │   http://localhost:8001
└─────────────────────┘                     └─────────────────────┘
                                                       │
                                                       │ HTTP API
                                                       ▼
                                            ┌─────────────────────┐
                                            │   OPENROUTER API    │
                                            │   Multiple AI Models │
                                            └─────────────────────┘
```

## 🔧 Запуск проекта

### 1. Фронтенд (React)

```bash
# В корне проекта
npm install
npm run dev
# ➜ http://localhost:8080
```

### 2. ИИ Микросервис (FastAPI)

```bash
# Переход в папку микросервиса
cd ai-chat-microservice

# Быстрый запуск (автоматическая настройка)
python run.py

# ИЛИ ручная настройка:
# pip install -r requirements.txt
# cp env.example .env
# nano .env  # добавьте OPENROUTER_API_KEY
# python app/main.py

# ➜ http://localhost:8001
```

### 3. Получение OpenRouter API ключа

1. Регистрация: [openrouter.ai/auth](https://openrouter.ai/auth)
2. Создание API ключа: [openrouter.ai/keys](https://openrouter.ai/keys)  
3. Добавление в `.env` файл микросервиса

## 🌐 Использование

### Навигация по сайту
1. Откройте [http://localhost:8080](http://localhost:8080)
2. Нажмите "Обучение" в навигации
3. Попадете на страницу с программой обучения

### ИИ Чат
1. На странице обучения справа внизу появится кнопка чата 💬
2. Нажмите на неё - откроется чат-окно
3. Задайте вопрос по программированию или ИИ
4. Получите ответ от обученного ассистента

### Функции чата
- **Сворачивание/разворачивание** - кнопки в шапке чата
- **Очистка истории** - кнопка 🔄 для начала нового разговора  
- **Отправка сообщений** - Enter или кнопка отправки
- **Индикация загрузки** - анимированный спиннер при ожидании ответа

## 🔍 API Endpoints микросервиса

### Основные
- **POST** `/chat` - Отправить сообщение в ИИ чат
- **GET** `/health` - Проверка состояния сервиса
- **GET** `/models` - Список доступных ИИ моделей

### Управление разговорами  
- **GET** `/conversations/{id}` - История разговора
- **DELETE** `/conversations/{id}` - Очистка истории

### Документация API
- Swagger UI: [http://localhost:8001/docs](http://localhost:8001/docs)
- ReDoc: [http://localhost:8001/redoc](http://localhost:8001/redoc)

## 📝 Пример использования API

```javascript
// Отправка сообщения в чат
const response = await fetch('http://localhost:8001/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Как изучать JavaScript?",
    conversation_id: "training-session-123",
    model: "openai/gpt-3.5-turbo",
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.response); // Ответ ИИ
```

## 🛠 Кастомизация

### Изменение системного промпта
Отредактируйте `SYSTEM_PROMPT` в файле `ai-chat-microservice-example.py`:

```python
SYSTEM_PROMPT = """Ваш кастомный промпт для ИИ помощника..."""
```

### Добавление новых ИИ моделей
Обновите список в функции `get_available_models()`:

```python
{
    "id": "anthropic/claude-3-sonnet",
    "name": "Claude 3 Sonnet", 
    "description": "Сбалансированная модель Anthropic"
}
```

### Настройка CORS
Добавьте свои домены в `allow_origins`:

```python
allow_origins=[
    "http://localhost:8080",
    "https://your-production-domain.com"
]
```

## 🚨 Troubleshooting

### Проблемы с CORS
Убедитесь, что фронтенд запущен на порту 8080, или добавьте свой порт в CORS настройки микросервиса.

### OpenRouter API ошибки
1. Проверьте правильность API ключа в `.env` файле
2. Убедитесь, что на аккаунте OpenRouter есть средства
3. Проверьте лимиты запросов

### Микросервис не отвечает
1. Убедитесь что он запущен на порту 8001
2. Проверьте консоль на ошибки
3. Откройте [http://localhost:8001/health](http://localhost:8001/health)

### Чат не открывается
1. Проверьте консоль браузера на JavaScript ошибки
2. Убедитесь, что микросервис доступен
3. Проверьте Network tab в DevTools на CORS ошибки

## 🔄 Следующие шаги

### База данных
Замените in-memory хранение на PostgreSQL/MongoDB для persistent истории разговоров.

### Аутентификация  
Добавьте JWT токены для связи пользователей с их разговорами.

### WebSocket
Реализуйте real-time чат через WebSocket для мгновенных ответов.

### Docker
Упакуйте микросервис в Docker для простого деплоя.

### Мониторинг
Добавьте логирование, метрики и алерты для production использования.

---

**🎉 Поздравляем!** Теперь у вас есть полнофункциональный сайт обучения с ИИ чатом!
