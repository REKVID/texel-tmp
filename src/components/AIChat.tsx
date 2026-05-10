import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  RotateCcw,
  Circle,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSendMessage, useClearConversation, useAIChatHealth } from '@/hooks/useAIChat';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface AIChatProps {
  onWidthChange?: (width: number) => void;
}

export const AIChat = ({ onWidthChange }: AIChatProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<string>('training-session-' + Date.now());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я ваш ИИ-помощник для обучения. Готов помочь с вопросами по программированию, ИИ-технологиям и решению задач. О чём хотите узнать?',
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatWidth, setChatWidth] = useState(384); // 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // API hooks
  const sendMessage = useSendMessage();
  const clearConversation = useClearConversation();
  const { data: health, isLoading: healthLoading, isError: healthError } = useAIChatHealth();
  
  const isServiceHealthy = health?.status === 'healthy' && !healthError;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Уведомляем родителя о изменении ширины
  useEffect(() => {
    if (onWidthChange) {
      // Если чат открыт и не минимизирован, передаем ширину, иначе 0
      onWidthChange(isOpen && !isMinimized ? chatWidth : 0);
    }
  }, [chatWidth, onWidthChange, isOpen, isMinimized]);

  // Обработка изменения размера чата
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !chatRef.current) return;

      const newWidth = window.innerWidth - e.clientX - 24; // 24px для right-6
      const minWidth = 384; // минимум w-96
      const maxWidth = window.innerWidth - 200; // оставляем минимум 200px для контента

      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setChatWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sendMessage.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    const messageContent = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Добавляем индикатор загрузки
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    // Отправляем сообщение через API
    sendMessage.mutate(
      {
        message: messageContent,
        conversation_id: conversationId,
        temperature: 0.7,
      },
      {
        onSuccess: (response) => {
          // Убираем индикатор загрузки и добавляем ответ
          setMessages(prev => 
            prev.filter(msg => msg.id !== loadingMessage.id).concat({
              id: Date.now().toString(),
              content: response.response,
              role: 'assistant',
              timestamp: new Date(),
            })
          );
        },
        onError: (error) => {
          // Убираем индикатор загрузки и показываем ошибку
          setMessages(prev => 
            prev.filter(msg => msg.id !== loadingMessage.id).concat({
              id: Date.now().toString(),
              content: 'Извините, произошла ошибка при обращении к ИИ. Попробуйте позже или обратитесь к преподавателю.',
              role: 'assistant',
              timestamp: new Date(),
            })
          );
        },
      }
    );
  };

  const handleClearConversation = () => {
    // Очищаем локальные сообщения, оставляя только приветствие
    setMessages([{
      id: '1',
      content: 'Привет! Я ваш ИИ-помощник для обучения. Готов помочь с вопросами по программированию, ИИ-технологиям и решению задач. О чём хотите узнать?',
      role: 'assistant',
      timestamp: new Date(),
    }]);

    // Создаем новый ID разговора
    const newConversationId = 'training-session-' + Date.now();
    setConversationId(newConversationId);

    // Опционально очищаем на сервере (если нужно сохранять историю)
    clearConversation.mutate(conversationId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Floating chat button
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary glow-primary shadow-2xl z-50 group hover:scale-110 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </Button>
    );
  }

  return (
    <div 
      ref={chatRef}
      className={cn(
        "fixed right-6 z-50 transition-all ease-in-out",
        isMinimized ? "bottom-6 h-16" : "bottom-6 top-20",
        isResizing ? "transition-none" : "duration-300"
      )}
      style={{ 
        width: isMinimized ? '320px' : `${chatWidth}px`
      }}
    >
      {/* Resize Handle */}
      {!isMinimized && (
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            "absolute -left-1 top-0 bottom-0 w-3 cursor-ew-resize z-10 group flex items-center justify-center transition-colors",
            isResizing ? "bg-primary/30" : "hover:bg-primary/10"
          )}
          title="Перетащите, чтобы изменить размер"
        >
          <div className={cn(
            "w-1 h-16 rounded-full transition-all",
            isResizing 
              ? "bg-primary/80 scale-110" 
              : "bg-primary/30 group-hover:bg-primary/60 group-hover:scale-105"
          )}>
            <GripVertical className="w-4 h-4 text-primary/70 -ml-1.5 mt-6" />
          </div>
        </div>
      )}
      
      <div className="glass rounded-2xl border border-primary/20 shadow-2xl h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="gradient-primary w-8 h-8 rounded-full flex items-center justify-center glow-primary">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">ИИ Помощник</h3>
              <div className="flex items-center gap-1.5">
                <Circle 
                  className={cn(
                    "w-2 h-2",
                    healthLoading 
                      ? "text-yellow-500 fill-yellow-500 animate-pulse"
                      : isServiceHealthy
                        ? "text-green-500 fill-green-500" 
                        : "text-red-500 fill-red-500"
                  )} 
                />
                <p className={cn(
                  "text-xs",
                  healthLoading
                    ? "text-yellow-500"
                    : isServiceHealthy
                      ? "text-green-500" 
                      : "text-red-500"
                )}>
                  {healthLoading ? 'Проверка...' : isServiceHealthy ? 'Онлайн' : 'Оффлайн'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearConversation}
              className="w-8 h-8 hover:bg-secondary/10"
              title="Очистить разговор"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 hover:bg-primary/10"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 animate-fade-in",
                      message.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user' 
                        ? "bg-secondary/20" 
                        : "gradient-primary glow-primary"
                    )}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-secondary" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    
                    <div className={cn(
                      "flex-1 space-y-1",
                      message.role === 'user' ? "text-right" : "text-left"
                    )}>
                      <div className={cn(
                        "inline-block p-3 rounded-2xl max-w-[80%] text-sm",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "glass border border-primary/10"
                      )}>
                        {message.isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-muted-foreground">Печатает...</span>
                          </div>
                        ) : (
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                      </div>
                      <p className={cn(
                        "text-xs text-muted-foreground",
                        message.role === 'user' ? "text-right" : "text-left"
                      )}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-primary/20 space-y-3">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Задайте вопрос..."
                  className="glass border-primary/20 flex-1"
                  disabled={sendMessage.isPending || !isServiceHealthy}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || sendMessage.isPending || !isServiceHealthy}
                  className="gradient-primary glow-primary px-3"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Powered by OpenRouter API • Texel AI
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
