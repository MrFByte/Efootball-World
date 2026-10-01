import Link from "next/link";
import { ArrowLeftIcon, LayersIcon } from "@/components/icons";
import { TournamentCard } from "@/components/tournament-card";
import { CreateTournamentForm } from "@/components/create-tournament-form";
import { JoinTournamentButton } from "@/components/join-tournament-button";
import { getCombinedOverview } from "./lib";

export default async function CombinedPage() {
  const { combined, joinable, myUsername } = await getCombinedOverview();

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
          <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-icterine px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
            <LayersIcon className="h-3.5 w-3.5" />
            Groups + Cup
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            Your Combined Comps
          </h1>
          <p className="text-sm font-bold text-ink-muted">
            A group stage first, then a knockout of whoever qualifies.
          </p>
        </div>

        <CreateTournamentForm format="combined" basePath="/game/combined" label="Create Groups + Cup" />

        {combined.length === 0 ? (
          <p className="text-sm font-semibold text-ink-muted">
            No combined competitions yet — create one above, draw the groups, then the knockout
            draws itself once every group match is played.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {combined.map((t, i) => (
              <Link key={t.id} href={`/game/combined/${t.id}`}>
                <TournamentCard tournament={t} index={i} />
              </Link>
            ))}
          </div>
        )}

        <section className="flex flex-col gap-3 pb-4">
          <h2 className="font-display text-lg font-extrabold text-ink">Join a Groups + Cup</h2>
          {joinable.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">
              No open ones to join right now — ask a friend to create one, or start your own above.
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
                    basePath="/game/combined"
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
