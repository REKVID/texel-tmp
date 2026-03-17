import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, type AdminUser } from "@/services/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await adminApi.getUsers();
        if (!cancelled) setUsers(res.users);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Ошибка загрузки пользователей");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, loading, navigate]);

  async function handleSave(u: AdminUser) {
    setSavingId(u.id);
    setError(null);
    try {
      const res = await adminApi.updateUser(u.id, {
        name: u.name,
        role: u.role,
        progress: u.progress,
      });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? res.user : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    } finally {
      setSavingId(null);
    }
  }

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="main-container min-h-screen flex items-center justify-center">
        <ParticlesBackground />
        <div className="glass p-6 rounded-2xl border border-primary/20 z-10">
          <p className="text-muted-foreground">Загрузка панели администратора…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container min-h-screen">
      <ParticlesBackground />
      <div className="content-layer">
        <Navigation />
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gradient mb-1">Админ-панель</h1>
                <p className="text-muted-foreground text-sm">Управление пользователями и прогрессом обучения</p>
              </div>
            </div>

            {error && (
              <div className="glass p-4 rounded-xl border border-destructive/30 mb-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="glass p-4 md:p-6 rounded-3xl border border-primary/20 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Логин</TableHead>
                    <TableHead>Почта</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Прогресс (%)</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-xs text-muted-foreground">{u.id}</TableCell>
                      <TableCell className="font-mono text-sm">{u.username}</TableCell>
                      <TableCell className="text-sm">{u.email}</TableCell>
                      <TableCell className="max-w-[160px]">
                        <Input
                          value={u.name}
                          onChange={(e) =>
                            setUsers((prev) =>
                              prev.map((x) => (x.id === u.id ? { ...x, name: e.target.value } : x))
                            )
                          }
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(value) =>
                            setUsers((prev) =>
                              prev.map((x) => (x.id === u.id ? { ...x, role: value } : x))
                            )
                          }
                        >
                          <SelectTrigger className="h-8 text-sm w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">user</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="w-32">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={u.progress}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (Number.isNaN(v)) return;
                            const clamped = Math.max(0, Math.min(100, v));
                            setUsers((prev) =>
                              prev.map((x) => (x.id === u.id ? { ...x, progress: clamped } : x))
                            );
                          }}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === u.id}
                          onClick={() => void handleSave(u)}
                        >
                          {savingId === u.id ? "Сохраняю…" : "Сохранить"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;

