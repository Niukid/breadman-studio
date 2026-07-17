import { urlFor } from "@/sanity/client";

export type SiteCase = {
  id: string;
  slug: string;
  title: string;
  tagsLabel: string;
  cats: string[];
  desc: string;
  url: string;
  audioFileUrl: string;
  audioEmbedUrl: string;
  videoFileUrl: string;
  videoUrl: string;
  imageUrl: string;
  imageAlt: string;
  bgImageDesktopUrl: string;
  bgImageDesktopAlt: string;
  bgImageMobileUrl: string;
  bgImageMobileAlt: string;
  bgVideoDesktopUrl: string;
  bgVideoMobileUrl: string;
};

const tagLabels: Record<string, string> = {
  branding: "Branding",
  web: "Web",
  audio: "Audio",
  motion: "Motion",
};

export function mapCases(raw: any[]): SiteCase[] {
  return (raw || []).map((c) => {
    const tags: string[] = c.tags || [];
    return {
      id: c._id,
      slug: c.slug?.current || "",
      title: c.title,
      tagsLabel: tags.map((t) => tagLabels[t] ?? t).join(" · "),
      cats: tags,
      desc: c.summary || "",
      url: c.externalUrl || "",
      audioFileUrl: c.audioFileUrl || "",
      audioEmbedUrl: c.audioEmbedUrl || "",
      videoFileUrl: c.videoFileUrl || "",
      videoUrl: c.videoUrl || "",
      imageUrl: c.coverImage ? urlFor(c.coverImage).width(900).height(680).url() : "",
      imageAlt: c.coverImage?.alt || "",
      bgImageDesktopUrl: c.backgroundDesktop
        ? urlFor(c.backgroundDesktop).width(1600).url()
        : c.coverImage
          ? urlFor(c.coverImage).width(1600).url()
          : "",
      bgImageDesktopAlt: c.backgroundDesktop?.alt || c.coverImage?.alt || "",
      bgImageMobileUrl: c.backgroundMobile
        ? urlFor(c.backgroundMobile).width(900).url()
        : c.coverImage
          ? urlFor(c.coverImage).width(900).url()
          : "",
      bgImageMobileAlt: c.backgroundMobile?.alt || c.coverImage?.alt || "",
      bgVideoDesktopUrl: c.backgroundVideoDesktopUrl || "",
      bgVideoMobileUrl: c.backgroundVideoMobileUrl || "",
    };
  });
}
