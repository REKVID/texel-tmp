# Быстрый старт News микросервиса

## Установка и запуск

### Вариант 1: Через скрипт (рекомендуется)

```bash
cd news-service
chmod +x run.sh
./run.sh
```

### Вариант 2: Вручную

```bash
cd news-service

# Создать виртуальное окружение (опционально)
python3 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Запустить сервис
python main.py
# или
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

## Проверка работы

1. Откройте браузер: http://localhost:8002/docs - документация API
2. Проверьте health: http://localhost:8002/health
3. Получите новости: http://localhost:8002/news?limit=6

## API Endpoints

- `GET /health` - Проверка состояния сервиса
- `GET /news?limit=6` - Получить последние новости

## Особенности

- Парсит новости о нейросетях с Яндекс.Дзен
- Кэширование на 5 минут
- Fallback на статичные новости при ошибках
- CORS настроен для localhost

