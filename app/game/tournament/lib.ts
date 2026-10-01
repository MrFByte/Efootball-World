import { requireSession } from "@/lib/supabase/session";
import { getJoinableTournaments, getMyTournaments } from "@/lib/tournament-data";

export async function getTournamentOverview() {
  const { profile } = await requireSession();
  const [tournaments, joinable] = await Promise.all([
    getMyTournaments(profile.id, "knockout"),
    getJoinableTournaments(profile.id, "knockout"),
  ]);
  return { tournaments, joinable, myUsername: profile.username };
}
