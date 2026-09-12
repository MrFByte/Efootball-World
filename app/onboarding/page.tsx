"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { BallIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";
import { apiClient, ApiError } from "@/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [gamerId, setGamerId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmedUsername)) {
      setError("Username must be 3-20 characters: letters, numbers, underscore.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      await apiClient.setupProfile(
        {
          username: trimmedUsername,
          gamer_id: gamerId.trim() || undefined,
          avatar_url: avatarUrl.trim() || undefined,
        },
        session.access_token,
      );

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <Logo />

        <div className="relative w-full overflow-hidden rounded-card border-2 border-border bg-surface-ink px-6 py-8 shadow-[6px_6px_0_0_var(--color-border)] sm:px-8 sm:py-10">
          <span
            aria-hidden
            className="dot-grid pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full text-lime/20 sm:h-48 sm:w-48"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-10 flex h-28 w-28 items-center justify-center rounded-full bg-lime/90 sm:h-32 sm:w-32"
          >
            <BallIcon className="h-14 w-14 text-[#14140f]/80 sm:h-16 sm:w-16" />
          </span>

          <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="w-fit rounded-full border-2 border-border bg-lime px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
                One last step
              </span>
              <h1 className="font-display text-2xl font-extrabold leading-[0.95] text-on-ink sm:text-3xl">
                Set up your profile
              </h1>
              <p className="text-sm font-semibold text-on-ink/70 sm:text-base">
                Pick a username so friends can find you.
              </p>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-on-ink/60">
                Username
              </span>
              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="leo10"
                maxLength={20}
                autoComplete="off"
                className="rounded-2xl border-2 border-border bg-surface px-4 py-3 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-on-ink/60">
                eFootball username{" "}
                <span className="normal-case text-on-ink/40">(optional)</span>
              </span>
              <input
                value={gamerId}
                onChange={(e) => setGamerId(e.target.value)}
                placeholder="1234-5678-90"
                maxLength={40}
                autoComplete="off"
                className="rounded-2xl border-2 border-border bg-surface px-4 py-3 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide text-on-ink/60">
                Avatar URL <span className="normal-case text-on-ink/40">(optional)</span>
              </span>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                type="url"
                autoComplete="off"
                className="rounded-2xl border-2 border-border bg-surface px-4 py-3 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
              />
            </label>

            {error ? (
              <p className="rounded-2xl border-2 border-pink/60 bg-pink/10 px-3 py-2 text-xs font-bold text-pink sm:text-sm">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-lime px-5 py-3 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60 sm:text-base"
            >
              {loading ? "Saving..." : "Enter the world"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
