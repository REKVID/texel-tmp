import { useQuery } from '@tanstack/react-query';
import { newsApi, NewsArticle } from '@/services/newsApi';

// Query keys для кэширования
export const newsQueryKeys = {
  news: (limit: number) => ['news', limit] as const,
  health: ['news', 'health'] as const,
} as const;

// Hook для получения новостей
export function useNews(limit: number = 6) {
  return useQuery({
    queryKey: newsQueryKeys.news(limit),
    queryFn: () => newsApi.getNews(limit),
    staleTime: 5 * 60 * 1000, // 5 минут кэш
    retry: 2,
  });
}

// Hook для проверки состояния news сервиса
export function useNewsHealth() {
  return useQuery({
    queryKey: newsQueryKeys.health,
    queryFn: () => newsApi.healthCheck(),
    refetchInterval: 60000, // Проверка каждую минуту
    retry: 1,
    retryDelay: 2000,
  });
}

