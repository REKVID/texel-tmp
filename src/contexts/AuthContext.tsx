import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi, type LoginInput, type RegisterInput, type User } from "@/services/authApi";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  openLogin: () => void;
  openRegister: () => void;
  loginOpen: boolean;
  registerOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  setRegisterOpen: (open: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (data: LoginInput) => {
    const u = await authApi.login(data);
    setUser(u);
    setLoginOpen(false);
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    const u = await authApi.register(data);
    setUser(u);
    setRegisterOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    openLogin: () => setLoginOpen(true),
    openRegister: () => setRegisterOpen(true),
    loginOpen,
    registerOpen,
    setLoginOpen,
    setRegisterOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
