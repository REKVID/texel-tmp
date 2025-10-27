# ✅ Решение проблемы с чатом на странице "Обучение"

## Найденные проблемы

1. **Конфликт зависимостей FastAPI** - исправлено в `ai-chat-microservice/app/deps.py` и `main.py`
2. **Rate Limiting бесплатной модели** - модель DeepSeek v3 временно ограничена по запросам
3. **Обработка ошибок** - улучшена в компоненте AIChat

## Что было исправлено

### 1. Зависимости FastAPI (`ai-chat-microservice/app/deps.py`)
Упрощена функция получения OpenRouter клиента:
```python
async def get_openrouter_client(request: Request) -> OpenRouterClient:
    """Получить клиент OpenRouter с HTTP клиентом из app state"""
    http_client = request.app.state.http_client
    return OpenRouterClient(http_client)
```

### 2. Изменена модель по умолчанию (`src/components/AIChat.tsx`)
Заменена на более стабильную:
- Было: `deepseek/deepseek-chat-v3-0324:free` (часто rate-limited)
- Стало: `google/gemini-2.0-flash-exp:free` (более стабильная)

### 3. Улучшена обработка ошибок
Добавлены понятные сообщения для пользователей при разных типах ошибок.

## Как запустить

### Шаг 1: Запустить микросервис
```bash
cd ai-chat-microservice
python run.py
```

Должно появиться:
```
🤖 AI Chat Microservice (Rewritten) — запуск
INFO:     Uvicorn running on http://0.0.0.0:8001
```

### Шаг 2: Запустить фронтенд (в новом терминале)
```bash
npm run dev
```

### Шаг 3: Открыть браузер
1. Перейти на http://localhost:8080
2. Открыть страницу "Обучение"
3. Нажать на кнопку чата в правом нижнем углу
4. Написать сообщение!

## Если чат всё ещё не работает

### Проблема: "Rate limited" или "429 error"
**Решение**: Модель перегружена, попробуйте:
1. Подождать 1-2 минуты
2. Или изменить модель в компоненте AIChat.tsx на другую бесплатную:
   - `meta-llama/llama-3.3-70b-instruct:free`
   - `mistralai/mistral-7b-instruct:free`
   - `google/gemini-2.0-flash-exp:free`

### Проблема: "Cannot connect" или "ERR_CONNECTION_REFUSED"
**Решение**: Микросервис не запущен:
```bash
cd ai-chat-microservice
python run.py
```

### Проблема: "API key not configured"
**Решение**: Проверьте `ai-chat-microservice/app/config.py` - там уже есть ключ

### Тест работоспособности
Откройте в браузере: http://localhost:8001/health

Должно показать:
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "openrouter_configured": true
}
```

## Дополнительные настройки

### Изменить модель через переменную окружения
Создайте файл `.env` в корне проекта:
```env
VITE_AI_CHAT_DEFAULT_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

Перезапустите фронтенд (Ctrl+C, затем `npm run dev`).

## Готово! 🎉

Теперь чат должен работать. Если возникнут вопросы - проверьте логи в терминале, где запущен микросервис.

