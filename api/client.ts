import type {
  Friendship,
  H2HMatch,
  Match,
  Tournament,
  TournamentFormat,
  TournamentTeam,
  User,
} from "@/lib/types";
import { api } from "./endpoints";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  accessToken?: string;
}

async function request<T>(url: string, { accessToken, headers, ...init }: RequestOptions = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body as { error?: string } | null)?.error ?? res.statusText;
    throw new ApiError(res.status, message);
  }
  return body as T;
}

export type MatchSummary = Pick<
  Match,
  | "id"
  | "stage"
  | "group_no"
  | "round"
  | "slot"
  | "leg"
  | "team_a_id"
  | "team_b_id"
  | "score_a"
  | "score_b"
  | "status"
  | "winner_team_id"
>;

export interface TournamentDetail extends Tournament {
  teams: Pick<TournamentTeam, "id" | "name">[];
  matches: MatchSummary[];
}

export interface StandingsRow {
  team_id: string;
  name: string;
  group_no: number | null; // set for combined tournaments
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export interface H2HResponse {
  record: { wins: number; losses: number; draws: number };
  matches: Pick<H2HMatch, "id" | "score_a" | "score_b" | "played_at" | "poster_url">[];
}

// One method per backend/README.md endpoint, each just wiring `api.*` +
// `request` together — this is what the rest of the frontend should import
// once a Supabase project is deployed and NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL
// is set (see api/endpoints.ts's isBackendConfigured).
// See backend/_shared/tournament-input.js for limits and defaults.
export interface CreateTournamentInput {
  name: string;
  format: TournamentFormat;
  size: number;
  legs?: 1 | 2;
  group_size?: number;
  advance_per_group?: number;
}

export interface MatchResultInput {
  score_a: number;
  score_b: number;
  // Required when a knockout tie ends level: the penalty shoot-out winner.
  winner_team_id?: string;
}

export interface MatchResultResponse extends Pick<Match, "id" | "status" | "score_a" | "score_b" | "winner_team_id"> {
  tournament_status: "active" | "completed";
  champion_team_id?: string | null;
}

export interface ProfileInput {
  username?: string;
  gamer_id?: string | null;
  avatar_url?: string | null;
}

export const apiClient = {
  getUser: (id: string, accessToken?: string) => request<User>(api.users.get(id), { accessToken }),

  getProfile: (accessToken?: string) => request<User>(api.profile.get(), { accessToken }),

  setupProfile: (payload: ProfileInput & { username: string }, accessToken?: string) =>
    request<User>(api.profile.setup(), {
      method: "POST",
      body: JSON.stringify(payload),
      accessToken,
    }),

  updateProfile: (payload: ProfileInput, accessToken?: string) =>
    request<User>(api.profile.update(), {
      method: "PATCH",
      body: JSON.stringify(payload),
      accessToken,
    }),

  requestFriend: (friendUsername: string, accessToken?: string) =>
    request<Friendship>(api.friends.request(), {
      method: "POST",
      body: JSON.stringify({ friend_username: friendUsername }),
      accessToken,
    }),

  acceptFriend: (friendshipId: string, accessToken?: string) =>
    request<Pick<Friendship, "id" | "status">>(api.friends.accept(friendshipId), {
      method: "POST",
      accessToken,
    }),

  createTournament: (payload: CreateTournamentInput, accessToken?: string) =>
    request<Tournament>(api.tournaments.create(), {
      method: "POST",
      body: JSON.stringify(payload),
      accessToken,
    }),

  getTournament: (id: string, accessToken?: string) =>
    request<TournamentDetail>(api.tournaments.get(id), { accessToken }),

  addTournamentTeam: (tournamentId: string, name: string, accessToken?: string) =>
    request<TournamentTeam>(api.tournaments.addTeam(tournamentId), {
      method: "POST",
      body: JSON.stringify({ name }),
      accessToken,
    }),

  generateBracket: (tournamentId: string, accessToken?: string) =>
    request<{ matches: Match[] }>(api.tournaments.generateBracket(tournamentId), {
      method: "POST",
      accessToken,
    }),

  getStandings: (tournamentId: string, accessToken?: string) =>
    request<StandingsRow[]>(api.tournaments.standings(tournamentId), { accessToken }),

  updateMatch: (matchId: string, score: MatchResultInput, accessToken?: string) =>
    request<MatchResultResponse>(api.matches.update(matchId), {
      method: "PATCH",
      body: JSON.stringify(score),
      accessToken,
    }),

  logH2H: (payload: { friend_id: string; score_a: number; score_b: number }, accessToken?: string) =>
    request<Pick<H2HMatch, "id" | "score_a" | "score_b" | "played_at">>(api.h2h.log(), {
      method: "POST",
      body: JSON.stringify(payload),
      accessToken,
    }),

  getH2H: (friendId: string, accessToken?: string) =>
    request<H2HResponse>(api.h2h.get(friendId), { accessToken }),

  generatePoster: (h2hId: string, accessToken?: string) =>
    request<{ poster_url: string }>(api.h2h.poster(h2hId), { method: "POST", accessToken }),
};
