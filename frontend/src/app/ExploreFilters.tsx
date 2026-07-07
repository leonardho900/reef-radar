"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SearchableDropdown from "./SearchableDropdown";
import SpeciesSearchSelect, { SearchableSpecies } from "./SpeciesSearchSelect";

type LocationSite = {
  countryCode: string;
  countryName: string;
  region: string;
  island: string | null;
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
  species: SearchableSpecies[];
  initialFilters: InitialFilters;
}) {
  const [country, setCountry] = useState(initialFilters.country ?? "");
  const [region, setRegion] = useState(
    initialFilters.country ? (initialFilters.region ?? "") : "",
  );
  const [island, setIsland] = useState(
    initialFilters.country ? (initialFilters.island ?? "") : "",
  );
  const [speciesId, setSpeciesId] = useState(initialFilters.speciesId ?? "");
  const [isOpen, setIsOpen] = useState(false);

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

  const activeFilterCount = [country, region, island, speciesId].filter(
    Boolean,
  ).length;

  function renderControls() {
    return (
      <>
        <Filter label="Reported species">
          <SpeciesSearchSelect
            species={species}
            selectedId={speciesId}
            onChange={setSpeciesId}
          />
        </Filter>

        <Filter label="Country">
          <SearchableDropdown
            name="country"
            value={country}
            options={countries}
            emptyLabel="All countries"
            searchLabel="countries"
            onChange={(value) => {
              setCountry(value);
              setRegion("");
              setIsland("");
            }}
          />
        </Filter>

        <Filter label="Region / state">
          <SearchableDropdown
            name="region"
            value={region}
            disabled={!country}
            options={regions.map((value) => ({ value, label: value }))}
            emptyLabel={country ? "All regions" : "Choose a country first"}
            searchLabel="regions"
            onChange={(value) => {
              setRegion(value);
              setIsland("");
            }}
          />
        </Filter>

        <Filter label="Island">
          <SearchableDropdown
            name="island"
            value={island}
            disabled={!country || islands.length === 0}
            options={islands.map((value) => ({ value, label: value }))}
            emptyLabel={
              !country
                ? "Choose a country first"
                : islands.length
                  ? "All islands"
                  : "No islands available"
            }
            searchLabel="islands"
            onChange={setIsland}
          />
        </Filter>

      </>
    );
  }

  function renderActions() {
    return (
      <div className="flex items-center justify-end gap-3 md:col-span-4">
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
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:hidden"
      >
        <span>Filter dive sites</span>
        <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-300">
          {activeFilterCount ? `${activeFilterCount} active` : "Filters"}
        </span>
      </button>

      <form
        className="hidden gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:grid md:grid-cols-4"
        action="/"
      >
        {renderControls()}
        {renderActions()}
      </form>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-3 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-filter-title"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <form
            action="/"
            className="relative z-10 grid max-h-[88vh] w-full max-w-md gap-5 overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Explore</p>
                <h2 id="mobile-filter-title" className="mt-1 text-xl font-bold">Filter dive sites</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg text-slate-400 hover:text-white"
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            {renderControls()}
            {renderActions()}
          </form>
        </div>
      )}
    </>
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
