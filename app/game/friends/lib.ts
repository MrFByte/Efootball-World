import { requireSession } from "@/lib/supabase/session";
import { getMyFriendships } from "@/lib/friends-data";

export async function getFriendsOverview() {
  const { profile } = await requireSession();
  const friendships = await getMyFriendships(profile.id);

  return {
    accepted: friendships.filter((f) => f.status === "accepted"),
    incomingPending: friendships.filter((f) => f.status === "pending" && f.direction === "incoming"),
    outgoingPending: friendships.filter((f) => f.status === "pending" && f.direction === "outgoing"),
  };
}
