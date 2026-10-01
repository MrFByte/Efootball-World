"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";
import {
  DEFAULT_ADVANCE_PER_GROUP,
  DEFAULT_GROUP_SIZE,
  DEFAULT_TEAM_COUNT,
  GROUP_SIZE_LIMITS,
  TEAM_LIMITS,
  TOURNAMENT_NAME_MAX_LENGTH,
  groupCount,
  isValidGroupSize,
} from "@/lib/tournament-rules";
import type { TournamentFormat } from "@/lib/types";

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
  const { min, max } = TEAM_LIMITS[format];
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sizeInput, setSizeInput] = useState(String(DEFAULT_TEAM_COUNT[format]));
  const [groupSizeInput, setGroupSizeInput] = useState(String(DEFAULT_GROUP_SIZE));
  const [advanceInput, setAdvanceInput] = useState(String(DEFAULT_ADVANCE_PER_GROUP));
  const [homeAndAway, setHomeAndAway] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedSize = Number.parseInt(sizeInput, 10);
  const sizeValid = Number.isInteger(parsedSize) && parsedSize >= min && parsedSize <= max;

  const isCombined = format === "combined";
  const parsedGroupSize = Number.parseInt(groupSizeInput, 10);
  const groupSizeValid =
    Number.isInteger(parsedGroupSize) &&
    parsedGroupSize >= GROUP_SIZE_LIMITS.min &&
    parsedGroupSize <= GROUP_SIZE_LIMITS.max &&
    (!sizeValid || isValidGroupSize(parsedSize, parsedGroupSize));
  const parsedAdvance = Number.parseInt(advanceInput, 10);
  const advanceValid =
    Number.isInteger(parsedAdvance) && parsedAdvance >= 1 && parsedAdvance < parsedGroupSize;

  const formValid = sizeValid && (!isCombined || (groupSizeValid && advanceValid));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!formValid) {
      setError("Check the highlighted fields.");
      return;
    }
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new ApiError(401, "Not signed in");
      const tournament = await apiClient.createTournament(
        {
          name: name.trim(),
          size: parsedSize,
          format,
          legs: homeAndAway ? 2 : 1,
          ...(isCombined ? { group_size: parsedGroupSize, advance_per_group: parsedAdvance } : {}),
        },
        token,
      );
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
        maxLength={TOURNAMENT_NAME_MAX_LENGTH}
        className="rounded-2xl border-2 border-border bg-bg px-4 py-2.5 font-semibold text-ink placeholder:text-ink-muted outline-none focus:ring-2 focus:ring-lime"
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-count" className="text-xs font-bold uppercase tracking-wide text-ink-muted">
          Number of teams ({min}–{max})
        </label>
        <input
          id="team-count"
          required
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={sizeInput}
          onChange={(e) => setSizeInput(e.target.value)}
          className={`w-28 rounded-2xl border-2 bg-bg px-4 py-2.5 font-display font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime ${
            sizeInput && !sizeValid ? "border-pink" : "border-border"
          }`}
        />
        {sizeInput && !sizeValid ? (
          <p className="text-xs font-bold text-pink">Must be between {min} and {max} teams</p>
        ) : null}
      </div>

      {isCombined ? (
        <div className="flex flex-wrap items-start gap-3 rounded-2xl border-2 border-border/50 bg-bg-soft/50 px-3.5 py-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Teams per group ({GROUP_SIZE_LIMITS.min}–{GROUP_SIZE_LIMITS.max})
            </span>
            <input
              required
              type="number"
              inputMode="numeric"
              min={GROUP_SIZE_LIMITS.min}
              max={GROUP_SIZE_LIMITS.max}
              value={groupSizeInput}
              onChange={(e) => setGroupSizeInput(e.target.value)}
              className={`w-24 rounded-2xl border-2 bg-bg px-3.5 py-2 font-display font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime ${
                groupSizeInput && !groupSizeValid ? "border-pink" : "border-border"
              }`}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Advance per group
            </span>
            <input
              required
              type="number"
              inputMode="numeric"
              min={1}
              max={Math.max(1, parsedGroupSize - 1)}
              value={advanceInput}
              onChange={(e) => setAdvanceInput(e.target.value)}
              className={`w-24 rounded-2xl border-2 bg-bg px-3.5 py-2 font-display font-extrabold text-ink outline-none focus:ring-2 focus:ring-lime ${
                advanceInput && !advanceValid ? "border-pink" : "border-border"
              }`}
            />
          </label>
          <p className="w-full text-xs font-bold text-ink-muted">
            {sizeValid && groupSizeValid
              ? `${groupCount(parsedSize, parsedGroupSize)} groups of ${parsedGroupSize}, top ${parsedAdvance || "?"} go through.`
              : "Team count must be an exact multiple of the group size, with at least 2 groups."}
          </p>
        </div>
      ) : null}

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-bold text-ink">
        <input
          type="checkbox"
          checked={homeAndAway}
          onChange={(e) => setHomeAndAway(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-lime)]"
        />
        Home &amp; away
        {format === "league" ? " (play everyone twice)" : " (two-leg ties, one-off final)"}
      </label>
      {error ? <p className="text-xs font-bold text-pink">{error}</p> : null}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || !formValid}
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
