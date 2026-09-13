export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const redis = Redis.fromEnv()

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN_ENGINE
const FER_TELEGRAM_ID = 1796093217
const MAX_HISTORY = 20
const CC_CONTEXT_KEY = 'cc:contexto_adicional'

const SYSTEM_PROMPT = `Eres el cerebro central de Breadman Studio, una agencia creativa dirigida por Fernando (Fer) en el Valle del Aconcagua, Chile.

## Quien eres
Breadman Studio opera cuatro negocios: agencia creativa Breadman, Claroscuro Records, NIUKID y un ecosistema de 12 agentes de IA.
Clientes externos: Campo Capital, Austral Arquitectura, RQ Medical.
Filosofia: menos decoracion, mas sustancia. Bien hecho y a tiempo.

## Como hablas
- Espanol neutro chileno, directo y sin relleno
- Nunca usas voseo
- Conciso: dos lineas si alcanza

## Regla de aprobacion
Cualquier accion real la preparas pero no ejecutas. Siempre pasa por Fer primero.

## Campo Capital - Identidad Visual
Paleta: #395D46 (verde principal), #1F3D2E (fondo oscuro), #A68A64 (bronce), #DCC8A3 (arena), #EDEAE2 (blanco hueso), #BA5130 (terracota CTA)
Tipografia: Outfit ExtraBold (titulos), SemiBold (subtitulos/precios), Regular (cuerpo)
Regla composicion: Sistema Centrado (cc_logo_principal) o Sistema Izquierda (cc_logo_principal_izq). Nunca mezclar.

## Campo Capital - Proyectos activos
- Casa Piedra: proyecto en Rinconada de Los Andes, a 50 minutos de Santiago. Es un proyecto de Campo Capital.
- Bosque Estaquilla: proyecto en Los Muermos, Region de Los Lagos. Es un proyecto de Campo Capital.

## Campo Capital - Contenido comercial

### Linea 1 - Venta de parcelas (compradores)
Precio desde $14.990.000
Beneficios: credito directo, sin papeleos, entrega inmediata, descuentos en terreno
Tagline: Invierte en tierra, construye patrimonio
Superficie tipica: 5.000 m2
Estado juridico: Rol individual CBR

### Linea 2 - Captacion de propietarios (vendedores)
Publico: duenos de terrenos rurales que quieren vender
Oferta: gestion profesional completa, tasacion seria, respaldo legal, sin papeleos
CTAs: Solicite una evaluacion tecnica, Agende su tasacion, Cuentenos sobre su terreno

## Motor Grafico - Como pedir un diseno
Cuando Fer menciona un proyecto de Campo Capital (Casa Piedra, Bosque Estaquilla) o pide un diseno, pieza, flyer o grafica, activa el flujo de diseno.

Recopila estos datos conversando naturalmente:
1. Proyecto: Casa Piedra o Bosque Estaquilla
2. Linea: venta de parcelas o captacion de propietarios
3. Titulo principal (o lo propones tu)
4. Bajada o subtitulo (o lo propones tu)
5. Precio
6. Telefono de contacto
7. CTA (o lo propones tu)
8. Foto: terreno_01 a terreno_05 (terreno_03 tiene laguna y cordillera nevada, ideal para Casa Piedra)
9. Estilo: centrado o izquierda
10. Formato: historia (1080x1920), cuadrado (1080x1080), vertical_completo (1080x1350)

Si Fer dice que propongas todo, genera un brief completo con todos los datos y pregunta si confirma. Cuando confirme, incluye al final en linea separada:
GENERAR_DISENO: {"embudo":"captacion","beneficio":"gestion_administracion","fuenteTexto":"usuario","titulo":"TITULO","bajada":"BAJADA","precio":"PRECIO","telefono1":"","contactoAdicional":"","cta":"CTA","estiloLayout":"izquierda","formato":"historia","foto_elegida":"terreno_03"}

Reemplaza los valores con los datos reales del brief.

## Guardar info nueva
Cuando Fer quiera guardar info, ayudalo a ordenarla y al final incluye en linea separada:
GUARDAR_INFO: la info limpia y ordenada`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function detectDesignRequest(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    lower.includes('diseno') ||
    lower.includes('diseño') ||
    lower.includes('pieza') ||
    lower.includes('flyer') ||
    lower.includes('grafica') ||
    lower.includes('grafico') ||
    lower.includes('genera') ||
    lower.includes('crear imagen') ||
    lower.includes('casa piedra') ||
    lower.includes('bosque estaquilla') ||
    lower.includes('campo capital') ||
    lower.includes('parcela') ||
    lower.includes('terreno')
  )
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
    lower.includes('quiero que sepas') ||
    lower.includes('ten en cuenta')
  )
}

async function sendTelegram(chatId: number, text: string) {
  await fetch(
    'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    }
  )
}

async function triggerGraphicEngine(brief: object): Promise<boolean> {
  try {
    const content = Buffer.from(JSON.stringify(brief, null, 2)).toString('base64')
    const getRes = await fetch(
      'https://api.github.com/repos/Niukid/breadman-graphic-engine/contents/clients/campo-capital/brief.json',
      {
        headers: {
          Authorization: 'token ' + GITHUB_TOKEN,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    )
    const current = await getRes.json()
    const sha = current.sha
    const updateRes = await fetch(
      'https://api.github.com/repos/Niukid/breadman-graphic-engine/contents/clients/campo-capital/brief.json',
      {
        method: 'PUT',
        headers: {
          Authorization: 'token ' + GITHUB_TOKEN,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'brief: nuevo diseno Campo Capital desde cerebro',
          content,
          sha
        })
      }
    )
    return updateRes.ok
  } catch (error) {
    console.error('[Agente11] Error:', error)
    return false
  }
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

    const historyKey = 'chat:' + chatId + ':history'
    let history: Message[] = []
    try {
      const stored = await redis.get<Message[]>(historyKey)
      if (stored) history = stored
    } catch (e) {}

    let extraContext = ''
    try {
      const saved = await redis.get<string>(CC_CONTEXT_KEY)
      if (saved) extraContext = '\n\n## Info adicional Campo Capital guardada por Fer\n' + saved
    } catch (e) {}

    const wantsDesign = isFer && detectDesignRequest(userText)
    const wantsToSave = isFer && detectSaveIntent(userText)

    const designInstruction = wantsDesign
      ? '\n\nINSTRUCCION: Fer quiere un diseno para Campo Capital. Si ya tiene suficiente info propone el brief completo y pregunta si confirma. Si falta info pide solo lo que falta. Cuando Fer confirme incluye GENERAR_DISENO: seguido del JSON en una sola linea.'
      : ''

    const saveInstruction = wantsToSave
      ? '\n\nINSTRUCCION: Fer quiere guardar info. Ayudalo y al final incluye GUARDAR_INFO: seguido de la info ordenada.'
      : ''

    history.push({ role: 'user', content: userText })
    if (history.length > MAX_HISTORY) {
      history = history.slice(history.length - MAX_HISTORY)
    }

    const contextMessages: Message[] = isFer ? [
      { role: 'user', content: '[CONTEXTO: es Fer, dueno de Breadman Studio. Acceso total.]' },
      { role: 'assistant', content: 'Entendido, hablo con Fer.' }
    ] : []

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + extraContext + designInstruction + saveInstruction,
      messages: [...contextMessages, ...history]
    })

    let replyText = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Error procesando.'

    const allLines = replyText.split('\n')

    const saveIdx = allLines.findIndex(l => l.trim().startsWith('GUARDAR_INFO:'))
    if (saveIdx !== -1 && isFer) {
      const newInfo = allLines[saveIdx].replace('GUARDAR_INFO:', '').trim()
      try {
        const existing = await redis.get<string>(CC_CONTEXT_KEY)
        const updated = existing ? existing + '\n- ' + newInfo : '- ' + newInfo
        await redis.set(CC_CONTEXT_KEY, updated)
        allLines.splice(saveIdx, 1)
        replyText = allLines.join('\n').trim() + '\n\nQuedo guardado.'
      } catch (e) {}
    }

    const designIdx = allLines.findIndex(l => l.trim().startsWith('GENERAR_DISENO:'))
    if (designIdx !== -1 && isFer) {
      const jsonStr = allLines[designIdx].replace('GENERAR_DISENO:', '').trim()
      allLines.splice(designIdx, 1)
      const cleanReply = allLines.join('\n').trim()

      await sendTelegram(chatId, cleanReply)
      await sendTelegram(chatId, 'Generando la pieza... llega en 2-3 minutos.')

      try {
        const brief = JSON.parse(jsonStr)
        const ok = await triggerGraphicEngine(brief)
        if (!ok) {
          await sendTelegram(chatId, 'Error con el motor grafico. Revisa GitHub Actions.')
        }
      } catch (e) {
        await sendTelegram(chatId, 'Error parseando el brief. Intenta de nuevo.')
      }

      history.push({ role: 'assistant', content: cleanReply })
      await redis.set(historyKey, history, { ex: 86400 })
      return NextResponse.json({ ok: true })
    }

    history.push({ role: 'assistant', content: replyText })
    await redis.set(historyKey, history, { ex: 86400 })
    await sendTelegram(chatId, replyText)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Cerebro] Error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
