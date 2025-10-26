import { Brain, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/20 py-12 px-4 relative">
      <div className="absolute inset-0 -z-10 gradient-hero opacity-30"></div>
      
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="gradient-primary p-2 rounded-lg glow-primary">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">Texel AI Center</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Центр разработки ИИ-инноваций и стажировок на базе компании Texel
            </p>
          </div>

          {/* Program */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Программа</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">О проекте</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Стажировка</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Инкубация стартапов</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Преимущества</li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Технологии</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-secondary transition-colors cursor-pointer">ChatGPT</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">DeepSeek</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Компьютерное зрение</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">3D-моделирование</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@texel-ai.ru</span>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>+7 (XXX) XXX-XX-XX</span>
              </li>
              <li className="flex items-center gap-2 hover:text-primary transition-colors">
                <MapPin className="w-4 h-4" />
                <span>Москва, Россия</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary/20 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Texel AI Center. Проектная деятельность в рамках приоритетного направления развития вуза.
          </p>
        </div>
      </div>
    </footer>
  );
};
