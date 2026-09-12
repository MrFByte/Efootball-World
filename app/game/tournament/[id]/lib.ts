import { notFound } from "next/navigation";
import { requireSession } from "@/lib/supabase/session";
import { getTournamentDetail, type TournamentDetailData } from "@/lib/tournament-data";

export interface TournamentDetailPageData {
  tournament: TournamentDetailData;
  isOwner: boolean;
  hasJoined: boolean;
  myUsername: string;
}

export async function getTournamentDetailPageData(id: string): Promise<TournamentDetailPageData> {
  const { profile } = await requireSession();
  const tournament = await getTournamentDetail(id);
  if (!tournament) notFound();

  return {
    tournament,
    isOwner: tournament.ownerId === profile.id,
    hasJoined: tournament.teams.some((t) => t.added_by_user_id === profile.id),
    myUsername: profile.username,
  };
}
