"use client";

import useIsMobile from "./useIsMobile";
import Desktop from "./Desktop";
import Mobile from "./Mobile";
import type { SiteCase } from "./caseData";

export default function Site({ cases }: { cases: SiteCase[] }) {
  const isMobile = useIsMobile();

  if (isMobile === null) return null;

  return isMobile ? <Mobile cases={cases} /> : <Desktop cases={cases} />;
}
