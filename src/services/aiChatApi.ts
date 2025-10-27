/* src/services/aiChatApi.ts
 * AI Chat API client with proper error handling and CORS support
 */

export interface ChatMessage {
  message: string;
  conversation_id: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  response: string;
  model_used: string;
  tokens_used: number;
  conversation_id: string;
  timestamp: string;
  response_time_ms: number;
}

export interface ConversationHistory {
  conversation_id: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  messages_count: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface ServiceStats {
  total_conversations: number;
  total_messages: number;
  active_conversations: number;
  openrouter_configured: boolean;
  timestamp: string;
}

// Get API URL from environment or use default
const API_URL = (import.meta.env.VITE_AI_CHAT_API_URL || "http://localhost:8001").replace(/\/+$/, "");

console.log("AI Chat API URL:", API_URL);

async function fetchJSON<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  
  console.log(`[API] ${options.method || "GET"} ${url}`);
  
  const config: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status}`;
      try {
        const errorData = await response.json() as Record<string, any>;
        if (errorData?.detail) {
          errorDetail = String(errorData.detail);
        }
      } catch {
        try {
          errorDetail = await response.text();
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorDetail);
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`[API] Error: ${error}`);
    throw error;
  }
}

export const aiChatApi = {
  health: () => fetchJSON<{ status: string; version: string }>("/health"),
  
  getModels: () => 
    fetchJSON<Array<{ id: string; name: string; description: string; provider?: string }>>("/models"),
  
  getStats: () => fetchJSON<ServiceStats>("/stats"),
  
  createConversation: () => 
    fetchJSON<{ conversation_id: string }>("/conversations", { method: "POST" }),
  
  getConversation: (conversationId: string) => 
    fetchJSON<ConversationHistory>(`/conversations/${conversationId}`),
  
  clearConversation: (conversationId: string) => 
    fetchJSON<{ success: boolean; message: string }>(`/conversations/${conversationId}`, { method: "DELETE" }),
  
  sendMessage: (payload: ChatMessage) => {
    console.log("[API] Sending message:", payload);
    return fetchJSON<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
