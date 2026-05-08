# Texel AI — Документация

## Быстрый старт

```bash
# Скопировать и заполнить ключ OpenRouter (опционально)
cp .env.example .env

# Запустить все сервисы
docker compose up --build
```

Приложение доступно на **http://localhost**

---

## Сервисы

| Сервис | Внутренний порт | Путь через nginx |
|---|---|---|
| Frontend (React) | 80 | `/` |
| Backend (Node + SQLite) | 3001 | `/api/` |
| AI Chat (FastAPI) | 8001 | `/ai-chat/` |
| News (Node + RSS) | 8002 | `/news-api/` |

---

## Регистрация и вход

1. Нажать **Регистрация** в навигации
2. Заполнить: логин, email, имя, пароль
3. После входа доступны: Обучение, Vibe Coding, AI-чат, Профиль, Настройки

---

## Страницы

- **`/`** — главная: герой, новости, возможности
- **`/training`** — список тем для обучения
- **`/training/:id`** — урок с теорией
- **`/training/:id/test`** — тест по теме
- **`/vibe-coding`** — Python-песочница + AI-чат
- **`/profile`** — просмотр и редактирование профиля
- **`/settings`** — настройки интерфейса (тема, язык, уведомления)
- **`/admin`** — панель администратора (только для роли `admin`)

---

## Доступ к админ-панели

Вариант 1 — через SQLite напрямую:
```bash
docker exec -it texel-backend sqlite3 /app/data/db.sqlite3 \
  "UPDATE users SET role='admin' WHERE username='ВАШ_ЛОГИН';"
```

Вариант 2 — через API (если у вас уже есть admin-аккаунт):
```bash
curl -X PATCH http://localhost/api/admin/users/<ID> \
  -H "Content-Type: application/json" \
  -b "session=..." \
  -d '{"role":"admin"}'
```

После этого в меню пользователя появится ссылка **Админ-панель** (`/admin`).

В панели можно: смотреть список пользователей, менять имя/email/роль, удалять аккаунты.

---

## AI-чат

Требует ключ OpenRouter. Добавьте в `.env`:
```
OPENROUTER_API_KEY=sk-or-v1-...
```
Бесплатные модели доступны без баланса. Получить ключ: https://openrouter.ai/keys

---

## Данные

SQLite-база хранится в Docker-volume `texel-sqlite-data` и сохраняется между перезапусками.

Удалить данные полностью:
```bash
docker compose down -v
```
