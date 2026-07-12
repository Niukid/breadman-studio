import { urlFor } from "@/sanity/client";

export type SiteCase = {
  id: string;
  title: string;
  tagsLabel: string;
  cats: string[];
  desc: string;
  made: string;
  url: string;
  audioUrl: string;
  imageUrl: string;
};

const tagLabels: Record<string, string> = {
  branding: "Branding",
  web: "Web",
  audio: "Audio",
};

export function mapCases(raw: any[]): SiteCase[] {
  return (raw || []).map((c) => {
    const tags: string[] = c.tags || [];
    return {
      id: c._id,
      title: c.title,
      tagsLabel: tags.map((t) => tagLabels[t] ?? t).join(" · "),
      cats: tags,
      desc: c.summary || "",
      made: tags.length ? "— " + tags.map((t) => tagLabels[t] ?? t).join(" · ") : "",
      url: c.externalUrl || "#",
      audioUrl: c.audioFileUrl || c.audioEmbedUrl || "",
      imageUrl: c.coverImage ? urlFor(c.coverImage).width(900).height(680).url() : "",
    };
  });
}
