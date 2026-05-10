import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Send,
    Bot,
    User,
    Loader2,
    RotateCcw,
    Circle
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

interface EmbeddedAIChatProps {
    topicTitle?: string;
}

export const EmbeddedAIChat: React.FC<EmbeddedAIChatProps> = ({ topicTitle }) => {
    const [conversationId] = useState<string>('lesson-session-' + Date.now());
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: `Привет! Я ваш ИИ-помощник для изучения темы${topicTitle ? ` "${topicTitle}"` : ''}. Готов помочь разобраться в материале, ответить на вопросы или объяснить что-то простыми словами. Чем могу помочь?`,
            role: 'assistant',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

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

        const loadingMessage: Message = {
            id: `loading-${Date.now()}`,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isLoading: true,
        };
        setMessages(prev => [...prev, loadingMessage]);

        sendMessage.mutate(
            {
                message: messageContent,
                conversation_id: conversationId,
                temperature: 0.7,
            },
            {
                onSuccess: (response) => {
                    setMessages(prev =>
                        prev.filter(msg => msg.id !== loadingMessage.id).concat({
                            id: Date.now().toString(),
                            content: response.response,
                            role: 'assistant',
                            timestamp: new Date(),
                        })
                    );
                },
                onError: () => {
                    setMessages(prev =>
                        prev.filter(msg => msg.id !== loadingMessage.id).concat({
                            id: Date.now().toString(),
                            content: 'Извините, произошла ошибка при обращении к ИИ. Попробуйте позже.',
                            role: 'assistant',
                            timestamp: new Date(),
                        })
                    );
                },
            }
        );
    };

    const handleClearConversation = () => {
        setMessages([{
            id: '1',
            content: `Привет! Я ваш ИИ-помощник для изучения темы${topicTitle ? ` "${topicTitle}"` : ''}. Готов помочь разобраться в материале, ответить на вопросы или объяснить что-то простыми словами. Чем могу помочь?`,
            role: 'assistant',
            timestamp: new Date(),
        }]);
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

    return (
        <div className="h-full flex flex-col glass rounded-2xl border border-primary/20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20 flex-shrink-0">
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

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearConversation}
                    className="w-8 h-8 hover:bg-secondary/10"
                    title="Очистить разговор"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
            </div>

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
                                    "inline-block p-3 rounded-2xl max-w-[85%] text-sm",
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
            <div className="p-4 border-t border-primary/20 space-y-2 flex-shrink-0">
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
        </div>
    );
};
