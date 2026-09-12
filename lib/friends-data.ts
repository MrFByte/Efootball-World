import { createClient } from "./supabase/server";
import type { FriendshipStatus, User } from "./types";

export interface FriendEntry {
  friendshipId: string;
  status: FriendshipStatus;
  direction: "incoming" | "outgoing";
  user: Pick<User, "id" | "username" | "gamer_id" | "avatar_url">;
}

// Every friendship row touching me, either side, joined with the other
// person's profile. No dedicated "list friends" Edge Function exists (only
// the request/accept actions in api-docs.md), so this reads the tables
// directly the same way app/lib.ts reads its own profile.
export async function getMyFriendships(myId: string): Promise<FriendEntry[]> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("friendships")
    .select("id, user_id, friend_id, status")
    .or(`user_id.eq.${myId},friend_id.eq.${myId}`);

  if (!rows || rows.length === 0) return [];

  const otherIds = [...new Set(rows.map((r) => (r.user_id === myId ? r.friend_id : r.user_id)))];
  const { data: users } = await supabase
    .from("users")
    .select("id, username, gamer_id, avatar_url")
    .in("id", otherIds);
  const usersById = new Map((users ?? []).map((u) => [u.id, u]));

  return rows
    .map((r): FriendEntry | null => {
      const otherId = r.user_id === myId ? r.friend_id : r.user_id;
      const user = usersById.get(otherId);
      if (!user) return null;
      return {
        friendshipId: r.id,
        status: r.status,
        direction: r.user_id === myId ? "outgoing" : "incoming",
        user,
      };
    })
    .filter((entry): entry is FriendEntry => entry !== null);
}
