"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { BallIcon, GoogleIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

function LoginCard() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const next = searchParams.get("next") ?? "/";
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="relative overflow-hidden rounded-card border-2 border-border bg-surface-ink px-6 py-8 shadow-[6px_6px_0_0_var(--color-border)] sm:px-8 sm:py-10">
        <span
          aria-hidden
          className="dot-grid pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full text-lime/20 sm:h-48 sm:w-48"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-10 flex h-32 w-32 items-center justify-center rounded-full bg-lime/90 sm:h-36 sm:w-36"
        >
          <BallIcon className="h-16 w-16 text-[#14140f]/80 sm:h-[4.5rem] sm:w-[4.5rem]" />
        </span>

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full border-2 border-border bg-lime px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
              Welcome
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-[0.95] text-on-ink sm:text-4xl">
              Kick off with eFootball World
            </h1>
            <p className="max-w-xs text-sm font-semibold text-on-ink/70 sm:text-base">
              Leagues, cups, friends and H2H bragging rights — sign in to get started.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-full border-2 border-border bg-surface px-5 py-3 font-display text-sm font-extrabold text-ink transition-transform active:scale-95 disabled:opacity-60 sm:text-base"
          >
            <GoogleIcon className="h-5 w-5" />
            {loading ? "Redirecting..." : "Continue with Google"}
          </button>

          {error ? (
            <p className="rounded-2xl border-2 border-pink/60 bg-pink/10 px-3 py-2 text-xs font-bold text-pink sm:text-sm">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <Logo />
        <Suspense fallback={null}>
          <LoginCard />
        </Suspense>
      </div>
    </main>
  );
}
