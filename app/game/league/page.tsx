import Link from "next/link";
import { ArrowLeftIcon, ShieldIcon } from "@/components/icons";
import { TournamentCard } from "@/components/tournament-card";
import { CreateTournamentForm } from "@/components/create-tournament-form";
import { JoinTournamentButton } from "@/components/join-tournament-button";
import { getLeagueOverview } from "./lib";

export default async function LeaguePage() {
  const { leagues, joinable, myUsername } = await getLeagueOverview();

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

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-aqua px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
              <ShieldIcon className="h-3.5 w-3.5" />
              League
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
              Your Leagues
            </h1>
          </div>
        </div>

        <CreateTournamentForm format="round_robin" basePath="/game/league" label="Create League" />

        {leagues.length === 0 ? (
          <p className="text-sm font-semibold text-ink-muted">
            No leagues yet — create one above to get standings and fixtures going.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {leagues.map((league, i) => (
              <Link key={league.id} href={`/game/league/${league.id}`}>
                <TournamentCard tournament={league} index={i} />
              </Link>
            ))}
          </div>
        )}

        <section className="flex flex-col gap-3 pb-4">
          <h2 className="font-display text-lg font-extrabold text-ink">Join a League</h2>
          {joinable.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">
              No open leagues to join right now — ask a friend to create one, or start your own above.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {joinable.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-border bg-surface px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ink">{t.name}</span>
                    <span className="text-xs font-bold text-ink-muted">
                      by {t.ownerName} · {t.teamCount}/{t.size} teams
                    </span>
                  </div>
                  <JoinTournamentButton
                    tournamentId={t.id}
                    basePath="/game/league"
                    defaultName={myUsername}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
