import { notFound } from "next/navigation";
import { apiClient, ApiError, type H2HResponse } from "@/api";
import { requireSession } from "@/lib/supabase/session";
import type { User } from "@/lib/types";

export interface FriendDetailData {
  friend: User;
  h2h: H2HResponse;
}

export async function getFriendDetail(friendId: string): Promise<FriendDetailData> {
  const { accessToken } = await requireSession();

  let friend: User;
  try {
    friend = await apiClient.getUser(friendId, accessToken);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const h2h = await apiClient.getH2H(friendId, accessToken);
  return { friend, h2h };
}
