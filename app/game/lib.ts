import { ChartIcon, LayersIcon, ShieldIcon, TrophyIcon, UsersIcon } from "@/components/icons";
import type { GameCardColor } from "@/components/lib";
import type { IconProps } from "@/components/icons";
import type { ComponentType } from "react";
import { requireSession } from "@/lib/supabase/session";
import { getMyTournaments } from "@/lib/tournament-data";
import { getMyFriendships } from "@/lib/friends-data";

export interface GameHubCard {
  href: string;
  title: string;
  description: string;
  color: GameCardColor;
  icon: ComponentType<IconProps>;
  count?: number;
}

// Live counts per card (leagues/cups/friends owned) so the hub reflects
// real data, not just static navigation copy.
export async function getGameHubCards(): Promise<GameHubCard[]> {
  const { profile } = await requireSession();
  const [leagues, cups, combined, friendships] = await Promise.all([
    getMyTournaments(profile.id, "league"),
    getMyTournaments(profile.id, "knockout"),
    getMyTournaments(profile.id, "combined"),
    getMyFriendships(profile.id),
  ]);
  const friendsCount = friendships.filter((f) => f.status === "accepted").length;

  return [
    {
      href: "/game/league",
      title: "League",
      description: "Round-robin standings & fixtures",
      color: "aqua",
      icon: ShieldIcon,
      count: leagues.length,
    },
    {
      href: "/game/tournament",
      title: "Tournament",
      description: "Knockout cups up to 64 teams",
      color: "futsol",
      icon: TrophyIcon,
      count: cups.length,
    },
    {
      href: "/game/combined",
      title: "Groups + Cup",
      description: "Group stage into a knockout",
      color: "icterine",
      icon: LayersIcon,
      count: combined.length,
    },
    {
      href: "/game/friends",
      title: "Friends",
      description: "H2H records & challenges",
      color: "blue",
      icon: UsersIcon,
      count: friendsCount,
    },
    {
      href: "/game/overall",
      title: "Overall",
      description: "Your stats across every match",
      color: "pink",
      icon: ChartIcon,
    },
  ];
}
