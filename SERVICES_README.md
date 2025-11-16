# Texel AI - Микросервисы

Проект состоит из фронтенда и двух микросервисов:

## Структура

```
texel-tmp/
├── src/                    # React фронтенд (Vite + TypeScript)
├── ai-chat-service/        # AI Chat микросервис (FastAPI, порт 8001)
└── news-service/           # News парсер микросервис (FastAPI, порт 8002)
```

## 🐳 Быстрый старт с Docker (рекомендуется)

```bash
# Запустить оба микросервиса
docker-compose up -d

# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f
```

**Готово!** Сервисы доступны:
- AI Chat: http://localhost:8001
- News: http://localhost:8002

Подробнее: см. [DOCKER_README.md](DOCKER_README.md)

---

## 📦 Локальный запуск (без Docker)

### 1. AI Chat Микросервис (порт 8001)

Чат с бесплатными моделями через OpenRouter API

```bash
cd ai-chat-service
chmod +x run.sh
./run.sh
```

**Доступно на:** http://localhost:8001

**API документация:** http://localhost:8001/docs

**Endpoints:**
- `GET /health` - Статус сервиса
- `GET /models` - Список доступных моделей
- `POST /chat` - Отправка сообщения
- `GET /conversations/{id}` - История разговора

**Модели:**
- DeepSeek R1T2 Chimera
- Kat Coder Pro  
- GLM-4.5 Air
- DeepSeek Chat v3
- Gemma 3 27B
- Llama 3.3 70B

### 2. News Микросервис (порт 8002)

Парсинг новостей о нейросетях с Яндекс.Дзен

```bash
cd news-service
chmod +x run.sh
./run.sh
```

**Доступно на:** http://localhost:8002

**API документация:** http://localhost:8002/docs

**Endpoints:**
- `GET /health` - Статус сервиса
- `GET /news?limit=6` - Получить новости

**Особенности:**
- Парсинг с dzen.ru
- Кэширование на 5 минут
- Fallback на статичные новости

### 3. Фронтенд (порт 8080)

React приложение с интеграцией микросервисов

```bash
npm install
npm run dev
```

**Доступно на:** http://localhost:8080

## Порядок запуска

### Вариант 1: Docker (проще)

```bash
# 1. Запустить микросервисы
docker-compose up -d

# 2. Запустить фронтенд
npm install
npm run dev

# 3. Открыть в браузере
http://localhost:8080
```

### Вариант 2: Локально

```bash
# Терминал 1 - AI Chat
cd ai-chat-service && ./run.sh

# Терминал 2 - News
cd news-service && ./run.sh

# Терминал 3 - Frontend
npm run dev

# Открыть в браузере
http://localhost:8080
```

## Функционал

### Страница "Обучение" (/training)
- Чат с AI моделями (правый нижний угол)
- Растягиваемый интерфейс чата
- Выбор из 6 бесплатных моделей
- Индикатор статуса микросервиса

### Главная страница (/)
- Секция "Новости" с актуальными новостями о нейросетях
- Автоматическое обновление каждые 5 минут
- Переход к полным статьям по клику

## Остановка сервисов

Нажмите `Ctrl+C` в каждом терминале где запущены сервисы.

## Решение проблем

### AI Chat не работает
- Проверьте что сервис запущен: http://localhost:8001/health
- Проверьте API ключ OpenRouter в `ai-chat-service/main.py`

### News не загружаются
- Проверьте что сервис запущен: http://localhost:8002/health
- Парсинг может не работать из-за изменений на сайте - в этом случае показываются статичные новости

### CORS ошибки
- Убедитесь что микросервисы запущены до фронтенда
- Проверьте что порты 8001 и 8002 не заняты другими приложениями

