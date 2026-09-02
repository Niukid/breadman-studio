"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "No se pudo iniciar sesión");
        setLoading(false);
        return;
      }
      const next = searchParams.get("next") || "/panel/campo-capital";
      router.push(next);
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#101010", color: "#EDEAE2" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-white/10 rounded-lg p-8"
      >
        <h1 className="text-xl font-medium mb-1">Panel Breadman</h1>
        <p className="text-sm opacity-60 mb-8">Campo Capital</p>

        <label className="block text-sm mb-2 opacity-80">Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="w-full mb-4 px-3 py-2 rounded bg-white/5 border border-white/10 outline-none focus:border-white/30 text-sm"
        />

        <label className="block text-sm mb-2 opacity-80">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full mb-6 px-3 py-2 rounded bg-white/5 border border-white/10 outline-none focus:border-white/30 text-sm"
        />

        {error && (
          <p className="text-sm mb-4" style={{ color: "#BA5130" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded text-sm font-medium disabled:opacity-50"
          style={{ background: "#EDEAE2", color: "#101010" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
