const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:8003";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  login_or_email: string;
  password: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${AUTH_API_URL}${endpoint}`;
  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const authApi = {
  register(data: RegisterInput): Promise<User> {
    return request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(data: LoginInput): Promise<User> {
    return request<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me(): Promise<User> {
    return request<User>("/auth/me");
  },

  logout(): Promise<{ ok: boolean }> {
    return request("/auth/logout", { method: "POST" });
  },
};
