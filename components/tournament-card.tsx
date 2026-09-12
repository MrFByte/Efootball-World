import type { TournamentProgress } from "@/lib/selectors";
import { getTournamentBarColor, tournamentFormatLabel } from "./lib";

export function TournamentCard({
  tournament,
  index,
}: {
  tournament: TournamentProgress;
  index: number;
}) {
  const barColor = getTournamentBarColor(index);

  return (
    <div className="flex flex-col gap-3 rounded-card border-2 border-border bg-surface px-4 py-4 shadow-[4px_4px_0_0_var(--color-border)] sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-extrabold leading-tight text-ink sm:text-xl">
            {tournament.name}
          </h3>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
            {tournamentFormatLabel[tournament.format]} · {tournament.teamCount} teams
          </p>
        </div>
        <span className="shrink-0 rounded-full border-2 border-border bg-lime px-2.5 py-1 text-xs font-extrabold text-[#14140f]">
          {tournament.percent}%
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full border border-border/40 bg-bg-soft">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${tournament.percent}%` }}
        />
      </div>
      <p className="text-xs font-bold text-ink-muted">
        {tournament.matchesPlayed} / {tournament.matchesTotal} matches played
      </p>
    </div>
  );
}
