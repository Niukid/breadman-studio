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

## Campo Capital — Identidad Visual

### Paleta de colores oficial
- Verde Bosque Principal: #395D46 — color principal, encabezados, botones primarios
- Verde Profundo Base: #1F3D2E — fondos oscuros, cierres institucionales
- Tierra Mineral / Bronce: #A68A64 — acentos, filetes, iconografia
- Arena Calida: #DCC8A3 — tarjetas secundarias, fondos intermedios
- Blanco Hueso Neutral: #EDEAE2 — fondo claro principal
- Terracota Acento: #BA5130 — llamadas a accion, badges, alertas comerciales

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
Campo Capital se posiciona como referente en terrenos y parcelas de montana de alta plusvalia. Tres pilares: solidez juridica, conexion con la naturaleza, elegancia patrimonial.

## Contexto actual
Estas corriendo en Telegram como canal de prueba. Fer es el dueno con acceso total.`

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
    lower.includes('nueva informacion') ||
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

    // Cargar historial
    const historyKey = `chat:${chatId}:history`
    let history: Message[] = []
    try {
      const stored = await redis.get<Message[]>(historyKey)
      if (stored) history = stored
    } catch (e) {
      console.log('[Cerebro] Sin historial previo')
    }

    // Cargar contexto adicional guardado de Campo Capital
    let extraContext = ''
    try {
      const saved = await redis.get<string>(CC_CONTEXT_KEY)
      if (saved) {
        extraContext = '\n\n## Informacion adicional Campo Capital (actualizada por Fer)\n' + saved
      }
    } catch (e) {
      console.log('[Cerebro] Sin contexto adicional guardado')
    }

    // Detectar si Fer quiere guardar info nueva
    const wantsToSave = isFer && detectSaveIntent(userText)

    history.push({ role: 'user', content: userText })
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY)
    }

    const contextMessages: Message[] = isFer ? [
      {
        role: 'user',
        content: '[CONTEXTO INTERNO: quien escribe es Fernando (Fer), el dueno y director de Breadman Studio. Tiene acceso total al sistema. Puede guardar informacion nueva para que el cerebro la recuerde permanentemente.]'
      },
      {
        role: 'assistant',
        content: 'Entendido, hablo con Fer.'
      }
    ] : []

    // Si quiere guardar, el system prompt le indica como proceder
    const saveInstruction = wantsToSave
      ? '\n\n## INSTRUCCION ESPECIAL: Fer quiere guardar informacion nueva. Ayudalo a formularla claramente, confirma lo que entendiste, y al final de tu respuesta incluye exactamente este bloque:\n[GUARDAR]: <la informacion limpia y ordenada para guardar>'
      : ''

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + extraContext + saveInstruction,
      messages: [...contextMessages, ...history]
    })

    let replyText = response.content[0].type === 'text' ? response.content[0].text : 'Error procesando la respuesta.'

    // Si hay bloque [GUARDAR], extraerlo y guardarlo en Redis
    const saveMatch = replyText.match(/\[GUARDAR\]:\s*([\s\S]+?)(?:\n|$)/)
    if (saveMatch && isFer) {
      const newInfo = saveMatch[1].trim()
      try {
        const existing = await redis.get<string>(CC_CONTEXT_KEY) || ''
        const updated = existing
          ? existing + '\n- ' + newInfo
          : '- ' + newInfo
        await redis.set(CC_CONTEXT_KEY, updated) // Sin expiracion
        console.log('[Cerebro] Info guardada en Redis: ' + newInfo)
        replyText = replyText.replace(/\[GUARDAR\]:.+/s, '').trim() + '\n\nQuedo guardado.'
      } catch (e) {
        console.error('[Cerebro] Error guardando info:', e)
      }
    }

    history.push({ role: 'assistant', content: replyText })
    await redis.set(historyKey, history, { ex: 86400 })

    const telegramRes = await fetch(
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

    if (!telegramRes.ok) {
      console.error('[Cerebro] Error enviando a Telegram:', await telegramRes.text())
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Cerebro] Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
