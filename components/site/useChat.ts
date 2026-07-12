"use client";

import { useRef, useState } from "react";

export type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Hola, soy el asistente de Breadman Studio. Te ayudo con servicios, presupuestos o a coordinar una reunión. ¿Qué tienes en mente?";

const ERROR_MSG =
  "Uy, tuve un problema para responder. Escríbenos por la sección Contacto y te contactamos pronto.";

export default function useChat() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) scrollToBottom();
      return next;
    });
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(history);
    setLoading(true);
    scrollToBottom();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error("chat request failed");
      const data = await res.json();
      const reply = String(data?.reply || "").trim() || "¿Podrías darme un poco más de detalle?";
      setMessages((s) => [...s, { role: "assistant", content: reply }]);
    } catch {
      setMessages((s) => [...s, { role: "assistant", content: ERROR_MSG }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return { open, toggle, close: () => setOpen(false), loading, messages, send, scrollRef };
}
