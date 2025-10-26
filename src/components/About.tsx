import { Brain, Rocket, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Актуальность",
    description: "Стремительное развитие технологий ИИ создает высокий спрос на специалистов. Компании ищут сотрудников, которые используют ИИ как усилитель производительности и инноваций."
  },
  {
    icon: Zap,
    title: "Проблематика",
    description: "Традиционные программы не успевают за развитием ИИ. Студенты не могут применить теоретические знания на практике из-за отсутствия реальных проектов и наставников."
  },
  {
    icon: Rocket,
    title: "Решение",
    description: "Центр разработки ИИ-инноваций на базе Texel. Практический опыт с передовыми технологиями, включая ChatGPT и DeepSeek под руководством опытных экспертов."
  },
  {
    icon: Users,
    title: "Поддержка",
    description: "Инкубационная программа для ИИ-стартапов. Менторская поддержка, доступ к технологиям Texel и помощь в трудоустройстве или запуске собственных проектов."
  }
];

export const About = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Subtle Background Elements - particles will be visible */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-gradient mb-6">О проекте</h2>
          <p className="text-lg text-muted-foreground">
            Мы создаем уникальную среду для развития специалистов нового поколения, 
            способных эффективно работать с технологиями искусственного интеллекта
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="gradient-card p-8 rounded-2xl border border-primary/20 hover-lift hover-glow group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="gradient-primary p-3 rounded-xl glow-primary group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
