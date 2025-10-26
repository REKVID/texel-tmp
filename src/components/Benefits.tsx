import { Award, Briefcase, GraduationCap, Target, Trophy, Lightbulb } from "lucide-react";

const benefits = [
  {
    icon: GraduationCap,
    title: "Экспертное обучение",
    description: "Работа с опытными специалистами Texel и приглашенными экспертами в области ИИ"
  },
  {
    icon: Target,
    title: "Практические навыки",
    description: "Освоение ChatGPT и DeepSeek на реальных проектах, а не на теории"
  },
  {
    icon: Briefcase,
    title: "Карьерные перспективы",
    description: "Трудоустройство в Texel, партнерские компании или поддержка стартапа"
  },
  {
    icon: Trophy,
    title: "Портфолио проектов",
    description: "Реальные кейсы для резюме: от маркетинга до разработки продуктов"
  },
  {
    icon: Lightbulb,
    title: "Инкубация стартапов",
    description: "Поддержка и ресурсы для развития собственных ИИ-проектов"
  },
  {
    icon: Award,
    title: "Конкурентное преимущество",
    description: "Навыки работы с ИИ, которые повышают вашу ценность на рынке труда"
  }
];

export const Benefits = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Subtle Background Elements - particles will be visible */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
          <div className="absolute inset-0 gradient-secondary opacity-5 blur-3xl rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-gradient mb-6">Преимущества участия</h2>
          <p className="text-lg text-muted-foreground">
            Получите комплексное развитие и откройте новые возможности в мире ИИ-технологий
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="gradient-card p-6 rounded-2xl border border-primary/20 hover-lift hover-glow group animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mb-4 glow-primary group-hover:scale-110 transition-transform">
                <benefit.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Expected Results */}
        <div className="max-w-4xl mx-auto mt-20 glass p-8 md:p-12 rounded-3xl border border-primary/20 animate-fade-in">
          <h3 className="text-3xl font-bold text-center mb-8 text-gradient">Ожидаемые результаты</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 glow-primary">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <p className="text-muted-foreground">
                Действующий центр разработки ИИ-инноваций с регулярными наборами стажеров
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors">
              <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center flex-shrink-0 glow-secondary">
                <span className="text-secondary-foreground font-bold">2</span>
              </div>
              <p className="text-muted-foreground">
                База успешных кейсов и проектов, реализованных с использованием искусственного интеллекта
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 glow-accent">
                <span className="text-accent-foreground font-bold">3</span>
              </div>
              <p className="text-muted-foreground">
                Инкубационная программа для ИИ-стартапов с доступом к технологиям и экспертизе Texel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
