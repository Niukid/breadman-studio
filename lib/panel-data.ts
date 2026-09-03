export type N8nStatus = {
  configured: boolean;
  error?: string;
  workflows: {
    name: string;
    lastExecutions: {
      status: string;
      startedAt: string;
    }[];
    totalRecent: number;
    failedRecent: number;
  }[];
};

export type MetaAdsStatus = {
  configured: boolean;
  error?: string;
  campaigns: {
    name: string;
    status: string;
    objective: string;
  }[];
};

export type LeadsStatus = {
  configured: boolean;
  error?: string;
  total: number;
  byStage: { stage: string; count: number }[];
  byClass: { clase: string; count: number }[];
};

const N8N_WORKFLOWS: { id: string; label: string }[] = [
  { id: "2QNKjoQ2JfYQkT5b", label: "Campo Capital WA" },
];

export async function getN8nStatus(): Promise<N8nStatus> {
  const baseUrl = process.env.N8N_BASE_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!baseUrl || !apiKey) {
    return { configured: false, workflows: [] };
  }

  try {
    const workflows = await Promise.all(
      N8N_WORKFLOWS.map(async (wf) => {
        const res = await fetch(
          `${baseUrl}/api/v1/executions?workflowId=${wf.id}&limit=10`,
          {
            headers: { "X-N8N-API-KEY": apiKey },
            cache: "no-store",
          }
        );
        if (!res.ok) {
          return {
            name: wf.label,
            lastExecutions: [],
            totalRecent: 0,
            failedRecent: 0,
          };
        }
        const data = await res.json();
        const executions = (data.data || []) as {
          status: string;
          startedAt: string;
        }[];
        return {
          name: wf.label,
          lastExecutions: executions.slice(0, 5),
          totalRecent: executions.length,
          failedRecent: executions.filter((e) => e.status === "error")
            .length,
        };
      })
    );

    return { configured: true, workflows };
  } catch (err) {
    return {
      configured: true,
      error: err instanceof Error ? err.message : "Error desconocido",
      workflows: [],
    };
  }
}

export async function getMetaAdsStatus(): Promise<MetaAdsStatus> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const adAccountId = process.env.META_AD_ACCOUNT_ID;

  if (!accessToken || !adAccountId) {
    return { configured: false, campaigns: [] };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/campaigns?fields=name,status,objective&access_token=${accessToken}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const body = await res.text();
      return { configured: true, error: body, campaigns: [] };
    }
    const data = await res.json();
    const campaigns = (data.data || []) as {
      name: string;
      status: string;
      objective: string;
    }[];
    return { configured: true, campaigns };
  } catch (err) {
    return {
      configured: true,
      error: err instanceof Error ? err.message : "Error desconocido",
      campaigns: [],
    };
  }
}

export async function getLeadsStatus(): Promise<LeadsStatus> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.LEADS_SHEET_ID;

  if (!apiKey || !sheetId) {
    return { configured: false, total: 0, byStage: [], byClass: [] };
  }

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:L?key=${apiKey}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const body = await res.text();
      return {
        configured: true,
        error: body,
        total: 0,
        byStage: [],
        byClass: [],
      };
    }
    const data = await res.json();
    const rows = (data.values || []) as string[][];
    const [header, ...leads] = rows;
    if (!header) {
      return { configured: true, total: 0, byStage: [], byClass: [] };
    }
    const stageIdx = header.indexOf("etapa");
    const classIdx = header.indexOf("clase_lead");

    const stageCounts = new Map<string, number>();
    const classCounts = new Map<string, number>();

    for (const row of leads) {
      const stage = (row[stageIdx] || "").trim() || "Sin etapa";
      const clase = (row[classIdx] || "").trim() || "Sin clase";
      stageCounts.set(stage, (stageCounts.get(stage) || 0) + 1);
      classCounts.set(clase, (classCounts.get(clase) || 0) + 1);
    }

    return {
      configured: true,
      total: leads.length,
      byStage: Array.from(stageCounts, ([stage, count]) => ({
        stage,
        count,
      })),
      byClass: Array.from(classCounts, ([clase, count]) => ({
        clase,
        count,
      })),
    };
  } catch (err) {
    return {
      configured: true,
      error: err instanceof Error ? err.message : "Error desconocido",
      total: 0,
      byStage: [],
      byClass: [],
    };
  }
}
