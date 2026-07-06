import Link from "next/link";
import { notFound } from "next/navigation";

type DiveSite = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  averageVisibilityMeters: number;
};

type Sighting = {
  id: number;
  diveLogId: number;
  speciesId: number;
  speciesCommonName: string;
  speciesScientificName: string;
  quantity: number;
  notes: string | null;
  createdAt: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getDiveSite(id: string): Promise<DiveSite> {
  const response = await fetch(
    `http://localhost:8080/api/dive-sites/${id}`,
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
    `http://localhost:8080/api/dive-sites/${id}/sightings`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load sightings");
  }

  return response.json();
}

export default async function DiveSitePage({ params }: PageProps) {
  const { id } = await params;

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
            </div>

            <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              {site.difficulty}
            </span>
          </div>

          <p className="mt-6 max-w-3xl text-lg text-slate-300">
            {site.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Info label="Visibility" value={`${site.averageVisibilityMeters} m`} />
            <Info label="Latitude" value={String(site.latitude)} />
            <Info label="Longitude" value={String(site.longitude)} />
          </div>
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
                      <h3 className="text-lg font-semibold">
                        {sighting.speciesCommonName}
                      </h3>
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
                    Recorded {new Date(sighting.createdAt).toLocaleDateString()}
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}