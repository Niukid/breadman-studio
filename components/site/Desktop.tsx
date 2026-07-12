"use client";

import { useEffect, useState } from "react";
import BmLogo from "./BmLogo";
import useHover from "./useHover";
import useAudioPlayer from "./useAudioPlayer";
import useChat from "./useChat";
import { ChatFab, ChatPanel } from "./Chat";
import type { SiteCase } from "./caseData";

const NAV_LINKS = [
  { sec: 1, label: "Home" },
  { sec: 2, label: "Trabajos" },
  { sec: 3, label: "Qué hacemos" },
  { sec: 4, label: "Sobre Breadman" },
  { sec: 5, label: "Contacto" },
];

const SECTION_BG = ["#283035", "#732706", "#5F7884", "#B65534", "#6F4B52", "#283035"];
const SECTION_ACCENT = ["#899EAA", "#B7D0DE", "#C9DCE6", "#E7CBAD", "#C6D2DB", "#B7D0DE"];
const SECTION_INACTIVE = [
  "",
  "rgba(183,208,222,.5)",
  "rgba(201,220,230,.55)",
  "rgba(231,203,173,.55)",
  "rgba(198,210,219,.55)",
  "rgba(183,208,222,.5)",
];
const HOME_BG_ANIM = { animation: "bmHomeBg 60s ease-in-out infinite" };

function Nav({ sec, accent, inactive, goTo }: { sec: number; accent: string; inactive: string; goTo: (i: number) => void }) {
  return (
    <nav
      className="flex justify-between items-center py-8"
      style={{ paddingLeft: "max(56px, calc((100% - 1440px) / 2))", paddingRight: "max(56px, calc((100% - 1440px) / 2))" }}
    >
      <button onClick={() => goTo(1)} aria-label="Inicio" className="bg-transparent border-none p-0 cursor-pointer flex flex-col gap-1 leading-none">
        <BmLogo color={accent} width={128} />
      </button>
      <div className="flex gap-11 items-center">
        {NAV_LINKS.map((l) => (
          <NavLink key={l.sec} active={sec === l.sec} accent={accent} inactive={inactive} onClick={() => goTo(l.sec)}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  active,
  accent,
  inactive,
  onClick,
  children,
}: {
  active: boolean;
  accent: string;
  inactive: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const { hovered, handlers } = useHover();
  return (
    <button
      onClick={onClick}
      {...handlers}
      className="bg-transparent border-none p-0 cursor-pointer text-base"
      style={{
        fontWeight: active ? 700 : 400,
        color: active || hovered ? accent : inactive,
      }}
    >
      {children}
    </button>
  );
}

function PillButton({
  onClick,
  type = "button",
  accent,
  bg,
  children,
  className,
  style,
}: {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  accent: string;
  bg: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { hovered, handlers } = useHover();
  return (
    <button
      type={type}
      onClick={onClick}
      {...handlers}
      className={`font-mono border rounded-full cursor-pointer transition-colors ${className}`}
      style={{
        borderColor: accent,
        color: hovered ? bg : accent,
        background: hovered ? accent : "none",
        transition: "background 250ms ease, color 250ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const SERVICES = [
  { title: "Identidad visual y branding", desc: "Marcas desde cero o rediseños: logo, sistema, aplicaciones." },
  { title: "Diseño web", desc: "Sitios que se ven bien y funcionan: portafolios, marcas, e-commerce." },
  { title: "Motion graphics", desc: "Piezas en movimiento para redes, web y presentaciones." },
  { title: "Dirección creativa", desc: "La mirada completa: concepto, estética y coherencia de principio a fin." },
  { title: "Diseño sonoro", desc: "Identidad de audio, música para piezas audiovisuales, logo sonoro." },
];

export default function Desktop({ cases }: { cases: SiteCase[] }) {
  const [sec, setSec] = useState(0);
  const [visited, setVisited] = useState(false);
  const [filter, setFilter] = useState<"all" | "branding" | "web" | "audio">("all");
  const [caseOpen, setCaseOpen] = useState(false);
  const [caseIdx, setCaseIdx] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [pulse, setPulse] = useState(false);
  const chat = useChat();

  useEffect(() => {
    let v = false;
    try {
      v = !!sessionStorage.getItem("bm-d-visited");
    } catch {}
    setVisited(v);
    setSec(v ? 1 : 0);
  }, []);

  const goTo = (i: number) => {
    if (i === sec) return;
    if (i >= 1) {
      try {
        sessionStorage.setItem("bm-d-visited", "1");
      } catch {}
      setVisited(true);
    }
    setSec(i);
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

  const visibleCases = cases
    .map((c, idx) => ({ c, idx }))
    .filter(({ c }) => filter === "all" || c.cats.includes(filter));

  const accent = caseOpen ? "#C9D6DE" : SECTION_ACCENT[sec] || "#899EAA";

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
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#101010] font-mono">
      {/* 0 · INICIO */}
      <Section active={sec === 0} bg={SECTION_BG[0]} extraStyle={HOME_BG_ANIM}>
        <div className="min-h-full flex items-center justify-center p-[60px]">
          <div className="flex items-center gap-[72px] flex-wrap justify-center">
            <div className="flex flex-col gap-2 leading-none">
              <BmLogo color="#899EAA" width={210} />
            </div>
            <IntroButton onEnter={() => goTo(1)} />
            <div className="text-base text-fog" style={{ letterSpacing: "0.34em" }}>
              Estudio de diseño
            </div>
          </div>
        </div>
      </Section>

      {/* 1 · HOME */}
      <Section active={sec === 1} bg={SECTION_BG[1]} extraStyle={HOME_BG_ANIM}>
        <div className="w-full h-full flex flex-col" style={{ maxHeight: 800, margin: "auto" }}>
          <div style={{ background: SECTION_BG[1], ...HOME_BG_ANIM }}>
            <Nav sec={sec} accent={SECTION_ACCENT[1]} inactive={SECTION_INACTIVE[1]} goTo={goTo} />
          </div>
          <div className="flex-1 flex flex-col justify-center" style={{ padding: "40px max(56px, calc((100% - 1440px) / 2)) 90px" }}>
            <h1
              className="italic font-extralight m-0"
              style={{ color: SECTION_ACCENT[1], fontSize: 70, lineHeight: 1.03, letterSpacing: ".005em" }}
            >
              DISEÑO—MOTION
              <br />
              WEB—SONIDO
            </h1>
            <p className="mt-8 max-w-[520px]" style={{ color: "rgba(183,208,222,.85)", fontSize: 17, lineHeight: 1.6 }}>
              Marcas que funcionan en imagen,
              <br />
              movimiento y sonido.
            </p>
            <PillButton onClick={() => goTo(2)} accent="#899EAA" bg="#283035" className="mt-8 self-start text-base" style={{ padding: "16px 48px" }}>
              Ver Trabajos
            </PillButton>
          </div>
        </div>
      </Section>

      {/* 2 · TRABAJOS */}
      <Section active={sec === 2} bg={SECTION_BG[2]}>
        <div className="w-full h-full flex flex-col" style={{ maxHeight: 800, margin: "auto" }}>
          <div style={{ background: SECTION_BG[2] }}>
            <Nav sec={sec} accent={SECTION_ACCENT[2]} inactive={SECTION_INACTIVE[2]} goTo={goTo} />
          </div>
          <div
            className="flex-1 flex flex-col justify-center"
            style={{ padding: "20px max(56px, calc((100% - 1440px) / 2)) 26px" }}
          >
            <h1 className="italic font-extralight m-0" style={{ color: SECTION_ACCENT[2], fontSize: 50, lineHeight: 1.05 }}>
              TRABAJOS
            </h1>
            <p className="mt-5 max-w-[640px]" style={{ color: "rgba(201,220,230,.9)", fontSize: 16, lineHeight: 1.6 }}>
              Casos de diseño, branding, web y motion. Sectores: arquitectura, salud, finanzas, música y cultura.
            </p>
            <div className="flex gap-3.5 flex-wrap my-5">
              {(["all", "branding", "web", "audio"] as const).map((f) => (
                <FilterPill key={f} active={filter === f} onClick={() => setFilter(f)}>
                  {f === "all" ? "Todo" : f === "branding" ? "Branding" : f === "web" ? "Web" : "Audio"}
                </FilterPill>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-[22px]">
              {visibleCases.map(({ c, idx }) => (
                <CaseCard key={c.id} c={c} onOpen={() => openCase(idx)} />
              ))}
              <div
                className="border border-dashed rounded-2xl flex items-center justify-center text-[15px]"
                style={{ borderColor: "rgba(201,220,230,.5)", color: "rgba(201,220,230,.7)", aspectRatio: "1.85" }}
              >
                + próximos casos
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3 · QUÉ HACEMOS */}
      <Section active={sec === 3} bg={SECTION_BG[3]}>
        <div className="w-full h-full flex flex-col" style={{ maxHeight: 800, margin: "auto" }}>
          <div style={{ background: SECTION_BG[3] }}>
            <Nav sec={sec} accent={SECTION_ACCENT[3]} inactive={SECTION_INACTIVE[3]} goTo={goTo} />
          </div>
          <div className="flex-1 flex flex-col justify-center" style={{ padding: "18px max(56px, calc((100% - 1440px) / 2)) 24px" }}>
            <h1 className="italic font-extralight m-0" style={{ color: SECTION_ACCENT[3], fontSize: 46, lineHeight: 1.05 }}>
              QUÉ HACEMOS
            </h1>
            <p className="mt-5" style={{ color: "rgba(231,203,173,.9)", fontSize: 16, lineHeight: 1.6 }}>
              Servicios integrados según lo que necesite la marca.
            </p>
            <div className="mt-[22px]" style={{ borderTop: "1px solid rgba(231,203,173,.26)" }}>
              {SERVICES.map((s, i) => (
                <div
                  key={s.title}
                  className="grid items-start py-[18px]"
                  style={{ gridTemplateColumns: "64px 1fr 430px", gap: 28, borderBottom: "1px solid rgba(231,203,173,.26)" }}
                >
                  <div style={{ color: "rgba(231,203,173,.6)", fontSize: 18 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-bold" style={{ color: SECTION_ACCENT[3], fontSize: 26, lineHeight: 1.15 }}>
                    {s.title}
                  </div>
                  <div className="pt-[9px]" style={{ color: "rgba(231,203,173,.82)", fontSize: 15, lineHeight: 1.55 }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 4 · SOBRE BREADMAN */}
      <Section active={sec === 4} bg={SECTION_BG[4]}>
        <img
          src="/assets/sobre-fondo.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.85 }}
        />
        <div className="w-full h-full flex flex-col" style={{ maxHeight: 800, margin: "auto" }}>
          <div className="relative z-[2]" style={{ background: SECTION_BG[4] }}>
            <Nav sec={sec} accent={SECTION_ACCENT[4]} inactive={SECTION_INACTIVE[4]} goTo={goTo} />
          </div>
          <div
            className="relative z-[1] flex-1 flex flex-col justify-center"
            style={{ padding: "20px max(56px, calc((100% - 1440px) / 2)) 30px", maxWidth: "none" }}
          >
            <h1 className="italic font-extralight" style={{ color: SECTION_ACCENT[4], fontSize: 50, lineHeight: 1.05, margin: "0 0 30px" }}>
              SOBRE BREADMAN
            </h1>
            <p className="max-w-[780px]" style={{ color: "rgba(198,210,219,.92)", fontSize: 16, lineHeight: 1.7, margin: "0 0 22px" }}>
              Breadman es un estudio de diseño y dirección creativa fundado por Fernando, con base en el Valle del
              Aconcagua. Trabajamos en identidad visual, branding, web design, motion graphics y sonido — todo
              integrado como una sola disciplina.
            </p>
            <p className="max-w-[780px]" style={{ color: "rgba(198,210,219,.92)", fontSize: 16, lineHeight: 1.7 }}>
              Venimos de años de trabajo en sectores distintos: arquitectura, salud, finanzas y cultura. Creemos que
              las marcas fuertes se construyen con método, criterio y las manos en el barro. Sin sobreproducciones,
              sin jerga. Bien hechas y a tiempo.
            </p>
          </div>
        </div>
      </Section>

      {/* 5 · CONTACTO */}
      <Section active={sec === 5} bg={SECTION_BG[5]}>
        <div className="w-full h-full flex flex-col" style={{ maxHeight: 800, margin: "auto" }}>
          <div style={{ background: SECTION_BG[5] }}>
            <Nav sec={sec} accent={SECTION_ACCENT[5]} inactive={SECTION_INACTIVE[5]} goTo={goTo} />
          </div>
          <div
            className="grid flex-1 items-start"
            style={{ padding: "40px max(56px, calc((100% - 1440px) / 2)) 0", gridTemplateColumns: "1fr 1fr", gap: 90 }}
          >
            <div className="flex flex-col h-full">
              <h1 className="italic font-extralight m-0" style={{ color: SECTION_ACCENT[5], fontSize: 52, lineHeight: 1.05 }}>
                CONTACTO
              </h1>
              <p className="mt-[22px]" style={{ color: "rgba(183,208,222,.85)", fontSize: 16, lineHeight: 1.6 }}>
                ¿Proyecto nuevo? Cuéntanos.
                <br />
                Respondemos rápido.
              </p>
              <div className="pt-20" style={{ color: "rgba(183,208,222,.85)", fontSize: 15 }}>
                Email directo · Instagram · Facebook
              </div>
            </div>
            <form className="flex flex-col gap-[13px]" onSubmit={submitContact}>
              <input name="name" placeholder="Nombre" required className="contact-input" />
              <input name="email" type="email" placeholder="Email" required className="contact-input" />
              <input name="projectType" placeholder="Tipo de proyecto" className="contact-input" />
              <textarea name="message" placeholder="Mensaje" rows={4} className="contact-input resize-none" />
              <div className="flex items-center gap-[18px] mt-1.5">
                <PillButton
                  type="submit"
                  accent="rgba(137,158,170,.7)"
                  bg="#283035"
                  className={`text-[15px] ${pulse ? "bm-btn-pulse" : ""}`}
                  style={{ padding: "16px 44px", color: "#B7D0DE" }}
                >
                  {sending ? "Enviando…" : "Enviar"}
                </PillButton>
                {sent && <span style={{ color: "rgba(183,208,222,.8)", fontSize: 13 }}>Recibido. Te respondemos pronto.</span>}
              </div>
            </form>
          </div>
          <footer
            className="text-center flex-none"
            style={{ padding: "34px max(56px, calc((100% - 1440px) / 2)) 26px", color: "rgba(183,208,222,.5)", fontSize: 14 }}
          >
            Hecho con método y tiempo © 2026 Breadman.Studio
          </footer>
        </div>
      </Section>

      {/* VER TRABAJO */}
      {cases.length > 0 && (
        <CaseOverlay
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

      {/* ASISTENTE / CHAT */}
      <div className="absolute z-[72]" style={{ right: 34, bottom: 34 }}>
        <ChatFab accent={accent} onClick={chat.toggle} className="w-[60px] h-[60px]" />
      </div>
      <div
        className="absolute z-[72] pointer-events-none"
        style={{ right: 34, bottom: 108, width: 360, maxWidth: "calc(100% - 48px)", height: 470, maxHeight: "calc(100% - 150px)" }}
      >
        <ChatPanel chat={chat} accent={accent} className="w-full h-full" />
      </div>
    </div>
  );
}

function Section({
  active,
  bg,
  children,
  extraStyle,
}: {
  active: boolean;
  bg: string;
  children: React.ReactNode;
  extraStyle?: React.CSSProperties;
}) {
  return (
    <section
      className="absolute inset-0 flex flex-col no-scrollbar"
      style={{
        background: bg,
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        zIndex: active ? 2 : 1,
        transition: "opacity 850ms ease",
        overflowY: "auto",
        ...extraStyle,
      }}
    >
      {children}
    </section>
  );
}

function IntroButton({ onEnter }: { onEnter: () => void }) {
  const { hovered, handlers } = useHover();
  return (
    <button onClick={onEnter} {...handlers} aria-label="Entrar" className="bg-transparent border-none p-0 cursor-pointer">
      <svg viewBox="0 0 200 200" className="block" style={{ width: 240 }}>
        <circle cx={100} cy={100} r={97} fill="none" stroke="#899EAA" strokeWidth={1} opacity={0.4} />
        <circle cx={100} cy={100} r={86} fill="none" stroke="#899EAA" strokeWidth={1} opacity={0.6} />
        <circle cx={100} cy={100} r={75} fill="none" stroke="#899EAA" strokeWidth={1} opacity={0.9} />
        <circle cx={100} cy={100} r={66} fill="#899EAA" style={{ opacity: hovered ? 1 : 0, transition: "opacity 650ms ease" }} />
      </svg>
    </button>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent cursor-pointer rounded-full font-mono text-[15px]"
      style={{
        color: "#C9DCE6",
        border: `1px solid rgba(201,220,230,${active ? 1 : 0.55})`,
        padding: "11px 28px",
        transition: "background 250ms ease, color 250ms ease, border-color 250ms ease",
      }}
    >
      {children}
    </button>
  );
}

function CaseCard({ c, onOpen }: { c: SiteCase; onOpen: () => void }) {
  const { hovered, handlers } = useHover();
  return (
    <div
      onClick={onOpen}
      {...handlers}
      className="rounded-2xl flex flex-col justify-end p-6 cursor-pointer"
      style={{
        background: hovered ? "#2C3841" : "#263038",
        aspectRatio: "1.85",
        transform: hovered ? "translateY(-5px)" : "none",
        transition: "transform 300ms ease, background 300ms ease",
        backgroundImage: c.imageUrl ? `linear-gradient(rgba(16,16,16,.35), rgba(16,16,16,.55)), url(${c.imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="font-bold text-[22px]" style={{ color: "#B7D0DE" }}>
        {c.title}
      </div>
      <div className="mt-[9px] text-sm" style={{ color: "rgba(183,208,222,.6)" }}>
        {c.tagsLabel}
      </div>
    </div>
  );
}

function CaseOverlay({
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
      className="absolute inset-0 z-[60] bg-[#101010]"
      style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 500ms ease" }}
    >
      <div
        className="no-scrollbar absolute inset-0 m-auto flex flex-col overflow-y-auto"
        style={{ width: "min(1440px,100%)", height: "min(800px,100%)", padding: "0 56px" }}
      >
        <div className="flex justify-between items-start py-7 flex-none">
          <button onClick={onHome} aria-label="Inicio" className="bg-transparent border-none p-0 cursor-pointer flex flex-col gap-1 leading-none">
            <BmLogo color="#C9D6DE" width={128} />
          </button>
          <button onClick={onClose} aria-label="Cerrar" className="bg-transparent border-none p-1.5 cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-9" stroke="#C9D6DE" strokeWidth={1} fill="none">
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </button>
        </div>
        <div className="relative flex-1 rounded-[18px] overflow-hidden m-0" style={{ minHeight: 170 }}>
          {c.imageUrl && <img src={c.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        </div>
        <div className="relative pt-6" style={{ maxWidth: 920 }}>
          <h1 className="italic font-extralight m-0" style={{ color: "#C9D6DE", fontSize: 44, lineHeight: 1.05 }}>
            {c.title}
          </h1>
          <div className="my-5" style={{ color: "rgba(201,214,222,.6)", fontSize: 15 }}>
            {c.tagsLabel}
          </div>
          <div className="mb-[30px]" style={{ color: "rgba(201,214,222,.85)", fontSize: 16, lineHeight: 1.6 }}>
            {c.desc}
          </div>
          {c.audioUrl && (
            <div className="rounded-[14px] p-5 mb-8" style={{ border: "1px solid rgba(201,214,222,.4)", maxWidth: 520 }}>
              <div className="mb-[13px] text-[10px]" style={{ color: "rgba(201,214,222,.55)", letterSpacing: ".16em" }}>
                DISEÑO SONORO
              </div>
              <div className="flex items-center gap-4">
                <PlayButton audio={audio} accent="#C9D6DE" />
                <div className="flex-1 min-w-0">
                  <div
                    onClick={audio.seek}
                    className="h-1.5 rounded-full cursor-pointer overflow-hidden"
                    style={{ background: "rgba(201,214,222,.22)" }}
                  >
                    <div className="h-full" style={{ width: `${audio.pct}%`, background: "#C9D6DE" }} />
                  </div>
                  <div className="flex justify-between mt-2 text-[11px]" style={{ color: "rgba(201,214,222,.5)" }}>
                    <span>{audio.curLabel}</span>
                    <span>{audio.durLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <audio ref={audio.audioRef} preload="metadata" className="hidden" />
          <VisitSiteLink href={c.url} accent="#C9D6DE" onDark="#101010" />
        </div>
        <div className="flex justify-between items-center py-[18px] flex-none" style={{ paddingBottom: 22 }}>
          <div className="text-[13px]" style={{ color: "rgba(201,214,222,.5)" }}>
            al scrollear: galería por bloques, tipo lámina · audio del caso
          </div>
          <div className="flex gap-10">
            <NavArrow onClick={onPrev}>← Anterior</NavArrow>
            <NavArrow onClick={onNext}>Siguiente →</NavArrow>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayButton({ audio, accent }: { audio: ReturnType<typeof useAudioPlayer>; accent: string }) {
  const { hovered, handlers } = useHover();
  return (
    <button
      onClick={audio.togglePlay}
      {...handlers}
      aria-label="Reproducir"
      className="flex-none w-[46px] h-[46px] rounded-full flex items-center justify-center cursor-pointer"
      style={{
        border: `1px solid ${accent}`,
        background: hovered ? "rgba(201,214,222,.12)" : "none",
        transition: "background 250ms ease",
      }}
    >
      {audio.playing ? (
        <svg viewBox="0 0 24 24" className="w-4" fill={accent}>
          <rect x={6} y={5} width={4} height={14} />
          <rect x={14} y={5} width={4} height={14} />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-4 ml-0.5" fill={accent}>
          <path d="M7 4v16l13-8z" />
        </svg>
      )}
    </button>
  );
}

function VisitSiteLink({ href, accent, onDark }: { href: string; accent: string; onDark: string }) {
  const { hovered, handlers } = useHover();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...handlers}
      className="inline-flex items-center gap-2.5 font-bold rounded-full"
      style={{
        fontSize: 13,
        color: hovered ? onDark : accent,
        border: `1px solid rgba(201,214,222,.7)`,
        background: hovered ? accent : "none",
        padding: "15px 32px",
        transition: "background 250ms ease, color 250ms ease",
      }}
    >
      Visitar Sitio ↗
    </a>
  );
}

function NavArrow({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const { hovered, handlers } = useHover();
  return (
    <button
      onClick={onClick}
      {...handlers}
      className="bg-transparent border-none cursor-pointer p-0 font-bold text-sm"
      style={{ color: "#C9D6DE", opacity: hovered ? 0.65 : 1, transition: "opacity 250ms ease" }}
    >
      {children}
    </button>
  );
}
