import { notFound } from "next/navigation";
import { apiClient, type StandingsRow } from "@/api";
import { requireSession } from "@/lib/supabase/session";
import { getTournamentDetail, type TournamentDetailData } from "@/lib/tournament-data";

export interface LeagueDetailData {
  tournament: TournamentDetailData;
  standings: StandingsRow[];
  isOwner: boolean;
  hasJoined: boolean;
  myUsername: string;
}

export async function getLeagueDetail(id: string): Promise<LeagueDetailData> {
  const { profile, accessToken } = await requireSession();
  const tournament = await getTournamentDetail(id);
  if (!tournament) notFound();

  const standings = await apiClient.getStandings(id, accessToken).catch(() => [] as StandingsRow[]);

  return {
    tournament,
    standings,
    isOwner: tournament.ownerId === profile.id,
    hasJoined: tournament.teams.some((t) => t.added_by_user_id === profile.id),
    myUsername: profile.username,
  };
}
