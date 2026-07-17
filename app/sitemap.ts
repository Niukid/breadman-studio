import type { MetadataRoute } from "next";
import { getAllCaseSlugs } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllCaseSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
  ];

  const casePages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/portafolio/${slug}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticPages, ...casePages];
}
