import Link from "next/link";

type Species = {
  id: number;
  commonName: string;
  scientificName: string;
  category: string;
  description: string | null;
};

export default async function SpeciesDirectory({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/species${params.size ? `?${params}` : ""}`,
    { cache: "no-store" },
  );
  if (!response.ok) throw new Error("Unable to search species");
  const species: Species[] = await response.json();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-6">
          <Link href="/" className="text-2xl font-bold text-cyan-300">ReefRadar</Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">Explore dive sites</Link>
        </nav>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Marine-life directory</p>
        <h1 className="mt-3 text-4xl font-bold">Search species</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Find marine species and discover the dive sites where divers have recently reported them.</p>

        <form className="mt-8 flex gap-3" action="/species">
          <input name="q" defaultValue={q} className="input" placeholder="Common or scientific name" aria-label="Search species" />
          <button className="rounded-xl bg-cyan-300 px-6 font-bold text-slate-950 hover:bg-cyan-200">Search</button>
        </form>

        <div className="mb-6 mt-10 flex justify-between gap-4"><h2 className="text-xl font-semibold">{q ? `Results for “${q}”` : "All species"}</h2><span className="text-sm text-slate-500">{species.length} found</span></div>
        {species.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center"><p className="text-slate-300">No species match this search.</p><p className="mt-2 text-sm text-slate-500">Try a common name, scientific name, or a shorter term.</p></div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {species.map((item) => (
              <Link key={item.id} href={`/species/${item.id}`} className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:border-cyan-300/40">
                <span className="rounded-full bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">{item.category}</span>
                <h2 className="mt-4 text-lg font-semibold">{item.commonName}</h2>
                <p className="mt-1 text-sm italic text-slate-400">{item.scientificName}</p>
                {item.description && <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">{item.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
