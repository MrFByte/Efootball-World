"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";
import { TEAM_NAME_MAX_LENGTH } from "@/lib/tournament-rules";

export function JoinTournamentButton({
  tournamentId,
  basePath,
  defaultName,
}: {
  tournamentId: string;
  basePath: string;
  defaultName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName);
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
      router.push(`${basePath}/${tournamentId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't join.");
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full border-2 border-border bg-lime px-4 py-2 font-display text-xs font-extrabold text-[#14140f] transition-transform active:scale-95"
      >
        Join
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-1.5">
      <input
        required
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your team name"
        maxLength={TEAM_NAME_MAX_LENGTH}
        className="h-8 w-36 rounded-full border-2 border-border bg-bg px-3 text-xs font-bold text-ink outline-none focus:ring-2 focus:ring-lime"
      />
      <button
        type="submit"
        disabled={loading}
        className="shrink-0 rounded-full border-2 border-border bg-lime px-3 py-1.5 font-display text-xs font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60"
      >
        {loading ? "..." : "Go"}
      </button>
      {error ? <span className="text-[10px] font-bold text-pink">{error}</span> : null}
    </form>
  );
}
