import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/writeClient";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const projectType = typeof body?.projectType === "string" ? body.projectType.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "El formulario de contacto no está configurado (falta SANITY_API_WRITE_TOKEN)." },
      { status: 500 }
    );
  }

  await writeClient.create({
    _type: "contactSubmission",
    name,
    email,
    projectType,
    message,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
