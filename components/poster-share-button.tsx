"use client";

import { useState } from "react";
import { apiClient, ApiError } from "@/api";
import { getAccessToken } from "@/lib/supabase/client";
import { ShareIcon } from "./icons";

// h2h-poster reserves/persists a Storage URL for the result-card image, but
// the image itself is rendered separately (an @vercel/og route, still
// unbuilt — see backend/README.md's "Not implemented here"). So this button
// requests the link and hands it to the browser's native share/copy flow;
// whether the image behind it actually renders is a separate, later piece.
export function PosterShareButton({
  matchId,
  initialPosterUrl,
}: {
  matchId: string;
  initialPosterUrl: string | null;
}) {
  const [posterUrl, setPosterUrl] = useState(initialPosterUrl);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ensurePosterUrl() {
    if (posterUrl) return posterUrl;
    const token = await getAccessToken();
    if (!token) throw new ApiError(401, "Not signed in");
    const { poster_url } = await apiClient.generatePoster(matchId, token);
    setPosterUrl(poster_url);
    return poster_url;
  }

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const url = await ensurePosterUrl();
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "eFootball World result", url }).catch(() => {});
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't get a share link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="flex shrink-0 flex-col items-end gap-0.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label="Share result poster"
        title="Share result poster"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border bg-bg text-ink transition-transform active:scale-90 disabled:opacity-60"
      >
        <ShareIcon className="h-3.5 w-3.5" />
      </button>
      {copied ? <span className="text-[10px] font-bold text-ink-muted">Link copied</span> : null}
      {error ? <span className="text-[10px] font-bold text-pink">{error}</span> : null}
    </span>
  );
}
