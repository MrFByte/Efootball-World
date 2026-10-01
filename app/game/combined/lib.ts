import { requireSession } from "@/lib/supabase/session";
import { getJoinableTournaments, getMyTournaments } from "@/lib/tournament-data";

export async function getCombinedOverview() {
  const { profile } = await requireSession();
  const [combined, joinable] = await Promise.all([
    getMyTournaments(profile.id, "combined"),
    getJoinableTournaments(profile.id, "combined"),
  ]);
  return { combined, joinable, myUsername: profile.username };
}
