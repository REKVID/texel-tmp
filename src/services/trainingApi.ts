export type TestResult = {
  hasResult: boolean;
  score?: number;
  total?: number;
  percentage?: number;
  updated_at?: number;
};

export type TestResultRow = {
  topic_id: string;
  score: number;
  total: number;
  percentage: number;
  updated_at: number;
};

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

export const trainingApi = {
  getTestResult(topicId: string) {
    return request<TestResult>(`/training/${encodeURIComponent(topicId)}/test-result`, { method: "GET" });
  },
  saveTestResult(topicId: string, score: number, total: number) {
    return request<{ ok: true; score: number; total: number; percentage: number; updated_at: number }>(
      `/training/${encodeURIComponent(topicId)}/test-result`,
      {
        method: "POST",
        body: JSON.stringify({ score, total }),
      }
    );
  },
  getAllTestResults() {
    return request<{ results: TestResultRow[] }>(`/training/test-results`, { method: "GET" });
  },
};

