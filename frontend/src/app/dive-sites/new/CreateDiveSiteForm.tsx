"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CreateDiveSiteForm() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const optionalNumber = (name: string) => form.get(name) ? Number(form.get(name)) : null;

    try {
      const response = await fetch("/api/dive-sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"), description: form.get("description") || null,
          countryCode: form.get("countryCode"), countryName: form.get("countryName"),
          region: form.get("region"), island: form.get("island") || null,
          latitude: Number(form.get("latitude")), longitude: Number(form.get("longitude")),
          difficulty: form.get("difficulty"), averageVisibilityMeters: optionalNumber("averageVisibilityMeters"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to create dive site");
      window.location.assign(`/dive-sites/${data.id}`);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Unable to create dive site");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white sm:px-6">
      <section className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-cyan-300">← Back to Explore</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Community contribution</p>
        <h1 className="mt-3 text-4xl font-bold">Add a dive site</h1>
        <p className="mt-3 text-slate-400">Add accurate location and condition details so other divers can discover the site.</p>

        <form onSubmit={submit} className="mt-8 space-y-8 rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8">
          <Section title="Site details">
            <Field label="Dive-site name"><input className="input" name="name" required maxLength={150} placeholder="Barracuda Point" /></Field>
            <Field label="Description" optional><textarea className="input resize-none" name="description" rows={4} maxLength={5000} placeholder="Currents, topography, and what makes this site notable" /></Field>
          </Section>
          <Section title="Location">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Country code"><input className="input uppercase" name="countryCode" required minLength={2} maxLength={2} pattern="[A-Za-z]{2}" placeholder="MY" /></Field>
              <Field label="Country name"><input className="input" name="countryName" required maxLength={100} placeholder="Malaysia" /></Field>
              <Field label="Region / state"><input className="input" name="region" required maxLength={120} placeholder="Sabah" /></Field>
              <Field label="Island" optional><input className="input" name="island" maxLength={120} placeholder="Sipadan Island" /></Field>
              <Field label="Latitude"><input className="input" name="latitude" type="number" min="-90" max="90" step="0.000001" required placeholder="4.114700" /></Field>
              <Field label="Longitude"><input className="input" name="longitude" type="number" min="-180" max="180" step="0.000001" required placeholder="118.628000" /></Field>
            </div>
          </Section>
          <Section title="Diving conditions">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Difficulty"><select className="input" name="difficulty" required defaultValue=""><option value="" disabled>Select difficulty</option><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></Field>
              <Field label="Average visibility (m)" optional><input className="input" name="averageVisibilityMeters" type="number" min="1" max="300" placeholder="25" /></Field>
            </div>
          </Section>
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <div className="flex justify-end gap-3"><Link href="/" className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-400">Cancel</Link><button disabled={saving} className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 disabled:opacity-50">{saving ? "Creating..." : "Create dive site"}</button></div>
        </form>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="mb-5 text-lg font-semibold">{title}</h2><div className="space-y-5">{children}</div></section>; }
function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) { return <label className="block"><span className="flex justify-between text-sm font-semibold text-slate-200">{label}{optional && <span className="font-normal text-slate-500">Optional</span>}</span><div className="mt-2">{children}</div></label>; }
