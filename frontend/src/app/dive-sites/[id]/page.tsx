import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type DiveSite = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  averageVisibilityMeters: number;
  countryCode: string;
  countryName: string;
  region: string;
  island: string | null;
  sourceProvider: string | null;
  sourceUrl: string | null;
};

type Sighting = {
  id: number;
  diveLogId: number;
  speciesId: number;
  speciesCommonName: string;
  speciesScientificName: string;
  quantity: number;
  notes: string | null;
  diveDate: string;
  createdAt: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getDiveSite(id: string): Promise<DiveSite> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/dive-sites/${id}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load dive site");
  }

  return response.json();
}

async function getSightings(id: string): Promise<Sighting[]> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/dive-sites/${id}/sightings`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load sightings");
  }

  return response.json();
}

export default async function DiveSitePage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("reefradar_token")?.value);

  const [site, sightings] = await Promise.all([
    getDiveSite(id),
    getSightings(id),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/" className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Back to dive sites
        </Link>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-cyan-400">Dive site</p>
              <h1 className="mt-2 text-4xl font-bold">{site.name}</h1>
              <p className="mt-2 text-slate-400">{[site.countryName, site.region, site.island].filter(Boolean).join(" · ")}</p>
            </div>

            <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              {site.difficulty}
            </span>
          </div>

          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            {site.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Info label="Visibility" value={site.averageVisibilityMeters ? `${site.averageVisibilityMeters} m` : "Not reported"} />
            <Info label="Latitude" value={String(site.latitude)} />
            <Info label="Longitude" value={String(site.longitude)} />
          </div>

          {isLoggedIn && (
            <Link
              href={`/dive-logs/new?diveSiteId=${site.id}`}
              className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            >
              Log a dive at this site
            </Link>
          )}

          {site.sourceProvider === "OPENSTREETMAP" && site.sourceUrl && (
            <p className="mt-6 text-xs text-slate-500">
              Source:{" "}
              <a href={site.sourceUrl} className="underline hover:text-slate-300">
                © OpenStreetMap contributors
              </a>
            </p>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Recent sightings</h2>
          <p className="mt-2 text-slate-400">
            Marine life recently recorded by divers at this site.
          </p>

          {sightings.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">
              No sightings have been recorded yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {sightings.map((sighting) => (
                <article
                  key={sighting.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-6"
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <Link href={`/species/${sighting.speciesId}`} className="text-lg font-semibold hover:text-cyan-300">{sighting.speciesCommonName}</Link>
                      <p className="text-sm italic text-slate-400">
                        {sighting.speciesScientificName}
                      </p>
                    </div>

                    <span className="text-sm text-cyan-300">
                      Quantity: {sighting.quantity}
                    </span>
                  </div>

                  {sighting.notes && (
                    <p className="mt-4 text-slate-300">{sighting.notes}</p>
                  )}

                  <p className="mt-4 text-xs text-slate-500">
                    Reported from a dive on {formatDiveDate(sighting.diveDate)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function formatDiveDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
