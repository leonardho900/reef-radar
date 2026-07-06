import Link from "next/link";
import { notFound } from "next/navigation";

type Species = { id: number; commonName: string; scientificName: string; category: string; description: string | null };
type ReportedSite = { diveSiteId: number; diveSiteName: string; countryCode: string; countryName: string; region: string; island: string | null; sightingCount: number; mostRecentSightingTime: string };

export default async function SpeciesDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [speciesResponse, sitesResponse] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/api/species/${id}`, { cache: "no-store" }),
    fetch(`${process.env.BACKEND_URL}/api/species/${id}/dive-sites`, { cache: "no-store" }),
  ]);
  if (speciesResponse.status === 404 || sitesResponse.status === 404) notFound();
  if (!speciesResponse.ok || !sitesResponse.ok) throw new Error("Unable to load species details");
  const species: Species = await speciesResponse.json();
  const sites: ReportedSite[] = await sitesResponse.json();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        <Link href="/species" className="text-sm text-cyan-300">← Back to species</Link>
        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-300">{species.category}</span>
          <h1 className="mt-5 text-4xl font-bold">{species.commonName}</h1>
          <p className="mt-2 text-lg italic text-slate-400">{species.scientificName}</p>
          {species.description && <p className="mt-6 max-w-3xl leading-7 text-slate-300">{species.description}</p>}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Where divers reported this species</h2>
          <p className="mt-2 text-slate-400">Based on community dive logs; sightings do not guarantee the species will be present.</p>
          {sites.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-10 text-center text-slate-400">This species has not been reported at a dive site yet.</div>
          ) : (
            <div className="mt-6 grid gap-4">
              {sites.map((site) => (
                <Link key={site.diveSiteId} href={`/dive-sites/${site.diveSiteId}`} className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-cyan-300/40">
                  <div><p className="text-sm text-cyan-300">{[site.countryName, site.region, site.island].filter(Boolean).join(" · ")}</p><h3 className="mt-1 text-lg font-semibold">{site.diveSiteName}</h3></div>
                  <div className="text-right text-sm"><p className="text-slate-200">{site.sightingCount} {site.sightingCount === 1 ? "report" : "reports"}</p><p className="mt-1 text-slate-500">Recently seen {new Date(site.mostRecentSightingTime).toLocaleDateString()}</p></div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
