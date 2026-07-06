import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import SightingForm from "./SightingForm";

type Species = {
  id: number;
  commonName: string;
  scientificName: string;
  category: string;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewSightingPage({ params }: PageProps) {
  const cookieStore = await cookies();

  if (!cookieStore.get("reefradar_token")) {
    redirect("/login");
  }

  const { id } = await params;
  const diveLogId = Number(id);

  if (!Number.isInteger(diveLogId)) {
    notFound();
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/species`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load species");
  }

  const species: Species[] = await response.json();

  return <SightingForm diveLogId={diveLogId} species={species} />;
}
