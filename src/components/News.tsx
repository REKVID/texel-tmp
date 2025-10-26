import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  featured?: boolean;
}

// Заглушки для новостей
const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Запуск новой программы стажировки по ИИ-разработке",
    excerpt: "Мы рады объявить о старте уникальной программы стажировки, где участники получат практический опыт работы с ChatGPT и DeepSeek на реальных проектах.",
    date: "2025-10-20",
    category: "Программы",
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: 2,
    title: "Новые возможности интеграции с GPT-4",
    excerpt: "Расширенные возможности работы с мультиагентными системами и интеграция передовых технологий искусственного интеллекта.",
    date: "2025-10-18",
    category: "Технологии",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Результаты первого потока стажеров",
    excerpt: "85% выпускников первого потока успешно трудоустроены в ведущие IT-компании или запустили собственные стартапы.",
    date: "2025-10-15",
    category: "Результаты",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Мастер-класс по компьютерному зрению",
    excerpt: "Приглашаем на открытый мастер-класс по применению технологий компьютерного зрения в реальных проектах.",
    date: "2025-10-12",
    category: "События",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Партнерство с ведущими tech-компаниями",
    excerpt: "Подписаны соглашения о сотрудничестве с крупными технологическими компаниями для трудоустройства наших выпускников.",
    date: "2025-10-10",
    category: "Партнерство",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Обновление учебной программы",
    excerpt: "В программу добавлены модули по работе с DeepSeek и продвинутым техникам prompt engineering.",
    date: "2025-10-08",
    category: "Обучение",
    image: "/placeholder.svg",
  },
];

export const News = () => {
  const featuredNews = newsData.find((news) => news.featured);
  const regularNews = newsData.filter((news) => !news.featured);

  return (
    <section id="news" className="py-24 relative overflow-hidden">
      {/* Subtle Background Effects - particles will be visible */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 mb-6">
            <Tag className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Последние обновления</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Новости и события
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Следите за новостями центра, анонсами программ и достижениями наших стажеров
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="glass-card rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow-primary group">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                      <Tag className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-sm text-primary mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      {featuredNews.category}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredNews.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-gradient-primary transition-all">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {featuredNews.excerpt}
                  </p>
                  <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all self-start group">
                    Читать далее
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((news, index) => (
            <div
              key={news.id}
              className="glass-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-glow-primary group animate-fade-in"
              style={{ animationDelay: `${0.1 * (index + 2)}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <Tag className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    {news.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(news.date).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {news.excerpt}
                </p>
                <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 group/btn">
                  Подробнее
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5">
            Показать больше новостей
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
