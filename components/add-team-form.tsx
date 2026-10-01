"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";
import { TEAM_NAME_MAX_LENGTH } from "@/lib/tournament-rules";

export function AddTeamForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.addTournamentTeam(tournamentId, name.trim(), token);
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't add that team.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team or player name"
          maxLength={TEAM_NAME_MAX_LENGTH}
          className="min-w-0 flex-1 rounded-2xl border-2 border-border bg-surface px-4 py-2.5 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full border-2 border-border bg-lime px-4 py-2.5 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60"
        >
          Add
        </button>
      </div>
      {error ? <p className="text-xs font-bold text-pink">{error}</p> : null}
    </form>
  );
}
