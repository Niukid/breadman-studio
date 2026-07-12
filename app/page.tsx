import Pulse from "@/components/Pulse";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6">
      <Pulse />
      <div className="text-center">
        <p className="font-display text-xs tracking-widest2 text-crust/70">
          BREADMAN
        </p>
        <p className="mt-1 text-[11px] text-crust/45">
          Diseño, web y motion. Valle del Aconcagua, Chile.
        </p>
      </div>
    </main>
  );
}
