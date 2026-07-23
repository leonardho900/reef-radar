const RETRY_DELAYS_MS = [0, 2_000, 3_000, 5_000, 7_000, 8_000, 10_000];
const RETRYABLE_STATUSES = new Set([500, 502, 503, 504]);

/**
 * Retries safe backend reads while Render starts a sleeping free service.
 * Do not use this helper for POST, PUT, PATCH, or DELETE requests.
 */
export async function fetchBackend(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not configured");
  }

  let lastFailure: unknown;

  for (const [attempt, delayMs] of RETRY_DELAYS_MS.entries()) {
    if (delayMs) await delay(delayMs);

    try {
      const response = await fetch(`${backendUrl}${path}`, {
        ...init,
        cache: init.cache ?? "no-store",
        signal: init.signal ?? AbortSignal.timeout(12_000),
      });

      if (!isWakeUpResponse(response)) return response;

      lastFailure = new Error(
        `Backend wake-up response ${response.status || "was not JSON"}`,
      );
    } catch (error) {
      lastFailure = error;
    }

    if (attempt === RETRY_DELAYS_MS.length - 1) break;
  }

  throw new Error(
    "ReefRadar is taking longer than expected to wake up. Please try again.",
    { cause: lastFailure },
  );
}

function isWakeUpResponse(response: Response) {
  if (RETRYABLE_STATUSES.has(response.status)) return true;

  const contentType = response.headers.get("content-type") ?? "";
  return response.ok && contentType.includes("text/html");
}

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
