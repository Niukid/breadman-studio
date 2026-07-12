import Site from "@/components/site/Site";
import { getCaseStudies } from "@/lib/queries";
import { mapCases } from "@/components/site/caseData";

export const revalidate = 60;

export default async function HomePage() {
  const raw = await getCaseStudies();
  const cases = mapCases(raw);

  return <Site cases={cases} />;
}
