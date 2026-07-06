import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("reefradar_token")?.value;
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

  const response = await fetch(`${process.env.BACKEND_URL}/api/dive-sites`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(await request.json()),
  });
  const data = await response.json().catch(() => ({ message: "Unable to create dive site" }));
  return NextResponse.json(data, { status: response.status });
}
