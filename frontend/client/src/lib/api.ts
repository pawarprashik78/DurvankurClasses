// ─── Central API Client ───────────────────────────────────────────────────────
// All requests go through this. JWT token is automatically attached.

const BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8080/api";

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem("jwtToken");

export const setToken = (
  token: string,
  role?: string,
  linkedId?: string,
  name?: string,
  userId?: string
) => {
  localStorage.setItem("jwtToken", token);
  if (role) { localStorage.setItem("userRole", role); }
  if (linkedId) { localStorage.setItem("linkedId", linkedId); }
  if (name) { localStorage.setItem("userName", name); }
  if (userId) { localStorage.setItem("userId", userId); }
};

export const clearToken = () => {
  ["jwtToken", "userRole", "linkedId", "userName", "userId"].forEach(k => localStorage.removeItem(k));
};

export const getRole = (): string | null => localStorage.getItem("userRole");
export const setRole = (r: string) => localStorage.setItem("userRole", r);
export const getLinkedId = (): string | null => localStorage.getItem("linkedId");
export const setLinkedId = (id: string) => localStorage.setItem("linkedId", id);
export const getUserName = (): string | null => localStorage.getItem("userName");
export const setUserName = (n: string) => localStorage.setItem("userName", n);
export const getUserId = (): string | null => localStorage.getItem("userId");
export const setUserId = (id: string) => localStorage.setItem("userId", id);

export function logout() {
  clearToken();
  window.location.href = "/login";
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const err = await res.json();
      msg = err.message || err.error || msg;
    } catch { }
    throw new Error(msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── HTTP methods ───────────────────────────────────────────────────────────────
export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ── Auth ───────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  role: string;
  userId: string;
  linkedId: string;
  name: string;
  email: string;
}

function saveAuth(data: AuthResponse) {
  setToken(data.token, data.role, data.linkedId, data.name, data.userId);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/login", { email, password });
  saveAuth(data);
  return data;
}

export async function registerStudent(payload: Record<string, string>): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/register/student", payload);
  saveAuth(data);
  return data;
}

export async function registerTeacher(payload: Record<string, string>): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/register/teacher", payload);
  saveAuth(data);
  return data;
}

export async function registerAdmin(payload: Record<string, string>): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/register/admin", payload);
  saveAuth(data);
  return data;
}

export async function registerParent(payload: Record<string, string>): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>("/auth/register/parent", payload);
  saveAuth(data);
  return data;
}

// Legacy alias kept for backward compatibility
export async function register(payload: Record<string, string>): Promise<AuthResponse> {
  return registerStudent(payload);
}
