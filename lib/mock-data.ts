import type {
  Friendship,
  H2HMatch,
  Match,
  Tournament,
  TournamentTeam,
  User,
} from "./types";

// Mock data shaped after the Phase 1 schema (see Plan/api-docs.md) so it can
// later be swapped for real Supabase-backed API calls without touching
// component code.

export const CURRENT_USER_ID = "u1";

export const users: User[] = [
  { id: "u1", username: "Rafi", gamer_id: "1234-5678", avatar_url: null },
  { id: "u2", username: "Karim", gamer_id: "2231-9981", avatar_url: null },
  { id: "u3", username: "Samir", gamer_id: "7743-1120", avatar_url: null },
  { id: "u4", username: "Dev", gamer_id: "5567-4402", avatar_url: null },
  { id: "u5", username: "Mo", gamer_id: "9910-3345", avatar_url: null },
];

export const friendships: Friendship[] = [
  { id: "f1", user_id: "u1", friend_id: "u2", status: "accepted" },
  { id: "f2", user_id: "u1", friend_id: "u3", status: "accepted" },
  { id: "f3", user_id: "u1", friend_id: "u4", status: "accepted" },
  { id: "f4", user_id: "u1", friend_id: "u5", status: "accepted" },
];

export const tournaments: Tournament[] = [
  {
    id: "t1",
    owner_id: "u1",
    name: "Friends World Cup",
    size: 8,
    format: "elimination",
    status: "active",
    created_at: "2026-08-01T12:00:00Z",
  },
  {
    id: "t2",
    owner_id: "u1",
    name: "Sunday League",
    size: 16,
    format: "round_robin",
    status: "active",
    created_at: "2026-07-15T12:00:00Z",
  },
  {
    id: "t3",
    owner_id: "u1",
    name: "Champions Ladder",
    size: 8,
    format: "round_robin",
    status: "active",
    created_at: "2026-08-20T12:00:00Z",
  },
];

export const tournamentTeams: TournamentTeam[] = [
  { id: "tt1", tournament_id: "t1", name: "Real Madrid", added_by_user_id: "u1" },
  { id: "tt2", tournament_id: "t1", name: "Man City", added_by_user_id: "u1" },
  { id: "tt3", tournament_id: "t2", name: "Barcelona", added_by_user_id: "u1" },
  { id: "tt4", tournament_id: "t2", name: "Liverpool", added_by_user_id: "u1" },
  { id: "tt5", tournament_id: "t3", name: "Inter Milan", added_by_user_id: "u1" },
  { id: "tt6", tournament_id: "t3", name: "PSG", added_by_user_id: "u1" },
];

// round counts drive the progress bars on the Overview page.
export const matches: Match[] = [
  { id: "m1", tournament_id: "t1", round: 1, team_a_id: "tt1", team_b_id: "tt2", score_a: 3, score_b: 1, status: "played" },
  { id: "m2", tournament_id: "t1", round: 2, team_a_id: "tt1", team_b_id: "tt2", score_a: null, score_b: null, status: "pending" },
  { id: "m3", tournament_id: "t1", round: 3, team_a_id: "tt1", team_b_id: "tt2", score_a: null, score_b: null, status: "pending" },

  { id: "m4", tournament_id: "t2", round: 1, team_a_id: "tt3", team_b_id: "tt4", score_a: 2, score_b: 2, status: "played" },
  { id: "m5", tournament_id: "t2", round: 1, team_a_id: "tt3", team_b_id: "tt4", score_a: 1, score_b: 0, status: "played" },
  { id: "m6", tournament_id: "t2", round: 1, team_a_id: "tt3", team_b_id: "tt4", score_a: null, score_b: null, status: "pending" },
  { id: "m7", tournament_id: "t2", round: 1, team_a_id: "tt3", team_b_id: "tt4", score_a: null, score_b: null, status: "pending" },

  { id: "m8", tournament_id: "t3", round: 1, team_a_id: "tt5", team_b_id: "tt6", score_a: 4, score_b: 2, status: "played" },
  { id: "m9", tournament_id: "t3", round: 1, team_a_id: "tt5", team_b_id: "tt6", score_a: 0, score_b: 0, status: "played" },
  { id: "m10", tournament_id: "t3", round: 1, team_a_id: "tt5", team_b_id: "tt6", score_a: 2, score_b: 1, status: "played" },
  { id: "m11", tournament_id: "t3", round: 1, team_a_id: "tt5", team_b_id: "tt6", score_a: null, score_b: null, status: "pending" },
  { id: "m12", tournament_id: "t3", round: 1, team_a_id: "tt5", team_b_id: "tt6", score_a: null, score_b: null, status: "pending" },
];

export const h2hMatches: H2HMatch[] = [
  { id: "h1", user_a_id: "u1", user_b_id: "u2", score_a: 3, score_b: 1, played_at: "2026-09-05T18:30:00Z", poster_url: null },
  { id: "h2", user_a_id: "u1", user_b_id: "u4", score_a: 1, score_b: 2, played_at: "2026-09-04T20:10:00Z", poster_url: null },
  { id: "h3", user_a_id: "u1", user_b_id: "u3", score_a: 2, score_b: 2, played_at: "2026-09-02T19:00:00Z", poster_url: null },
  { id: "h4", user_a_id: "u1", user_b_id: "u5", score_a: 4, score_b: 0, played_at: "2026-08-30T21:15:00Z", poster_url: null },
  { id: "h5", user_a_id: "u1", user_b_id: "u2", score_a: 0, score_b: 1, played_at: "2026-08-27T17:45:00Z", poster_url: null },
  { id: "h6", user_a_id: "u1", user_b_id: "u4", score_a: 3, score_b: 3, played_at: "2026-08-24T19:30:00Z", poster_url: null },
  { id: "h7", user_a_id: "u1", user_b_id: "u3", score_a: 2, score_b: 0, played_at: "2026-08-20T18:00:00Z", poster_url: null },
];
