import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuthStore } from '../lib/store'

function AuthLayout({ children, title, sub }: { children: React.ReactNode; title: string; sub: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(55,138,221,0.12) 0%, transparent 70%)'}} />
      <Link to="/" className="font-display font-extrabold text-2xl gradient-text mb-10">SkillTester</Link>
      <div className="card w-full max-w-sm animate-fade-in-up">
        <h1 className="font-display font-bold text-xl mb-1">{title}</h1>
        <p className="text-sm text-[#8889aa] mb-6">{sub}</p>
        {children}
      </div>
    </div>
  )
}

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const nav = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await api.auth.login({ email, password })
    setLoading(false)
    if (res.ok && res.data) { setAuth(res.data.token, res.data.user); nav('/dashboard') }
    else setError(res.error ?? 'Erro ao fazer login')
  }

  return (
    <AuthLayout title="Bem-vindo de volta" sub={<>Não tem conta? <Link to="/register" className="text-brand-blue hover:underline">Criar agora</Link></>}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">E-mail</label>
          <input type="email" className="input" placeholder="voce@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Senha</label>
          <input type="password" className="input" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary justify-center py-2.5 mt-1">
          {loading ? 'Entrando…' : 'Entrar →'}
        </button>
      </form>
    </AuthLayout>
  )
}

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const nav = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await api.auth.register({ name, email, password })
    setLoading(false)
    if (res.ok && res.data) { setAuth(res.data.token, res.data.user); nav('/dashboard') }
    else setError(res.error ?? 'Erro ao criar conta')
  }

  return (
    <AuthLayout title="Criar sua conta" sub={<>Já tem conta? <Link to="/login" className="text-brand-blue hover:underline">Entrar</Link></>}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Nome completo</label>
          <input type="text" className="input" placeholder="Seu nome" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input type="email" className="input" placeholder="voce@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Senha</label>
          <input type="password" className="input" placeholder="8+ chars, maiúscula, número" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary justify-center py-2.5 mt-1">
          {loading ? 'Criando conta…' : 'Criar conta →'}
        </button>
        <p className="text-[11px] text-[#5a5c7a] text-center">Você receberá um e-mail de boas-vindas.</p>
      </form>
    </AuthLayout>
  )
}
