"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import BmLogo from "./BmLogo";
import BmMark from "./BmMark";
import useAudioPlayer from "./useAudioPlayer";
import useChat from "./useChat";
import { ChatFab, ChatPanel } from "./Chat";
import type { SiteCase } from "./caseData";

const STRIPE_H = 9;
const HOME_BG_ANIM = { animation: "bmHomeBg 60s ease-in-out infinite" };
const MENU_ITEMS = [
  { sec: 1, label: "Home" },
  { sec: 2, label: "Trabajos" },
  { sec: 3, label: "Qué hacemos" },
  { sec: 4, label: "Sobre Breadman" },
  { sec: 5, label: "Contacto" },
];
const SECTION_BG = ["#283035", "#732706", "#5F7884", "#B65534", "#6F4B52", "#283035"];
const SECTION_ACCENT = ["#899EAA", "#899EAA", "#B7D0DE", "#D9B395", "#899EAA", "#899EAA"];

const RevealContext = createContext(false);

function Sheet({
  i,
  shown,
  active,
  bg,
  zIndex,
  extraStyle,
  scrollerRef,
  children,
}: {
  i: number;
  shown: boolean;
  active: boolean;
  bg: string;
  zIndex: number;
  extraStyle?: React.CSSProperties;
  scrollerRef?: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-sheet-i={i}
      className="fixed inset-0"
      style={{
        background: bg,
        zIndex,
        transform: shown ? "translateY(0)" : "translateY(103%)",
        transition: "transform 500ms cubic-bezier(.65,0,.35,1)",
        willChange: "transform",
        ...extraStyle,
      }}
    >
      <div ref={scrollerRef} className="no-scrollbar h-full overflow-y-auto">
        <RevealContext.Provider value={active}>{children}</RevealContext.Provider>
      </div>
    </div>
  );
}

function Reveal({ i, className, children, style }: { i: number; className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const active = useContext(RevealContext);
  const delay = i * 250;
  return (
    <div
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(18px)",
        transition: `opacity 500ms ease-in-out ${delay}ms, transform 500ms ease-in-out ${delay}ms`,
        ...style,
      }}
      data-reveal={i}
    >
      {children}
    </div>
  );
}

function Header({ accent, onHome, onMenu }: { accent: string; onHome: () => void; onMenu: () => void }) {
  return (
    <div className="flex justify-between items-center mb-9">
      <button onClick={onHome} aria-label="Home" className="bg-transparent border-none p-0 cursor-pointer">
        <BmMark color={accent} width={19} />
      </button>
      <button onClick={onMenu} aria-label="Menú" className="bg-transparent border-none py-2 cursor-pointer flex flex-col gap-[9px] w-11">
        <span className="h-[1.5px] block" style={{ background: accent }} />
        <span className="h-[1.5px] block" style={{ background: accent }} />
        <span className="h-[1.5px] block" style={{ background: accent }} />
      </button>
    </div>
  );
}

const SERVICES = [
  { title: "Identidad visual y branding", desc: "Marcas desde cero o rediseños: logo, sistema, aplicaciones." },
  { title: "Diseño web", desc: "Sitios que se ven bien y funcionan: portafolios, marcas, e-commerce." },
  { title: "Motion graphics", desc: "Piezas en movimiento para redes, web y presentaciones." },
  { title: "Dirección creativa", desc: "La mirada completa: concepto, estética y coherencia de principio a fin." },
  { title: "Diseño sonoro", desc: "Identidad de audio, música para piezas audiovisuales, logo sonoro." },
];

export default function Mobile({ cases }: { cases: SiteCase[] }) {
  const [cur, setCur] = useState(0);
  const [visited, setVisited] = useState(false);
  const [menu, setMenu] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);
  const [caseIdx, setCaseIdx] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const chat = useChat();

  const lockUntil = useRef(0);
  const scrollers = useRef<Record<number, HTMLDivElement | null>>({});
  const touchY = useRef<number | null>(null);
  const touchT = useRef(0);

  useEffect(() => {
    let v = false;
    try {
      v = !!sessionStorage.getItem("bm-visited");
    } catch {}
    setVisited(v);
    setCur(v ? 1 : 0);
  }, []);

  const goTo = (i: number, backwards = false) => {
    const min = visited ? 1 : 0;
    if (i < min || i > 5 || i === cur) return;
    lockUntil.current = Date.now() + 550;
    if (i >= 1 && !visited) {
      setVisited(true);
      try {
        sessionStorage.setItem("bm-visited", "1");
      } catch {}
    }
    setCur(i);
    requestAnimationFrame(() => {
      const sc = scrollers.current[i];
      if (sc) sc.scrollTop = backwards ? sc.scrollHeight : 0;
    });
  };

  const scroller = () => scrollers.current[cur] || null;

  const gesture = (dir: number, mag: number) => {
    if (menu || caseOpen || chat.open) return;
    if (Date.now() < lockUntil.current) return;
    if (mag < 40) return;
    const sc = scroller();
    if (dir > 0) {
      if (sc && sc.scrollHeight - sc.scrollTop - sc.clientHeight > 4) return;
      goTo(cur + 1);
    } else {
      if (sc && sc.scrollTop > 4) return;
      goTo(cur - 1, true);
    }
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => gesture(e.deltaY > 0 ? 1 : -1, Math.abs(e.deltaY));
    const onTS = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
      touchT.current = Date.now();
    };
    const onTE = (e: TouchEvent) => {
      if (touchY.current == null) return;
      const dy = touchY.current - e.changedTouches[0].clientY;
      const dt = Date.now() - touchT.current;
      touchY.current = null;
      if (Math.abs(dy) > 70 && dt < 500) gesture(dy > 0 ? 1 : -1, 999);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchend", onTE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur, menu, caseOpen, chat.open, visited]);

  const menuGo = (i: number) => {
    setMenu(false);
    setTimeout(() => {
      lockUntil.current = 0;
      goTo(i);
    }, 250);
  };

  const cs = cases[caseIdx];
  const audio = useAudioPlayer(cs?.audioUrl || "");

  const openCase = (idx: number) => {
    audio.stop();
    setCaseOpen(true);
    setCaseIdx(idx);
  };
  const closeCase = () => {
    audio.stop();
    setCaseOpen(false);
  };

  const chatAccent = caseOpen ? "#C9D6DE" : SECTION_ACCENT[cur] || "#899EAA";
  const chatFabShow = cur !== 0 && !menu && !caseOpen;
  const stripesOpacity = cur === 0 || cur === 5 ? 0 : 1;

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          projectType: data.get("projectType"),
          message: data.get("message"),
        }),
      });
      if (res.ok) {
        setSent(true);
        form.reset();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#101010] font-mono" style={{ touchAction: "pan-y" }}>
      {/* 0 · INICIO */}
      <Sheet i={0} shown={cur >= 0} active={cur === 0} bg={SECTION_BG[0]} zIndex={10} extraStyle={HOME_BG_ANIM} scrollerRef={(el) => (scrollers.current[0] = el)}>
        <div className="min-h-full flex flex-col items-center justify-between px-6 pt-16 pb-10 box-border">
          <BmLogo color="#899EAA" width={170} className="mt-[60px]" />
          <button
            onClick={() => goTo(1)}
            aria-label="Entrar"
            className="relative w-[180px] h-[180px] bg-transparent border-none p-0 cursor-pointer animate-pulse-slow"
          >
            <span className="absolute inset-0 rounded-full block animate-spin-slow" style={{ border: "2px dotted #899EAA" }} />
            <span className="absolute rounded-full block" style={{ inset: 14, background: "#899EAA" }} />
          </button>
          <div className="text-[13px]" style={{ color: "#899EAA", letterSpacing: ".06em" }}>
            Estudio de diseño
          </div>
        </div>
      </Sheet>

      {/* 1 · HOME */}
      <Sheet i={1} shown={cur >= 1} active={cur === 1} bg={SECTION_BG[1]} zIndex={11} extraStyle={HOME_BG_ANIM} scrollerRef={(el) => (scrollers.current[1] = el)}>
        <div className="min-h-full flex flex-col box-border px-6 pt-6 pb-12">
          <div className="flex justify-end items-center">
            <button onClick={() => setMenu(true)} aria-label="Menú" className="bg-transparent border-none py-2 cursor-pointer flex flex-col gap-[9px] w-11">
              <span className="h-[1.5px] block bg-[#899EAA]" />
              <span className="h-[1.5px] block bg-[#899EAA]" />
              <span className="h-[1.5px] block bg-[#899EAA]" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-7">
            <Reveal i={0}>
              <BmLogo color="#899EAA" width={160} />
            </Reveal>
            <Reveal i={1} className="italic font-extralight" style={{ color: "#899EAA", fontSize: 28, lineHeight: 1.15, letterSpacing: ".02em" }}>
              DISEÑO-MOTION
              <br />
              WEB-SONIDO
            </Reveal>
            <Reveal i={2} style={{ color: "#899EAA", fontSize: 12, lineHeight: 1.6, maxWidth: 280 }}>
              Marcas que funcionan en imagen, movimiento y sonido.
            </Reveal>
            <Reveal i={3}>
              <button
                onClick={() => goTo(2)}
                className="font-mono cursor-pointer rounded-[10px]"
                style={{ color: "#899EAA", background: "none", border: "1px solid #899EAA", padding: "12px 36px", fontSize: 14 }}
              >
                Ver Trabajos
              </button>
            </Reveal>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button onClick={() => goTo(2)} aria-label="Siguiente sección" className="bg-transparent border-none cursor-pointer p-2">
              <svg viewBox="0 0 24 24" className="w-[26px]" fill="none" stroke="#899EAA" strokeWidth={2}>
                <path d="M12 20V6M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Sheet>

      {/* 2 · TRABAJOS */}
      <Sheet i={2} shown={cur >= 2} active={cur === 2} bg={SECTION_BG[2]} zIndex={12} scrollerRef={(el) => (scrollers.current[2] = el)}>
        <div className="box-border px-6 pt-6 pb-20">
          <Header accent="#B7D0DE" onHome={() => goTo(1)} onMenu={() => setMenu(true)} />
          <Reveal i={0} className="italic font-extralight" style={{ color: "#B7D0DE", fontSize: 42, letterSpacing: ".02em" }}>
            TRABAJOS
          </Reveal>
          <Reveal i={1} className="mt-2.5 mb-[22px]" style={{ color: "#B7D0DE", fontSize: 14, lineHeight: 1.55 }}>
            Casos de diseño, branding, web y motion. Sectores: arquitectura, salud, finanzas, música y cultura.
          </Reveal>
          <Reveal i={2} className="flex gap-2.5 flex-wrap mb-11">
            {["Todo", "Branding", "Web", "Audio"].map((f) => (
              <span key={f} className="rounded-full text-[13px]" style={{ border: "1px solid #B7D0DE", color: "#B7D0DE", padding: "7px 18px" }}>
                {f}
              </span>
            ))}
          </Reveal>
          <Reveal i={3} className="flex flex-col gap-7">
            {cases.map((c, idx) => (
              <MobileCaseCard key={c.id} c={c} onOpen={() => openCase(idx)} />
            ))}
          </Reveal>
        </div>
      </Sheet>

      {/* 3 · QUÉ HACEMOS */}
      <Sheet i={3} shown={cur >= 3} active={cur === 3} bg={SECTION_BG[3]} zIndex={13} scrollerRef={(el) => (scrollers.current[3] = el)}>
        <div className="box-border px-6 pt-6 pb-20">
          <Header accent="#D9B395" onHome={() => goTo(1)} onMenu={() => setMenu(true)} />
          <Reveal i={0} className="italic font-extralight" style={{ color: "#D9B395", fontSize: 40, letterSpacing: ".02em" }}>
            QUÉ HACEMOS
          </Reveal>
          <Reveal i={1} className="mt-2.5 mb-10" style={{ color: "#D9B395", fontSize: 14, lineHeight: 1.55 }}>
            Servicios integrados según
            <br />
            lo que necesite la marca.
          </Reveal>
          <Reveal i={2} className="flex flex-col gap-[34px]" style={{ color: "#D9B395" }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} className="grid" style={{ gridTemplateColumns: "52px 1fr", columnGap: 10 }}>
                <div style={{ fontSize: 26 }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div style={{ fontSize: 26, lineHeight: 1.25 }}>{s.title}</div>
                  <div className="mt-2.5" style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </Sheet>

      {/* 4 · SOBRE BREADMAN */}
      <Sheet i={4} shown={cur >= 4} active={cur === 4} bg={SECTION_BG[4]} zIndex={14} scrollerRef={(el) => (scrollers.current[4] = el)}>
        <img src="/assets/sobre-silueta.png" alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.85 }} />
        <div className="relative box-border px-6 pt-6 pb-20">
          <Header accent="#899EAA" onHome={() => goTo(1)} onMenu={() => setMenu(true)} />
          <Reveal i={0} className="italic font-extralight" style={{ color: "#899EAA", fontSize: 38, letterSpacing: ".02em", marginBottom: 26 }}>
            SOBRE BREADMAN
          </Reveal>
          <Reveal i={1} className="mb-[34px]" style={{ color: "#899EAA", fontSize: 15, lineHeight: 1.6 }}>
            Breadman es un estudio de diseño y dirección creativa fundado por Fernando, con base en el Valle del
            Aconcagua.
            <br />
            Trabajamos en identidad visual, branding, web design, motion graphics y sonido — todo integrado como una
            sola disciplina.
          </Reveal>
          <Reveal i={2} style={{ color: "#899EAA", fontSize: 15, lineHeight: 1.6 }}>
            Venimos de años de trabajo en sectores distintos: arquitectura, salud, finanzas y cultura. Creemos que las
            marcas fuertes se construyen con método, criterio y las manos en el barro. Sin sobreproducciones, sin
            jerga. Bien hechas y a tiempo.
          </Reveal>
        </div>
      </Sheet>

      {/* 5 · CONTACTO */}
      <Sheet i={5} shown={cur >= 5} active={cur === 5} bg={SECTION_BG[5]} zIndex={15} scrollerRef={(el) => (scrollers.current[5] = el)}>
        <div className="box-border px-6 pt-6 pb-12">
          <Header accent="#899EAA" onHome={() => goTo(1)} onMenu={() => setMenu(true)} />
          <Reveal i={0} className="italic font-extralight" style={{ color: "#899EAA", fontSize: 40, letterSpacing: ".02em" }}>
            CONTACTO
          </Reveal>
          <Reveal i={1} className="mt-2.5 mb-[26px]" style={{ color: "#899EAA", fontSize: 12, lineHeight: 1.55 }}>
            ¿Proyecto nuevo? Cuéntanos.
            <br />
            Respondemos rápido.
          </Reveal>
          <Reveal i={2}>
            <form className="flex flex-col gap-2.5" onSubmit={submitContact}>
              <input name="name" placeholder="Nombre" required className="mobile-input" />
              <input name="email" type="email" placeholder="Email" required className="mobile-input" />
              <input name="projectType" placeholder="Tipo de proyecto" className="mobile-input" />
              <textarea name="message" placeholder="Mensaje" rows={3} className="mobile-input resize-none" />
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="self-start bg-transparent rounded-[10px] font-mono cursor-pointer"
                  style={{ border: "1px solid #5F7884", padding: "12px 26px", fontSize: 14, color: "#899EAA" }}
                >
                  {sending ? "Enviando…" : "Enviar"}
                </button>
                {sent && <span style={{ color: "#B7D0DE", fontSize: 12 }}>Recibido. Te respondemos pronto.</span>}
              </div>
            </form>
          </Reveal>
          <Reveal i={3} style={{ color: "#899EAA", fontSize: 13, margin: "22px 0 28px" }}>
            Email directo · Instagram · Facebook
          </Reveal>
          <Reveal i={4} className="flex flex-col items-center gap-2.5">
            <BmLogo color="#899EAA" width={105} />
            <div className="text-center" style={{ color: "#899EAA", fontSize: 11, lineHeight: 1.7 }}>
              Hecho con método y tiempo
              <br />© 2026 Breadman.Studio
            </div>
          </Reveal>
        </div>
      </Sheet>

      {/* FRANJAS */}
      <div
        onClick={() => {
          if (Date.now() >= lockUntil.current) goTo(cur + 1);
        }}
        className="fixed left-0 right-0 bottom-0 z-[100] flex flex-col cursor-pointer"
        style={{ opacity: stripesOpacity, transition: "opacity 500ms ease-in-out" }}
      >
        <div style={{ background: "#5F7884", height: cur >= 2 ? 0 : STRIPE_H, transition: "height 500ms cubic-bezier(.65,0,.35,1)" }} />
        <div style={{ background: "#B65534", height: cur >= 3 ? 0 : STRIPE_H, transition: "height 500ms cubic-bezier(.65,0,.35,1)" }} />
        <div style={{ background: "#6F4B52", height: cur >= 4 ? 0 : STRIPE_H, transition: "height 500ms cubic-bezier(.65,0,.35,1)" }} />
        <div style={{ background: "#283035", height: cur >= 5 ? 0 : STRIPE_H, transition: "height 500ms cubic-bezier(.65,0,.35,1)" }} />
      </div>

      {/* VER TRABAJO */}
      {cases.length > 0 && (
        <MobileCaseOverlay
          open={caseOpen}
          c={cs}
          audio={audio}
          onHome={() => {
            closeCase();
            goTo(1);
          }}
          onClose={closeCase}
          onPrev={() => {
            audio.stop();
            setCaseIdx((i) => (i + cases.length - 1) % cases.length);
          }}
          onNext={() => {
            audio.stop();
            setCaseIdx((i) => (i + 1) % cases.length);
          }}
        />
      )}

      {/* MENÚ */}
      <div
        className="fixed inset-0 z-[400] bg-[#283035]"
        style={{ opacity: menu ? 1 : 0, pointerEvents: menu ? "auto" : "none", transition: "opacity 500ms ease-in-out" }}
      >
        <div className="h-full box-border flex flex-col p-6">
          <div className="flex justify-end">
            <button onClick={() => setMenu(false)} aria-label="Cerrar menú" className="bg-transparent border-none p-1.5 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-[34px]" stroke="#899EAA" strokeWidth={1} fill="none">
                <path d="M4 4l16 16M20 4L4 20" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center items-center gap-[30px]">
            {MENU_ITEMS.map((item, idx) => (
              <button
                key={item.sec}
                onClick={() => menuGo(item.sec)}
                className="bg-transparent border-none text-center font-mono text-[28px] cursor-pointer p-0"
                style={{
                  color: item.sec === cur ? "#D9B395" : "#899EAA",
                  transition: "color 250ms ease, opacity 500ms ease-in-out, transform 500ms ease-in-out",
                  opacity: menu ? 1 : 0,
                  transform: menu ? "none" : "translateY(14px)",
                  transitionDelay: menu ? `${(idx + 1) * 250}ms` : "0ms",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ASISTENTE / CHAT */}
      <ChatFab
        accent={chatAccent}
        show={chatFabShow}
        onClick={chat.toggle}
        className="fixed z-[350] w-[58px] h-[58px]"
        style={{ right: 20, bottom: 24 }}
      />
      <div className="fixed z-[360] pointer-events-none" style={{ left: 12, right: 12, top: 70, bottom: 12 }}>
        <ChatPanel chat={chat} accent={chatAccent} className="w-full h-full" />
      </div>
    </div>
  );
}

function MobileCaseCard({ c, onOpen }: { c: SiteCase; onOpen: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={onOpen}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: "rgba(16,16,16,0.16)",
        paddingBottom: 26,
        transform: pressed ? "scale(0.98)" : "none",
        transition: "transform 250ms ease",
      }}
    >
      <div
        className="h-[250px]"
        style={
          c.imageUrl
            ? { backgroundImage: `url(${c.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      />
      <div className="px-[26px] pt-4">
        <div className="font-bold text-[22px]" style={{ color: "#B7D0DE" }}>
          {c.title}
        </div>
        <div className="mt-2" style={{ color: "#899EAA", fontSize: 14 }}>
          {c.tagsLabel}
        </div>
      </div>
    </div>
  );
}

function MobileCaseOverlay({
  open,
  c,
  audio,
  onHome,
  onClose,
  onPrev,
  onNext,
}: {
  open: boolean;
  c: SiteCase;
  audio: ReturnType<typeof useAudioPlayer>;
  onHome: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!c) return null;
  return (
    <div
      className="fixed inset-0 z-[300] bg-[#101010]"
      style={{ transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 500ms cubic-bezier(.65,0,.35,1)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(210deg, rgba(137,158,170,0.07) 0%, rgba(16,16,16,0) 55%)" }}
      />
      <div className="h-full overflow-y-auto box-border flex flex-col px-6 pt-6 pb-10 relative">
        <div className="flex justify-between items-center">
          <button onClick={onHome} aria-label="Home" className="bg-transparent border-none p-0 cursor-pointer">
            <BmMark color="#899EAA" width={19} />
          </button>
          <button onClick={onClose} aria-label="Cerrar" className="bg-transparent border-none p-1.5 cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-[34px]" stroke="#899EAA" strokeWidth={1} fill="none">
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </button>
        </div>
        <div className="flex-1" style={{ minHeight: 24 }} />
        <h1 className="italic font-extralight text-left" style={{ color: "#899EAA", fontSize: 40, lineHeight: 1.1, margin: "0 0 26px" }}>
          {c.title}
        </h1>
        <div className="mb-[22px]" style={{ color: "#899EAA", fontSize: 13 }}>
          {c.tagsLabel}
        </div>
        <div className="mb-6" style={{ color: "#899EAA", fontSize: 13, lineHeight: 1.55 }}>
          {c.desc}
        </div>
        <div className="font-bold mb-3" style={{ color: "#B7D0DE", fontSize: 18 }}>
          Qué se hizo
        </div>
        <div className="mb-[30px]" style={{ color: "#899EAA", fontSize: 13 }}>
          {c.made}
        </div>
        {c.audioUrl && (
          <div className="rounded-xl mb-[30px]" style={{ border: "1px solid #5F7884", padding: "12px 14px" }}>
            <div className="mb-[11px] text-[10px]" style={{ color: "#5F7884", letterSpacing: ".14em" }}>
              DISEÑO SONORO
            </div>
            <div className="flex items-center gap-3.5">
              <button
                onClick={audio.togglePlay}
                aria-label="Reproducir"
                className="flex-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                style={{ border: "1px solid #899EAA", background: "none" }}
              >
                {audio.playing ? (
                  <svg viewBox="0 0 24 24" className="w-[15px]" fill="#899EAA">
                    <rect x={6} y={5} width={4} height={14} />
                    <rect x={14} y={5} width={4} height={14} />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-[15px] ml-0.5" fill="#899EAA">
                    <path d="M7 4v16l13-8z" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div onClick={audio.seek} className="h-1.5 rounded-full cursor-pointer overflow-hidden" style={{ background: "rgba(137,158,170,0.22)" }}>
                  <div className="h-full" style={{ width: `${audio.pct}%`, background: "#899EAA" }} />
                </div>
                <div className="flex justify-between mt-[7px] text-[11px]" style={{ color: "#5F7884" }}>
                  <span>{audio.curLabel}</span>
                  <span>{audio.durLabel}</span>
                </div>
              </div>
            </div>
            <audio ref={audio.audioRef} preload="metadata" className="hidden" />
          </div>
        )}
        <a
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start rounded-[9px] font-bold"
          style={{ background: "none", border: "1px solid #5F7884", padding: "10px 22px", fontSize: 11, color: "#899EAA" }}
        >
          Visitar Sitio
        </a>
        <div className="flex justify-between mt-11">
          <button onClick={onPrev} className="bg-transparent border-none font-bold text-[13px] cursor-pointer p-0" style={{ color: "#899EAA" }}>
            ← Anterior
          </button>
          <button onClick={onNext} className="bg-transparent border-none font-bold text-[13px] cursor-pointer p-0" style={{ color: "#899EAA" }}>
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
}
