"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";
import {
  GAMER_ID_MAX_LENGTH,
  USERNAME_HELP,
  USERNAME_MAX_LENGTH,
  isValidUsername,
} from "@/lib/profile-rules";
import type { User } from "@/lib/types";

export function EditProfileForm({ profile }: { profile: User }) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username);
  const [gamerId, setGamerId] = useState(profile.gamer_id ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const trimmedUsername = username.trim();
    if (!isValidUsername(trimmedUsername)) {
      setError(USERNAME_HELP);
      return;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      await apiClient.updateProfile(
        {
          username: trimmedUsername,
          gamer_id: gamerId.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        },
        token,
      );
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save your profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-card border-2 border-border bg-surface px-5 py-6 shadow-[4px_4px_0_0_var(--color-border)] sm:px-7 sm:py-7"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold uppercase tracking-wide text-ink-muted">Username</span>
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="leo10"
          maxLength={USERNAME_MAX_LENGTH}
          autoComplete="off"
          className="rounded-2xl border-2 border-border bg-bg px-4 py-3 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold uppercase tracking-wide text-ink-muted">
          eFootball username <span className="normal-case text-ink-muted/70">(optional)</span>
        </span>
        <input
          value={gamerId}
          onChange={(e) => setGamerId(e.target.value)}
          placeholder="1234-5678-90"
          maxLength={GAMER_ID_MAX_LENGTH}
          autoComplete="off"
          className="rounded-2xl border-2 border-border bg-bg px-4 py-3 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold uppercase tracking-wide text-ink-muted">
          Avatar URL <span className="normal-case text-ink-muted/70">(optional)</span>
        </span>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
          type="url"
          autoComplete="off"
          className="rounded-2xl border-2 border-border bg-bg px-4 py-3 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border-2 border-pink/60 bg-pink/10 px-3 py-2 text-xs font-bold text-pink sm:text-sm">
          {error}
        </p>
      ) : null}
      {saved && !error ? (
        <p className="rounded-2xl border-2 border-lime/60 bg-lime/10 px-3 py-2 text-xs font-bold text-ink sm:text-sm">
          Saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-lime px-5 py-3 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60 sm:text-base"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
