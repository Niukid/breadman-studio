import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT =
  "Eres el asistente virtual de Breadman Studio, un estudio de diseño y dirección creativa con base en el Valle del Aconcagua, Chile, fundado por Fernando. Servicios: identidad visual y branding, diseño web, motion graphics, dirección creativa y diseño sonoro. Actúas como vendedor, asistente y secretario: resuelves dudas sobre los servicios, orientas presupuestos y ayudas a agendar o dejar contacto. Responde en español, en tono cercano, claro y breve (2-4 frases). Para precios exactos, pide detalles del proyecto (alcance, plazos) y ofrece coordinar una reunión o usar la sección Contacto. No inventes datos, clientes ni cifras que no conozcas.";

const client = new Anthropic();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  const firstUser = messages.findIndex((m: any) => m.role === "user");
  const history = (firstUser < 0 ? messages : messages.slice(firstUser))
    .filter((m: any) => m.role === "user" || m.role === "assistant")
    .map((m: any) => ({ role: m.role, content: String(m.content ?? "") }));

  if (history.length === 0) {
    return NextResponse.json({ error: "No hay mensajes." }, { status: 400 });
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: "chat_failed" }, { status: 502 });
  }
}
