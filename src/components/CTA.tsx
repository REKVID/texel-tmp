import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Calendar } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Subtle Background Elements - particles will be visible */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="glass p-12 md:p-16 rounded-3xl border border-primary/30 text-center animate-scale-in">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Набор открыт</span>
            </div>

            <h2 className="text-gradient leading-tight">
              Начните свой путь в ИИ уже сегодня
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Присоединяйтесь к программе стажировки и получите практический опыт работы 
              с передовыми технологиями искусственного интеллекта
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8 glow-primary group">
                <Mail className="mr-2 w-5 h-5" />
                Отправить заявку
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="glass hover:bg-white/10 text-lg px-8 border-primary/30">
                <Calendar className="mr-2 w-5 h-5" />
                Записаться на встречу
              </Button>
            </div>

            {/* Info */}
            <div className="pt-8 border-t border-primary/20">
              <p className="text-sm text-muted-foreground">
                Срок реализации программы: <span className="text-primary font-semibold">1 учебный год</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Направление: <span className="text-secondary font-semibold">Интеллектуальные системы управления</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
