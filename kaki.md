# Texel AI — функции системы

Учебная AI-платформа на стеке **React + FastAPI + Express + SQLite + Docker**. Ниже перечислены все ключевые функции системы и краткие описания.

---

## 1. Авторизация и пользователи

| Функция | Описание |
|---|---|
| **Регистрация** | Создание аккаунта по логину, email, имени и паролю. Пароль хэшируется через `bcrypt` (12 раундов). Эндпоинт `POST /api/auth/register`. |
| **Вход** | Авторизация по логину **или** email + пароль. Эндпоинт `POST /api/auth/login`. |
| **Сессии (cookie)** | Сервер создаёт сессию (`texel_session`, httpOnly, sameSite=lax), срок жизни — 30 дней. Хранится в таблице `sessions`. |
| **Получение текущего пользователя** | `GET /api/auth/me` — возвращает данные авторизованного пользователя по сессионной cookie. |
| **Выход** | `POST /api/auth/logout` — удаляет сессию из БД и сбрасывает cookie. |
| **Обновление профиля** | `PATCH /api/auth/me` — изменение имени и email текущего пользователя. |
| **Диалоги Login / Register** | UI-модалки ([LoginDialog](src/components/LoginDialog.tsx), [RegisterDialog](src/components/RegisterDialog.tsx)), управляются через `AuthContext`. |
| **AuthContext (React)** | Глобальное состояние пользователя на фронте: [AuthContext.tsx](src/contexts/AuthContext.tsx) — `user`, `loading`, `login`, `register`, `logout`, `updateUser`, открытие модалок. |
| **Валидация ввода** | Серверная схема `zod` (минимум 6 символов в пароле, валидный email, длина имени и логина). |

---

## 2. Роли и права доступа

| Роль | Возможности |
|---|---|
| **user** | Стандартный учащийся: проходит уроки, тесты, видит свой прогресс и профиль. |
| **admin** | Полный доступ к **админ-панели** (`/admin`): просмотр, редактирование и удаление пользователей. |

**Реализация:**
- Поле `role` в таблице `users` (значение по умолчанию — `user`).
- Серверный guard `requireAdmin()` в [server/index.js](server/index.js) — отдаёт `403`, если роль не `admin`.
- Клиентский guard в [Admin.tsx](src/pages/Admin.tsx) — редирект на `/`, если пользователь не админ.
- Защита от самоудаления: админ не может удалить свой собственный аккаунт.

---

## 3. Темы и внешний вид

| Функция | Описание |
|---|---|
| **Тема оформления** | Выбор: `Тёмная` / `Светлая` / `Системная`. Реализовано в [Settings.tsx](src/pages/Settings.tsx). |
| **Язык интерфейса** | Переключатель: `Русский` / `English`. |
| **Хранение настроек** | Сохраняются в `localStorage` под ключом `texel_settings`. |
| **Стилизация** | TailwindCSS + кастомные классы `glass-card`, `gradient-primary`, `text-gradient`, `glow-primary`, эффект частиц [ParticlesBackground](src/components/ParticlesBackground.tsx). |
| **UI-кит** | Набор shadcn/ui компонентов в [src/components/ui/](src/components/ui/) (Button, Card, Dialog, Select, Switch, Table, Toast и др.). |

---

## 4. Встроенная IDE — Vibe Coding

Страница [/vibe-coding](src/pages/VibeCoding.tsx) — браузерная среда разработки с двумя языками.

| Функция | Описание |
|---|---|
| **Monaco Editor** | Полноценный редактор кода (тот же движок, что у VS Code). Загружается с CDN, тема `vs-dark`, подсветка синтаксиса, авто-layout. |
| **Fallback редактор** | Если Monaco не загрузился — переключение на обычный `<textarea>`. |
| **Режим HTML / JS / CSS** | Код запускается в **sandbox iframe** (`sandbox="allow-scripts"`). Предзагружены **p5.js** и **three.js** через CDN. |
| **Режим Python (Pyodide)** | Python исполняется прямо в браузере через WebAssembly. Поддержка `numpy`, `pandas`, `matplotlib` (бэкенд `agg`, графики рендерятся в PNG и встраиваются в превью). |
| **Запуск кода** | Кнопка `Run`, индикатор статуса (`Готово` / `Запуск...` / `Ошибка`). |
| **Превью результата** | Правая панель — iframe с песочницей; для Python отображает stdout/stderr + последнюю фигуру matplotlib. |
| **Плавающий AI-чат** | Кнопка снизу справа — открывает того же ИИ-ассистента, что и на других страницах. |

---


## 9. Профиль и настройки

| Функция | Описание |
|---|---|
| **/profile** | [Profile.tsx](src/pages/Profile.tsx) — аватар-инициал, имя, логин, email, бейдж роли, прогресс-бар, форма редактирования. |
| **/settings** | [Settings.tsx](src/pages/Settings.tsx) — тема, язык, уведомления, автопереход между уроками. |
| **Уведомления** | Toast-сообщения через `@/components/ui/toaster` и `sonner`. |

---

## 10. Админ-панель

[/admin](src/pages/Admin.tsx) — доступно только пользователям с ролью `admin`.

| Функция | Эндпоинт | Описание |
|---|---|---|
| Список пользователей | `GET /api/admin/users` | Таблица всех зарегистрированных учётных записей. |
| Редактирование | `PATCH /api/admin/users/:id` | Изменение имени, роли (`user`/`admin`), прогресса (0–100). |
| Удаление | `DELETE /api/admin/users/:id` | Подтверждение через `window.confirm`. Нельзя удалить самого себя. |

---

## 11. База данных (SQLite)

Файл [server/storage.js](server/storage.js). Таблицы:

| Таблица | Поля |
|---|---|
| `users` | `id, username (UNIQUE), email (UNIQUE), password_hash, name, role, progress, created_at` |
| `sessions` | `session_id, user_id, created_at, expires_at` |
| `test_results` | `user_id, topic_id, score, total, percentage, updated_at` (UNIQUE по `user_id + topic_id`) |

---

---

## 13. Безопасность

- Пароли хэшируются `bcrypt` с фактором 12.
- Сессии в httpOnly-cookies (защита от XSS-кражи).
- `sameSite=lax` — защита от базовой CSRF.
- Все админ-эндпоинты защищены guard'ом `requireAdmin`.
- Валидация ввода через `zod` на сервере.
- iframe-песочница для Vibe Coding (`sandbox="allow-scripts"`).
- Запрет на самоудаление администратора.
