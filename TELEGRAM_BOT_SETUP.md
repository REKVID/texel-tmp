# 🤖 Настройка Telegram Authentication

## Шаг 1: Получить токен от @BotFather

1. **Откройте Telegram** и найдите `@BotFather`
2. **Отправьте команду:** `/newbot`
3. **Следуйте инструкциям:**
   - Введите название бота (например: "Texel Learning Bot")
   - Введите username бота (должен заканчиваться на `_bot`, например: `texel_learning_bot`)
4. **Получите токен** в формате: `123456:ABCdefGHIjklmno-zyx`

## Шаг 2: Добавить токен в backend (.env)

В файле `ai-chat-microservice/` создайте или отредактируйте `.env`:

```env
TELEGRAM_BOT_TOKEN=123456:ABCdefGHIjklmno-zyx
TELEGRAM_BOT_USERNAME=texel_learning_bot
```

**⚠️ Важно:** 
- Токен - это полное значение (вместе с двоеточием и дефисом)
- Username - это ваш username БЕЗ @

## Шаг 3: Добавить username в frontend (.env)

В файле `.env` в корне проекта:

```env
VITE_TELEGRAM_BOT_USERNAME=texel_learning_bot
```

## Шаг 4: Установить webhook (опционально)

Если вы хотите, чтобы бот получал сообщения напрямую:

```bash
# Отправьте запрос к BotFather
# Это ОПЦИОНАЛЬНО для Login Widget
```

## ✅ Проверка конфигурации

1. Перезагрузите backend: `python run.py`
2. Перезагрузите frontend: `npm run dev`
3. Откройте http://localhost:XXXX
4. Нажмите "Вход"
5. **Должна появиться кнопка "Войти через Telegram"**
6. Нажмите на неё и аутентифицируйтесь через Telegram

## 🔍 Troubleshooting

### "Ошибка: Укажите VITE_TELEGRAM_BOT_USERNAME в .env"
- Проверьте что `.env` в корне проекта содержит:
  ```env
  VITE_TELEGRAM_BOT_USERNAME=your_bot_username
  ```
- Обновите страницу (Ctrl+Shift+R)

### Widget не загружается
- Убедитесь что TELEGRAM_BOT_USERNAME **правильный и без @**
- Проверьте в консоли браузера (F12) есть ли ошибки

### "Invalid Telegram authentication"
- Проверьте что backend имеет ПРАВИЛЬНЫЙ токен:
  ```env
  TELEGRAM_BOT_TOKEN=123456:ABCdefGHIjklmno-zyx
  ```
- Перезагрузите backend (Ctrl+C и `python run.py`)

### Widget показывает пустую область
- Может быть проблема с загрузкой скрипта Telegram
- Откройте DevTools (F12) → Network tab
- Проверьте что `telegram-web-app.js` загружается успешно

## 📚 Дополнительно

- **Bot API документация:** https://core.telegram.org/bots
- **Login Widget docs:** https://core.telegram.org/widgets/login
- **BotFather commands:** `/help` в @BotFather

---

**Готово! Telegram Login Widget должен работать! 🎉**
