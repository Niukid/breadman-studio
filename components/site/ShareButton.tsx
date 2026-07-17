"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({
  title,
  text,
  url,
  color = "#C9D6DE",
  size = 18,
  className,
}: {
  title: string;
  text?: string;
  url: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // El usuario canceló el share sheet nativo, no hacemos nada
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin acceso al portapapeles, no hay fallback adicional
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Compartir este caso"
      className={`inline-flex items-center gap-2 opacity-80 hover:opacity-100 ${className || ""}`}
      style={{
        color,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        fontFamily: "inherit",
        fontWeight: 700,
        fontSize: 13,
        transition: "opacity 250ms ease",
      }}
    >
      {copied ? <Check size={size} /> : <Share2 size={size} />}
      {copied ? "Link copiado" : "Compartir"}
    </button>
  );
}
