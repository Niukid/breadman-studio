'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Paleta Breadman Studio — estilo panel tecnologico
const T = {
  bg: '#111111',
  surface: '#1a1a1a',
  surfaceHover: '#202020',
  border: '#2a2a2a',
  borderLight: '#333333',
  text: '#e8e8e8',
  textMuted: '#666666',
  textDim: '#444444',
  // Acentos de marca — solo como badges/indicadores
  cc: '#395D46',        // Campo Capital verde
  ccLight: '#4a7a5c',
  claroscuro: '#A68A64', // Claroscuro bronce
  breadman: '#BA5130',  // Breadman terracota
  ok: '#22c55e',
  warn: '#f59e0b',
  error: '#ef4444',
}

const AGENTS = [
  { id: '01', name: 'Captacion', client: 'CC', status: 'standby' },
  { id: '02', name: 'Ventas', client: 'CC', status: 'standby' },
  { id: '03', name: 'Estrategia', client: 'CC', status: 'standby' },
  { id: '04', name: 'Publicidad', client: 'CC', status: 'standby' },
  { id: '05', name: 'Servicio', client: 'CC', status: 'standby' },
  { id: '06', name: 'Contenido', client: 'CC', status: 'standby' },
  { id: '07', name: 'Integracion', client: 'CC', status: 'standby' },
  { id: '08', name: 'Analytics', client: 'CC', status: 'standby' },
  { id: '09', name: 'Marketing', client: 'CC', status: 'standby' },
  { id: '10', name: 'Retencion', client: 'CC', status: 'standby' },
  { id: '11', name: 'Arte', client: 'CC', status: 'active' },
  { id: '12', name: 'Operaciones', client: 'CC', status: 'standby' },
]

const STATUS_DOT: Record<string, string> = {
  active: T.ok,
  standby: T.textDim,
  error: T.error,
}

const STATUS_LABEL: Record<string, string> = {
  active: 'ACTIVO',
  standby: 'STANDBY',
  error: 'ERROR',
}

const ACTIVITY = [
  { icon: '◆', label: 'Pieza generada — Campo Capital', time: 'hace 2h', color: T.cc },
  { icon: '◆', label: 'Lead nuevo — Campo Capital', time: 'hace 3h', color: T.cc },
  { icon: '◆', label: 'Venta — Claroscuro Records', time: 'hace 5h', color: T.claroscuro },
  { icon: '◆', label: 'Bot Telegram — respuesta enviada', time: 'hace 6h', color: T.breadman },
]

function Badge({ label, color }: { label: string, color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '2px 8px', borderRadius: '4px',
      border: '1px solid ' + color + '44',
      backgroundColor: color + '14',
      color: color, fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px'
    }}>{label}</span>
  )
}

function MetricCard({ value, label, sub }: { value: string|number, label: string, sub?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '16px 12px' }}>
      <div style={{ fontSize: '32px', fontWeight: 800, color: T.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '4px', letterSpacing: '0.5px' }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: T.textDim, marginTop: '2px' }}>{sub}</div>}
    </div>
  )
}

export default function PanelMaestro() {
  const router = useRouter()
  const [time, setTime] = useState('')
  const [seccion, setSeccion] = useState('dashboard')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }))
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'ccsmart', label: 'CC Smart', icon: '◉', color: T.cc, badge: 'ACTIVO' },
    { id: 'claroscuro', label: 'Claroscuro', icon: '◉', color: T.claroscuro, badge: 'ACTIVO' },
    { id: 'austral', label: 'Austral Arq.', icon: '○', color: T.textDim, badge: 'PRONTO' },
    { id: 'agentes', label: 'Agentes IA', icon: '⬡', sub: '1/12 activos' },
    { id: 'disenos', label: 'Diseños', icon: '◈' },
    { id: 'config', label: 'Ajustes', icon: '⊙' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.bg, color: T.text, fontFamily: 'Outfit, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* TOP BAR */}
      <div style={{ height: '48px', borderBottom: '1px solid ' + T.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', backgroundColor: T.bg, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: T.text, letterSpacing: '-0.5px' }}>Breadman</span>
          <span style={{ fontSize: '15px', fontWeight: 300, color: T.textMuted }}>Studio</span>
          <span style={{ color: T.border, fontSize: '18px', margin: '0 4px' }}>/</span>
          <span style={{ fontSize: '13px', color: T.textMuted }}>Panel de Control</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: T.textDim }}>{time}</span>
          <div style={{ width: '1px', height: '16px', backgroundColor: T.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: T.ok }} />
            <span style={{ fontSize: '11px', color: T.ok, fontWeight: 700, letterSpacing: '0.5px' }}>ONLINE</span>
          </div>
          <button onClick={() => fetch('/api/panel/logout', { method: 'POST' }).then(() => router.push('/panel/login'))}
            style={{ background: 'none', border: '1px solid ' + T.border, color: T.textDim, padding: '4px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.5px' }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <div style={{ width: '220px', borderRight: '1px solid ' + T.border, padding: '16px 0', display: 'flex', flexDirection: 'column', flexShrink: 0, backgroundColor: T.bg }}>
          <div style={{ padding: '0 16px 16px', borderBottom: '1px solid ' + T.border, marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: T.textDim, letterSpacing: '1.5px', fontWeight: 700, marginBottom: '4px' }}>CLIENTES</div>
          </div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => item.id === 'ccsmart' ? router.push('/panel/ccsmart') : setSeccion(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer',
                color: seccion === item.id ? T.text : T.textMuted,
                backgroundColor: seccion === item.id ? T.surface : 'transparent',
                borderLeft: seccion === item.id ? '2px solid ' + T.breadman : '2px solid transparent',
                fontSize: '13px', fontFamily: 'Outfit, sans-serif', textAlign: 'left', width: '100%',
                transition: 'all 0.1s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.color ? (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: item.badge === 'ACTIVO' ? item.color : T.textDim, flexShrink: 0 }} />
                ) : (
                  <span style={{ fontSize: '12px', color: T.textDim, flexShrink: 0 }}>{item.icon}</span>
                )}
                <div>
                  <div style={{ fontWeight: seccion === item.id ? 600 : 400 }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: '10px', color: T.textDim, marginTop: '1px' }}>{item.sub}</div>}
                </div>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px',
                  padding: '1px 6px', borderRadius: '3px',
                  backgroundColor: item.badge === 'ACTIVO' ? (item.color + '20') : T.surface,
                  color: item.badge === 'ACTIVO' ? item.color : T.textDim,
                  border: '1px solid ' + (item.badge === 'ACTIVO' ? item.color + '40' : T.border),
                }}>{item.badge}</span>
              )}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: '12px 16px', borderTop: '1px solid ' + T.border, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: T.breadman + '20', border: '1px solid ' + T.breadman + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: T.breadman }}>F</div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: T.text }}>Fernando</div>
              <div style={{ fontSize: '10px', color: T.textDim }}>Director</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>

          {/* HEADER */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: T.text }}>Dashboard</div>
            <div style={{ fontSize: '13px', color: T.textMuted, marginTop: '2px' }}>Visión general de todos los clientes y agentes</div>
          </div>

          {/* CLIENTES ACTIVOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>

            {/* Campo Capital */}
            <div style={{ backgroundColor: T.surface, border: '1px solid ' + T.border, borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + T.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '3px', height: '32px', borderRadius: '2px', backgroundColor: T.cc }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: T.text }}>Campo Capital</div>
                    <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '1px' }}>Terrenos certificados</div>
                  </div>
                </div>
                <Badge label="CC SMART" color={T.cc} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid ' + T.border }}>
                <MetricCard value={0} label="Leads semana" />
                <div style={{ borderLeft: '1px solid ' + T.border, borderRight: '1px solid ' + T.border }}>
                  <MetricCard value={0} label="Calientes" />
                </div>
                <MetricCard value={0} label="Visitas" />
              </div>
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: T.textDim }}>Ultima pieza: hace 2h</span>
                <button onClick={() => router.push('/panel/ccsmart')}
                  style={{ background: 'none', border: '1px solid ' + T.cc + '60', color: T.cc, padding: '4px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                  Ver panel →
                </button>
              </div>
            </div>

            {/* Claroscuro */}
            <div style={{ backgroundColor: T.surface, border: '1px solid ' + T.border, borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + T.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '3px', height: '32px', borderRadius: '2px', backgroundColor: T.claroscuro }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: T.text }}>Claroscuro Records</div>
                    <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '1px' }}>Sello de musica electronica</div>
                  </div>
                </div>
                <Badge label="SELLO" color={T.claroscuro} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid ' + T.border }}>
                <MetricCard value={5} label="Ventas mes" sub="USD 14.25" />
                <div style={{ borderLeft: '1px solid ' + T.border, borderRight: '1px solid ' + T.border }}>
                  <MetricCard value={5} label="Tracks" />
                </div>
                <MetricCard value="$14" label="Neto USD" />
              </div>
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: T.textDim }}>Bandcamp + Instagram</span>
                <button style={{ background: 'none', border: '1px solid ' + T.claroscuro + '60', color: T.claroscuro, padding: '4px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                  Ver panel →
                </button>
              </div>
            </div>

          </div>

          {/* AGENTES */}
          <div style={{ backgroundColor: T.surface, border: '1px solid ' + T.border, borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid ' + T.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>Agentes IA</span>
                <span style={{ fontSize: '12px', color: T.textMuted, marginLeft: '8px' }}>1 de 12 activos</span>
              </div>
              <Badge label="ECOSISTEMA" color={T.breadman} />
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
              {AGENTS.map(a => (
                <div key={a.id} style={{ backgroundColor: T.bg, border: '1px solid ' + (a.status === 'active' ? T.ok + '40' : T.border), borderRadius: '6px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: STATUS_DOT[a.status], flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: T.textMuted }}>{a.id}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: a.status === 'active' ? T.text : T.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                    <div style={{ fontSize: '10px', color: STATUS_DOT[a.status], letterSpacing: '0.5px', fontWeight: 700 }}>{STATUS_LABEL[a.status]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVIDAD */}
          <div style={{ backgroundColor: T.surface, border: '1px solid ' + T.border, borderRadius: '8px' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid ' + T.border }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: T.text }}>Actividad reciente</span>
            </div>
            <div>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ padding: '12px 20px', borderBottom: i < ACTIVITY.length - 1 ? '1px solid ' + T.border : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: a.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: T.text, flex: 1 }}>{a.label}</span>
                  <span style={{ fontSize: '11px', color: T.textDim, whiteSpace: 'nowrap' }}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}