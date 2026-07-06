"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      onClick={logout}
      disabled={isLoggingOut}
      className="rounded-xl border border-white/10 px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
    >
      {isLoggingOut ? "Leaving..." : "Log out"}
    </button>
  );
}
