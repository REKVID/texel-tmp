// News API Service

const NEWS_API_URL = import.meta.env.VITE_NEWS_API_URL || 'http://localhost:8002';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  source: string;
  published_date: string | null;
  category: string;
  image?: string;
}

class NewsApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`News API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Получение последних новостей
  async getNews(limit: number = 6): Promise<NewsArticle[]> {
    return this.request<NewsArticle[]>(`/news?limit=${limit}`);
  }

  // Health check микросервиса
  async healthCheck(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health');
  }
}

// Export singleton instance
export const newsApi = new NewsApiClient(NEWS_API_URL);

