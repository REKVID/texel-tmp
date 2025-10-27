/* src/hooks/useAIChat.ts
 * React Query hooks for AI Chat microservice
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { aiChatApi, ChatMessage, ChatResponse, ConversationHistory, ServiceStats } from '@/services/aiChatApi';

export type Role = 'user' | 'assistant' | 'system';

// Health check
export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => aiChatApi.health(),
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
}

// Get available models
export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: () => aiChatApi.getModels(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Get service stats
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => aiChatApi.getStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Create conversation
export function useCreateConversation() {
  return useMutation({
    mutationFn: () => aiChatApi.createConversation(),
  });
}

// Get conversation history
export function useConversationHistory(conversationId?: string) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => conversationId ? aiChatApi.getConversation(conversationId) : Promise.reject('No conversation ID'),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
}

// Clear conversation
export function useClearConversation() {
  return useMutation({
    mutationFn: (conversationId: string) => aiChatApi.clearConversation(conversationId),
  });
}

// Send message to chat
export function useSendMessage() {
  return useMutation({
    mutationFn: (payload: ChatMessage) => {
      console.log('[Hook] Sending message...');
      return aiChatApi.sendMessage(payload);
    },
    retry: 1,
  });
}
