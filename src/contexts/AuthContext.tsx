import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi, type LoginInput, type RegisterInput, type User } from "@/services/authApi";
import { toast } from "@/components/ui/use-toast";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  loginOpen: boolean;
  registerOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  setLoginOpen: (v: boolean) => void;
  setRegisterOpen: (v: boolean) => void;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateUser: (input: { name?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(input: LoginInput) {
    const u = await authApi.login(input);
    setUser(u);
    setLoginOpen(false);
    toast({ title: "Вы вошли", description: `Здравствуйте, ${u.name}` });
  }

  async function register(input: RegisterInput) {
    const u = await authApi.register(input);
    setUser(u);
    setRegisterOpen(false);
    toast({ title: "Аккаунт создан", description: `Здравствуйте, ${u.name}` });
  }

  async function updateUser(input: { name?: string; email?: string }) {
    const u = await authApi.updateMe(input);
    setUser(u);
    toast({ title: "Профиль обновлён" });
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    toast({ title: "Вы вышли" });
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginOpen,
      registerOpen,
      openLogin: () => setLoginOpen(true),
      openRegister: () => setRegisterOpen(true),
      setLoginOpen,
      setRegisterOpen,
      login,
      register,
      updateUser,
      logout,
    }),
    [user, loading, loginOpen, registerOpen]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

