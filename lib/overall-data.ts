import { createClient } from "./supabase/server";
import type { H2HResult } from "./selectors";

export interface OverallStats {
  tournamentsOwned: number;
  matchesPlayed: number;
  friendsCount: number;
  h2h: { wins: number; losses: number; draws: number; winRate: number };
}

// Aggregates across tournaments (mine), matches (within those tournaments)
// and h2h_matches (either side, me) — there's no single endpoint for this,
// so it's a handful of direct queries run in parallel.
export async function getOverallStats(myId: string): Promise<OverallStats> {
  const supabase = await createClient();

  const [{ data: myTournaments }, { data: h2hRows }, { count: friendsCount }] = await Promise.all([
    supabase.from("tournaments").select("id").eq("owner_id", myId),
    supabase
      .from("h2h_matches")
      .select("score_a, score_b, user_a_id, user_b_id")
      .or(`user_a_id.eq.${myId},user_b_id.eq.${myId}`),
    supabase
      .from("friendships")
      .select("id", { count: "exact", head: true })
      .eq("status", "accepted")
      .or(`user_id.eq.${myId},friend_id.eq.${myId}`),
  ]);

  const tournamentIds = (myTournaments ?? []).map((t) => t.id);
  let matchesPlayed = 0;
  if (tournamentIds.length > 0) {
    const { count } = await supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .in("tournament_id", tournamentIds)
      .eq("status", "played");
    matchesPlayed = count ?? 0;
  }

  let wins = 0;
  let losses = 0;
  let draws = 0;
  for (const row of h2hRows ?? []) {
    const scoreFor = row.user_a_id === myId ? row.score_a : row.score_b;
    const scoreAgainst = row.user_a_id === myId ? row.score_b : row.score_a;
    if (scoreFor === scoreAgainst) draws += 1;
    else if (scoreFor > scoreAgainst) wins += 1;
    else losses += 1;
  }
  const h2hTotal = wins + losses + draws;

  return {
    tournamentsOwned: tournamentIds.length,
    matchesPlayed,
    friendsCount: friendsCount ?? 0,
    h2h: { wins, losses, draws, winRate: h2hTotal === 0 ? 0 : Math.round((wins / h2hTotal) * 100) },
  };
}

export interface RecentH2HEntry {
  id: string;
  opponentId: string;
  opponentName: string;
  scoreFor: number;
  scoreAgainst: number;
  playedAt: string;
  posterUrl: string | null;
}

// Recent matches across every friend, not just one (contrast with
// h2h-get, which is scoped to a single friend_id) — no dedicated endpoint
// for this either, so it's a direct read plus a name lookup.
export async function getRecentH2H(myId: string, limit = 5): Promise<RecentH2HEntry[]> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("h2h_matches")
    .select("id, user_a_id, user_b_id, score_a, score_b, played_at, poster_url")
    .or(`user_a_id.eq.${myId},user_b_id.eq.${myId}`)
    .order("played_at", { ascending: false })
    .limit(limit);
  if (!rows || rows.length === 0) return [];

  const opponentIds = [...new Set(rows.map((r) => (r.user_a_id === myId ? r.user_b_id : r.user_a_id)))];
  const { data: users } = await supabase.from("users").select("id, username").in("id", opponentIds);
  const nameById = new Map((users ?? []).map((u) => [u.id, u.username]));

  return rows.map((r) => {
    const iAmA = r.user_a_id === myId;
    const opponentId = iAmA ? r.user_b_id : r.user_a_id;
    return {
      id: r.id,
      opponentId,
      opponentName: nameById.get(opponentId) ?? "Unknown",
      scoreFor: iAmA ? r.score_a : r.score_b,
      scoreAgainst: iAmA ? r.score_b : r.score_a,
      playedAt: r.played_at,
      posterUrl: r.poster_url,
    };
  });
}

// Shared by app/lib.ts and app/game/overall/lib.ts — both render recent H2H
// entries through the existing H2HList component, which expects a `result`
// field this data doesn't carry on its own.
export function toH2HResults(entries: RecentH2HEntry[]): H2HResult[] {
  return entries.map((m) => ({
    id: m.id,
    opponentId: m.opponentId,
    opponentName: m.opponentName,
    scoreFor: m.scoreFor,
    scoreAgainst: m.scoreAgainst,
    result: m.scoreFor === m.scoreAgainst ? "D" : m.scoreFor > m.scoreAgainst ? "W" : "L",
    playedAt: m.playedAt,
    posterUrl: m.posterUrl,
  }));
}
