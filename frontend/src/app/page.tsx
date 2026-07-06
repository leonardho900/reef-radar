import Link from "next/link";

type DiveSite = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  averageVisibilityMeters: number;
};

async function getDiveSites(): Promise<DiveSite[]> {
  const response = await fetch("http://localhost:8080/api/dive-sites", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load dive sites");
  }

  return response.json();
}

export default async function Home() {
  const diveSites = await getDiveSites();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between p-6">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            ReefRadar
          </Link>

          <div className="flex gap-6 text-sm text-slate-300">
            <Link href="/">Explore</Link>
            <Link href="/login">Login</Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 font-medium text-cyan-400">
          Explore beneath the surface
        </p>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight">
          Discover dive sites through recent marine-life sightings.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          See what divers recently observed, compare conditions, and plan your
          next underwater adventure.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-2xl font-semibold">Featured dive sites</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {diveSites.map((site) => (
            <Link
              key={site.id}
              href={`/dive-sites/${site.id}`}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{site.name}</h3>

                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  {site.difficulty}
                </span>
              </div>

              <p className="mt-4 text-slate-400">{site.description}</p>

              <div className="mt-6 flex gap-6 text-sm text-slate-300">
                <span>Visibility: {site.averageVisibilityMeters} m</span>
                <span>
                  {site.latitude}, {site.longitude}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}