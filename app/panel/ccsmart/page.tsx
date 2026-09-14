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
  presupuesto: string
  motivo_perdida: string
  fecha_visita: string
  notas: string
  ultima_actualizacion: string
}

const ETAPAS = ['Contacto Inicial','Calificacion','Ficha Enviada','En Nutricion','Visita Agendada','Visita Realizada','Procompra','Compra Realizada','Postventa','Estancado','Perdido']

const CLASE_COLOR: Record<string, string> = { 'A': '#BA5130', 'B': '#A68A64', 'C': '#395D46' }

export default function CCSmartPanel() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState<'embudo'|'lista'>('embudo')

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
          presupuesto: r[7] || '', motivo_perdida: r[8] || '',
          fecha_visita: r[9] || '', notas: r[10] || '', ultima_actualizacion: r[11] || '',
        }))
      setLeads(parsed)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const leadsFiltrados = leads.filter(l =>
    !busqueda || l.nombre.toLowerCase().includes(busqueda.toLowerCase()) || l.telefono.includes(busqueda)
  )

  const leadsParaEtapa = (etapa: string) => leadsFiltrados.filter(l => l.etapa === etapa || (etapa === 'Calificacion' && !l.etapa))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#EDEAE2', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#111', borderBottom: '1px solid #1a1a1a', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#395D46', letterSpacing: '-1px' }}>CC</span>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#EDEAE2', letterSpacing: '-1px' }}>smart</span>
          </div>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#222' }} />
          <span style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase' }}>Smart CC / Leads Control</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar lead..."
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #222', color: '#EDEAE2', padding: '6px 14px', borderRadius: '4px', fontSize: '13px', width: '200px', fontFamily: 'Outfit, sans-serif' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#395D46' }} />
            <span style={{ fontSize: '11px', color: '#395D46', letterSpacing: '1px' }}>ONLINE</span>
          </div>
          <button onClick={() => fetch('/api/panel/logout', { method: 'POST' }).then(() => router.push('/panel/login'))}
            style={{ background: 'none', border: '1px solid #222', color: '#555', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Outfit, sans-serif' }}>
            SALIR
          </button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[['embudo','EMBUDO'],['lista','LISTA / DATOS EN VIVO']].map(([v, label]) => (
            <button key={v} onClick={() => setVista(v as 'embudo'|'lista')}
              style={{ background: 'none', border: 'none', color: vista === v ? '#BA5130' : '#444', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', borderBottom: vista === v ? '2px solid #BA5130' : '2px solid transparent', height: '44px', padding: '0 2px' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#333', letterSpacing: '1px' }}>PIPELINE / DATOS EN VIVO</span>
          <button style={{ backgroundColor: '#BA5130', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', letterSpacing: '1px' }}>
            + NUEVO LEAD
          </button>
        </div>
      </div>

      {/* Titulo */}
      <div style={{ padding: '20px 24px 12px' }}>
        <div style={{ fontSize: '10px', color: '#444', letterSpacing: '2px', marginBottom: '4px' }}>PIPELINE / DATOS EN VIVO</div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#EDEAE2' }}>{vista === 'embudo' ? 'Embudo de leads' : 'Lista de leads'}</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#333', fontSize: '11px', letterSpacing: '3px' }}>CARGANDO...</div>
      ) : vista === 'embudo' ? (
        /* VISTA KANBAN */
        <div style={{ padding: '0 24px 32px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', minWidth: 'max-content' }}>
            {ETAPAS.map((etapa, idx) => {
              const etapaLeads = leadsParaEtapa(etapa)
              return (
                <div key={etapa} style={{ width: '220px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#333', fontWeight: 700 }}>{String(idx + 1).padStart(2,'0')}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#EDEAE2' }}>{etapa}</div>
                    </div>
                    <span style={{ fontSize: '13px', color: '#333', fontWeight: 700 }}>{etapaLeads.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {etapaLeads.length === 0 ? (
                      <div style={{ border: '1px dashed #1a1a1a', borderRadius: '6px', padding: '20px', textAlign: 'center', color: '#222', fontSize: '11px' }}>vacio</div>
                    ) : etapaLeads.map((lead, i) => (
                      <div key={i} style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '14px', borderLeft: '3px solid ' + (CLASE_COLOR[lead.clase_lead] || '#222'), cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: CLASE_COLOR[lead.clase_lead] || '#333' }} />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#EDEAE2' }}>{lead.nombre || 'Sin nombre'}</span>
                        </div>
                        {lead.notas && <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px', lineHeight: '1.4' }}>{lead.notas.slice(0, 60)}{lead.notas.length > 60 ? '...' : ''}</div>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#333' }}>
                          <span>{lead.proyecto || 'Campo Capital'}</span>
                          <span>{lead.fecha_creacion ? new Date(lead.fecha_creacion).toLocaleDateString('es-CL') : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* VISTA LISTA */
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['','Nombre','Telefono','Proyecto','Etapa','Notas','Fecha'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#444', fontSize: '10px', letterSpacing: '2px', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leadsFiltrados.map((lead, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: CLASE_COLOR[lead.clase_lead] || '#333' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>{lead.nombre || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{lead.telefono || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#A68A64' }}>{lead.proyecto || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '3px', backgroundColor: '#1a1a1a', color: '#EDEAE2', fontSize: '11px' }}>{lead.etapa || '-'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#444', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.notas || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#333', fontSize: '11px' }}>{lead.fecha_creacion ? new Date(lead.fecha_creacion).toLocaleDateString('es-CL') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ borderTop: '1px solid #111', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#333', letterSpacing: '1px' }}>
        <span>SMART CC / GESTION OPERATIVA</span>
        <span>© BREADMAN STUDIO IA</span>
      </div>
    </div>
  )
}