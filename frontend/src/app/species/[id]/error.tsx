"use client";

import Link from "next/link";

export default function SpeciesDetailError({ reset }: { reset: () => void }) { return <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center text-white"><div><h1 className="text-2xl font-bold">Species details could not be loaded</h1><p className="mt-3 text-slate-400">The report data may be temporarily unavailable.</p><div className="mt-6 flex justify-center gap-3"><Link href="/species" className="rounded-xl px-5 py-3 text-slate-300">Back</Link><button onClick={reset} className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">Try again</button></div></div></main>; }
