import { requireSession } from "@/lib/supabase/session";
import { getJoinableTournaments, getMyTournaments } from "@/lib/tournament-data";

export async function getLeagueOverview() {
  const { profile } = await requireSession();
  const [leagues, joinable] = await Promise.all([
    getMyTournaments(profile.id, "league"),
    getJoinableTournaments(profile.id, "league"),
  ]);
  return { leagues, joinable, myUsername: profile.username };
}
