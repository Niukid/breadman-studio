import { getSiteSettings } from "@/lib/queries";

export const revalidate = 60;

export default async function ContactoPage() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen flex flex-col justify-end px-6 pb-16 pt-24 bg-crust text-cream">
      <p className="font-display text-xs tracking-widest2 text-cream/55 mb-4">
        CONTACTO
      </p>
      <p className="text-base mb-6 max-w-sm">
        Cuéntame de tu proyecto y te respondo pronto.
      </p>

      <form className="max-w-sm flex flex-col gap-3 mb-8">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          className="h-11 rounded-sm border border-cream/50 bg-transparent px-3 text-sm placeholder:text-cream/50 focus:outline-none focus:border-cream"
        />
        <textarea
          name="mensaje"
          placeholder="Mensaje"
          rows={4}
          className="rounded-sm border border-cream/50 bg-transparent px-3 py-2 text-sm placeholder:text-cream/50 focus:outline-none focus:border-cream"
        />
        <button
          type="submit"
          className="h-11 rounded-sm bg-cream text-crust text-sm font-medium"
        >
          Enviar
        </button>
      </form>

      <div className="text-sm text-cream/70 flex flex-col gap-1">
        {settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
        {(settings?.socialLinks || []).map((s: any) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </main>
  );
}
