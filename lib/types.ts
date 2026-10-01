// league: one table, most points wins (max 30 teams)
// knockout: random draw, seeded bracket with byes (max 64 teams)
// combined: group stage (mini leagues) then a knockout of the qualifiers
export type TournamentFormat = "league" | "knockout" | "combined";
export type TournamentStatus = "draft" | "active" | "completed";
export type MatchStatus = "pending" | "played" | "bye";
export type MatchStage = "league" | "group" | "knockout";
export type FriendshipStatus = "pending" | "accepted";
export type MatchResult = "W" | "L" | "D";

export interface User {
  id: string;
  username: string;
  gamer_id: string;
  avatar_url: string | null;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
}

export interface Tournament {
  id: string;
  owner_id: string;
  name: string;
  size: number;
  format: TournamentFormat;
  legs: 1 | 2; // 2 = home & away (finals are always one match)
  group_size: number | null; // combined only
  advance_per_group: number | null; // combined only
  status: TournamentStatus;
  winner_team_id: string | null;
  created_at: string;
}

export interface TournamentTeam {
  id: string;
  tournament_id: string;
  name: string;
  added_by_user_id: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  stage: MatchStage;
  group_no: number | null;
  round: number;
  slot: number;
  leg: 1 | 2;
  team_a_id: string | null; // null = TBD (later knockout round) or bye
  team_b_id: string | null;
  score_a: number | null;
  score_b: number | null;
  status: MatchStatus;
  winner_team_id: string | null;
}

export interface H2HMatch {
  id: string;
  user_a_id: string;
  user_b_id: string;
  score_a: number;
  score_b: number;
  played_at: string;
  poster_url: string | null;
}
