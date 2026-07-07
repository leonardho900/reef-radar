import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DiveLogForm from "./DiveLogForm";

type DiveSite = {
  id: number;
  name: string;
  countryName: string;
  region: string;
  island: string | null;
};

export default async function NewDiveLogPage({
  searchParams,
}: {
  searchParams: Promise<{ diveSiteId?: string }>;
}) {
  const cookieStore = await cookies();

  if (!cookieStore.get("reefradar_token")) {
    redirect("/login");
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/dive-sites`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load dive sites");
  }

  const diveSites: DiveSite[] = await response.json();
  const sortedDiveSites = diveSites.toSorted((left, right) =>
    ["countryName", "region", "island", "name"]
      .map((field) => {
        const key = field as keyof DiveSite;
        return String(left[key] ?? "").localeCompare(
          String(right[key] ?? ""),
          undefined,
          { sensitivity: "base" },
        );
      })
      .find((comparison) => comparison !== 0) ?? 0,
  );
  const { diveSiteId } = await searchParams;
  const initialDiveSiteId = sortedDiveSites.some(
    (site) => String(site.id) === diveSiteId,
  )
    ? diveSiteId
    : undefined;

  return (
    <DiveLogForm
      diveSites={sortedDiveSites}
      initialDiveSiteId={initialDiveSiteId}
    />
  );
}
