import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/panel-auth";
import { getN8nStatus, getMetaAdsStatus } from "@/lib/panel-data";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-2"
      style={{ background: color }}
    />
  );
}

export default async function CampoCapitalPanel() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const username = await verifySessionToken(token);

  const [n8nStatus, metaStatus] = await Promise.all([
    getN8nStatus(),
    getMetaAdsStatus(),
  ]);

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{ background: "#101010", color: "#EDEAE2" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-medium">Campo Capital</h1>
          <LogoutButton />
        </div>
        <p className="text-sm opacity-60 mb-10">
          Panel de estado · sesión: {username}
        </p>

        {/* Dirección de Arte / n8n */}
        <section className="mb-8 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">
            Dirección de Arte (bot de diseño)
          </h2>

          {!n8nStatus.configured && (
            <p className="text-sm opacity-60">
              <StatusDot color="#7a7a7a" />
              Todavía no conectado — falta configurar N8N_BASE_URL y
              N8N_API_KEY.
            </p>
          )}

          {n8nStatus.configured && n8nStatus.error && (
            <p className="text-sm" style={{ color: "#BA5130" }}>
              Error al consultar n8n: {n8nStatus.error}
            </p>
          )}

          {n8nStatus.configured &&
            !n8nStatus.error &&
            n8nStatus.workflows.map((wf) => (
              <div key={wf.name} className="mb-4 last:mb-0">
                <p className="text-sm font-medium mb-1">{wf.name}</p>
                <p className="text-sm opacity-70">
                  <StatusDot
                    color={wf.failedRecent > 0 ? "#BA5130" : "#4a7a5a"}
                  />
                  {wf.totalRecent} ejecuciones recientes
                  {wf.failedRecent > 0 &&
                    ` · ${wf.failedRecent} con error`}
                </p>
              </div>
            ))}
        </section>

        {/* Meta Ads */}
        <section className="mb-8 border border-white/10 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Publicidad (Meta Ads)</h2>

          {!metaStatus.configured && (
            <p className="text-sm opacity-60">
              <StatusDot color="#7a7a7a" />
              Todavía no conectado — falta configurar META_ACCESS_TOKEN y
              META_AD_ACCOUNT_ID.
            </p>
          )}

          {metaStatus.configured && metaStatus.error && (
            <p className="text-sm" style={{ color: "#BA5130" }}>
              Error al consultar Meta: {metaStatus.error}
            </p>
          )}

          {metaStatus.configured &&
            !metaStatus.error &&
            metaStatus.campaigns.length === 0 && (
              <p className="text-sm opacity-60">
                Conectado, sin campañas todavía.
              </p>
            )}

          {metaStatus.configured &&
            !metaStatus.error &&
            metaStatus.campaigns.map((c) => (
              <div key={c.name} className="mb-3 last:mb-0">
                <p className="text-sm font-medium mb-1">{c.name}</p>
                <p className="text-sm opacity-70">
                  <StatusDot
                    color={c.status === "ACTIVE" ? "#4a7a5a" : "#7a7a7a"}
                  />
                  {c.status} · {c.objective}
                </p>
              </div>
            ))}
        </section>

        {/* Próximamente */}
        <section className="border border-white/10 rounded-lg p-6 opacity-50">
          <h2 className="text-lg font-medium mb-2">Próximamente</h2>
          <p className="text-sm">WhatsApp · Kommo CRM</p>
        </section>
      </div>
    </div>
  );
}
