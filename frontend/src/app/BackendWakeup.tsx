"use client";

import { useEffect } from "react";

export default function BackendWakeup() {
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/backend-wakeup", {
      cache: "no-store",
      signal: controller.signal,
    }).catch(() => {
      // This is only a background warm-up request. Page-level fetches still show
      // the friendly waking-up screen if the backend needs more time.
    });

    return () => controller.abort();
  }, []);

  return null;
}
