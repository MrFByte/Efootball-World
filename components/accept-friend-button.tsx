"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";

export function AcceptFriendButton({ friendshipId }: { friendshipId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.acceptFriend(friendshipId, token);
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="shrink-0 rounded-full border-2 border-border bg-lime px-4 py-2 font-display text-xs font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60"
    >
      {loading ? "..." : "Accept"}
    </button>
  );
}
