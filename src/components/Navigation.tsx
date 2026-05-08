import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, openLogin, openRegister, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Главная", href: "/" },
    { name: "Новости", href: "/#news" },
    { name: "Обучение", href: "/training" },
    { name: "Vibe Coding", href: "/vibe-coding" },
  ];

  const handleStartLearning = () => {
    if (user) {
      navigate("/training");
    } else {
      openRegister();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-primary">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Texel AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.name === "Новости" ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                </Link>
              )
            )}
          </div>

          {/* Right Side - User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-glow-primary" />
            </Button>

            {!user ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={openLogin}>
                  Войти
                </Button>
                <Button
                  className="bg-gradient-primary hover:shadow-glow-primary transition-all"
                  onClick={openRegister}
                >
                  Регистрация
                </Button>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="p-2">
                    {user.role.trim().toLowerCase() === "admin" && (
                      <button
                        onClick={() => navigate("/admin")}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-primary"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Админ-панель</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Профиль</span>
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Настройки</span>
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={() => void logout()}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Выйти</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all" onClick={handleStartLearning}>
              Начать обучение
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) =>
                link.name === "Новости" ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              )}
              <div className="border-t border-border/50 my-2" />
              {!user ? (
                <div className="flex flex-col gap-2 px-4">
                  <Button variant="outline" onClick={openLogin}>
                    Войти
                  </Button>
                  <Button className="bg-gradient-primary hover:shadow-glow-primary transition-all" onClick={openRegister}>
                    Регистрация
                  </Button>
                </div>
              ) : (
                <>
                  {user.role.trim().toLowerCase() === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-accent rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Админ-панель</span>
                    </button>
                  )}
                  <button
                    onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Профиль</span>
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setMobileMenuOpen(false); }}
                    className="flex items-center space-x-2 px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Настройки</span>
                  </button>
                  <button
                    onClick={() => void logout()}
                    className="flex items-center space-x-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Выйти</span>
                  </button>
                </>
              )}
              <Button className="mx-4 bg-gradient-primary hover:shadow-glow-primary transition-all" onClick={handleStartLearning}>
                Начать обучение
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
