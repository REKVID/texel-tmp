export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  progress: number;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  login_or_email: string;
  password: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    let detail = "Ошибка запроса";
    try {
      const data = (await res.json()) as { detail?: string };
      if (data?.detail) detail = data.detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return (await res.json()) as T;
}

export const authApi = {
  register(input: RegisterInput) {
    return request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  login(input: LoginInput) {
    return request<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  me() {
    return request<User>("/auth/me", { method: "GET" });
  },
  logout() {
    return request<{ ok: true }>("/auth/logout", { method: "POST" });
  },
};

