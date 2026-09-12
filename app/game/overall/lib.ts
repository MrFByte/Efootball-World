import { requireSession } from "@/lib/supabase/session";
import { getMyTournaments } from "@/lib/tournament-data";
import { getOverallStats, getRecentH2H } from "@/lib/overall-data";

export async function getOverallOverview() {
  const { profile } = await requireSession();
  const [stats, leagues, cups, recentH2H] = await Promise.all([
    getOverallStats(profile.id),
    getMyTournaments(profile.id, "round_robin"),
    getMyTournaments(profile.id, "elimination"),
    getRecentH2H(profile.id, 5),
  ]);

  return { stats, tournaments: [...leagues, ...cups], recentH2H };
}
