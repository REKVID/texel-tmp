# Быстрый старт AI Chat микросервиса

## Установка и запуск

### Вариант 1: Через скрипт (рекомендуется)

```bash
cd ai-chat-service
./run.sh
```

### Вариант 2: Вручную

```bash
cd ai-chat-service

# Создать виртуальное окружение (опционально)
python3 -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate

# Установить зависимости
pip install -r requirements.txt

# Запустить сервис
python main.py
# или
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## Проверка работы

1. Откройте браузер: http://localhost:8001/docs - документация API
2. Проверьте health: http://localhost:8001/health
3. Откройте сайт и перейдите на страницу "Обучение"
4. Нажмите на кнопку чата в правом нижнем углу

## Настройка

API ключ OpenRouter уже встроен в код. Если нужно изменить:

```bash
export OPENROUTER_API_KEY="ваш-ключ"
python main.py
```

Или отредактируйте `main.py` и измените значение `OPENROUTER_API_KEY`.

