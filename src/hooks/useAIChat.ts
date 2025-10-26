import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiChatApi, ChatMessage, ChatResponse, ConversationHistory } from '@/services/aiChatApi';
import { toast } from '@/hooks/use-toast';

// Query keys для кэширования
export const aiChatQueryKeys = {
  conversation: (id: string) => ['ai-chat', 'conversation', id] as const,
  models: ['ai-chat', 'models'] as const,
  health: ['ai-chat', 'health'] as const,
} as const;

// Hook для отправки сообщения в ИИ чат
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatMessage) => aiChatApi.sendMessage(data),
    onSuccess: (response: ChatResponse, variables) => {
      // Инвалидируем кэш истории разговора
      queryClient.invalidateQueries({ 
        queryKey: aiChatQueryKeys.conversation(variables.conversation_id) 
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка чата",
        description: "Не удалось отправить сообщение. Попробуйте еще раз.",
        variant: "destructive",
      });
      console.error('AI chat message failed:', error);
    },
  });
}

// Hook для получения истории разговора
export function useConversationHistory(conversationId: string) {
  return useQuery({
    queryKey: aiChatQueryKeys.conversation(conversationId),
    queryFn: () => aiChatApi.getConversationHistory(conversationId),
    enabled: !!conversationId,
    staleTime: 30000, // 30 секунд кэш
    retry: 1,
  });
}

// Hook для создания новой беседы
export function useCreateConversation() {
  return useMutation({
    mutationFn: () => aiChatApi.createConversation(),
    onError: (error: Error) => {
      toast({
        title: "Ошибка создания беседы",
        description: "Не удалось создать новую беседу.",
        variant: "destructive",
      });
      console.error('Failed to create conversation:', error);
    },
  });
}

// Hook для очистки истории разговора
export function useClearConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => aiChatApi.clearConversation(conversationId),
    onSuccess: (_, conversationId) => {
      // Удаляем из кэша историю разговора
      queryClient.removeQueries({ 
        queryKey: aiChatQueryKeys.conversation(conversationId) 
      });
      
      toast({
        title: "История очищена",
        description: "История разговора успешно удалена.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка очистки",
        description: "Не удалось очистить историю разговора.",
        variant: "destructive",
      });
      console.error('Failed to clear conversation:', error);
    },
  });
}

// Hook для получения доступных моделей
export function useAvailableModels() {
  return useQuery({
    queryKey: aiChatQueryKeys.models,
    queryFn: () => aiChatApi.getAvailableModels(),
    staleTime: 10 * 60 * 1000, // 10 минут кэш
    retry: 2,
  });
}

// Hook для проверки состояния ИИ чат сервиса
export function useAIChatHealth() {
  return useQuery({
    queryKey: aiChatQueryKeys.health,
    queryFn: () => aiChatApi.healthCheck(),
    refetchInterval: 60000, // Проверка каждую минуту
    retry: false,
  });
}
