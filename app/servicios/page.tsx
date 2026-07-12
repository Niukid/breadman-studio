const services = [
  {
    title: "Branding",
    description:
      "Identidad de marca completa: logo, sistema visual, tono de voz y posicionamiento.",
  },
  {
    title: "Web",
    description:
      "Diseño y desarrollo de sitios e interfaces, de la estructura al detalle.",
  },
  {
    title: "Audio",
    description:
      "Identidad sonora, producción y sound design para marcas y proyectos propios.",
  },
];

export default function ServiciosPage() {
  return (
    <main className="min-h-screen px-6 pt-24 pb-16">
      <p className="font-display text-xs tracking-widest2 text-crust/60 mb-6">
        SERVICIOS
      </p>
      <div className="flex flex-col gap-8 max-w-md mx-auto">
        {services.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl mb-1">{s.title}</h2>
            <p className="text-sm text-crust/70">{s.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
