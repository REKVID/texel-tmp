import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user, updateUser, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);

  if (!loading && !user) {
    navigate("/");
    return null;
  }

  if (loading || !user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({ name, email });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
          Профиль
        </h1>

        <Card className="mb-6 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p>{user.name}</p>
                <p className="text-sm text-muted-foreground font-normal">@{user.username}</p>
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="ml-auto">
                {user.role}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Прогресс обучения</p>
              <Progress value={user.progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{user.progress}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Редактировать профиль</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Имя</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Логин</Label>
              <Input value={user.username} disabled className="opacity-60" />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-primary hover:shadow-glow-primary transition-all"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
