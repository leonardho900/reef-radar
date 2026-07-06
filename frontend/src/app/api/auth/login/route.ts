import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const credentials = await request.json();

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  const result = NextResponse.json(data.user);

  result.cookies.set("reefradar_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.expiresInSeconds,
  });

  return result;
}