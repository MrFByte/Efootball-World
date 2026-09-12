import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google redirects here with a `code` after the user approves the OAuth
// consent screen. Exchanging it for a session is what actually signs the
// user in; from there the middleware (lib/supabase/middleware.ts) takes over
// and routes them into /onboarding or the app depending on profile state.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
