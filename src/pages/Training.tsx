import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { AIChat } from "@/components/AIChat";
import { BookOpen, Brain, Code, Lightbulb, Target, Users } from "lucide-react";

const trainingModules = [
  {
    icon: Brain,
    title: "Основы работы с ИИ",
    description: "Изучение принципов работы с ChatGPT, Claude и другими языковыми моделями",
    duration: "2 недели",
    topics: [
      "Понимание возможностей ИИ",
      "Эффективные промпты", 
      "Ограничения и этика ИИ"
    ]
  },
  {
    icon: Code,
    title: "ИИ в разработке",
    description: "Практическое применение ИИ для написания и отладки кода",
    duration: "3 недели",
    topics: [
      "GitHub Copilot и аналоги",
      "Автоматизация рутинных задач",
      "Code Review с ИИ"
    ]
  },
  {
    icon: Lightbulb,
    title: "Креативные решения",
    description: "Использование ИИ для генерации идей и решения нестандартных задач",
    duration: "2 недели", 
    topics: [
      "Brainstorming с ИИ",
      "Создание контента",
      "Дизайн и прототипирование"
    ]
  },
  {
    icon: Target,
    title: "Проектная работа",
    description: "Реализация собственного проекта с активным использованием ИИ",
    duration: "4 недели",
    topics: [
      "Планирование проекта",
      "Итеративная разработка", 
      "Презентация результатов"
    ]
  },
  {
    icon: Users,
    title: "Командная работа",
    description: "Координация команды и процессов с помощью ИИ-инструментов",
    duration: "2 недели",
    topics: [
      "ИИ для менеджмента",
      "Автоматизация коммуникаций",
      "Анализ производительности"
    ]
  },
  {
    icon: BookOpen,
    title: "Глубокое изучение",
    description: "Продвинутые техники и специализированные области применения ИИ",
    duration: "3 недели",
    topics: [
      "Fine-tuning моделей",
      "RAG системы",
      "Мультимодальные ИИ"
    ]
  }
];

const Training = () => {
  return (
    <div className="main-container min-h-screen">
      <ParticlesBackground />
      
      <div className="content-layer">
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
                <div className="text-4xl font-bold text-gradient mb-2">16</div>
                <div className="text-muted-foreground">недель обучения</div>
              </div>
              <div className="glass p-6 rounded-2xl border border-primary/20 text-center">
                <div className="text-4xl font-bold text-gradient mb-2">6</div>
                <div className="text-muted-foreground">тематических модулей</div>
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
                  key={index}
                  className="glass p-6 rounded-2xl border border-primary/20 hover-lift hover-glow group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 glow-primary group-hover:scale-110 transition-transform">
                    <module.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {module.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="mb-4">
                    <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
                      {module.duration}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {module.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{topic}</span>
                      </div>
                    ))}
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
      
      {/* AI Chat Component - Fixed Position */}
      <AIChat />
    </div>
  );
};

export default Training;
