// AI Chat API Service

const AI_CHAT_API_URL = import.meta.env.VITE_AI_CHAT_API_URL || 'http://localhost:8001';

export interface ChatMessage {
  message: string;
  conversation_id: string;
  temperature?: number;
}

export interface ChatResponse {
  response: string;
  model_used: string;
  tokens_used: number;
  conversation_id: string;
  timestamp: string;
}

export interface ConversationHistory {
  conversation_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

class AIChatApiClient {
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
      console.error(`AI Chat API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Отправка сообщения в чат
  async sendMessage(data: ChatMessage): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Получение истории разговора
  async getConversationHistory(conversationId: string): Promise<ConversationHistory> {
    return this.request<ConversationHistory>(`/conversations/${conversationId}`);
  }

  // Создание новой беседы
  async createConversation(): Promise<{ conversation_id: string }> {
    return this.request<{ conversation_id: string }>('/conversations', {
      method: 'POST',
    });
  }

  // Очистка истории разговора
  async clearConversation(conversationId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }

  // Получение доступных моделей
  async getAvailableModels(): Promise<Array<{ id: string; name: string; description: string }>> {
    return this.request<Array<{ id: string; name: string; description: string }>>('/models');
  }

  // Health check микросервиса
  async healthCheck(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health');
  }
}

// Export singleton instance
export const aiChatApi = new AIChatApiClient(AI_CHAT_API_URL);
