# 🔐 Система Авторизации через Telegram - Инструкция по настройке

## 📋 Обзор

Полная система авторизации с поддержкой Telegram OAuth, профилем пользователя с графиками и статистикой обучения.

## 🗄️ База Данных

### Импорт SQL схемы

1. Откройте phpMyAdmin на `http://localhost/phpmyadmin`
2. Создайте новую базу данных: `texel_learning`
3. Перейдите в созданную БД
4. В закладке "Import" выберите файл `ai-chat-microservice/database_schema.sql`
5. Нажмите "Go" для импорта

**Или через командную строку:**
```bash
mysql -u root -p texel_learning < ai-chat-microservice/database_schema.sql
```

### Структура таблиц:
- `users` - информация о пользователях (Telegram ID, имя, аватар и т.д.)
- `user_profiles` - профили с данными об обучении
- `learning_stats` - статистика по дням
- `achievements` - значки достижений
- `user_achievements` - достижения пользователя
- `sessions` - сессии авторизации

## 🔧 Настройка Backend

### 1. Установка зависимостей

```bash
cd ai-chat-microservice
pip install -r requirements.txt
```

### 2. Переменные окружения

Создайте файл `.env` в папке `ai-chat-microservice/`:

```bash
# OpenRouter API
OPENROUTER_API_KEY=sk-or-v1-...

# Server
AI_CHAT_HOST=0.0.0.0
AI_CHAT_PORT=8001
DEBUG=True

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:8080,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:8080
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ваш_пароль_от_mysql
DB_NAME=texel_learning

# Telegram OAuth
TELEGRAM_BOT_TOKEN=ваш_бот_токен_от_бот_фазера
TELEGRAM_BOT_USERNAME=ваш_username_без_@

# JWT
JWT_SECRET_KEY=ваш_супер_секретный_ключ_минимум_32_символа
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
```

### 3. Получение Telegram Bot Token

1. Откройте Telegram и найдите `@BotFather`
2. Отправьте `/newbot` и следуйте инструкциям
3. Получите токен и сохраните в `.env`

### 4. Запуск Backend

```bash
python run.py
```

API будет доступен на `http://localhost:8001`

## 🎨 Настройка Frontend

### 1. Установка зависимостей

```bash
npm install
# или
yarn install
```

### 2. Файл .env в корне проекта

Создайте `.env` в корневой папке проекта:

```
VITE_API_URL=http://localhost:8001
VITE_TELEGRAM_BOT_USERNAME=ваш_username_бота
```

### 3. Запуск Frontend

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

## 🚀 API Endpoints

### Авторизация

#### POST `/api/auth/telegram-login`
Вход через Telegram OAuth
```json
{
  "telegram_data": {
    "id": 123456789,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "photo_url": "https://...",
    "auth_date": 1234567890,
    "hash": "...",
    "is_premium": false,
    "language_code": "en"
  }
}
```

**Ответ:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "telegram_id": 123456789,
    "first_name": "John",
    ...
  }
}
```

#### GET `/api/auth/me`
Получить информацию о текущем пользователе

**Headers:** `Authorization: Bearer {token}`

#### POST `/api/auth/logout`
Выход из системы

#### GET `/api/auth/profile`
Получить полный профиль пользователя

#### PUT `/api/auth/profile`
Обновить профиль пользователя

```json
{
  "bio": "Я учу программирование",
  "skill_level": "intermediate",
  "preferred_language": "Python",
  "motivational_quote": "Код - это искусство"
}
```

#### GET `/api/auth/dashboard`
Получить данные для панели пользователя (статистика, достижения, и т.д.)

## 🔒 Безопасность

### Проверка подписи Telegram

Система автоматически проверяет подпись всех данных от Telegram для убедитель в их подлинности.

### JWT Токены

- Токены имеют срок действия (по умолчанию 24 часа)
- Хранятся в `localStorage` на клиенте
- Отправляются в заголовке `Authorization: Bearer {token}`

## 📊 Функции профиля

### Доступные вкладки:

1. **Прогресс** 📈
   - Текущий курс с полоской прогресса
   - Еженедельная статистика (часов, упражнений)
   - Тренд обучения (график)

2. **Достижения** 🏆
   - Список всех значков
   - Показывает разблокированные и заблокированные достижения

3. **Языки** 💻
   - Диаграмма предпочтений языков программирования
   - Процентное распределение

4. **Настройки** ⚙️
   - Изменение уровня навыков
   - Выбор любимого языка
   - Мотивирующая цитата

## 🔌 Интеграция с Telegram Widget

В `src/components/LoginModal.tsx` используется официальный Telegram Login Widget.

Для полной интеграции:

1. Замените `YOUR_BOT_USERNAME` на ваш username бота
2. Обновите `auth_url` на вашу боевую ссылку

## 📱 Демо вход

Для тестирования без реального Telegram бота используется кнопка "Демо вход" которая создает тестового пользователя.

## 🛠️ Troubleshooting

### CORS ошибки
Убедитесь, что `ALLOWED_ORIGINS` в `config.py` содержит ваш фронтенд адрес

### Ошибка подключения к БД
- Проверьте, что MySQL запущен
- Проверьте учетные данные в `.env`
- Убедитесь, что база `texel_learning` существует

### Telegram токен невалидный
- Проверьте токен от BotFather
- Убедитесь, что это полный токен без пробелов

### JWT ошибки
- Проверьте `JWT_SECRET_KEY` совпадает на фронте и бэке
- Убедитесь, что время на сервере и клиенте синхронизировано

## 📚 Дополнительно

- GraphQL поддержка (опционально)
- Интеграция с платежами для Premium
- Социальные функции (友谊, команды и т.д.)
- Email подтверждение
- 2FA аутентификация

