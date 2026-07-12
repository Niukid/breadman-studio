import CaseCard from "@/components/CaseCard";
import { getCaseStudies } from "@/lib/queries";

export const revalidate = 60;

export default async function PortafolioPage() {
  const cases = await getCaseStudies();

  return (
    <main className="min-h-screen px-6 pt-24 pb-16">
      <p className="font-display text-xs tracking-widest2 text-crust/60 mb-6">
        PORTAFOLIO
      </p>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {cases.map((c: any, i: number) => (
          <CaseCard key={c._id} caseItem={c} offset={i} />
        ))}
        {cases.length === 0 && (
          <p className="text-sm text-crust/60">
            Aún no hay casos publicados. Agrégalos desde{" "}
            <a href="/studio" className="underline">
              /studio
            </a>
            .
          </p>
        )}
      </div>
    </main>
  );
}
