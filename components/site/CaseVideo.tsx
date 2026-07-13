import { toVideoEmbedUrl } from "./embedUrl";

export default function CaseVideo({
  videoFileUrl,
  videoUrl,
  className,
}: {
  videoFileUrl: string;
  videoUrl: string;
  className?: string;
}) {
  if (videoFileUrl) {
    return (
      <video
        src={videoFileUrl}
        controls
        playsInline
        className={`w-full rounded-[14px] ${className || ""}`}
      />
    );
  }

  const embed = videoUrl ? toVideoEmbedUrl(videoUrl) : null;
  if (embed) {
    return (
      <div className={`relative w-full rounded-[14px] overflow-hidden ${className || ""}`} style={{ aspectRatio: "16/9" }}>
        <iframe
          src={embed}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video del caso"
        />
      </div>
    );
  }

  return null;
}
