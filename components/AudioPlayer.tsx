"use client";

import useAudioPlayer from "./site/useAudioPlayer";

export default function AudioPlayer({
  src,
  accent = "#C9D6DE",
  className,
}: {
  src: string;
  accent?: string;
  className?: string;
}) {
  const audio = useAudioPlayer(src);

  return (
    <div className={`flex items-center gap-2.5 ${className || ""}`}>
      <button
        onClick={audio.togglePlay}
        aria-label={audio.playing ? "Pausar" : "Reproducir"}
        className="flex-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-transparent"
        style={{ border: `1px solid ${accent}`, transition: "background 250ms ease" }}
      >
        {audio.playing ? (
          <svg viewBox="0 0 24 24" className="w-3" fill={accent}>
            <rect x={6} y={5} width={4} height={14} />
            <rect x={14} y={5} width={4} height={14} />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-3 ml-0.5" fill={accent}>
            <path d="M7 4v16l13-8z" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        <span className="text-[10px] flex-none" style={{ color: accent }}>
          {audio.curLabel}
        </span>
        <div
          onClick={audio.seek}
          className="h-1 rounded-full cursor-pointer overflow-hidden flex-1"
          style={{ background: "rgba(201,214,222,.22)" }}
        >
          <div className="h-full" style={{ width: `${audio.pct}%`, background: accent }} />
        </div>
        <span className="text-[10px] flex-none" style={{ color: accent }}>
          {audio.durLabel}
        </span>
      </div>
      <audio ref={audio.audioRef} preload="metadata" className="hidden" />
    </div>
  );
}
