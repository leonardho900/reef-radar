import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateDiveSiteForm from "./CreateDiveSiteForm";

export default async function NewDiveSitePage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("reefradar_token")) redirect("/login");
  return <CreateDiveSiteForm />;
}
