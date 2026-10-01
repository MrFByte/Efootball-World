import type { TournamentFormat } from "./types";

// Single source of truth for the frontend's tournament-shape constants.
// These MUST mirror backend/supabase/functions/_shared/tournament-engine.js
// (TEAM_LIMITS, GROUP_SIZE_LIMITS) exactly — the backend is what actually
// enforces them (via tournaments-create's validation and the DB check
// constraints in migrations/0004_tournament_modes.sql); this file only lets
// the UI show the same bounds before submitting, instead of guessing or
// hardcoding them again at each call site.
export const TEAM_LIMITS: Record<TournamentFormat, { min: number; max: number }> = {
  league: { min: 2, max: 30 },
  knockout: { min: 2, max: 64 },
  combined: { min: 4, max: 64 },
};

export const GROUP_SIZE_LIMITS = { min: 2, max: 8 } as const;

export const DEFAULT_TEAM_COUNT: Record<TournamentFormat, number> = {
  league: 8,
  knockout: 16,
  combined: 8,
};

export const DEFAULT_GROUP_SIZE = 4;
export const DEFAULT_ADVANCE_PER_GROUP = 2;

// Mirrors tournaments-create's (name) and tournaments-add-team's
// (MAX_TEAM_NAME) own length checks.
export const TOURNAMENT_NAME_MAX_LENGTH = 60;
export const TEAM_NAME_MAX_LENGTH = 40;

export const FORMAT_LABEL: Record<TournamentFormat, string> = {
  league: "League",
  knockout: "Cup",
  combined: "Groups + Cup",
};

export const FORMAT_DESCRIPTION: Record<TournamentFormat, string> = {
  league: "Everyone plays everyone; most points wins.",
  knockout: "Random draw, seeded bracket, winners advance.",
  combined: "Group stage, then a knockout of the qualifiers.",
};

// The "/game/<segment>" route each format's pages live under — league and
// combined keep their own name, knockout's pages are under "tournament"
// (existing route name, kept for backwards-compatible links).
export const FORMAT_ROUTE: Record<TournamentFormat, string> = {
  league: "league",
  knockout: "tournament",
  combined: "combined",
};

// A combined tournament's size must be an exact multiple of its group size,
// with at least two groups — mirrors tournaments-create's own check so the
// create form can validate before it ever sends the request.
export function isValidGroupSize(size: number, groupSize: number): boolean {
  return groupSize >= GROUP_SIZE_LIMITS.min && size % groupSize === 0 && size / groupSize >= 2;
}

export function groupCount(size: number, groupSize: number): number {
  return Math.floor(size / groupSize);
}
