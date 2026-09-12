export type TournamentFormat = "elimination" | "round_robin";
export type TournamentStatus = "draft" | "active" | "completed";
export type MatchStatus = "pending" | "played";
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
  size: 8 | 16 | 32;
  format: TournamentFormat;
  status: TournamentStatus;
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
  round: number;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  status: MatchStatus;
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
