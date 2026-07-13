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
