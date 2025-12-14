import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { AIChat } from "@/components/AIChat";
import { getTestByTopicId, TestQuestion } from "@/data/test-data";
import { getTopicById } from "@/data/training-data";
import { ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrainingTest = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [chatWidth, setChatWidth] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const topic = topicId ? getTopicById(topicId) : undefined;
    const test = topicId ? getTestByTopicId(topicId) : undefined;

    // Redirect if topic or test not found
    useEffect(() => {
        if (!topic || !test) {
            // navigate("/training"); // Create infinite loop if something is wrong, better just show error
        }
    }, [topic, test, navigate]);

    if (!topic || !test) {
        return (
            <div className="main-container min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Тест не найден</h1>
                    <Link to="/training" className="text-primary hover:underline">Вернуться к обучению</Link>
                </div>
            </div>
        );
    }

    const contentMarginRight = chatWidth > 0 ? chatWidth + 24 : 0;

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const calculateScore = () => {
        let correctCount = 0;
        test.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const handleSubmit = () => {
        // Ensure all questions are answered? Optional.
        // For now, let's allow submitting even if partially answered (treated as wrong)
        setIsSubmitted(true);
    };

    const score = calculateScore();
    const totalQuestions = test.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Ring chart calculation
    // solved (green), unsolved/wrong (red/gray)
    // Actually user said "solved and unsolved". 'Unsolved' usually implies skipped, but in test context usually 'Correct' vs 'Incorrect'.
    // "решенные и нерешенные" -> Solved (Correct) and Unsolved (Incorrect/Skipped).
    // Let's use Green for Correct, Red for Incorrect.

    const correctDeg = (score / totalQuestions) * 360;

    return (
        <div className="main-container min-h-screen">
            <ParticlesBackground />

            <div
                className="content-layer transition-[margin] duration-200"
                style={{ marginRight: `${contentMarginRight}px` }}
            >
                <Navigation />

                <section className="pt-24 pb-16 px-4">
                    <div className="container mx-auto max-w-4xl">
                        {/* Header */}
                        <div className="mb-8">
                            <Link to="/training" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Вернуться к обучению
                            </Link>
                            <h1 className="text-3xl font-bold text-gradient mb-2">Тест: {topic.title}</h1>
                            <p className="text-muted-foreground">Проверьте свои знания по теме</p>
                        </div>

                        {/* Result View */}
                        {isSubmitted ? (
                            <div className="glass p-8 rounded-3xl border border-primary/20 animate-fade-in mb-8 flex flex-col items-center">
                                <h2 className="text-2xl font-bold mb-8">Результаты тестирования</h2>

                                <div className="relative w-48 h-48 mb-6">
                                    {/* CSS Conic Gradient Ring */}
                                    <div
                                        className="w-full h-full rounded-full"
                                        style={{
                                            background: `conic-gradient(#22c55e ${correctDeg}deg, #ef4444 ${correctDeg}deg 360deg)`
                                        }}
                                    >
                                        <div className="absolute inset-4 bg-background/90 rounded-full flex flex-col items-center justify-center">
                                            <span className="text-4xl font-bold">{score}/{totalQuestions}</span>
                                            <span className="text-sm text-muted-foreground">Правильно</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xl font-medium mb-6">
                                    Оценка: {percentage >= 80 ? 'Отлично! 🏆' : percentage >= 50 ? 'Хорошо 👍' : 'Нужно еще подучить 📚'}
                                </div>

                                <div className="flex gap-4">
                                    <Button onClick={() => { setIsSubmitted(false); setAnswers({}); }} variant="outline">
                                        Пройти заново
                                    </Button>
                                    <Link to="/training">
                                        <Button>Вернуться к обучению</Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {test.questions.map((q, idx) => (
                                    <div key={q.id} className="glass p-6 rounded-2xl border border-primary/10">
                                        <h3 className="text-lg font-medium mb-4 flex">
                                            <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                                            {q.question}
                                        </h3>
                                        <div className="space-y-3">
                                            {q.options.map((opt, optIdx) => (
                                                <div
                                                    key={optIdx}
                                                    onClick={() => handleOptionSelect(q.id, optIdx)}
                                                    className={`
                                                        p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center
                                                        ${answers[q.id] === optIdx
                                                            ? 'border-primary bg-primary/10 text-primary-foreground'
                                                            : 'border-border hover:border-primary/50 hover:bg-white/5'
                                                        }
                                                    `}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${answers[q.id] === optIdx ? 'border-primary' : 'border-muted-foreground'}`}>
                                                        {answers[q.id] === optIdx && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                    </div>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={handleSubmit}
                                        size="lg"
                                        className="px-8"
                                        disabled={Object.keys(answers).length < test.questions.length}
                                    >
                                        Завершить тест
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Show answers review after submission */}
                        {isSubmitted && (
                            <div className="mt-12 space-y-6">
                                <h3 className="text-xl font-bold mb-4">Разбор ответов</h3>
                                {test.questions.map((q, idx) => {
                                    const userAnswer = answers[q.id];
                                    const isCorrect = userAnswer === q.correctAnswer;

                                    return (
                                        <div key={q.id} className={`glass p-6 rounded-2xl border ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
                                            <h4 className="font-medium mb-3 flex items-start gap-2">
                                                {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                                                {q.question}
                                            </h4>

                                            <div className="pl-7 space-y-2 text-sm">
                                                <p className="text-muted-foreground">
                                                    Ваш ответ: <span className={isCorrect ? 'text-green-500' : 'text-red-500'}>{q.options[userAnswer]}</span>
                                                </p>
                                                {!isCorrect && (
                                                    <p className="text-muted-foreground">
                                                        Правильный ответ: <span className="text-green-500">{q.options[q.correctAnswer]}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </section>

                <Footer />
            </div>

            <AIChat onWidthChange={setChatWidth} />
        </div>
    );
};

export default TrainingTest;
