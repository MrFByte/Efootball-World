import { createBrowserClient } from "@supabase/ssr";

// One Supabase client per browser tab. Client Components (the login button,
// the onboarding form, sign-out) import this — Server Components and the
// middleware use ./server and ./middleware instead, since they need to read
// and write cookies rather than localStorage.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

// Shared by every Client Component form that calls an Edge Function
// (create tournament, add team, log H2H, ...) so each one doesn't repeat
// its own getSession() dance. Null means "not signed in" — shouldn't happen
// on a gated route, but callers check anyway rather than assume.
export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
