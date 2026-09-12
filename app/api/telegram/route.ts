import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// System prompt base — Capa 1 transversal Breadman Studio
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Solo procesar mensajes de texto
    const message = body?.message
    if (!message?.text) {
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const userText = message.text
    const userName = message.from?.first_name || 'Usuario'

    console.log(`[Cerebro] Mensaje de ${userName}: ${userText}`)

    // Llamar a Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: userText }
      ]
    })

    const reply =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Error al procesar la respuesta.'

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
