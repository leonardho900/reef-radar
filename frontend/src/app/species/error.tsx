"use client";

export default function SpeciesError({ reset }: { reset: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center text-white"><div><h1 className="text-2xl font-bold">Species could not be loaded</h1><p className="mt-3 text-slate-400">Please try again in a moment.</p><button onClick={reset} className="mt-6 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950">Try again</button></div></main>;
}
