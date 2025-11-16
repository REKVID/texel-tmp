from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import httpx
from bs4 import BeautifulSoup
from datetime import datetime
import re
import random

app = FastAPI(title="News Microservice", version="1.0.0")

# Монтируем статические файлы
app.mount("/images", StaticFiles(directory="img"), name="images")

# CORS настройка
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URL для парсинга новостей о нейросетях
DZEN_NEWS_URL = "https://dzen.ru/news/search?query=%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D0%B5%D1%82%D0%B8&type_filter=news"


class NewsArticle(BaseModel):
    id: str
    title: str
    excerpt: str
    url: str
    source: str
    published_date: Optional[str] = None
    category: str = "Нейросети"
    image: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str


# Кэш для новостей (чтобы не парсить каждый раз)
news_cache = {
    "data": [],
    "updated_at": None,
    "cache_duration": 300,  # 5 минут
}


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Проверка состояния микросервиса"""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/news", response_model=List[NewsArticle])
async def get_news(limit: int = 6):
    """Получить последние новости о нейросетях"""

    # Проверяем кэш
    if news_cache["data"] and news_cache["updated_at"]:
        time_diff = (datetime.now() - news_cache["updated_at"]).seconds
        if time_diff < news_cache["cache_duration"]:
            return news_cache["data"][:limit]

    try:
        # Парсим новости
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            response = await client.get(DZEN_NEWS_URL, headers=headers)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            articles = []

            # Ищем блоки с новостями (структура может меняться)
            news_items = soup.find_all("article", limit=20) or soup.find_all(
                "div", class_=re.compile("news|article|story"), limit=20
            )

            for idx, item in enumerate(news_items[:limit]):
                try:
                    # Извлекаем заголовок
                    title_elem = item.find(
                        ["h2", "h3", "a"], class_=re.compile("title|headline")
                    )
                    if not title_elem:
                        title_elem = item.find("a")

                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)

                    # Извлекаем ссылку
                    link_elem = title_elem if title_elem.name == "a" else item.find("a")
                    url = link_elem.get("href", "") if link_elem else ""

                    if url and not url.startswith("http"):
                        url = "https://dzen.ru" + url

                    if not url or not title:
                        continue

                    # Извлекаем описание
                    excerpt_elem = item.find(
                        ["p", "div"],
                        class_=re.compile("excerpt|description|text|snippet"),
                    )
                    excerpt = (
                        excerpt_elem.get_text(strip=True)[:200]
                        if excerpt_elem
                        else title[:150] + "..."
                    )

                    # Извлекаем источник
                    source_elem = item.find(
                        ["span", "div"], class_=re.compile("source|author|publisher")
                    )
                    source = (
                        source_elem.get_text(strip=True)
                        if source_elem
                        else "Яндекс.Дзен"
                    )

                    # Извлекаем дату
                    date_elem = item.find(
                        ["time", "span"], class_=re.compile("date|time|published")
                    )
                    published_date = (
                        date_elem.get_text(strip=True) if date_elem else None
                    )

                    article = NewsArticle(
                        id=f"news-{idx}-{hash(url) % 100000}",
                        title=title,
                        excerpt=excerpt,
                        url=url,
                        source=source,
                        published_date=published_date,
                        category="Нейросети",
                    )

                    articles.append(article)

                except Exception as e:
                    print(f"Ошибка парсинга элемента: {e}")
                    continue

            # Если не удалось спарсить, возвращаем фейковые данные
            if not articles:
                articles = get_fallback_news()

            # Обновляем кэш
            news_cache["data"] = articles
            news_cache["updated_at"] = datetime.now()

            return articles[:limit]

    except Exception as e:
        print(f"Ошибка при парсинге новостей: {e}")
        # В случае ошибки возвращаем фейковые данные
        return get_fallback_news()[:limit]


def get_fallback_news() -> List[NewsArticle]:
    """Фейковые новости на случай проблем с парсингом"""
    # Список доступных изображений
    images = [
        "http://localhost:8002/images/pexels-andrew-15863000.jpg",
        "http://localhost:8002/images/pexels-googledeepmind-25630342.jpg",
        "http://localhost:8002/images/pexels-googledeepmind-18069694.jpg",
        "http://localhost:8002/images/pexels-beyzaa-yurtkuran-279977530-16245254.jpg",
        "http://localhost:8002/images/pexels-googledeepmind-18069693.jpg",
        "http://localhost:8002/images/pexels-pavel-danilyuk-8438865.jpg",
        "http://localhost:8002/images/pexels-pixabay-276452.jpg",
    ]

    # Перемешиваем для рандомности
    random.shuffle(images)

    return [
        NewsArticle(
            id="fallback-1",
            title="Новые возможности нейросетей в 2024 году",
            excerpt="Последние достижения в области искусственного интеллекта открывают новые горизонты...",
            url="https://dzen.ru/news/search?query=нейросети&type_filter=news",
            source="Яндекс.Дзен",
            published_date="Сегодня",
            category="Нейросети",
            image=images[0],
        ),
        NewsArticle(
            id="fallback-2",
            title="ChatGPT и другие языковые модели: что изменилось",
            excerpt="Обзор последних обновлений популярных AI-инструментов и их применение в бизнесе...",
            url="https://dzen.ru/news/search?query=нейросети&type_filter=news",
            source="Яндекс.Дзен",
            published_date="Вчера",
            category="Нейросети",
            image=images[1],
        ),
        NewsArticle(
            id="fallback-3",
            title="Как нейросети меняют индустрию разработки",
            excerpt="Искусственный интеллект становится незаменимым помощником программистов...",
            url="https://dzen.ru/news/search?query=нейросети&type_filter=news",
            source="Яндекс.Дзен",
            published_date="2 дня назад",
            category="Нейросети",
            image=images[2],
        ),
        NewsArticle(
            id="fallback-4",
            title="Безопасность AI: новые вызовы и решения",
            excerpt="Эксперты обсуждают риски и меры защиты при работе с нейросетями...",
            url="https://dzen.ru/news/search?query=нейросети&type_filter=news",
            source="Яндекс.Дзен",
            published_date="3 дня назад",
            category="Нейросети",
            image=images[3],
        ),
        NewsArticle(
            id="fallback-5",
            title="Обучение нейросетей: новые методы",
            excerpt="Исследователи представили более эффективные подходы к обучению AI-моделей...",
            url="https://dzen.ru/news/search?query=нейросети&type_filter=news",
            source="Яндекс.Дзен",
            published_date="4 дня назад",
            category="Нейросети",
            image=images[4],
        ),
        NewsArticle(
            id="fallback-6",
            title="Будущее искусственного интеллекта",
            excerpt="Прогнозы экспертов о развитии AI-технологий в ближайшие годы...",
            url="https://dzen.ru/news/search?query=нейросети&type_filter=news",
            source="Яндекс.Дзен",
            published_date="5 дней назад",
            category="Нейросети",
            image=images[5],
        ),
    ]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8002)
