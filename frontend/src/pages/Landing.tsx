import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

const features = [
  { icon: '⚡', title: 'API Hono', desc: 'Backend TypeScript no Edge com Cloudflare.' },
  { icon: '🔐', title: 'Auth JWT', desc: 'Registro, login e proteção de rotas.' },
  { icon: '📧�', title: 'E-mails Resend', desc: 'Templates via Resend API.' },
  { icon: '📊', title: 'Dashboard', desc: 'Gráficos de usuários e e-mails.' },
  { icon: '🗄️', title: 'Cloudflare D1', desc: 'SQLite serverless com Drizzle.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'UI com Tailwind e animações.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-[--border] bg-surface/80 backdrop-blur-md">
        <span className="font-display font-extrabold text-xl gradient-text">SkillTester</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-outline text-xs px-4 py-2">Entrar</Link>
          <Link to="/register" className="btn-primary text-xs px-4 py-2">Criar conta</Link>
        </div>
      </nav>
      <section className="relative text-center px-6 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(127,119,221,0.15) 0%, transparent 70%)'}}/>
        <div className="inline-block text-xs tracking-widest px-4 py-1.5 rounded-full mb-8 border border-[--border] text-brand-purple bg-brand-purple/10 animate-fade-in">✦ full-stack · TypeScript · Edge</div>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.08] tracking-tight mb-6 animate-fade-in-up">
          Skills que{ ' '}<span className="gradient-text">funcionam</span><br />de verdade
        </h1>
        <p className="text-[#8889aa] text-lg max-w-xl mx-auto mb-10 font-light animate-fade-in-up [animation-delay:0.1s]">Aplicação full-stack com autenticação, e-mails transacionais, dashboard com gráficos e banco de dados serverless.</p>
        <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up [animation-delay:0.2s]">
          <Link to="/register" className="btn-primary px-7 py-3 text-base">Começar agora →</Link>
          <a href="https://github.com/petergreycdn-prog/skilltester" target="_blank" rel="noreferrer" className="btn-outline px-7 py-3 text-base">Ver código</a>
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-xs tracking-widest text-brand-blue mb-3 text-center">RECUP�S</p>
        <h2 className="font-display font-bold text-3xl text-center mb-10">Tudo incluso, pronto para produção</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (<div key={f.title} className="card hover:-translate-y-1"><div className="text-2xl mb-3">{f.icon}</div><h3 className="font-display font-bold text-base mb-2">{f.title}</h3><p className="text-sm text-[#8889aa] leading-relaxed">{f.desc}</p></div>))}
        </div>
      </section>
      <ContactSection />
      <footer className="text-center py-8 text-xs text-[#5a5c7a] border-t border-[--border]">SkillTester · 2026 · Hono + React + Cloudflare</footer>
    </div>
  )
}

function ContactSection() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setStatus("loading")
    const res = await api.email.sendContact(form)
    setStatus(res.ok ? 'ok' : 'error')
    if (res.ok) setForm({ nome: '', email: '', mensagem: '' })
  }
  return (
    <section className="max-w-xl mx-auto px-6 pb-24">
      <p className="text-xs tracking-widest text-brand-blue mb-3 text-center">CONTATO</p>
      <h2 className="font-display font-bold text-3xl text-center mb-8">Fale conosco</h2>
      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Nome</label><input className="input" placeholder="Seu nome" required value={form.nome} onChange={e=>setForm(p=>({...p,nome:e.target.value}))}/></div>
            <div><label className="label">E-mail</label><input type="email" className="input" placeholder="voce@email.com" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
          </div>
          <div><label className="label">Mensagem</label><textarea rows={4} className="input resize-none" placeholder="Como podemos ajudar?" required value={form.mensagem} onChange={e=>setForm(p=>({...p,mensagem:e.target.value}))}/></div>
          <button type="submit" disabled={status==='loading'} className="btn-primary justify-center py-3">{status==='loading'?'Enviando...':'Enviar mensagem →'}</button>
          {status==='ok'&&<p className="text-center text-sm text-green-400">✓ Mensagem enviada!</p>}
          {status==='error'&&<p className="text-center text-sm text-red-400">Erro ao enviar.</p>}
        </form>
      </div>
    </section>
  )
}
