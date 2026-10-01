import { requireSession } from "@/lib/supabase/session";

export async function getAccountPageData() {
  const { profile } = await requireSession();
  return { profile };
}
