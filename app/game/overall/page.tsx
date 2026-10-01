import Link from "next/link";
import { ArrowLeftIcon, ChartIcon } from "@/components/icons";
import { StatCard } from "@/components/stat-card";
import { TournamentCard } from "@/components/tournament-card";
import { H2HList } from "@/components/h2h-list";
import { toH2HResults } from "@/lib/overall-data";
import { getOverallOverview } from "./lib";
import { FORMAT_ROUTE } from "@/lib/tournament-rules";

export default async function OverallPage() {
  const { stats, tournaments, recentH2H } = await getOverallOverview();
  const results = toH2HResults(recentH2H);

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/game"
          className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Game
        </Link>

        <div className="flex flex-col gap-1">
          <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-pink px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
            <ChartIcon className="h-3.5 w-3.5" />
            Overall
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            Your Stats
          </h1>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="H2H Win Rate" value="%" accent={`${stats.h2h.winRate}`} />
          <StatCard label="Leagues & Cups" value={`${stats.tournamentsOwned}`} />
          <StatCard label="Matches Played" value={`${stats.matchesPlayed}`} />
          <StatCard label="Friends" value={`${stats.friendsCount}`} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-extrabold text-ink">
            H2H Record: {stats.h2h.wins}-{stats.h2h.losses}-{stats.h2h.draws}
          </h2>
          {results.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">No head-to-head matches logged yet.</p>
          ) : (
            <H2HList results={results} />
          )}
        </section>

        <section className="flex flex-col gap-3 pb-4">
          <h2 className="font-display text-lg font-extrabold text-ink">Leagues &amp; Cups</h2>
          {tournaments.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">
              Nothing created yet — start a league or cup from the Game hub.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tournaments.map((t, i) => (
                <Link key={t.id} href={`/game/${FORMAT_ROUTE[t.format]}/${t.id}`}>
                  <TournamentCard tournament={t} index={i} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
