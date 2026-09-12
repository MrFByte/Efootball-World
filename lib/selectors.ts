import {
  CURRENT_USER_ID,
  h2hMatches,
  matches,
  tournaments,
  tournamentTeams,
  users,
} from "./mock-data";
import type { MatchResult, TournamentFormat, TournamentStatus } from "./types";

// These helpers stand in for what the real API routes in Plan/api-docs.md
// will eventually return (e.g. GET /api/tournaments/:id/standings,
// GET /api/h2h/:friend_id). Pages call them the same way they'd call a
// fetcher, so swapping mock data for live requests later won't touch the UI.

export function getCurrentUser() {
  const user = users.find((u) => u.id === CURRENT_USER_ID);
  if (!user) throw new Error("Mock current user missing");
  return user;
}

export function getUserById(id: string) {
  return users.find((u) => u.id === id) ?? null;
}

export interface TournamentProgress {
  id: string;
  name: string;
  format: TournamentFormat;
  status: TournamentStatus;
  teamCount: number;
  matchesPlayed: number;
  matchesTotal: number;
  percent: number;
}

export function getActiveTournaments(): TournamentProgress[] {
  return tournaments
    .filter((t) => t.owner_id === CURRENT_USER_ID && t.status === "active")
    .map((t) => {
      const tMatches = matches.filter((m) => m.tournament_id === t.id);
      const played = tMatches.filter((m) => m.status === "played").length;
      const total = tMatches.length;
      return {
        id: t.id,
        name: t.name,
        format: t.format,
        status: t.status,
        teamCount: tournamentTeams.filter((tt) => tt.tournament_id === t.id).length,
        matchesPlayed: played,
        matchesTotal: total,
        percent: total === 0 ? 0 : Math.round((played / total) * 100),
      };
    });
}

export interface H2HResult {
  id: string;
  opponentId: string;
  opponentName: string;
  scoreFor: number;
  scoreAgainst: number;
  result: MatchResult;
  playedAt: string;
}

function toH2HResult(match: (typeof h2hMatches)[number]): H2HResult {
  const userIsA = match.user_a_id === CURRENT_USER_ID;
  const scoreFor = userIsA ? match.score_a : match.score_b;
  const scoreAgainst = userIsA ? match.score_b : match.score_a;
  const opponentId = userIsA ? match.user_b_id : match.user_a_id;
  const result: MatchResult =
    scoreFor === scoreAgainst ? "D" : scoreFor > scoreAgainst ? "W" : "L";

  return {
    id: match.id,
    opponentId,
    opponentName: getUserById(opponentId)?.username ?? "Unknown",
    scoreFor,
    scoreAgainst,
    result,
    playedAt: match.played_at,
  };
}

export function getRecentH2H(limit = 3): H2HResult[] {
  return [...h2hMatches]
    .sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime())
    .slice(0, limit)
    .map(toH2HResult);
}

export interface H2HSummary {
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export function getH2HSummary(): H2HSummary {
  const results = h2hMatches.map(toH2HResult);
  const wins = results.filter((r) => r.result === "W").length;
  const losses = results.filter((r) => r.result === "L").length;
  const draws = results.filter((r) => r.result === "D").length;
  const total = results.length;
  return {
    wins,
    losses,
    draws,
    winRate: total === 0 ? 0 : Math.round((wins / total) * 100),
  };
}
