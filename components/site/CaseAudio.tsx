import AudioPlayer from "../AudioPlayer";
import CaseLinkButton from "./CaseLinkButton";
import { audioPlatformLabel, toAudioEmbedUrl } from "./embedUrl";

export default function CaseAudio({
  audioFileUrl,
  audioEmbedUrl,
  accent,
  variant,
  className,
}: {
  audioFileUrl: string;
  audioEmbedUrl: string;
  accent: string;
  variant: "desktop" | "mobile";
  className?: string;
}) {
  if (audioFileUrl) {
    return <AudioPlayer src={audioFileUrl} accent={accent} className={className} />;
  }

  if (!audioEmbedUrl) return null;

  const embed = toAudioEmbedUrl(audioEmbedUrl);
  if (embed) {
    return (
      <iframe
        src={embed.src}
        className={`w-full rounded-[10px] border-none ${className || ""}`}
        height={embed.height}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen"
        title="Audio del caso"
      />
    );
  }

  return (
    <CaseLinkButton href={audioEmbedUrl} variant={variant} className={className}>
      Escuchar en {audioPlatformLabel(audioEmbedUrl)} ↗
    </CaseLinkButton>
  );
}
