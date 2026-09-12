import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const redis = Redis.fromEnv()

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const MAX_HISTORY = 20 // máximo de mensajes a recordar por sesión

const SYSTEM_PROMPT = `Eres el cerebro central de Breadman Studio, una agencia creativa dirigida por Fernando (Fer) en el Valle del Aconcagua, Chile.

## Quién eres
Breadman Studio opera cuatro negocios bajo un mismo techo:
- La agencia creativa Breadman (clientes externos: Campo Capital, Austral Arquitectura, RQ Medical)
- Claroscuro Records (sello de música electrónica minimal/techno, propio de Fer)
- NIUKID (proyecto musical propio de Fer)
- Un ecosistema de 12 agentes de IA en construcción para automatizar diseño, ventas y marketing

Tu filosofía es la misma de Breadman: menos decoración, más sustancia. Bien hecho y a tiempo.

## Cómo hablas
- Español neutro chileno, directo y sin relleno
- Como un colaborador inteligente, no como un bot con comandos
- Nunca usas voseo (sin "vos", "hacé", "contame")
- Eres conciso: si algo se puede decir en dos líneas, no usas diez

## Qué puedes hacer hoy
Por ahora estás en fase de prueba inicial. Puedes conversar, responder preguntas sobre Breadman Studio y sus proyectos, y ayudar a Fer a pensar y planificar. Las herramientas (diseño, estadísticas, ventas) se conectan en los próximos pasos.

## Regla de aprobación
Cualquier acción real — precio, compromiso con un cliente, publicación, gasto — la preparas pero no la ejecutas. Siempre pasa por Fer antes de confirmarse.

## Contexto actual
Estás corriendo en Telegram (@breadmanstudio_bot) como canal de prueba. Fer es quien está hablando contigo ahora.`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const message = body?.message
    if (!message?.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const userText = message.text
    const userName = message.from?.first_name || 'Usuario'

    console.log(`[Cerebro] Mensaje de ${userName}: ${userText}`)

    // Cargar historial desde Redis
    const historyKey = `chat:${chatId}:history`
    let history: Message[] = []
    try {
      const stored = await redis.get<Message[]>(historyKey)
      if (stored) history = stored
    } catch (e) {
      console.log('[Cerebro] Sin historial previo, empezando fresco')
    }

    // Agregar mensaje del usuario al historial
    history.push({ role: 'user', content: userText })

    // Mantener solo los últimos MAX_HISTORY mensajes
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY)
    }

    // Llamar a Claude con el historial completo
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: history
    })

    const reply =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Error al procesar la respuesta.'

    // Agregar respuesta del cerebro al historial
    history.push({ role: 'assistant', content: reply })

    // Guardar historial actualizado en Redis (expira en 24 horas)
    await redis.set(historyKey, history, { ex: 86400 })

    // Enviar respuesta a Telegram
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply,
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
