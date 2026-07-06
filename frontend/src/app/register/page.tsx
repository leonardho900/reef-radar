"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: formData.get("displayName"),
          email: formData.get("email"),
          password: formData.get("password"),
          bio: formData.get("bio") || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to create account");
      }

      router.replace("/login");
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to create account",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-[100svh] w-full flex-1 place-items-center overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.25),_transparent_52%)]" />
      <section className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/90 p-7 shadow-[0_28px_90px_-35px_rgba(6,182,212,0.45)] ring-1 ring-white/[0.03] backdrop-blur sm:p-9">
        <Link href="/" className="block text-center text-2xl font-bold text-cyan-300">
          ReefRadar
        </Link>

        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
          Join the community
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight">Create your diver profile</h1>
        <p className="mt-2 text-center leading-6 text-slate-400">
          Start recording dives and marine-life sightings.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Display name">
            <input
              name="displayName"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="How other divers will know you"
              className="input"
            />
          </Field>

          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="input"
            />
          </Field>

          <Field label="Password">
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="input"
            />
          </Field>

          <Field label="Bio (optional)">
            <textarea
              name="bio"
              rows={3}
              maxLength={500}
              placeholder="Your diving interests or experience"
              className="input resize-none"
            />
          </Field>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200"
            >
              {error}
            </p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-300 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:from-cyan-200 hover:to-sky-200 disabled:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group block">
      <span className="text-sm font-semibold text-slate-200 transition group-focus-within:text-cyan-200">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
