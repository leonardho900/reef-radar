import Link from "next/link";
import { cookies } from "next/headers";
import ExploreFilters from "./ExploreFilters";
import HomeNavigation from "./HomeNavigation";
import Pagination from "./Pagination";

const RECORDS_PER_PAGE = 6;

type DiveSite = {
  id: number;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  difficulty: string;
  averageVisibilityMeters: number | null;
  countryCode: string;
  countryName: string;
  region: string;
  island: string | null;
};

type Species = {
  id: number;
  commonName: string;
};

type SearchParams = {
  country?: string;
  region?: string;
  island?: string;
  speciesId?: string;
  page?: string;
};

function parsePage(value: string | undefined) {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${process.env.BACKEND_URL}${path}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    let detail = body;

    try {
      const error = JSON.parse(body) as { message?: string };
      detail = error.message ?? body;
    } catch {
      // Keep the plain-text response when the backend did not return JSON.
    }

    throw new Error(
      `Explore request ${path} failed (${response.status})${
        detail ? `: ${detail.slice(0, 300)}` : ""
      }`,
    );
  }
  return response.json();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("reefradar_token")?.value);
  const filters = await searchParams;
  const query = new URLSearchParams();
  if (filters.country) query.set("country", filters.country);
  if (filters.region) query.set("region", filters.region);
  if (filters.island) query.set("island", filters.island);
  if (filters.speciesId) query.set("speciesId", filters.speciesId);

  const allSitesPromise = fetchJson<DiveSite[]>("/api/dive-sites");
  const [allSites, species] = await Promise.all([
    allSitesPromise,
    fetchJson<Species[]>("/api/species"),
  ]);
  const diveSites = query.size
    ? await fetchJson<DiveSite[]>(`/api/dive-sites?${query}`)
    : allSites;
  const totalPages = Math.max(
    1,
    Math.ceil(diveSites.length / RECORDS_PER_PAGE),
  );
  const currentPage = Math.min(parsePage(filters.page), totalPages);
  const visibleDiveSites = diveSites.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE,
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <HomeNavigation isLoggedIn={isLoggedIn} />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="mb-4 font-medium text-cyan-400">Explore beneath the surface</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          Discover dive sites through recently reported marine life.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Browse locations, compare conditions, and see what divers have recently seen.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <ExploreFilters
          sites={allSites}
          species={species}
          initialFilters={filters}
        />

        <div className="mb-7 mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Explore locations</p>
            <h2 className="mt-1 text-2xl font-semibold">Dive sites</h2>
          </div>
          <span className="text-sm text-slate-400">{diveSites.length} found</span>
        </div>

        {diveSites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-slate-300">No dive sites match these filters.</p>
            <p className="mt-2 text-sm text-slate-500">Try removing one filter or searching a wider area.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleDiveSites.map((site) => (
              <article key={site.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/50">
                <Link href={`/dive-sites/${site.id}`} className="block p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-cyan-300">{[site.countryName, site.region, site.island].filter(Boolean).join(" · ")}</p>
                      <h3 className="mt-2 text-xl font-semibold">{site.name}</h3>
                    </div>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">{site.difficulty}</span>
                  </div>
                  {site.description && <p className="mt-4 line-clamp-2 text-slate-400">{site.description}</p>}
                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
                    <span>Visibility: {site.averageVisibilityMeters ? `${site.averageVisibilityMeters} m` : "Not reported"}</span>
                    <span>{site.latitude}, {site.longitude}</span>
                  </div>
                </Link>
                {isLoggedIn && (
                  <div className="border-t border-white/[0.07] px-6 py-3">
                    <Link
                      href={`/dive-logs/new?diveSiteId=${site.id}`}
                      className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                    >
                      Log a dive here →
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
        <Pagination
          key={currentPage}
          basePath="/"
          currentPage={currentPage}
          totalPages={totalPages}
          query={{
            country: filters.country,
            region: filters.region,
            island: filters.island,
            speciesId: filters.speciesId,
          }}
        />
        <p className="mt-10 text-xs text-slate-600">
          Some dive-site records are sourced from{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="underline hover:text-slate-400"
          >
            © OpenStreetMap contributors
          </a>{" "}
          under the ODbL.
        </p>
      </section>
    </main>
  );
}
