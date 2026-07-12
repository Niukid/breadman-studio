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
      "audioFileUrl": audioFile.asset->url,
      audioEmbedUrl,
      externalUrl,
      featured
    }
  `);
}

export async function getFeaturedCase() {
  return client.fetch(`
    *[_type == "caseStudy" && featured == true][0] {
      _id,
      title,
      slug,
      tags,
      summary,
      coverImage,
      externalUrl
    }
  `);
}

export async function getCaseBySlug(slug: string) {
  return client.fetch(
    `
    *[_type == "caseStudy" && slug.current == $slug][0] {
      _id,
      title,
      tags,
      body,
      coverImage,
      gallery,
      "videoFileUrl": videoFile.asset->url,
      videoUrl,
      "audioFileUrl": audioFile.asset->url,
      audioEmbedUrl,
      externalUrl
    }
  `,
    { slug }
  );
}

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`);
}
