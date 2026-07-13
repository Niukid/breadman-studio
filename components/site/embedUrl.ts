export function toVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      if (u.hostname.includes("player.vimeo.com")) return url;
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return url;
  } catch {
    return null;
  }
}

export function toAudioEmbedUrl(url: string): { src: string; height: number } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("spotify.com")) {
      if (u.pathname.includes("/embed/")) return { src: url, height: 152 };
      const parts = u.pathname.split("/").filter(Boolean).filter((p) => !p.startsWith("intl-"));
      const [type, id] = parts;
      if (!type || !id) return null;
      return { src: `https://open.spotify.com/embed/${type}/${id}`, height: 152 };
    }
    return null;
  } catch {
    return null;
  }
}

export function audioPlatformLabel(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes("soundcloud.com")) return "SoundCloud";
    if (hostname.includes("spotify.com")) return "Spotify";
    return "el link";
  } catch {
    return "el link";
  }
}
