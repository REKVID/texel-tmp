import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { AIChat } from "@/components/AIChat";
import { Brain } from "lucide-react";
import { getTrainingModules } from "@/data/training-data";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { trainingApi, type TestResultRow } from "@/services/trainingApi";

const trainingModules = getTrainingModules();

const Training = () => {
  const [chatWidth, setChatWidth] = useState(0); // По умолчанию чат закрыт
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<Record<string, TestResultRow>>({});

  // Вычисляем отступ для контента (chatWidth + 24px для right-6, если чат открыт)
  const contentMarginRight = chatWidth > 0 ? chatWidth + 24 : 0;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setResults({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await trainingApi.getAllTestResults();
        if (cancelled) return;
        const map: Record<string, TestResultRow> = {};
        for (const r of res.results) map[r.topic_id] = r;
        setResults(map);
      } catch {
        if (!cancelled) setResults({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const scoreTone = useMemo(
    () => (percentage: number) => {
      if (percentage >= 80) return { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/30" };
      if (percentage >= 50) return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/30" };
      return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/30" };
    },
    []
  );

  return (
    <div className="main-container min-h-screen">
      <ParticlesBackground />

      <div
        className="content-layer transition-[margin] duration-200"
        style={{ marginRight: `${contentMarginRight}px` }}
      >
        <Navigation />

        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Программа обучения</span>
              </div>

              <h1 className="text-gradient mb-6">
                Обучение работе с ИИ
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Комплексная программа изучения современных ИИ-технологий с практическим применением
                в реальных проектах. От основ до продвинутых техник.
              </p>
            </div>

            {/* Program Overview */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <div className="glass p-6 rounded-2xl border border-primary/20 text-center">
                <div className="text-4xl font-bold text-gradient mb-2">{trainingModules.length}</div>
                <div className="text-muted-foreground">тематических модулей</div>
              </div>
              <div className="glass p-6 rounded-2xl border border-primary/20 text-center">
                <div className="text-4xl font-bold text-gradient mb-2">10+</div>
                <div className="text-muted-foreground">часов контента</div>
              </div>
              <div className="glass p-6 rounded-2xl border border-primary/20 text-center">
                <div className="text-4xl font-bold text-gradient mb-2">24/7</div>
                <div className="text-muted-foreground">доступ к ИИ-помощнику</div>
              </div>
            </div>

            {/* Training Modules */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingModules.map((module, index) => (
                <div
                  key={module.id}
                  className="glass p-6 rounded-2xl border border-primary/20 hover-glow group animate-fade-in transition-all duration-300 flex flex-col"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    to={`/training/${module.id}`}
                    className="flex-1 block group-hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 glow-primary group-hover:scale-110 transition-transform">
                      <module.icon className="w-6 h-6 text-primary-foreground" />
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {module.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {module.description}
                    </p>

                    {module.estimatedTime && (
                      <div className="mb-4">
                        <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
                          {module.estimatedTime}
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-primary/5">
                    <Link
                      to={`/training/${module.id}`}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    >
                      Изучить
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    {results[module.id] ? (
                      <div
                        className={`hidden sm:flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold border ${scoreTone(results[module.id].percentage).bg} ${scoreTone(results[module.id].percentage).text} ${scoreTone(results[module.id].percentage).border}`}
                        title="Ваш сохранённый результат"
                      >
                        {results[module.id].score}/{results[module.id].total}
                      </div>
                    ) : null}

                    <Link to={`/training/${module.id}/test`}>
                      <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs hover:bg-primary hover:text-primary-foreground transition-all">
                        {results[module.id] ? "Пройти заново" : "Пройти тест"}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Path */}
            <div className="mt-16 glass p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold text-center mb-8 text-gradient">
                Путь обучения
              </h2>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Теория</h4>
                  <p className="text-sm text-muted-foreground">Изучение основ и принципов</p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                    <span className="text-secondary font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Практика</h4>
                  <p className="text-sm text-muted-foreground">Решение реальных задач</p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Проект</h4>
                  <p className="text-sm text-muted-foreground">Собственная разработка</p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto">
                    <span className="text-primary-foreground font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-foreground">Карьера</h4>
                  <p className="text-sm text-muted-foreground">Трудоустройство</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* AI Chat Component - Fixed Position with Resize */}
      <AIChat onWidthChange={setChatWidth} />
    </div>
  );
};

export default Training;
