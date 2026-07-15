"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TextInput, Button } from "@/components/admin/ui";
import { ShieldIcon } from "@/components/ui/icons";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        setError(json.error || "Login failed");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 500px at 50% 30%, rgba(193,18,31,0.18), transparent 65%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glow-red relative z-10 w-full max-w-md rounded-3xl glass-strong p-8 sm:p-10"
      >
        <div className="mb-7 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <ShieldIcon className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-lg font-bold">Studio Access</h1>
            <p className="text-xs text-muted">Sign in to manage your portfolio</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
              Email
            </label>
            <TextInput
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@alexrivera.studio"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
              Password
            </label>
            <TextInput name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
          </div>

          {error && (
            <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
          Protected by Auth.js-style sessions · Password hashing · Rate limiting
        </p>
      </motion.div>
    </div>
  );
}
