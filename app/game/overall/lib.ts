import { requireSession } from "@/lib/supabase/session";
import { getMyTournaments } from "@/lib/tournament-data";
import { getOverallStats, getRecentH2H } from "@/lib/overall-data";

export async function getOverallOverview() {
  const { profile } = await requireSession();
  const [stats, leagues, cups, combined, recentH2H] = await Promise.all([
    getOverallStats(profile.id),
    getMyTournaments(profile.id, "league"),
    getMyTournaments(profile.id, "knockout"),
    getMyTournaments(profile.id, "combined"),
    getRecentH2H(profile.id, 5),
  ]);

  return { stats, tournaments: [...leagues, ...cups, ...combined], recentH2H };
}
