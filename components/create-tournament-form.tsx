"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";
import type { TournamentFormat } from "@/lib/types";

const SIZES = [8, 16, 32] as const;

export function CreateTournamentForm({
  format,
  basePath,
  label,
}: {
  format: TournamentFormat;
  basePath: string;
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [size, setSize] = useState<(typeof SIZES)[number]>(8);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      const tournament = await apiClient.createTournament({ name: name.trim(), size, format }, token);
      router.push(`${basePath}/${tournament.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create it. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-lime px-5 py-3 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 sm:text-base"
      >
        {label}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-card border-2 border-border bg-surface px-4 py-4 shadow-[4px_4px_0_0_var(--color-border)] sm:px-5 sm:py-5"
    >
      <input
        required
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        maxLength={60}
        className="rounded-2xl border-2 border-border bg-bg px-4 py-2.5 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
      />
      <div className="flex items-center gap-2">
        {SIZES.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-full border-2 border-border px-4 py-2 font-display text-sm font-extrabold transition-transform active:scale-95 ${
              size === s ? "bg-lime text-[#14140f]" : "bg-bg text-ink"
            }`}
          >
            {s} teams
          </button>
        ))}
      </div>
      {error ? <p className="text-xs font-bold text-pink">{error}</p> : null}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full border-2 border-border bg-lime px-5 py-2.5 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border-2 border-border bg-bg px-5 py-2.5 font-display text-sm font-extrabold text-ink transition-transform active:scale-95"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
