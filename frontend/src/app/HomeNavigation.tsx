import Link from "next/link";
import LogoutButton from "./dashboard/LogoutButton";

export default function HomeNavigation({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="relative z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold text-cyan-300 sm:text-2xl">
          ReefRadar
        </Link>

        <div className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
          <NavLinks isLoggedIn={isLoggedIn} />
        </div>

        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 marker:content-none hover:bg-white/5">
            Menu
            <span aria-hidden="true" className="text-cyan-300 transition group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="absolute right-0 top-full mt-2 flex min-w-52 flex-col gap-1 rounded-2xl border border-white/10 bg-slate-900 p-2 text-sm text-slate-200 shadow-2xl">
            <MobileNavLinks isLoggedIn={isLoggedIn} />
          </div>
        </details>
      </nav>
    </header>
  );
}

function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <>
      <Link href="/species" className="hover:text-white">Species</Link>
      {isLoggedIn ? (
        <>
          <Link href="/dive-sites/new" className="hover:text-white">Add site</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link
            href="/dive-logs/new"
            className="rounded-lg bg-cyan-400 px-3 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Add dive
          </Link>
          <LogoutButton />
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5"
        >
          Login
        </Link>
      )}
    </>
  );
}

function MobileNavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const linkClass = "rounded-xl px-3 py-2.5 transition hover:bg-white/5 hover:text-white";

  return (
    <>
      <Link href="/species" className={linkClass}>Species</Link>
      {isLoggedIn ? (
        <>
          <Link href="/dashboard" className={linkClass}>Dashboard</Link>
          <Link href="/dive-sites/new" className={linkClass}>Add site</Link>
          <Link href="/dive-logs/new" className="rounded-xl bg-cyan-300 px-3 py-2.5 font-bold text-slate-950">
            Add dive
          </Link>
          <div className="mt-1 border-t border-white/10 pt-2">
            <LogoutButton />
          </div>
        </>
      ) : (
        <Link href="/login" className="rounded-xl bg-cyan-300 px-3 py-2.5 font-bold text-slate-950">
          Login
        </Link>
      )}
    </>
  );
}
