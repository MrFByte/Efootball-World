import { createClient } from "./server";
import type { User } from "@/lib/types";

export interface SessionContext {
  accessToken: string;
  profile: User;
}

// Every /game/** route sits behind the proxy's auth + profile gate
// (proxy.ts), so by the time a Server Component calls this, both the
// session and the `users` row are guaranteed to exist. Used for (a) reading
// "my" data with the caller's own id and (b) forwarding the access token to
// Edge Functions that have real business logic worth reusing (e.g.
// standings) instead of re-deriving it in the frontend.
export async function requireSession(): Promise<SessionContext> {
  const supabase = await createClient();

  // getUser() re-verifies against the Auth server rather than trusting the
  // cookie-derived value getSession() returns, per Supabase's own guidance
  // — getSession() is only used below to grab the raw access token to
  // forward to Edge Functions, never to decide whose data this is.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("requireSession called outside an authenticated route");

  const [{ data: profile }, { data: session }] = await Promise.all([
    supabase.from("users").select("id, username, gamer_id, avatar_url").eq("id", user.id).single(),
    supabase.auth.getSession(),
  ]);
  if (!profile) throw new Error("requireSession called before profile setup");
  if (!session.session) throw new Error("requireSession called outside an authenticated route");

  return { accessToken: session.session.access_token, profile };
}
