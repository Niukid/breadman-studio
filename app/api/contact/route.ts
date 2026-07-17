import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { writeClient } from "@/sanity/writeClient";

async function sendContactEmail({
  name,
  email,
  projectType,
  message,
}: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.me.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ICLOUD_EMAIL,
      pass: process.env.ICLOUD_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Breadman Studio <contacto@breadman.studio>",
    to: process.env.CONTACT_EMAIL_TO,
    replyTo: email,
    subject: `Nuevo mensaje de contacto — ${name}`,
    text: `Nombre: ${name}\nEmail: ${email}\nTipo de proyecto: ${projectType || "—"}\n\nMensaje:\n${message}`,
  });
}

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

  try {
    await sendContactEmail({ name, email, projectType, message });
  } catch (err) {
    console.error("No se pudo enviar el correo de contacto:", err);
  }

  return NextResponse.json({ ok: true });
}
