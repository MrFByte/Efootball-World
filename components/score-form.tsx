"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";

export function ScoreForm({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.updateMatch(
        matchId,
        { score_a: Number(scoreA), score_b: Number(scoreB) },
        token,
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save that score.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <input
        required
        type="number"
        min={0}
        value={scoreA}
        onChange={(e) => setScoreA(e.target.value)}
        className="h-9 w-11 rounded-lg border-2 border-border bg-bg text-center font-display text-sm font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime"
      />
      <span className="font-display text-sm font-extrabold text-ink-muted">-</span>
      <input
        required
        type="number"
        min={0}
        value={scoreB}
        onChange={(e) => setScoreB(e.target.value)}
        className="h-9 w-11 rounded-lg border-2 border-border bg-bg text-center font-display text-sm font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime"
      />
      <button
        type="submit"
        disabled={loading}
        className="ml-1 rounded-full border-2 border-border bg-lime px-3 py-1.5 font-display text-xs font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60"
      >
        Save
      </button>
      {error ? <span className="text-xs font-bold text-pink">{error}</span> : null}
    </form>
  );
}
