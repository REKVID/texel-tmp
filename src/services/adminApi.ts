export interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  progress: number;
  created_at: number;
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

export const adminApi = {
  getUsers() {
    return request<{ users: AdminUser[] }>(`/admin/users`, { method: "GET" });
  },
  updateUser(id: number, payload: Partial<Pick<AdminUser, "name" | "role" | "progress">>) {
    return request<{ user: AdminUser }>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

