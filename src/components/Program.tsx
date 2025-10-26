import { Book, Code, Presentation, TrendingUp } from "lucide-react";
import aiBrainImage from "@/assets/ai-brain.jpg";
import codeHologramImage from "@/assets/code-hologram.jpg";

const programPoints = [
  {
    icon: Book,
    title: "Организация и запуск",
    points: [
      "Структурированная программа с четкими целями и критериями",
      "Среда для сотрудничества между стажерами и экспертами",
      "Учебные материалы по продвинутым техникам работы с ИИ"
    ]
  },
  {
    icon: Code,
    title: "Учебная программа",
    points: [
      "Еженедельные мастер-классы и практические сессии",
      "Работа с ChatGPT и DeepSeek для решения реальных задач",
      "Менторские сессии с экспертами Texel и приглашенными специалистами"
    ]
  },
  {
    icon: TrendingUp,
    title: "Практическая работа",
    points: [
      "Интеграция в рабочие процессы Texel",
      "Реализация собственных проектов с поддержкой экспертов",
      "От маркетинга до разработки новых продуктов"
    ]
  },
  {
    icon: Presentation,
    title: "Результаты и карьера",
    points: [
      "Регулярные демо-дни перед работодателями и инвесторами",
      "Трудоустройство в Texel или партнерские компании",
      "Поддержка в запуске собственных стартапов"
    ]
  }
];

export const Program = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-gradient mb-6">Программа стажировки</h2>
          <p className="text-lg text-muted-foreground">
            Комплексный подход к обучению: от теории до практического применения в реальных проектах
          </p>
        </div>

        {/* Image Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          <div className="relative rounded-2xl overflow-hidden group animate-fade-in-left">
            <img 
              src={aiBrainImage} 
              alt="AI Brain" 
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">ИИ-Технологии</h3>
              <p className="text-muted-foreground">ChatGPT, DeepSeek и передовые инструменты</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden group animate-fade-in-right">
            <img 
              src={codeHologramImage} 
              alt="Code Hologram" 
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Реальные проекты</h3>
              <p className="text-muted-foreground">Работа над кейсами компании Texel</p>
            </div>
          </div>
        </div>

        {/* Program Points */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {programPoints.map((section, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl border border-primary/20 hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="gradient-secondary p-3 rounded-xl">
                  <section.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-3">
                {section.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
