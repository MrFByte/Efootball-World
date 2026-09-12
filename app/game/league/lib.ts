import { requireSession } from "@/lib/supabase/session";
import { getJoinableTournaments, getMyTournaments } from "@/lib/tournament-data";

export async function getLeagueOverview() {
  const { profile } = await requireSession();
  const [leagues, joinable] = await Promise.all([
    getMyTournaments(profile.id, "round_robin"),
    getJoinableTournaments(profile.id, "round_robin"),
  ]);
  return { leagues, joinable, myUsername: profile.username };
}
