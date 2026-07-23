"use client";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Still waking up
        </p>
        <h1 className="mt-3 text-3xl font-bold">The reef needs another moment</h1>
        <p className="mt-4 leading-7 text-slate-400">
          ReefRadar could not reach its backend yet. Wait a few seconds, then
          try again—your data is safe.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Reload page
          </button>
        </div>
      </div>
    </main>
  );
}
