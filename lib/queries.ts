import { client } from "@/sanity/client";

export async function getCaseStudies() {
  return client.fetch(`
    *[_type == "caseStudy"] | order(orderRank asc) {
      _id,
      title,
      slug,
      tags,
      summary,
      coverImage,
      backgroundDesktop,
      backgroundMobile,
      "backgroundVideoDesktopUrl": backgroundVideoDesktop.asset->url,
      "backgroundVideoMobileUrl": backgroundVideoMobile.asset->url,
      "audioFileUrl": audioFile.asset->url,
      audioEmbedUrl,
      "videoFileUrl": videoFile.asset->url,
      videoUrl,
      externalUrl,
      featured
    }
  `);
}

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getAllCaseSlugs(): Promise<string[]> {
  const slugs: (string | null)[] = await client.fetch(
    `*[_type == "caseStudy" && defined(slug.current)].slug.current`
  );
  return slugs.filter((s): s is string => Boolean(s));
}

export async function getCaseBySlug(slug: string) {
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      tags,
      summary,
      body,
      coverImage,
      backgroundDesktop,
      backgroundMobile,
      "backgroundVideoDesktopUrl": backgroundVideoDesktop.asset->url,
      "audioFileUrl": audioFile.asset->url,
      audioEmbedUrl,
      "videoFileUrl": videoFile.asset->url,
      videoUrl,
      externalUrl,
      gallery
    }`,
    { slug }
  );
}
