import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { LessonContent } from '@/components/LessonContent';
import { EmbeddedAIChat } from '@/components/EmbeddedAIChat';
import { getTopicById } from '@/data/training-data';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrainingLesson = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const topic = topicId ? getTopicById(topicId) : undefined;

    if (!topic) {
        return (
            <div className="main-container min-h-screen">
                <ParticlesBackground />
                <div className="content-layer">
                    <Navigation />
                    <div className="container mx-auto px-4 py-20 text-center">
                        <h1 className="text-4xl font-bold text-gradient mb-4">
                            Тема не найдена
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            К сожалению, запрошенная тема обучения не существует.
                        </p>
                        <Link to="/training">
                            <Button className="gradient-primary glow-primary">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Вернуться к обучению
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container min-h-screen">
            <ParticlesBackground />

            <div className="content-layer">
                <Navigation />

                {/* LeetCode-style split view */}
                <div className="flex h-[calc(100vh-80px)] pt-20">
                    {/* Left side - Lesson Content */}
                    <div className="w-1/2 border-r border-primary/20 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-primary/20 flex-shrink-0">
                            <Link
                                to="/training"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mb-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Вернуться к темам
                            </Link>

                            <div className="flex items-center gap-3 mb-2">
                                <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center glow-primary">
                                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <h1 className="text-3xl font-bold text-gradient">
                                    {topic.title}
                                </h1>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <LessonContent content={topic.content} />
                        </div>
                    </div>

                    {/* Right side - AI Chat */}
                    <div className="w-1/2 flex flex-col">
                        <div className="h-full p-6">
                            <EmbeddedAIChat topicTitle={topic.title} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingLesson;
