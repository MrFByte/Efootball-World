import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// For Server Components, Route Handlers and Server Actions. Reads the
// session from the incoming request's cookies; `setAll` is wrapped in a
// try/catch because Server Components can't write cookies — the middleware
// (lib/supabase/middleware.ts) is what actually refreshes/persists the
// session on every request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore.
          }
        },
      },
    },
  );
}
