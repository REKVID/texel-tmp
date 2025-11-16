# News Microservice

Простой микросервис для парсинга новостей о нейросетях с Яндекс.Дзен.

## Установка

```bash
cd news-service
pip install -r requirements.txt
```

## Запуск

```bash
chmod +x run.sh
./run.sh
```

Или вручную:

```bash
python main.py
```

Сервис будет доступен на `http://localhost:8002`

## API Endpoints

- `GET /health` - Проверка состояния сервиса
- `GET /news?limit=6` - Получить последние новости

## Особенности

- Кэширование новостей на 5 минут
- Фоллбэк на статичные новости при ошибках парсинга
- CORS настроен для работы с фронтендом

