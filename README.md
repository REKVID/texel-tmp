# Texel AI Forge

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
│   │   └── NotFound.tsx             # 404 страница
│   │
│   ├── assets/                      # Изображения и медиафайлы
│   │   ├── ai-brain.jpg             # Изображение AI мозга
│   │   ├── code-hologram.jpg        # Изображение голограммы кода
│   │   └── hero-ai.jpg              # Главное изображение
│   │
│   ├── hooks/                       # Кастомные React хуки
│   │   ├── use-mobile.tsx           # Хук определения мобильного устройства
│   │   └── use-toast.ts             # Хук для уведомлений
│   │
│   ├── lib/                         # Утилиты и конфигурация
│   │   └── utils.ts                 # Общие утилиты (cn функция для классов)
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
└── package.json                     # Зависимости и скрипты проекта
```




