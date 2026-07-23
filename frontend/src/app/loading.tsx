export default function AppLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center text-white">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-300/25 border-t-cyan-300" />
        </div>
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          ReefRadar is waking up
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Preparing the reef map
        </h1>
        <p className="mt-4 leading-7 text-slate-400">
          The free backend rests when nobody is diving. Its first request can
          take up to a minute—please keep this page open.
        </p>
      </div>
    </main>
  );
}
