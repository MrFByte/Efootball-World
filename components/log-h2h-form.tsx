"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";

export function LogH2HForm({ friendId }: { friendId: string }) {
  const router = useRouter();
  const [myScore, setMyScore] = useState("");
  const [theirScore, setTheirScore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.logH2H(
        { friend_id: friendId, score_a: Number(myScore), score_b: Number(theirScore) },
        token,
      );
      setMyScore("");
      setTheirScore("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't log that match.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-card border-2 border-border bg-surface px-4 py-4 shadow-[4px_4px_0_0_var(--color-border)] sm:px-5"
    >
      <p className="font-display text-sm font-extrabold text-ink">Log a match</p>
      <div className="flex items-center gap-3">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-bold text-ink-muted">You</span>
          <input
            required
            type="number"
            min={0}
            value={myScore}
            onChange={(e) => setMyScore(e.target.value)}
            className="rounded-2xl border-2 border-border bg-bg px-4 py-2.5 text-center font-display font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime"
          />
        </label>
        <span className="mt-5 font-display font-extrabold text-ink-muted">-</span>
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-bold text-ink-muted">Them</span>
          <input
            required
            type="number"
            min={0}
            value={theirScore}
            onChange={(e) => setTheirScore(e.target.value)}
            className="rounded-2xl border-2 border-border bg-bg px-4 py-2.5 text-center font-display font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime"
          />
        </label>
      </div>
      {error ? <p className="text-xs font-bold text-pink">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full border-2 border-border bg-lime px-5 py-2.5 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save result"}
      </button>
    </form>
  );
}
