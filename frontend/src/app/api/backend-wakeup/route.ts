import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    await fetch(`${backendUrl}/api/dive-sites`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    // Render free services can take longer than this to cold-start. Returning a
    // successful response keeps this background warm-up from breaking the UI.
    return new NextResponse(null, { status: 202 });
  }

  return new NextResponse(null, { status: 204 });
}
