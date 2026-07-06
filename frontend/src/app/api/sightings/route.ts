import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("reefradar_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  const sighting = await request.json();

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/sightings`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sighting),
    },
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}