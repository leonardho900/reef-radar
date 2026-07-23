"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SearchableSpecies = {
  id: number;
  commonName: string;
  scientificName: string;
  category: string;
};

export default function SpeciesSearchSelect({
  species,
  selectedId,
  onChange,
  name = "speciesId",
  emptyLabel = "All species",
  required = false,
}: {
  species: SearchableSpecies[];
  selectedId: string;
  onChange: (id: string) => void;
  name?: string;
  emptyLabel?: string;
  required?: boolean;
}) {
  const menuId = `${useId()}-species-options`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedSpecies = species.find(
    (item) => String(item.id) === selectedId,
  );
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMemo(
    () => species.filter((item) => matchesSpecies(item, query)).slice(0, 20),
    [query, species],
  );

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  function chooseSpecies(id: string) {
    onChange(id);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative mt-2">
      <input type="hidden" name={name} value={selectedId} />

      <button
        type="button"
        onClick={() => {
          setQuery("");
          setIsOpen((open) => !open);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="input compact-dropdown flex items-center justify-between text-left text-sm"
        style={{ height: "2.75rem", minHeight: "2.75rem" }}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="listbox"
      >
        <span className="truncate text-slate-100">
          {selectedSpecies?.commonName ?? emptyLabel}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`ml-3 h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
          style={{
            width: "16px",
            height: "16px",
            minWidth: "16px",
            maxWidth: "16px",
            flex: "0 0 16px",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
          <div className="border-b border-white/10 p-2">
            <input
              type="text"
              inputMode="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsOpen(false);
              }}
              placeholder="Search species..."
              className="input compact-input rounded-lg text-sm"
              style={{ height: "2.25rem", minHeight: "2.25rem" }}
              aria-label="Search species"
              autoComplete="off"
            />
          </div>

          <div
            id={menuId}
            role="listbox"
            className="max-h-64 overflow-y-auto p-1.5"
          >
            {!required && (
              <button
                type="button"
                role="option"
                aria-selected={!selectedId}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  chooseSpecies("");
                }}
                onClick={(event) => {
                  if (event.detail === 0) chooseSpecies("");
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/[0.06]"
              >
                {emptyLabel}
                {!selectedId && <span className="text-cyan-300">✓</span>}
              </button>
            )}

            {matches.length ? (
              matches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={String(item.id) === selectedId}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    chooseSpecies(String(item.id));
                  }}
                  onClick={(event) => {
                    if (event.detail === 0) chooseSpecies(String(item.id));
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-100">
                      {item.commonName}
                    </span>
                    <span className="mt-0.5 block truncate text-xs italic text-slate-500">
                      {item.scientificName}
                    </span>
                  </span>
                  {String(item.id) === selectedId ? (
                    <span className="shrink-0 text-cyan-300">✓</span>
                  ) : (
                    <span className="shrink-0 text-xs text-slate-500">
                      {item.category}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                No matching species
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function matchesSpecies(item: SearchableSpecies, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return true;

  return [item.commonName, item.scientificName, item.category]
    .join(" ")
    .toLocaleLowerCase()
    .includes(normalizedQuery);
}
