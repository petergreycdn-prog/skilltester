const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const { token, ...init } = options
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  }
  try {
    const res = await fetch(`${BASE}${path}`, { ...init, headers })
    return await res.json()
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export const api = {
  auth: {
    register: (b: { name: string; email: string; password: string }) =>
      request<{ token: string; user: { id: number; name: string; email: string; role: 'user' | 'admin' } }>('/auth/register', { method: 'POST', body: JSON.stringify(b) }),
    login: (b: { email: string; password: string }) =>
      request<{ token: string; user: { id: number; name: string; email: string; role: 'user' | 'admin' } }>('/auth/login', { method: 'POST', body: JSON.stringify(b) }),
    me: (token: string) => request('/auth/me', { token }),
  },
  email: {
    sendContact: (b: { nome: string; email: string; mensagem: string }) =>
      request('/send-email', { method: 'POST', body: JSON.stringify(b) }),
  },
  stats: {
    overview: (token: string) => request('/stats/overview', { token }),
    users: (token: string) => request('/stats/users', { token }),
  },
  health: () => request('/health'),
}