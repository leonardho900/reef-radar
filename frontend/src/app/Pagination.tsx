"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Pagination({
  basePath,
  currentPage,
  totalPages,
  query = {},
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  query?: Record<string, string | undefined>;
}) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    if (page > 1) params.set("page", String(page));
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  }

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-8 max-w-xl rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5"
    >
      <div className="flex items-center gap-3">
        {currentPage > 1 ? (
          <Link
            href={hrefFor(currentPage - 1)}
            aria-label="Previous page"
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-300"
          >
            ← <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span className="px-2.5 py-1.5 text-xs text-slate-600">
            ← <span className="hidden sm:inline">Previous</span>
          </span>
        )}

        <label className="flex min-w-0 flex-1 items-center justify-center gap-2 text-xs text-slate-400">
          <span>Page</span>
          <select
            value={currentPage}
            onChange={(event) =>
              router.push(hrefFor(Number(event.target.value)))
            }
            className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 font-semibold text-cyan-300 outline-none transition focus:border-cyan-300/50"
            aria-label={`Select page. Current page ${currentPage} of ${totalPages}`}
          >
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <option key={page} value={page}>
                  {page}
                </option>
              ),
            )}
          </select>
          <span>of {totalPages}</span>
        </label>

        {currentPage < totalPages ? (
          <Link
            href={hrefFor(currentPage + 1)}
            aria-label="Next page"
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-300"
          >
            <span className="hidden sm:inline">Next</span> →
          </Link>
        ) : (
          <span className="px-2.5 py-1.5 text-xs text-slate-600">
            <span className="hidden sm:inline">Next</span> →
          </span>
        )}
      </div>
    </nav>
  );
}
