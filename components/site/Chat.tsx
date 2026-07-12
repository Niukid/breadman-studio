"use client";

import { useState } from "react";
import useChat from "./useChat";

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-7" fill="none" stroke="#16191c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.1A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
      <path d="M8.4 12h.01M12 12h.01M15.6 12h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5" stroke="#16191c" strokeWidth={2} fill="none">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px]" fill="#16191c">
      <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
    </svg>
  );
}

export function ChatFab({
  accent,
  show = true,
  className,
  style,
  onClick,
}: {
  accent: string;
  show?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
}) {
  if (!show) return null;
  return (
    <button
      onClick={onClick}
      aria-label="Abrir chat asistente"
      className={`flex items-center justify-center rounded-full border-none cursor-pointer shadow-[0_8px_26px_rgba(0,0,0,.4)] hover:scale-[1.09] ${className}`}
      style={{ background: accent, transition: "transform 250ms ease, background 500ms ease", ...style }}
    >
      <ChatIcon />
    </button>
  );
}

export function ChatPanel({
  chat,
  accent,
  className,
}: {
  chat: ReturnType<typeof useChat>;
  accent: string;
  className?: string;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    chat.send(value);
    setValue("");
  };

  return (
    <div
      data-open={chat.open}
      className={`flex flex-col bg-chatPanel border rounded-[18px] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,.55)] ${
        chat.open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      } ${className}`}
      style={{ borderColor: accent, transition: "opacity 260ms ease, transform 260ms ease" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ background: accent, transition: "background 500ms ease" }}
      >
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm text-onAccent">Asistente Breadman</span>
          <span className="text-[10px]" style={{ color: "rgba(22,25,28,.68)" }}>
            Ventas · consultas · agenda
          </span>
        </div>
        <button onClick={chat.close} aria-label="Cerrar chat" className="p-1 flex">
          <CloseIcon />
        </button>
      </div>
      <div ref={chat.scrollRef} className="no-scrollbar flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
        {chat.messages.map((m, i) => (
          <div
            key={i}
            className="max-w-[82%] px-3.5 py-2.5 rounded-[13px] text-[13px] leading-normal whitespace-pre-wrap"
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? accent : "rgba(255,255,255,.07)",
              color: m.role === "user" ? "#16191c" : "#DDE6EA",
            }}
          >
            {m.content}
          </div>
        ))}
        {chat.loading && (
          <div className="self-start bg-white/[.07] text-[#9fb0b8] px-3.5 py-2.5 rounded-[13px] text-[13px]">
            escribiendo…
          </div>
        )}
      </div>
      <div className="flex gap-2 p-3 border-t border-white/[.08]">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Escribe tu consulta…"
          className="flex-1 min-w-0 bg-white/5 border border-white/[.12] rounded-[10px] px-3.5 py-2.5 text-[13px] text-chatText outline-none placeholder:text-[#5F7884]"
        />
        <button
          onClick={submit}
          aria-label="Enviar"
          className="flex-none w-[42px] rounded-[10px] border-none cursor-pointer flex items-center justify-center"
          style={{ background: accent, transition: "background 500ms ease" }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
