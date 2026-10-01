"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";

export interface PenaltyOption {
  id: string;
  name: string;
}

// `penaltyOptions` (the two teams) is passed for knockout matches: when the
// tie ends level the backend refuses the score until a shoot-out winner is
// chosen, so a picker appears for equal scores — or on that refusal, since a
// two-leg tie can be level on aggregate without this leg being a draw.
export function ScoreForm({
  matchId,
  penaltyOptions,
}: {
  matchId: string;
  penaltyOptions?: PenaltyOption[];
}) {
  const router = useRouter();
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [winner, setWinner] = useState("");
  const [needsWinner, setNeedsWinner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isDraw = scoreA !== "" && scoreA === scoreB;
  const showWinner = Boolean(penaltyOptions) && (isDraw || needsWinner);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.updateMatch(
        matchId,
        {
          score_a: Number(scoreA),
          score_b: Number(scoreB),
          ...(showWinner && winner ? { winner_team_id: winner } : {}),
        },
        token,
      );
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.message.includes("winner_team_id")) setNeedsWinner(true);
      setError(err instanceof ApiError ? err.message : "Couldn't save that score.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-1.5">
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
      {showWinner && penaltyOptions ? (
        <select
          required
          value={winner}
          onChange={(e) => setWinner(e.target.value)}
          aria-label="Penalty shoot-out winner"
          className="h-9 rounded-lg border-2 border-border bg-bg px-2 text-xs font-bold text-ink outline-none focus:ring-2 focus:ring-lime"
        >
          <option value="">Pens winner…</option>
          {penaltyOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      ) : null}
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
