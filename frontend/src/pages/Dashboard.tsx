import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { api } from '../lib/api'
import { useAuthStore } from '../lib/store'

function Metric({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="metric-card">
      <p className="text-xs text-[#8889aa] tracking-wide">{label}</p>
      <p className="font-display font-bold text-3xl text-[#e8eaf6]">{value}</p>
      {sub && <p className="text-xs text-[#5a5c7a]">{sub}</p>}
    </div>
  )
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-2 border border-[--border] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-[#8889aa] mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{color: p.color}}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  )
}

export default function Dashboard() {
  const { token, user, logout } = useAuthStore()
  const nav = useNavigate()
  const [data, setData] = useState<{ totals: { users: number; emails: number; contacts: number }; daily: { date: string; newUsers: number; emailsSent: number; contactForms: number }[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { nav('/login'); return }
    api.stats.overview(token).then(res => {
      setLoading(false)
      if (res.ok && res.data) setData(res.data as { totals: { users: number; emails: number; contacts: number }; daily: { date: string; newUsers: number; emailsSent: number; contactForms: number }[] })
    })
  }, [token, nav])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const daily = data?.daily ?? []
  const totals = data?.totals ?? { users: 0, emails: 0, contacts: 0 }

  return (
    <div className="min-h-screen flex h-screen overflow-hidden">
      <aside className="w-56 flex-shrink-0 border-r border-[--border] bg-surface-2 flex flex-col p-4">
        <span className="font-display font-extrabold text-lg gradient-text mb-8 px-2">SkillTester</span>
        <nav className="flex flex-col gap-1 flex-1">
          {[{icon:'📊',label:'Dashboard'},{icon:'👥',label:'Usuários'},{icon:'📧',label:'E-mails'}].map(item => (
            <button key={item.label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#8889aa] hover:bg-surface-3 hover:text-[#e8eaf6] transition-colors text-left">
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-[--border] pt-3">
          <p className="text-xs font-medium text-[#e8eaf6] px-3 truncate">{user?.name}</p>
          <button onClick={() => { logout(); nav('/') }} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">Sair</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display font-bold text-2xl mb-6">Dashboard</h1>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Metric label="Total de usuários" value={totals.users} sub="registrados" />
            <Metric label="E-mails enviados" value={totals.emails} sub="via Resend" />
            <Metric label="Formulários" value={totals.contacts} sub="de contato" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h2 className="font-display font-bold text-sm mb-4">Novos usuários / dia</h2>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={daily} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#378ADD" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#378ADD" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,119,221,0.1)"/>
                  <XAxis dataKey="date" tick={{fill:'#5a5c7a',fontSize:10}} tickFormatter={d => d.slice(5)}/>
                  <YAxis tick={{fill:'#5a5c7a',fontSize:10}} allowDecimals={false}/>
                  <Tooltip content={<ChartTooltip />}/>
                  <Area type="monotone" dataKey="newUsers" name="Usuários" stroke="#378ADD" fill="url(#gBlue)" strokeWidth={2} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h2 className="font-display font-bold text-sm mb-4">E-mails / dia</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={daily} margin={{top:0,right:0,left:-20,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,119,221,0.1)"/>
                  <XAxis dataKey="date" tick={{fill:'#5a5c7a',fontSize:10}} tickFormatter={d => d.slice(5)}/>
                  <YAxis tick={{fill:'#5a5c7a',fontSize:10}} allowDecimals={false}/>
                  <Tooltip content={<ChartTooltip />}/>
                  <Legend wrapperStyle={{fontSize:11,color:'#8889aa'}}/>
                  <Bar dataKey="emailsSent" name="E-mails" fill="#7F77DD" radius={[3,3,0,0]}/>
                  <Bar dataKey="contactForms" name="Formulários" fill="#378ADD" radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
