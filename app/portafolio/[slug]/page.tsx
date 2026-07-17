import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getAllCaseSlugs, getCaseBySlug } from "@/lib/queries";
import { urlFor } from "@/sanity/client";
import { SITE_URL } from "@/lib/site";
import BmLogo from "@/components/site/BmLogo";
import CaseVideo from "@/components/site/CaseVideo";
import CaseAudio from "@/components/site/CaseAudio";
import CaseLinkButton from "@/components/site/CaseLinkButton";

export const revalidate = 60;

const tagLabels: Record<string, string> = {
  branding: "Branding",
  web: "Web",
  audio: "Audio",
  motion: "Motion",
};

export async function generateStaticParams() {
  const slugs = await getAllCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = await getCaseBySlug(params.slug);
  if (!c) return {};

  const title = `${c.title} | Breadman Studio`;
  const description = c.summary || "";
  const url = `${SITE_URL}/portafolio/${params.slug}`;
  const ogImage = c.coverImage ? urlFor(c.coverImage).width(1200).height(630).url() : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: c.coverImage?.alt || c.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function CaseDetailPage({ params }: { params: { slug: string } }) {
  const c = await getCaseBySlug(params.slug);
  if (!c) notFound();

  const tags: string[] = c.tags || [];
  const bgUrl = c.backgroundDesktop
    ? urlFor(c.backgroundDesktop).width(1600).url()
    : c.coverImage
      ? urlFor(c.coverImage).width(1600).url()
      : "";
  const bgAlt = c.backgroundDesktop?.alt || c.coverImage?.alt || c.title;

  return (
    <div className="relative min-h-screen" style={{ background: "#101010" }}>
      {bgUrl && (
        <img
          src={bgUrl}
          alt={bgAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(.5)" }}
        />
      )}
      <div className="absolute inset-0" style={{ background: "rgba(16,16,16,.55)" }} />

      <div className="relative mx-auto" style={{ maxWidth: 900, padding: "40px 24px 100px" }}>
        <Link href="/" aria-label="Inicio" className="inline-block mb-12">
          <BmLogo color="#C9D6DE" width={140} />
        </Link>

        <h1 className="italic font-extralight" style={{ color: "#C9D6DE", fontSize: 42, lineHeight: 1.1, margin: "0 0 12px" }}>
          {c.title}
        </h1>

        {tags.length > 0 && (
          <div style={{ color: "#899EAA", fontSize: 14, marginBottom: 24 }}>
            {tags.map((t) => tagLabels[t] ?? t).join(" · ")}
          </div>
        )}

        {c.summary && (
          <p style={{ color: "rgba(198,210,219,.92)", fontSize: 17, lineHeight: 1.6, marginBottom: 32, maxWidth: 720 }}>
            {c.summary}
          </p>
        )}

        {Array.isArray(c.body) && c.body.length > 0 && (
          <div style={{ color: "rgba(198,210,219,.85)", fontSize: 15, lineHeight: 1.8, marginBottom: 40, maxWidth: 720 }}>
            <PortableText value={c.body} />
          </div>
        )}

        {(c.videoFileUrl || c.videoUrl) && (
          <div style={{ marginBottom: 32 }}>
            <CaseVideo videoFileUrl={c.videoFileUrl} videoUrl={c.videoUrl} />
          </div>
        )}

        {(c.audioFileUrl || c.audioEmbedUrl) && (
          <div style={{ marginBottom: 32 }}>
            <CaseAudio
              audioFileUrl={c.audioFileUrl}
              audioEmbedUrl={c.audioEmbedUrl}
              accent="#C9D6DE"
              variant="desktop"
            />
          </div>
        )}

        {Array.isArray(c.gallery) && c.gallery.length > 0 && (
          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 40 }}>
            {c.gallery.map((img: any, i: number) => (
              <img
                key={i}
                src={urlFor(img).width(800).url()}
                alt={img.alt || `${c.title} — imagen ${i + 1}`}
                className="w-full rounded-[14px] object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {c.externalUrl && (
            <CaseLinkButton href={c.externalUrl} variant="desktop">
              Ver sitio ↗
            </CaseLinkButton>
          )}
          <Link
            href="/#portafolio"
            className="inline-flex items-center font-bold"
            style={{ color: "#C9D6DE", fontSize: 13 }}
          >
            ← Volver al portafolio
          </Link>
        </div>
      </div>
    </div>
  );
}
