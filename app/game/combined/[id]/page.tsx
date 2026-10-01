import Link from "next/link";
import { ArrowLeftIcon, LayersIcon } from "@/components/icons";
import { AddTeamForm } from "@/components/add-team-form";
import { GenerateBracketButton } from "@/components/generate-bracket-button";
import { JoinTournamentButton } from "@/components/join-tournament-button";
import { StandingsTable } from "@/components/standings-table";
import { BracketView } from "@/components/bracket-view";
import { ScoreForm } from "@/components/score-form";
import { getCombinedDetail } from "./lib";

export default async function CombinedDetailPage({ params }: PageProps<"/game/combined/[id]">) {
  const { id } = await params;
  const { tournament, standings, isOwner, hasJoined, myUsername } = await getCombinedDetail(id);
  const teamName = new Map(tournament.teams.map((t) => [t.id, t.name]));

  const groupMatches = tournament.matches.filter((m) => m.stage === "group");
  const knockoutMatches = tournament.matches.filter((m) => m.stage === "knockout");
  const groupNumbers = [...new Set(groupMatches.map((m) => m.group_no))]
    .filter((g): g is number => g !== null)
    .sort((a, b) => a - b);

  const champion = tournament.winnerTeamId ? teamName.get(tournament.winnerTeamId) : null;

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/game/combined"
          className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Groups + Cup
        </Link>

        <div className="flex flex-col gap-1">
          <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-icterine px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
            <LayersIcon className="h-3.5 w-3.5" />
            {tournament.size} teams
            {tournament.groupSize
              ? ` · ${Math.floor(tournament.size / tournament.groupSize)} groups of ${tournament.groupSize}`
              : ""}
            {tournament.advancePerGroup ? ` · top ${tournament.advancePerGroup} advance` : ""}
            {tournament.legs === 2 ? " · home & away" : ""}
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            {tournament.name}
          </h1>
        </div>

        {champion ? (
          <div className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-lime px-4 py-2 font-display text-sm font-extrabold text-[#14140f]">
            🏆 Champion: {champion}
          </div>
        ) : null}

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
            <JoinTournamentButton tournamentId={tournament.id} basePath="/game/combined" defaultName={myUsername} />
          ) : null}
        </section>

        {isOwner && tournament.status === "draft" && tournament.teams.length >= 2 ? (
          <GenerateBracketButton tournamentId={tournament.id} label="Draw Groups" />
        ) : null}

        {groupNumbers.length > 0 ? (
          <section className="flex flex-col gap-6">
            <h2 className="font-display text-lg font-extrabold text-ink">Group Stage</h2>
            {groupNumbers.map((groupNo) => {
              const rows = standings.filter((s) => s.group_no === groupNo);
              const fixtures = groupMatches
                .filter((m) => m.group_no === groupNo)
                .sort((a, b) => a.round - b.round || a.slot - b.slot || a.leg - b.leg);
              return (
                <div key={groupNo} className="flex flex-col gap-3">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink-muted">
                    Group {groupNo}
                  </h3>
                  <StandingsTable standings={rows} />
                  <ul className="flex flex-col gap-2">
                    {fixtures.map((m) => (
                      <li
                        key={m.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-border bg-surface px-4 py-3"
                      >
                        <span className="text-sm font-bold text-ink">
                          <span className="mr-2 text-[10px] font-extrabold uppercase tracking-wide text-ink-muted">
                            R{m.round}
                          </span>
                          {(m.team_a_id && teamName.get(m.team_a_id)) ?? "TBD"} vs{" "}
                          {(m.team_b_id && teamName.get(m.team_b_id)) ?? "TBD"}
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
                </div>
              );
            })}
          </section>
        ) : null}

        {knockoutMatches.length > 0 ? (
          <section className="flex flex-col gap-3 pb-4">
            <h2 className="font-display text-lg font-extrabold text-ink">Knockout</h2>
            <BracketView matches={knockoutMatches} teams={tournament.teams} isOwner={isOwner} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
