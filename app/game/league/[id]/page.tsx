import Link from "next/link";
import { ArrowLeftIcon, ShieldIcon } from "@/components/icons";
import { AddTeamForm } from "@/components/add-team-form";
import { GenerateBracketButton } from "@/components/generate-bracket-button";
import { JoinTournamentButton } from "@/components/join-tournament-button";
import { StandingsTable } from "@/components/standings-table";
import { ScoreForm } from "@/components/score-form";
import { getLeagueDetail } from "./lib";

export default async function LeagueDetailPage({ params }: PageProps<"/game/league/[id]">) {
  const { id } = await params;
  const { tournament, standings, isOwner, hasJoined, myUsername } = await getLeagueDetail(id);
  const teamName = new Map(tournament.teams.map((t) => [t.id, t.name]));

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/game/league"
          className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Leagues
        </Link>

        <div className="flex flex-col gap-1">
          <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-aqua px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
            <ShieldIcon className="h-3.5 w-3.5" />
            {tournament.size}-team league
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            {tournament.name}
          </h1>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-extrabold text-ink">
            Teams ({tournament.teams.length}/{tournament.size})
          </h2>
          <div className="flex flex-wrap gap-2">
            {tournament.teams.map((team) => (
              <span
                key={team.id}
                className="rounded-full border-2 border-border bg-surface px-3.5 py-1.5 text-sm font-bold text-ink"
              >
                {team.name}
              </span>
            ))}
          </div>
          {isOwner && tournament.status === "draft" ? <AddTeamForm tournamentId={tournament.id} /> : null}
          {!isOwner && !hasJoined && tournament.status === "draft" && tournament.teams.length < tournament.size ? (
            <JoinTournamentButton tournamentId={tournament.id} basePath="/game/league" defaultName={myUsername} />
          ) : null}
        </section>

        {isOwner && tournament.status === "draft" && tournament.teams.length >= 2 ? (
          <GenerateBracketButton tournamentId={tournament.id} label="Generate Fixtures" />
        ) : null}

        {tournament.matches.length > 0 ? (
          <>
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-lg font-extrabold text-ink">Standings</h2>
              <StandingsTable standings={standings} />
            </section>

            <section className="flex flex-col gap-3 pb-4">
              <h2 className="font-display text-lg font-extrabold text-ink">Fixtures</h2>
              <ul className="flex flex-col gap-2">
                {tournament.matches.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-border bg-surface px-4 py-3"
                  >
                    <span className="text-sm font-bold text-ink">
                      {teamName.get(m.team_a_id) ?? "TBD"} vs {teamName.get(m.team_b_id) ?? "TBD"}
                    </span>
                    {m.status === "played" ? (
                      <span className="font-display text-sm font-extrabold text-ink">
                        {m.score_a}-{m.score_b}
                      </span>
                    ) : isOwner ? (
                      <ScoreForm matchId={m.id} />
                    ) : (
                      <span className="text-xs font-bold uppercase text-ink-muted">Pending</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
