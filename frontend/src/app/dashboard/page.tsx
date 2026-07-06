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
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between p-6">
          <Link href="/" className="text-2xl font-bold text-cyan-400">
            ReefRadar
          </Link>

          <div className="flex items-center gap-5">
            <LogoutButton />

            <Link
              href="/dive-logs/new"
              className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
            >
              Add dive
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <section>
          <p className="text-cyan-400">Diver dashboard</p>
          <h1 className="mt-2 text-4xl font-bold">{user.displayName}</h1>
          <p className="mt-2 text-slate-400">
            {user.bio ?? user.email}
          </p>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My dive logs</h2>
            <span className="text-sm text-slate-400">
              {diveLogs.length} dives
            </span>
          </div>

          {diveLogs.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-10 text-center">
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
                <article
                  key={log.id}
                  className="rounded-2xl border border-white/10 bg-slate-900 p-6"
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
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
