'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Lead {
  fecha_creacion: string
  nombre: string
  telefono: string
  clase_lead: string
  etapa: string
  proyecto: string
  canal: string
  presupuesto: string
  motivo_perdida: string
  fecha_visita: string
  notas: string
  ultima_actualizacion: string
}

const ETAPA_COLOR: Record<string, string> = {
  'Contacto Inicial': '#A68A64',
  'Calificacion': '#DCC8A3',
  'Ficha Enviada': '#395D46',
  'En Nutricion': '#395D46',
  'Visita Agendada': '#1F3D2E',
  'Visita Realizada': '#1F3D2E',
  'Procompra': '#BA5130',
  'Compra Realizada': '#2d6a4f',
  'Estancado': '#666',
  'Perdido': '#444',
}

const CLASE_COLOR: Record<string, string> = {
  'A': '#BA5130',
  'B': '#A68A64',
  'C': '#555',
}

export default function CCSmartPanel() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('Todos')
  const [filtroClase, setFiltroClase] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => { fetchLeads() }, [])

  async function fetchLeads() {
    try {
      const res = await fetch('/api/sheet-data')
      if (res.status === 401) { router.push('/panel/login?next=/panel/ccsmart'); return }
      const data = await res.json()
      const rows = (data.data || []).slice(1)
      const parsed = rows
        .filter((r: string[]) => r[0] && r[3] !== 'Claroscuro Records')
        .map((r: string[]) => ({
          fecha_creacion: r[0] || '', nombre: r[1] || '', telefono: r[2] || '',
          clase_lead: r[3] || '', etapa: r[4] || '', proyecto: r[5] || '',
          canal: r[6] || '', presupuesto: r[7] || '', motivo_perdida: r[8] || '',
          fecha_visita: r[9] || '', notas: r[10] || '', ultima_actualizacion: r[11] || '',
        }))
      setLeads(parsed)
    } catch (e) { setError('Error cargando leads') }
    finally { setLoading(false) }
  }

  const leadsFiltrados = leads.filter(l => {
    const matchEtapa = filtroEtapa === 'Todos' || l.etapa === filtroEtapa
    const matchClase = filtroClase === 'Todos' || l.clase_lead === filtroClase
    const matchBusqueda = !busqueda || l.nombre.toLowerCase().includes(busqueda.toLowerCase()) || l.telefono.includes(busqueda)
    return matchEtapa && matchClase && matchBusqueda
  })

  const metricas = [
    { label: 'LEADS TOTALES', value: leads.length, color: '#A68A64' },
    { label: 'LEADS CALIENTES', value: leads.filter(l => l.clase_lead === 'A').length, color: '#BA5130' },
    { label: 'VISITAS AGENDADAS', value: leads.filter(l => l.etapa === 'Visita Agendada').length, color: '#395D46' },
    { label: 'COMPRAS REALIZADAS', value: leads.filter(l => l.etapa === 'Compra Realizada').length, color: '#2d6a4f' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0d1f18', color: '#EDEAE2', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ backgroundColor: '#1F3D2E', borderBottom: '1px solid #395D46', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#BA5130' }} />
          <span style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#A68A64' }}>Campo Capital</span>
          <span style={{ color: '#395D46' }}>/</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>CC Smart</span>
        </div>
        <button onClick={() => fetch('/api/panel/logout', { method: 'POST' }).then(() => router.push('/panel/login'))}
          style={{ background: 'none', border: '1px solid #395D46', color: '#A68A64', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', letterSpacing: '1px', fontFamily: 'Outfit, sans-serif' }}>
          SALIR
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {metricas.map((m, i) => (
            <div key={i} style={{ backgroundColor: '#1F3D2E', border: '1px solid #395D46', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#A68A64', marginTop: '8px' }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#1F3D2E', border: '1px solid #395D46', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar nombre o telefono..."
            style={{ flex: 1, minWidth: '180px', backgroundColor: '#0d1f18', border: '1px solid #395D46', color: '#EDEAE2', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', fontFamily: 'Outfit, sans-serif' }} />
          <select value={filtroEtapa} onChange={e => setFiltroEtapa(e.target.value)}
            style={{ backgroundColor: '#0d1f18', border: '1px solid #395D46', color: '#EDEAE2', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', fontFamily: 'Outfit, sans-serif' }}>
            {['Todos','Contacto Inicial','Calificacion','Ficha Enviada','En Nutricion','Visita Agendada','Visita Realizada','Procompra','Compra Realizada','Estancado','Perdido'].map(e => <option key={e}>{e}</option>)}
          </select>
          <select value={filtroClase} onChange={e => setFiltroClase(e.target.value)}
            style={{ backgroundColor: '#0d1f18', border: '1px solid #395D46', color: '#EDEAE2', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', fontFamily: 'Outfit, sans-serif' }}>
            {['Todos','A','B','C'].map(c => <option key={c}>{c}</option>)}
          </select>
          <span style={{ fontSize: '12px', color: '#A68A64' }}>{leadsFiltrados.length} resultado{leadsFiltrados.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#A68A64', letterSpacing: '3px', fontSize: '12px' }}>CARGANDO...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#BA5130' }}>{error}</div>
        ) : leadsFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#A68A64', letterSpacing: '2px', fontSize: '12px' }}>SIN RESULTADOS</div>
        ) : (
          <div style={{ backgroundColor: '#1F3D2E', border: '1px solid #395D46', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #395D46' }}>
                  {['Clase','Nombre','Telefono','Proyecto','Etapa','Notas','Fecha'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#A68A64', fontWeight: 600, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leadsFiltrados.map((lead, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #253d2e', transition: 'background 0.1s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', width: '26px', height: '26px', borderRadius: '50%', backgroundColor: CLASE_COLOR[lead.clase_lead] || '#555', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                        {lead.clase_lead}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{lead.nombre || '-'}</td>
                    <td style={{ padding: '14px 16px', color: '#A68A64' }}>{lead.telefono || '-'}</td>
                    <td style={{ padding: '14px 16px', color: '#DCC8A3' }}>{lead.proyecto || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '4px', backgroundColor: ETAPA_COLOR[lead.etapa] || '#333', color: '#EDEAE2', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {lead.etapa || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#9aaf9a', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.notas || '-'}</td>
                    <td style={{ padding: '14px 16px', color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {lead.fecha_creacion ? new Date(lead.fecha_creacion).toLocaleDateString('es-CL') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}