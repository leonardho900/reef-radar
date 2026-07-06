"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Species = {
  id: number;
  commonName: string;
  scientificName: string;
  category: string;
};

export default function SightingForm({
  diveLogId,
  species,
}: {
  diveLogId: number;
  species: Species[];
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState("");
  const [addedCount, setAddedCount] = useState(0);

  const selectedSpecies = useMemo(
    () => species.find((item) => String(item.id) === selectedSpeciesId),
    [selectedSpeciesId, species],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sightings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diveLogId,
          speciesId: Number(formData.get("speciesId")),
          quantity: Number(formData.get("quantity")),
          notes: formData.get("notes") || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to save sighting");
      }

      setSuccess(`${data.speciesCommonName} was added to this dive.`);
      setAddedCount((count) => count + 1);
      setSelectedSpeciesId("");
      form.reset();
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to save sighting",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(8,145,178,0.22),_transparent_68%)]" />

      <section className="relative mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-300"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:items-start">
          <header className="lg:sticky lg:top-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <span aria-hidden="true">✓</span>
              Dive saved
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              What did you spot?
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
              Add the marine life you observed, one species at a time. These
              sightings help other divers know what has been seen recently.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-400">Sightings added</span>
                <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-cyan-300/10 px-3 font-bold text-cyan-300">
                  {addedCount}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                No sightings to add? That is completely fine—you can finish
                this dive at any time.
              </p>
            </div>
          </header>

          <div>
            {success && (
              <div
                aria-live="polite"
                className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3.5 text-sm text-emerald-200"
              >
                <span aria-hidden="true" className="mt-0.5">✓</span>
                <span>{success} Add another below or finish the dive.</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-2xl shadow-cyan-950/20 backdrop-blur"
            >
              <div className="space-y-7 p-6 sm:p-8">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">
                    Marine species
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">
                    Choose the closest match from the species catalogue.
                  </span>
                  <select
                    name="speciesId"
                    required
                    value={selectedSpeciesId}
                    onChange={(event) => {
                      setSelectedSpeciesId(event.target.value);
                      setSuccess("");
                    }}
                    className="input mt-3"
                  >
                    <option value="" disabled>
                      Select a species
                    </option>
                    {species.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.commonName}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedSpecies && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-100">
                        {selectedSpecies.commonName}
                      </p>
                      <p className="mt-0.5 text-sm italic text-slate-400">
                        {selectedSpecies.scientificName}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                      {selectedSpecies.category}
                    </span>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-[9rem_1fr]">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">
                      Quantity
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Best estimate
                    </span>
                    <input
                      name="quantity"
                      type="number"
                      min="1"
                      defaultValue="1"
                      required
                      className="input mt-3"
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-200">
                      Notes
                      <span className="text-xs font-normal text-slate-500">
                        Optional
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Behaviour, location, or anything memorable
                    </span>
                    <textarea
                      name="notes"
                      rows={4}
                      maxLength={2000}
                      placeholder="For example: resting beneath the reef ledge..."
                      className="input mt-3 resize-none leading-6"
                    />
                  </label>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 bg-slate-950/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <Link
                  href="/dashboard"
                  className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Finish dive
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSpeciesId}
                  className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? "Adding sighting..." : "Add sighting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
