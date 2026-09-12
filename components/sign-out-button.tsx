"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOutIcon } from "./icons";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      aria-label="Sign out"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-ink transition-transform active:scale-90 disabled:opacity-60 sm:h-11 sm:w-11"
    >
      <LogOutIcon className="h-5 w-5" />
    </button>
  );
}
