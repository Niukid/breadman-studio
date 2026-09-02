"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/panel/logout", { method: "POST" });
    router.push("/panel/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm opacity-60 hover:opacity-100 transition-opacity underline"
    >
      Cerrar sesión
    </button>
  );
}
