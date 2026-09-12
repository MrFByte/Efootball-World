"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";

export function GenerateBracketButton({ tournamentId, label }: { tournamentId: string; label: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.generateBracket(tournamentId, token);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't generate it.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 rounded-full border-2 border-border bg-lime px-5 py-3 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60 sm:text-base"
      >
        {loading ? "Generating..." : label}
      </button>
      {error ? <p className="text-xs font-bold text-pink">{error}</p> : null}
    </div>
  );
}
