import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const SETTINGS_KEY = "texel_settings";

interface AppSettings {
  theme: "dark" | "light" | "system";
  language: "ru" | "en";
  notifications: boolean;
  autoplay: boolean;
}

const defaults: AppSettings = {
  theme: "dark",
  language: "ru",
  notifications: true,
  autoplay: false,
};

function load(): AppSettings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") };
  } catch {
    return defaults;
  }
}

export default function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>(load);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  if (!loading && !user) {
    navigate("/");
    return null;
  }

  if (loading || !user) return null;

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast({ title: "Настройки сохранены" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Настройки
        </h1>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Внешний вид</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Тема</Label>
              <Select value={settings.theme} onValueChange={(v) => update("theme", v as AppSettings["theme"])}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Тёмная</SelectItem>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="system">Системная</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Язык интерфейса</Label>
              <Select value={settings.language} onValueChange={(v) => update("language", v as AppSettings["language"])}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Уведомления и обучение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif">Уведомления</Label>
              <Switch
                id="notif"
                checked={settings.notifications}
                onCheckedChange={(v) => update("notifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoplay">Автопереход к следующему уроку</Label>
              <Switch
                id="autoplay"
                checked={settings.autoplay}
                onCheckedChange={(v) => update("autoplay", v)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
