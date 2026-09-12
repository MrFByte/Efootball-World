import { requireSession } from "@/lib/supabase/session";
import { getMyTournaments } from "@/lib/tournament-data";
import { getOverallStats, getRecentH2H, toH2HResults } from "@/lib/overall-data";

// Bundles everything the Overview page renders into one call so page.tsx
// stays presentational. proxy.ts guarantees both a session and a `users`
// row exist by the time this route is reachable, so everything here is
// real data — no more mock fallback.
export async function getOverviewData() {
  const { profile } = await requireSession();

  const [leagues, cups, stats, recentH2H] = await Promise.all([
    getMyTournaments(profile.id, "round_robin"),
    getMyTournaments(profile.id, "elimination"),
    getOverallStats(profile.id),
    getRecentH2H(profile.id, 3),
  ]);

  return {
    user: profile,
    tournaments: [...leagues, ...cups].filter((t) => t.status === "active"),
    h2h: stats.h2h,
    recentH2H: toH2HResults(recentH2H),
  };
}

export function getAvatarInitial(username: string) {
  return username.slice(0, 1).toUpperCase();
}
