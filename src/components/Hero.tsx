import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/30"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(265 90% 65% / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(265 90% 65% / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-40 right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Центр ИИ-инноваций на базе Texel</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-gradient leading-tight">
            Развивайте суперспособности с ИИ
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Практическая программа стажировки с <span className="text-primary font-semibold">ChatGPT</span> и <span className="text-secondary font-semibold">DeepSeek</span>. 
            От реальных проектов до карьеры в ИИ-индустрии.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">1 год</div>
              <div className="text-sm text-muted-foreground mt-1">программа обучения</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">100%</div>
              <div className="text-sm text-muted-foreground mt-1">практика</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient">∞</div>
              <div className="text-sm text-muted-foreground mt-1">возможностей</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8 glow-primary group">
              Подать заявку
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="glass hover:bg-white/10 text-lg px-8 border-primary/30">
              Узнать больше
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full p-1">
          <div className="w-1.5 h-3 bg-primary rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
