"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SearchableDropdownOption = {
  value: string;
  label: string;
};

export default function SearchableDropdown({
  name,
  value,
  options,
  emptyLabel,
  searchLabel,
  disabled = false,
  withTopMargin = true,
  onChange,
}: {
  name: string;
  value: string;
  options: SearchableDropdownOption[];
  emptyLabel: string;
  searchLabel: string;
  disabled?: boolean;
  withTopMargin?: boolean;
  onChange: (value: string) => void;
}) {
  const menuId = `${useId()}-options`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = options.find((option) => option.value === value);
  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      `${option.label} ${option.value}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [options, query]);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  function select(nextValue: string) {
    onChange(nextValue);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div
      ref={wrapperRef}
      className={withTopMargin ? "relative mt-2" : "relative"}
    >
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setQuery("");
          setIsOpen((open) => !open);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        className="input compact-dropdown flex items-center justify-between text-left text-sm disabled:cursor-not-allowed disabled:opacity-50"
        style={{ height: "2.75rem", minHeight: "2.75rem" }}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="listbox"
      >
        <span className="truncate text-slate-100">
          {selectedOption?.label ?? emptyLabel}
        </span>
        <Chevron isOpen={isOpen} />
      </button>

      {isOpen && !disabled && (
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
              placeholder={`Search ${searchLabel.toLocaleLowerCase()}...`}
              className="input compact-input rounded-lg text-sm"
              style={{ height: "2.25rem", minHeight: "2.25rem" }}
              aria-label={`Search ${searchLabel.toLocaleLowerCase()}`}
              autoComplete="off"
            />
          </div>

          <div
            id={menuId}
            role="listbox"
            className="max-h-64 overflow-y-auto p-1.5"
          >
            <OptionButton
              label={emptyLabel}
              selected={!value}
              onClick={() => select("")}
            />
            {matches.length ? (
              matches.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={option.value === value}
                  onClick={() => select(option.value)}
                />
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-slate-500">
                No matching {searchLabel.toLocaleLowerCase()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      onClick={(event) => {
        if (event.detail === 0) onClick();
      }}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
    >
      <span className="truncate">{label}</span>
      {selected && <span className="shrink-0 text-cyan-300">✓</span>}
    </button>
  );
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
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
  );
}
