"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
        className="fixed top-5 left-5 z-50 h-9 w-9 rounded-full border border-crust flex items-center justify-center"
      >
        {/* Isotipo: círculo con tres cortes diagonales */}
        <svg viewBox="0 0 32 32" className="h-5 w-5">
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="1.4" />
          <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="1.4" />
          <line x1="13" y1="17" x2="19" y2="23" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-crust flex flex-col justify-center pl-10 gap-7">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-display text-3xl tracking-wide ${
                i === 0 ? "text-cream" : "text-cream/55"
              } hover:text-cream transition-colors`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
