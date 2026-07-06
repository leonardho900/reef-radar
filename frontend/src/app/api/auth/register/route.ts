import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const registration = await request.json();

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registration),
    },
  );

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}