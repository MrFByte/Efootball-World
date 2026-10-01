import type { MatchSummary } from "@/api";
import type { TournamentTeam } from "@/lib/types";
import { ScoreForm } from "./score-form";

type MatchRow = MatchSummary;

export function BracketView({
  matches,
  teams,
  isOwner,
}: {
  matches: MatchRow[];
  teams: Pick<TournamentTeam, "id" | "name">[];
  isOwner: boolean;
}) {
  const teamName = new Map(teams.map((t) => [t.id, t.name]));
  // Knockout rounds only: a combined tournament's group fixtures share round
  // numbers with the bracket, so they'd collide here.
  const bracket = matches.filter((m) => m.stage === "knockout");
  const rounds = [...new Set(bracket.map((m) => m.round))].sort((a, b) => a - b);
  const totalRounds = rounds.length;
  const roundLabel = (round: number) => {
    const left = totalRounds - round;
    if (left === 0) return "Final";
    if (left === 1) return "Semi-finals";
    if (left === 2) return "Quarter-finals";
    return `Round ${round}`;
  };

  if (bracket.length === 0) {
    return <p className="text-sm font-semibold text-ink-muted">No matches yet.</p>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {rounds.map((round) => (
        <div key={round} className="flex w-64 shrink-0 flex-col gap-3">
          <p className="font-display text-xs font-extrabold uppercase tracking-wide text-ink-muted">
            {roundLabel(round)}
          </p>
          {bracket
            .filter((m) => m.round === round)
            .map((m) => (
              <div
                key={m.id}
                className="flex flex-col gap-2 rounded-2xl border-2 border-border bg-surface px-3.5 py-3 shadow-[3px_3px_0_0_var(--color-border)]"
              >
                {m.leg === 2 || (m.leg === 1 && m.status !== "bye" && bracket.some((o) => o.round === m.round && o.slot === m.slot && o.leg === 2)) ? (
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-ink-muted">
                    Leg {m.leg}
                  </span>
                ) : null}
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate text-sm font-bold ${m.winner_team_id && m.winner_team_id === m.team_a_id ? "text-ink" : m.winner_team_id ? "text-ink-muted" : "text-ink"}`}>
                    {m.team_a_id ? (teamName.get(m.team_a_id) ?? "TBD") : m.status === "bye" ? "Bye" : "TBD"}
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink-muted">
                    {m.score_a ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate text-sm font-bold ${m.winner_team_id && m.winner_team_id === m.team_b_id ? "text-ink" : m.winner_team_id ? "text-ink-muted" : "text-ink"}`}>
                    {m.team_b_id ? (teamName.get(m.team_b_id) ?? "TBD") : m.status === "bye" ? "Bye" : "TBD"}
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink-muted">
                    {m.score_b ?? "-"}
                  </span>
                </div>
                {isOwner && m.status === "pending" && m.team_a_id && m.team_b_id ? (
                  <div className="border-t border-border/30 pt-2">
                    <ScoreForm
                      matchId={m.id}
                      penaltyOptions={[
                        { id: m.team_a_id, name: teamName.get(m.team_a_id) ?? "Team A" },
                        { id: m.team_b_id, name: teamName.get(m.team_b_id) ?? "Team B" },
                      ]}
                    />
                  </div>
                ) : null}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
