"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to log in");
      }

      router.replace("/dashboard");
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to log in",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-[100svh] w-full flex-1 place-items-center overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(8,145,178,0.25),_transparent_52%)]" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-7 shadow-[0_28px_90px_-35px_rgba(6,182,212,0.45)] ring-1 ring-white/[0.03] backdrop-blur sm:p-9">
        <Link href="/" className="block text-center text-2xl font-bold text-cyan-300">
          ReefRadar
        </Link>

        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
          Diver access
        </p>

        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight">Welcome back</h1>

        <p className="mt-2 text-center leading-6 text-slate-400">
          Log in to record dives and marine-life sightings.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input mt-2"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-200">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input mt-2"
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-sky-300 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:from-cyan-200 hover:to-sky-200 disabled:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New to ReefRadar?{" "}
          <Link href="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Create an account
          </Link>
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-slate-500 transition hover:text-slate-300"
        >
          Return to dive sites
        </Link>
      </section>
    </main>
  );
}
