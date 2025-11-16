# Texel AI

Платформа для обучения работе с искусственным интеллектом.


https://github.com/user-attachments/assets/5c29d40a-b663-4b36-bea2-bcae134290c1




## 🚀 Быстрый старт

### С Docker (рекомендуется)

```bash
# Запустить микросервисы
./docker-start.sh

# Запустить фронтенд
npm install
npm run dev
```

Откройте http://localhost:8080

### Без Docker

```bash
# Терминал 1 - AI Chat
cd ai-chat-service && ./run.sh

# Терминал 2 - News
cd news-service && ./run.sh

# Терминал 3 - Frontend
npm run dev
```

## 📦 Структура проекта

```
texel-tmp/
├── src/                # React фронтенд
├── ai-chat-service/    # FastAPI чат с AI моделями (порт 8001)
├── news-service/       # FastAPI парсер новостей (порт 8002)
├── docker-compose.yml  # Docker конфигурация
└── docker-start.sh     # Скрипт запуска
```

## 🎯 Возможности

- 💬 **AI Chat** - Чат с 6 бесплатными моделями через OpenRouter
- 📰 **News Feed** - Новости о нейросетях с изображениями
- 🎨 **Resizable Chat** - Растягиваемый интерфейс чата
- 🔄 **Microservices** - Независимые Docker-контейнеры
- ⚡ **Real-time** - Индикаторы статуса сервисов

## 📚 Документация

- [SERVICES_README.md](SERVICES_README.md) - Подробное описание всех сервисов
- [DOCKER_README.md](DOCKER_README.md) - Docker команды и troubleshooting
- [ai-chat-service/README.md](ai-chat-service/README.md) - AI Chat API
- [news-service/README.md](news-service/README.md) - News API

## Texel AI Forge

Веб-сайт центра ИИ-инноваций на базе Texel.

## Стек

- **Frontend Framework**: React 18.3.1 + TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19 
- **Styling**: TailwindCSS 3.4.17 + PostCSS
- **UI Components**: ShadCN/UI (Radix UI primitives)
- **Routing**: React Router DOM 6.30.1
- **State Management**: TanStack Query 5.83.0
- **Animations**: particles.js 2.0.0
- **Icons**: Lucide React 0.462.0
- **Forms**: React Hook Form 7.61.1 + Zod validation
- **Linting**: ESLint 9.32.0 + TypeScript ESLint

## Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера (http://localhost:8080)
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен сборки
npm run preview

# Линтинг кода
npm run lint
```

## 🤖 ИИ Чат Микросервис

Проект включает **отдельный независимый** микросервис для ИИ чата через OpenRouter API.

### Быстрый запуск микросервиса:

```bash
# Переход в папку микросервиса
cd ai-chat-microservice

# Установка зависимостей
pip install -r requirements.txt

# Копирование конфигурации
cp env.example .env
# Отредактируйте .env и добавьте ваш OPENROUTER_API_KEY

# Запуск микросервиса (http://localhost:8001)
python run.py
```

📖 **Подробная инструкция:** [ai-chat-microservice/README.md](ai-chat-microservice/README.md)  
🏗️ **Архитектура микросервиса:** [AI_CHAT_MICROSERVICE.md](AI_CHAT_MICROSERVICE.md)

## Файловая архитектура

```
texel-ai-forge/
├── public/                          # Статические файлы
│   ├── favicon.ico                  # Иконка сайта
│   ├── particles.js                 # Particles.js библиотека
│   ├── placeholder.svg              # Заглушка изображений
│   └── robots.txt                   # SEO конфигурация
│
├── src/                             # Исходный код приложения
│   ├── components/                  # React компоненты
│   │   ├── ui/                      # ShadCN/UI компоненты
│   │   │   ├── button.tsx           # Кнопки
│   │   │   ├── card.tsx             # Карточки
│   │   │   ├── dialog.tsx           # Модальные окна
│   │   │   ├── form.tsx             # Формы
│   │   │   ├── navigation-menu.tsx  # Навигационное меню
│   │   │   └── ...                  # Остальные UI компоненты
│   │   ├── About.tsx                # Секция "О проекте"
│   │   ├── AIChat.tsx               # ⭐ ИИ Чат компонент
│   │   ├── Benefits.tsx             # Секция "Преимущества"
│   │   ├── CTA.tsx                  # Call-to-Action секция
│   │   ├── Footer.tsx               # Подвал сайта
│   │   ├── Hero.tsx                 # Главная секция
│   │   ├── Navigation.tsx           # Навигационная панель
│   │   ├── News.tsx                 # Секция новостей
│   │   ├── ParticlesBackground.tsx  # Particles.js фон
│   │   └── Program.tsx              # Секция программы обучения
│   │
│   ├── pages/                       # Страницы приложения
│   │   ├── Index.tsx                # Главная страница
│   │   ├── Training.tsx             # ⭐ Страница обучения
│   │   └── NotFound.tsx             # 404 страница
│   │
│   ├── assets/                      # Изображения и медиафайлы
│   │   ├── ai-brain.jpg             # Изображение AI мозга
│   │   ├── code-hologram.jpg        # Изображение голограммы кода
│   │   └── hero-ai.jpg              # Главное изображение
│   │
│   ├── hooks/                       # Кастомные React хуки
│   │   ├── use-mobile.tsx           # Хук определения мобильного устройства
│   │   ├── use-toast.ts             # Хук для уведомлений  
│   │   └── useAIChat.ts             # ⭐ Хуки для ИИ чата
│   │
│   ├── lib/                         # Утилиты и конфигурация
│   │   └── utils.ts                 # Общие утилиты (cn функция для классов)
│   │
│   ├── services/                    # ⭐ API сервисы
│   │   └── aiChatApi.ts             # API клиент для ИИ чата
│   │
│   ├── App.tsx                      # Корневой компонент приложения
│   ├── main.tsx                     # Точка входа в приложение
│   ├── index.css                    # Глобальные стили и TailwindCSS
│   └── vite-env.d.ts                # TypeScript декларации для Vite
│
├── components.json                  # Конфигурация ShadCN/UI
├── eslint.config.js                 # Конфигурация ESLint
├── postcss.config.js                # Конфигурация PostCSS
├── tailwind.config.ts               # Конфигурация TailwindCSS
├── tsconfig.json                    # Конфигурация TypeScript
├── tsconfig.app.json                # TypeScript конфигурация для приложения
├── tsconfig.node.json               # TypeScript конфигурация для Node.js
├── vite.config.ts                   # Конфигурация Vite
├── package.json                     # Зависимости и скрипты проекта
├── ai-chat-microservice/            # ⭐ Независимый ИИ микросервис
│   ├── app/                         # Исходный код микросервиса
│   │   ├── __init__.py
│   │   └── main.py                  # FastAPI приложение
│   ├── requirements.txt             # Python зависимости  
│   ├── README.md                    # Документация микросервиса
│   ├── Dockerfile                   # Docker образ
│   ├── docker-compose.yml          # Docker Compose
│   ├── run.py                       # Скрипт быстрого запуска
│   └── env.example                  # Пример конфигурации
├── AI_CHAT_MICROSERVICE.md         # ⭐ Архитектура микросервиса  
└── QUICK_START.md                   # ⭐ Быстрый старт с ИИ чатом
```



### AIChat.tsx ⭐
Интегрированный ИИ чат для обучения:
- Разворачивающееся окно справа внизу экрана
- Интеграция с OpenRouter API через микросервис
- Системные промпты для обучающего ассистента
- Управление историей разговоров
- Анимации загрузки и отправки сообщений

### Training.tsx ⭐
Страница программы обучения:
- Детальная программа обучения ИИ-технологиям (16 недель, 6 модулей)
- Тот же particles.js фон как на главной странице
- Интегрированный ИИ чат для вопросов по обучению

### Navigation.tsx
Адаптивная навигационная панель:
- Мобильное меню
- Dropdown для пользователя
- Glass эффект с размытием

