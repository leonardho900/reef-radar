"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type DiveSite = {
  id: number;
  name: string;
  countryName: string;
  region: string;
  island: string | null;
};

const NO_ISLAND = "__NO_ISLAND__";

export default function DiveLogForm({
  diveSites,
  initialDiveSiteId,
}: {
  diveSites: DiveSite[];
  initialDiveSiteId?: string;
}) {
  const initialDiveSite = diveSites.find(
    (site) => String(site.id) === initialDiveSiteId,
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDiveSiteId, setSelectedDiveSiteId] = useState(
    initialDiveSiteId ?? "",
  );
  const [selectedCountry, setSelectedCountry] = useState(
    initialDiveSite?.countryName ?? "",
  );
  const [selectedRegion, setSelectedRegion] = useState(
    initialDiveSite?.region ?? "",
  );
  const [selectedIsland, setSelectedIsland] = useState(
    initialDiveSite ? (initialDiveSite.island ?? NO_ISLAND) : "",
  );

  const countries = useMemo(
    () => [...new Set(diveSites.map((site) => site.countryName))],
    [diveSites],
  );
  const regions = useMemo(
    () => [
      ...new Set(
        diveSites
          .filter((site) => site.countryName === selectedCountry)
          .map((site) => site.region),
      ),
    ],
    [diveSites, selectedCountry],
  );
  const islands = useMemo(
    () => [
      ...new Set(
        diveSites
          .filter(
            (site) =>
              site.countryName === selectedCountry &&
              site.region === selectedRegion,
          )
          .map((site) => site.island ?? NO_ISLAND),
      ),
    ],
    [diveSites, selectedCountry, selectedRegion],
  );
  const filteredDiveSites = useMemo(
    () =>
      diveSites.filter(
        (site) =>
          site.countryName === selectedCountry &&
          site.region === selectedRegion &&
          (site.island ?? NO_ISLAND) === selectedIsland,
      ),
    [diveSites, selectedCountry, selectedRegion, selectedIsland],
  );
  const selectedDiveSite = filteredDiveSites.find(
    (site) => String(site.id) === selectedDiveSiteId,
  );

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedDiveSiteId) {
      setError("Choose a dive site from the suggestions before continuing.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const optionalNumber = (name: string) => {
      const value = formData.get(name)?.toString();
      return value ? Number(value) : null;
    };

    try {
      const response = await fetch("/api/dive-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diveSiteId: Number(formData.get("diveSiteId")),
          diveDate: formData.get("diveDate"),
          maxDepthMeters: Number(formData.get("maxDepthMeters")),
          durationMinutes: Number(formData.get("durationMinutes")),
          waterTemperatureCelsius: optionalNumber(
            "waterTemperatureCelsius",
          ),
          visibilityMeters: optionalNumber("visibilityMeters"),
          notes: formData.get("notes") || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message ?? "Unable to create dive log");
      }

      const diveLogId = Number(data?.id);

      if (!Number.isInteger(diveLogId) || diveLogId < 1) {
        throw new Error(
          "The dive was saved, but the server did not return its ID.",
        );
      }

      window.location.assign(`/dive-logs/${diveLogId}/sightings/new`);
    } catch (exception) {
      setError(
        exception instanceof Error
          ? exception.message
          : "Unable to create dive log",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,_rgba(8,145,178,0.18),_transparent_65%)]" />

      <section className="relative mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-300"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <header className="lg:sticky lg:top-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Step 1 of 2
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Record your dive
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-400">
              Capture the essentials from your dive computer and memory. You
              will add marine-life sightings in the next step.
            </p>

            <ol className="mt-8 space-y-3" aria-label="Dive logging progress">
              <li className="flex items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 font-bold text-slate-950">1</span>
                <div>
                  <p className="text-sm font-semibold text-white">Dive details</p>
                  <p className="text-xs text-slate-400">Site and conditions</p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-3 text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 font-bold">2</span>
                <div>
                  <p className="text-sm font-semibold">Marine sightings</p>
                  <p className="text-xs">What you observed</p>
                </div>
              </li>
            </ol>
          </header>

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border border-cyan-200/10 bg-slate-900/90 shadow-[0_24px_80px_-32px_rgba(6,182,212,0.32)] ring-1 ring-white/[0.03] backdrop-blur"
          >
          <FormSection
            number="01"
            title="Where and when"
            description="Start with the essentials for this dive."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Country">
                <select
                  required
                  value={selectedCountry}
                  onChange={(event) => {
                    setSelectedCountry(event.target.value);
                    setSelectedRegion("");
                    setSelectedIsland("");
                    setSelectedDiveSiteId("");
                  }}
                  className="input bg-slate-950/70"
                >
                  <option value="">Choose a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Region">
                <select
                  required
                  value={selectedRegion}
                  disabled={!selectedCountry}
                  onChange={(event) => {
                    setSelectedRegion(event.target.value);
                    setSelectedIsland("");
                    setSelectedDiveSiteId("");
                  }}
                  className="input bg-slate-950/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {selectedCountry ? "Choose a region" : "Choose a country first"}
                  </option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Island">
                <select
                  required
                  value={selectedIsland}
                  disabled={!selectedRegion}
                  onChange={(event) => {
                    setSelectedIsland(event.target.value);
                    setSelectedDiveSiteId("");
                  }}
                  className="input bg-slate-950/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {selectedRegion ? "Choose an island" : "Choose a region first"}
                  </option>
                  {islands.map((island) => (
                    <option key={island} value={island}>
                      {island === NO_ISLAND ? "No island specified" : island}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Dive site">
                <select
                  name="diveSiteId"
                  required
                  value={selectedDiveSiteId}
                  disabled={!selectedIsland}
                  onChange={(event) =>
                    setSelectedDiveSiteId(event.target.value)
                  }
                  className="input bg-slate-950/70 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {selectedIsland ? "Choose a dive site" : "Choose an island first"}
                  </option>
                  {filteredDiveSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Dive date">
                <input
                  name="diveDate"
                  type="date"
                  required
                  max={today}
                  defaultValue={today}
                  className="input"
                />
              </Field>

              <div
                className={`sm:col-span-2 rounded-xl border px-4 py-3 text-sm transition ${
                  selectedDiveSite
                    ? "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100"
                    : "border-white/[0.07] bg-slate-950/35 text-slate-500"
                }`}
                aria-live="polite"
              >
                {selectedDiveSite ? (
                  <span>
                    <span className="font-semibold text-cyan-300">Selected location:</span>{" "}
                    {[
                      selectedCountry,
                      selectedRegion,
                      selectedIsland === NO_ISLAND ? null : selectedIsland,
                      selectedDiveSite.name,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                ) : (
                  "Choose a country, region, island, and dive site to continue."
                )}
              </div>
            </div>
          </FormSection>

          <FormSection
            number="02"
            title="Dive conditions"
            description="Add the key numbers from your computer and observations."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Maximum depth" unit="metres">
                <input
                  name="maxDepthMeters"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="24.5"
                  required
                  className="input"
                />
              </Field>

              <Field label="Bottom time" unit="minutes">
                <input
                  name="durationMinutes"
                  type="number"
                  min="1"
                  placeholder="48"
                  required
                  className="input"
                />
              </Field>

              <Field label="Water temperature" unit="°C" optional>
                <input
                  name="waterTemperatureCelsius"
                  type="number"
                  step="0.1"
                  placeholder="28"
                  className="input"
                />
              </Field>

              <Field label="Visibility" unit="metres" optional>
                <input
                  name="visibilityMeters"
                  type="number"
                  min="1"
                  placeholder="20"
                  className="input"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            number="03"
            title="Field notes"
            description="Save the little details you will want to remember."
          >
            <Field label="Notes" optional>
              <textarea
                name="notes"
                rows={5}
                maxLength={2000}
                placeholder="Conditions, route, gear, memorable moments..."
                className="input resize-none leading-6"
              />
            </Field>
          </FormSection>

          <div className="border-t border-white/10 bg-slate-950/55 px-6 py-6 sm:px-8">
            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Link
                href="/dashboard"
                className="rounded-xl border border-transparent px-5 py-3 text-center text-sm font-semibold text-slate-400 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !selectedDiveSiteId}
                className="rounded-xl bg-gradient-to-r from-cyan-300 to-sky-300 px-7 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:-translate-y-0.5 hover:from-cyan-200 hover:to-sky-200 hover:shadow-cyan-400/20 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSubmitting ? "Saving dive..." : "Save and add sightings →"}
              </button>
            </div>
          </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  unit,
  optional = false,
  children,
}: {
  label: string;
  unit?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="group block">
      <span className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-200 transition group-focus-within:text-cyan-200">
        <span>
          {label}
          {unit && <span className="ml-1.5 font-normal text-slate-500">{unit}</span>}
        </span>
        {optional && (
          <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[0.6875rem] font-medium text-slate-500">
            Optional
          </span>
        )}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-white/[0.08] px-6 py-7 transition-colors hover:bg-white/[0.012] sm:px-8 sm:py-8">
      <div className="mb-6 flex items-start gap-4">
        <p className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-cyan-300/10 px-2 text-[0.6875rem] font-bold tracking-[0.12em] text-cyan-300 ring-1 ring-cyan-300/10">
          {number}
        </p>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
