import type { H2HResult } from "@/lib/selectors";
import { getH2HAvatarColor, getInitials, h2hResultClasses } from "./lib";
import { PosterShareButton } from "./poster-share-button";

export function H2HList({ results }: { results: H2HResult[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {results.map((r, i) => (
        <li
          key={r.id}
          className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface px-3.5 py-3 sm:px-4"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border font-display text-sm font-extrabold text-[#14140f] ${getH2HAvatarColor(i)}`}
          >
            {getInitials(r.opponentName)}
          </span>
          <span className="flex-1 truncate text-sm font-bold text-ink sm:text-base">
            {r.opponentName}
          </span>
          <span className="font-display text-sm font-extrabold text-ink sm:text-base">
            {r.scoreFor}-{r.scoreAgainst}
          </span>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border font-display text-xs font-extrabold ${h2hResultClasses[r.result]}`}
          >
            {r.result}
          </span>
          <PosterShareButton matchId={r.id} initialPosterUrl={r.posterUrl} />
        </li>
      ))}
    </ul>
  );
}
