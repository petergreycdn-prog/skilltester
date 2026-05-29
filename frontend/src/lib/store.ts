import { create } from 'zustand'
import { persist } from 'zustand/middleware'
interface User { id: number; name: string; email: string; role: 'user' | 'admin' }
interface AuthState { token: string | null; user: User | null; setAuth: (t: string, u: User) => void; logout: () => void; isAuthenticated: () => boolean }
export const useAuthStore = create<AuthState>()(persist((set, get) => ({ token: null, user: null, setAuth: (t, u) => set({ token: t, user: u }), logout: () => set({ token: null, user: null }), isAuthenticated: () => !!get().token })), { name: 'skilltester-auth' }))
