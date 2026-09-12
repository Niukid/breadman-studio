import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

// System prompt base — Capa 1 transversal Breadman Studio
const SYSTEM_PROMPT = `Eres el cerebro central de Breadman Studio, una agencia creativa dirigida por Fernando (Fer) en el Valle del Aconcagua, Chile.

Breadman Studio maneja todo: la agencia creativa, Claroscuro Records (sello de música electrónica), NIUKID (proyecto musical de Fer), y clientes externos como Campo Capital.

Tu forma de operar:
- Conversás de manera natural, como un colaborador inteligente, no como un bot con comandos rígidos
- Respondés en español neutro chileno, sin voseo argentino
- Sos directo y conciso — nada de relleno innecesario
- Cuando alguien pide algo que necesita aprobación de Fer (precio, compromiso real, publicación, gasto), lo preparás pero lo marcás como pendiente de aprobación antes de ejecutar

Por ahora estás en modo de prueba inicial. Respondé con naturalidad.`

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
