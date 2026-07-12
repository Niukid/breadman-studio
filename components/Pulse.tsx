import Link from "next/link";

export default function Pulse() {
  return (
    <Link
      href="/portafolio"
      aria-label="Ver portafolio"
      className="relative flex h-40 w-40 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-crust rounded-full"
    >
      <span className="absolute h-32 w-32 rounded-full border border-crust/25" />
      <span className="h-20 w-20 rounded-full bg-crust animate-pulse-slow motion-reduce:animate-none" />
    </Link>
  );
}
