import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DiveLogForm from "./DiveLogForm";

type DiveSite = {
  id: number;
  name: string;
};

export default async function NewDiveLogPage() {
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

  return <DiveLogForm diveSites={diveSites} />;
}