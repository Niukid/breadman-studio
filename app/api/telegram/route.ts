import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'
import { google } from 'googleapis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const redis = Redis.fromEnv()

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const FER_TELEGRAM_ID = 1796093217
const MAX_HISTORY = 20

const DRIVE_DOCS = {
  campo_capital_so: '1w7LhDwbPazHtTKnRjT1HGQo1jcWjBIZHDNMKUs34ExA',
  campo_capital_manual: '1_yLk12bxdJzvqatgM1IMvFz4Ms_Ivh9yaGGaFlrYCes',
}

async function readDriveDoc(fileId: string): Promise<string> {
  const cacheKey = `drive:${fileId}`
  try {
    const cached = await redis.get<string>(cacheKey)
    if (cached) {
      console.log('[Drive] Desde cache: ' + fileId)
      return cached
    }
  } catch (e) {
    console.log('[Drive] Sin cache, leyendo desde Drive')
  }

  try {
    const credentials = JSON.parse(process.env.GSPAK as string)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })
    const drive = google.drive({ version: 'v3', auth })
    const response = await drive.files.export({
      fileId,
      mimeType: 'text/plain',
    })
    const content = response.data as string
    await redis.set(cacheKey, content, { ex: 21600 })
    console.log('[Drive] Leido y cacheado: ' + fileId)
    return content
  } catch (error) {
    console.error('[Drive] Error leyendo doc:', error)
    return ''
  }
}

const SYSTEM_PROMPT = `Eres el cerebro central de Breadman Studio, una agencia creativa dirigida por Fernando (Fer) en el Valle del Aconcagua, Chile.

## Quien eres
Breadman Studio opera cuatro negocios bajo un mismo techo:
- La agencia creativa Breadman (clientes externos: Campo Capital, Austral Arquitectura, RQ Medical)
- Claroscuro Records (sello de musica electronica minimal/techno, propio de Fer)
- NIUKID (proyecto musical propio de Fer)
- Un ecosistema de 12 agentes de IA en construccion para automatizar diseno, ventas y marketing

Tu filosofia es la misma de Breadman: menos decoracion, mas sustancia. Bien hecho y a tiempo.

## Como hablas
- Espanol neutro chileno, directo y sin relleno
- Como un colaborador inteligente, no como un bot con comandos
- Nunca usas voseo
- Eres conciso: si algo se puede decir en dos lineas, no usas diez

## Que puedes hacer hoy
Puedes conversar, responder preguntas sobre Breadman Studio y sus proyectos, y ayudar a Fer a pensar y planificar. Cuando el contexto involucra a Campo Capital, tienes acceso al Sistema Operativo y Manual Maestro de ese cliente.

## Regla de aprobacion
Cualquier accion real: precio, compromiso con un cliente, publicacion, gasto, la preparas pero no la ejecutas. Siempre pasa por Fer antes de confirmarse.

## Contexto actual
Estas corriendo en Telegram como canal de prueba.`

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
    const userId = message.from?.id
    const userText = message.text
    const isFer = userId === FER_TELEGRAM_ID

    console.log('[Cerebro] Mensaje de ' + message.from?.first_name + ' (id: ' + userId + ', esFer: ' + isFer + '): ' + userText)

    const historyKey = `chat:${chatId}:history`
    let history: Message[] = []
    try {
      const stored = await redis.get<Message[]>(historyKey)
      if (stored) history = stored
    } catch (e) {
      console.log('[Cerebro] Sin historial previo')
    }

    const textLower = userText.toLowerCase()
    const involvesCampoCapital =
      textLower.includes('campo capital') ||
      textLower.includes('parcela') ||
      textLower.includes('lote') ||
      textLower.includes('terreno') ||
      textLower.includes('diseno') ||
      textLower.includes('paleta') ||
      textLower.includes('color') ||
      textLower.includes('tipografia')

    let driveContext = ''
    if (involvesCampoCapital) {
      console.log('[Cerebro] Cargando contexto Campo Capital desde Drive...')
      const [so, manual] = await Promise.all([
        readDriveDoc(DRIVE_DOCS.campo_capital_so),
        readDriveDoc(DRIVE_DOCS.campo_capital_manual),
      ])
      if (so || manual) {
        driveContext = '\n\n## Contexto Campo Capital\n\n### Sistema Operativo V2\n' + so + '\n\n### Manual Maestro V12\n' + manual.slice(0, 3000)
      }
    }

    history.push({ role: 'user', content: userText })
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY)
    }

    const contextMessages: Message[] = isFer ? [
      {
        role: 'user',
        content: '[CONTEXTO INTERNO: quien escribe es Fernando (Fer), el dueno y director de Breadman Studio. Tiene acceso total al sistema.]'
      },
      {
        role: 'assistant',
        content: 'Entendido, hablo con Fer.'
      }
    ] : []

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + driveContext,
      messages: [...contextMessages, ...history]
    })

    const replyText = response.content[0].type === 'text' ? response.content[0].text : 'Error procesando la respuesta.'

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
