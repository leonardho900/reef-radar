"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LocationSite = {
  countryCode: string;
  countryName: string;
  region: string;
  island: string | null;
};

type SpeciesOption = {
  id: number;
  commonName: string;
};

type InitialFilters = {
  country?: string;
  region?: string;
  island?: string;
  speciesId?: string;
};

export default function ExploreFilters({
  sites,
  species,
  initialFilters,
}: {
  sites: LocationSite[];
  species: SpeciesOption[];
  initialFilters: InitialFilters;
}) {
  const [country, setCountry] = useState(initialFilters.country ?? "");
  const [region, setRegion] = useState(
    initialFilters.country ? (initialFilters.region ?? "") : "",
  );
  const [island, setIsland] = useState(
    initialFilters.country ? (initialFilters.island ?? "") : "",
  );

  const countries = useMemo(
    () =>
      [...new Map(
        sites.map((site) => [
          site.countryCode,
          { value: site.countryCode, label: site.countryName },
        ]),
      ).values()].sort((a, b) => a.label.localeCompare(b.label)),
    [sites],
  );

  const regions = useMemo(
    () =>
      country
        ? unique(
            sites
              .filter((site) => site.countryCode === country)
              .map((site) => site.region),
          )
        : [],
    [country, sites],
  );

  const islands = useMemo(
    () =>
      country
        ? unique(
            sites
              .filter(
                (site) =>
                  site.countryCode === country &&
                  (!region || site.region === region),
              )
              .map((site) => site.island)
              .filter((value): value is string => Boolean(value)),
          )
        : [],
    [country, region, sites],
  );

  return (
    <form
      className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:grid-cols-4"
      action="/"
    >
      <Filter label="Country">
        <select
          name="country"
          value={country}
          onChange={(event) => {
            setCountry(event.target.value);
            setRegion("");
            setIsland("");
          }}
          className="input mt-2"
        >
          <option value="">All countries</option>
          {countries.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Filter>

      <Filter label="Region / state">
        <select
          name="region"
          value={region}
          disabled={!country}
          onChange={(event) => {
            setRegion(event.target.value);
            setIsland("");
          }}
          className="input mt-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {country ? "All regions" : "Choose a country first"}
          </option>
          {regions.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </Filter>

      <Filter label="Island">
        <select
          name="island"
          value={island}
          disabled={!country || islands.length === 0}
          onChange={(event) => setIsland(event.target.value)}
          className="input mt-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {!country
              ? "Choose a country first"
              : islands.length
                ? "All islands"
                : "No islands available"}
          </option>
          {islands.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </Filter>

      <Filter label="Reported species">
        <select
          name="speciesId"
          defaultValue={initialFilters.speciesId ?? ""}
          className="input mt-2"
        >
          <option value="">All species</option>
          {species.map((item) => (
            <option key={item.id} value={item.id}>{item.commonName}</option>
          ))}
        </select>
      </Filter>

      <div className="flex gap-3 md:col-span-4 md:justify-end">
        <Link
          href="/"
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white"
        >
          Clear
        </Link>
        <button className="rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-200">
          Apply filters
        </button>
      </div>
    </form>
  );
}

function Filter({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function unique(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}
