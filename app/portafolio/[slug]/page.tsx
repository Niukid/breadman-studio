import { getCaseBySlug } from "@/lib/queries";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CaseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const caseItem = await getCaseBySlug(params.slug);
  if (!caseItem) notFound();

  return (
    <main className="min-h-screen px-6 pt-24 pb-16">
      <p className="font-display text-xs tracking-widest2 text-crust/60 mb-2">
        {(caseItem.tags || []).join(" · ")}
      </p>
      <h1 className="font-display text-2xl mb-6">{caseItem.title}</h1>
      <div className="max-w-md text-sm text-crust/80 leading-relaxed space-y-4">
        {/* El campo body es Portable Text: se puede renderizar con
            @portabletext/react cuando quieras texto largo con formato */}
      </div>
    </main>
  );
}
