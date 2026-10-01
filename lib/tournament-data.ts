import { createClient } from "./supabase/server";
import type { TournamentProgress } from "./selectors";
import type { MatchSummary } from "@/api";
import type { TournamentFormat, TournamentTeam } from "./types";

// Shared by app/game/league/lib.ts and app/game/tournament/lib.ts — same
// underlying `tournaments` table, filtered by format. Returns the same
// shape as lib/selectors.ts's mock TournamentProgress so the existing
// TournamentCard component needs no changes.
export async function getMyTournaments(
  ownerId: string,
  format: TournamentFormat,
): Promise<TournamentProgress[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("id, name, format, status, tournament_teams(count), matches(status)")
    .eq("owner_id", ownerId)
    .eq("format", format)
    .order("created_at", { ascending: false });

  return (data ?? []).map((t) => {
    const teamCount = (t.tournament_teams as { count: number }[] | null)?.[0]?.count ?? 0;
    const matchRows = (t.matches as { status: string }[] | null) ?? [];
    const matchesTotal = matchRows.length;
    const matchesPlayed = matchRows.filter((m) => m.status === "played").length;
    return {
      id: t.id,
      name: t.name,
      format: t.format,
      status: t.status,
      teamCount,
      matchesPlayed,
      matchesTotal,
      percent: matchesTotal === 0 ? 0 : Math.round((matchesPlayed / matchesTotal) * 100),
    };
  });
}

export interface TournamentDetailData {
  id: string;
  name: string;
  size: number;
  format: TournamentFormat;
  legs: 1 | 2;
  groupSize: number | null;
  advancePerGroup: number | null;
  status: string;
  ownerId: string;
  winnerTeamId: string | null;
  teams: Pick<TournamentTeam, "id" | "name" | "added_by_user_id">[];
  matches: MatchSummary[];
}

export async function getTournamentDetail(id: string): Promise<TournamentDetailData | null> {
  const supabase = await createClient();
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("id, name, size, format, legs, group_size, advance_per_group, status, owner_id, winner_team_id")
    .eq("id", id)
    .maybeSingle();
  if (!tournament) return null;

  const [{ data: teams }, { data: matches }] = await Promise.all([
    supabase.from("tournament_teams").select("id, name, added_by_user_id").eq("tournament_id", id),
    supabase
      .from("matches")
      .select("id, stage, group_no, round, slot, leg, team_a_id, team_b_id, score_a, score_b, status, winner_team_id")
      .eq("tournament_id", id)
      .order("stage", { ascending: true })
      .order("round", { ascending: true })
      .order("slot", { ascending: true })
      .order("leg", { ascending: true }),
  ]);

  return {
    id: tournament.id,
    name: tournament.name,
    size: tournament.size,
    format: tournament.format,
    legs: tournament.legs,
    groupSize: tournament.group_size,
    advancePerGroup: tournament.advance_per_group,
    status: tournament.status,
    ownerId: tournament.owner_id,
    winnerTeamId: tournament.winner_team_id,
    teams: teams ?? [],
    matches: matches ?? [],
  };
}

export interface JoinableTournament {
  id: string;
  name: string;
  format: TournamentFormat;
  size: number;
  teamCount: number;
  ownerName: string;
}

// Other people's draft tournaments with room left — tournaments are
// readable by any signed-in user already (see the migration's select
// policy), this just filters that down to "joinable right now".
export async function getJoinableTournaments(
  myId: string,
  format: TournamentFormat,
): Promise<JoinableTournament[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("id, name, format, size, owner_id, tournament_teams(count)")
    .eq("format", format)
    .eq("status", "draft")
    .neq("owner_id", myId)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = data ?? [];
  const ownerIds = [...new Set(rows.map((t) => t.owner_id))];
  const { data: owners } =
    ownerIds.length > 0
      ? await supabase.from("users").select("id, username").in("id", ownerIds)
      : { data: [] as { id: string; username: string }[] };
  const ownerNameById = new Map((owners ?? []).map((o) => [o.id, o.username]));

  return rows
    .map((t) => ({
      id: t.id,
      name: t.name,
      format: t.format,
      size: t.size,
      teamCount: (t.tournament_teams as { count: number }[] | null)?.[0]?.count ?? 0,
      ownerName: ownerNameById.get(t.owner_id) ?? "Unknown",
    }))
    .filter((t) => t.teamCount < t.size);
}
