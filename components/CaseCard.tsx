import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";

const tagLabels: Record<string, string> = {
  branding: "Branding",
  web: "Web",
  audio: "Audio",
};

export default function CaseCard({
  caseItem,
  offset = 0,
}: {
  caseItem: any;
  offset?: number;
}) {
  const isExternal = Boolean(caseItem.externalUrl);
  const href = isExternal ? caseItem.externalUrl : `/portafolio/${caseItem.slug.current}`;

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{ marginLeft: `${offset * 16}px` }}
      className="block rounded-sm border border-crust/70 bg-cream-soft p-4 transition-transform hover:-translate-y-0.5"
    >
      {caseItem.coverImage && (
        <div className="mb-3 aspect-[4/3] w-full overflow-hidden rounded-sm bg-cream-deep">
          <Image
            src={urlFor(caseItem.coverImage).width(600).height(450).url()}
            alt={caseItem.title}
            width={600}
            height={450}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-medium text-crust">
          {caseItem.title}
          {isExternal && <span className="ml-1">↗</span>}
        </h3>
      </div>
      <p className="mt-1 text-xs text-crust/60">
        {(caseItem.tags || []).map((t: string) => tagLabels[t] ?? t).join(" · ")}
      </p>
      {caseItem.summary && (
        <p className="mt-2 text-sm text-crust/80">{caseItem.summary}</p>
      )}
    </Link>
  );
}
