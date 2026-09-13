import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const redis = Redis.fromEnv()

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const FER_TELEGRAM_ID = 1796093217
const MAX_HISTORY = 20
const CC_CONTEXT_KEY = 'cc:contexto_adicional'

const SYSTEM_PROMPT = `Eres el cerebro central de Breadman Studio, una agencia creativa dirigida por Fernando (Fer) en el Valle del Aconcagua, Chile.

## Quien eres
Breadman Studio opera cuatro negocios bajo un mismo techo:
- La agencia creativa Breadman (clientes externos: Campo Capital, Austral Arquitectura, RQ Medical)
- Claroscuro Records (sello de musica electronica minimal/techno, propio de Fer)
- NIUKID (proyecto musical propio de Fer)
- Un ecosistema de 12 agentes de IA en construccion para automatizar diseno, ventas y marketing

Tu filosofia: menos decoracion, mas sustancia. Bien hecho y a tiempo.

## Como hablas
- Espanol neutro chileno, directo y sin relleno
- Como un colaborador inteligente, no como un bot con comandos
- Nunca usas voseo
- Eres conciso: si algo se puede decir en dos lineas, no usas diez

## Regla de aprobacion
Cualquier accion real: precio, compromiso con un cliente, publicacion, gasto, la preparas pero no la ejecutas. Siempre pasa por Fer antes de confirmarse.

## Campo Capital - Identidad Visual

### Paleta de colores oficial
- Verde Bosque Principal: #395D46 - color principal, encabezados, botones primarios
- Verde Profundo Base: #1F3D2E - fondos oscuros, cierres institucionales
- Tierra Mineral / Bronce: #A68A64 - acentos, filetes, iconografia
- Arena Calida: #DCC8A3 - tarjetas secundarias, fondos intermedios
- Blanco Hueso Neutral: #EDEAE2 - fondo claro principal
- Terracota Acento: #BA5130 - llamadas a accion, badges, alertas comerciales

### Tipografia
- Familia exclusiva: Outfit
- ExtraBold: titulares H1/H2, claims principales
- SemiBold: subtitulos, precios, metricas
- Regular/Light: cuerpo de texto, datos legales

### Regla de composicion
- Sistema Centrado (logo cc_logo_principal): todo el contenido centrado
- Sistema Izquierda (logo cc_logo_principal_izq): todo alineado a la izquierda
- Nunca mezclar los dos sistemas

### Filosofia de marca
Campo Capital es referente en terrenos y parcelas de montana de alta plusvalia. Tres pilares: solidez juridica, conexion con la naturaleza, elegancia patrimonial.

## Guardar informacion nueva
Cuando Fer te mande info nueva para recordar, ayudalo a ordenarla y al final incluye exactamente:
GUARDAR_INFO: la informacion ordenada y limpia`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function detectSaveIntent(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    lower.includes('guarda') ||
    lower.includes('anota') ||
    lower.includes('registra') ||
    lower.includes('agrega') ||
    lower.includes('actualiza') ||
    lower.includes('nueva info') ||
    lower.includes('para campo capital') ||
    lower.includes('quiero que sepas') ||
    lower.includes('ten en cuenta')
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const message = body?.message
    if (!message?.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const userId = message.from?.id
    const userText = message.text
    const isFer = userId === FER_TELEGRAM_ID

    console.log('[Cerebro] Mensaje de ' + message.from?.first_name + ' (esFer: ' + isFer + '): ' + userText)

    const historyKey = 'chat:' + chatId + ':history'
    let history: Message[] = []
    try {
      const stored = await redis.get<Message[]>(historyKey)
      if (stored) history = stored
    } catch (e) {
      console.log('[Cerebro] Sin historial previo')
    }

    let extraContext = ''
    try {
      const saved = await redis.get<string>(CC_CONTEXT_KEY)
      if (saved) {
        extraContext = '\n\n## Informacion adicional Campo Capital guardada por Fer\n' + saved
      }
    } catch (e) {
      console.log('[Cerebro] Sin contexto adicional')
    }

    const wantsToSave = isFer && detectSaveIntent(userText)
    const saveInstruction = wantsToSave
      ? '\n\nINSTRUCCION: Fer quiere guardar info nueva. Ayudalo a formularla claramente y al final incluye: GUARDAR_INFO: la info limpia y ordenada'
      : ''

    history.push({ role: 'user', content: userText })
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY)
    }

    const contextMessages: Message[] = isFer ? [
      {
        role: 'user',
        content: '[CONTEXTO INTERNO: quien escribe es Fernando (Fer), dueno y director de Breadman Studio. Acceso total al sistema.]'
      },
      {
        role: 'assistant',
        content: 'Entendido, hablo con Fer.'
      }
    ] : []

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + extraContext + saveInstruction,
      messages: [...contextMessages, ...history]
    })

    let replyText = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Error procesando la respuesta.'

    const lines = replyText.split('\n')
    const saveLineIndex = lines.findIndex(function(line) {
      return line.trim().startsWith('GUARDAR_INFO:')
    })

    if (saveLineIndex !== -1 && isFer) {
      const newInfo = lines[saveLineIndex].replace('GUARDAR_INFO:', '').trim()
      try {
        const existing = await redis.get<string>(CC_CONTEXT_KEY)
        const updated = existing ? existing + '\n- ' + newInfo : '- ' + newInfo
        await redis.set(CC_CONTEXT_KEY, updated)
        console.log('[Cerebro] Info guardada: ' + newInfo)
        lines.splice(saveLineIndex, 1)
        replyText = lines.join('\n').trim() + '\n\nQuedo guardado.'
      } catch (e) {
        console.error('[Cerebro] Error guardando:', e)
      }
    }

    history.push({ role: 'assistant', content: replyText })
    await redis.set(historyKey, history, { ex: 86400 })

    await fetch(
      'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          parse_mode: 'Markdown'
        })
      }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Cerebro] Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
