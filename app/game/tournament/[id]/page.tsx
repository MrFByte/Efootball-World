import Link from "next/link";
import { ArrowLeftIcon, TrophyIcon } from "@/components/icons";
import { AddTeamForm } from "@/components/add-team-form";
import { GenerateBracketButton } from "@/components/generate-bracket-button";
import { JoinTournamentButton } from "@/components/join-tournament-button";
import { BracketView } from "@/components/bracket-view";
import { getTournamentDetailPageData } from "./lib";

export default async function TournamentDetailPage({ params }: PageProps<"/game/tournament/[id]">) {
  const { id } = await params;
  const { tournament, isOwner, hasJoined, myUsername } = await getTournamentDetailPageData(id);

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/game/tournament"
          className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Cups
        </Link>

        <div className="flex flex-col gap-1">
          <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-futsol px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
            <TrophyIcon className="h-3.5 w-3.5" />
            {tournament.size}-team cup
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
            <JoinTournamentButton tournamentId={tournament.id} basePath="/game/tournament" defaultName={myUsername} />
          ) : null}
        </section>

        {isOwner && tournament.status === "draft" && tournament.teams.length >= 2 ? (
          <GenerateBracketButton tournamentId={tournament.id} label="Generate Bracket" />
        ) : null}

        {tournament.matches.length > 0 ? (
          <section className="flex flex-col gap-3 pb-4">
            <h2 className="font-display text-lg font-extrabold text-ink">Bracket</h2>
            <BracketView matches={tournament.matches} teams={tournament.teams} isOwner={isOwner} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
