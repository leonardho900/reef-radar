import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

type User = {
  id: number;
  email: string;
  displayName: string;
  bio: string | null;
  createdAt: string;
};

type DiveLog = {
  id: number;
  diveSiteId: number;
  diveSiteName: string;
  diveDate: string;
  maxDepthMeters: number;
  durationMinutes: number;
  waterTemperatureCelsius: number | null;
  visibilityMeters: number | null;
  notes: string | null;
  createdAt: string;
};

async function authenticatedFetch(path: string, token: string) {
  return fetch(`${process.env.BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("reefradar_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const [userResponse, logsResponse] = await Promise.all([
    authenticatedFetch("/api/users/me", token),
    authenticatedFetch("/api/users/me/dive-logs", token),
  ]);

  if (userResponse.status === 401 || logsResponse.status === 401) {
    redirect("/login");
  }

  if (!userResponse.ok || !logsResponse.ok) {
    throw new Error("Unable to load dashboard");
  }

  const user: User = await userResponse.json();
  const diveLogs: DiveLog[] = await logsResponse.json();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link href="/" className="text-xl font-bold text-cyan-300 sm:text-2xl">
            ReefRadar
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dive-sites/new" className="hidden text-sm font-semibold text-slate-300 hover:text-white md:inline">Add site</Link>
            <Link
              href="/dive-logs/new"
              className="rounded-xl bg-cyan-300 px-3.5 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 sm:px-4"
            >
              Add dive
            </Link>

            <LogoutButton />
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/[0.08] to-transparent p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">Diver dashboard</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{user.displayName}</h1>
          <p className="mt-2 max-w-2xl leading-6 text-slate-400">
            {user.bio ?? user.email}
          </p>
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Your underwater history</p>
              <h2 className="mt-1 text-2xl font-semibold">My dive logs</h2>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-400">
              {diveLogs.length} dives
            </span>
          </div>

          {diveLogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center sm:p-10">
              <p className="text-slate-400">No dives recorded yet.</p>
              <Link
                href="/dive-logs/new"
                className="mt-4 inline-block text-cyan-400"
              >
                Record your first dive
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {diveLogs.map((log) => (
                <Link
                    key={log.id}
                    href={`/dive-sites/${log.diveSiteId}`}
                    className="block rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50"
                    >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {log.diveSiteName}
                      </h3>
                      <p className="text-sm text-slate-400">{log.diveDate}</p>
                    </div>

                    <p className="text-cyan-300">
                      {log.maxDepthMeters} m · {log.durationMinutes} min
                    </p>
                  </div>

                  {log.notes && (
                    <p className="mt-4 text-slate-300">{log.notes}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
