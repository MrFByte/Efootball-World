import type { Match, TournamentTeam } from "@/lib/types";
import { ScoreForm } from "./score-form";

type MatchRow = Pick<Match, "id" | "round" | "team_a_id" | "team_b_id" | "score_a" | "score_b" | "status">;

export function BracketView({
  matches,
  teams,
  isOwner,
}: {
  matches: MatchRow[];
  teams: Pick<TournamentTeam, "id" | "name">[];
  isOwner: boolean;
}) {
  if (matches.length === 0) {
    return <p className="text-sm font-semibold text-ink-muted">No matches yet.</p>;
  }

  const teamName = new Map(teams.map((t) => [t.id, t.name]));
  const rounds = [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {rounds.map((round) => (
        <div key={round} className="flex w-64 shrink-0 flex-col gap-3">
          <p className="font-display text-xs font-extrabold uppercase tracking-wide text-ink-muted">
            Round {round}
          </p>
          {matches
            .filter((m) => m.round === round)
            .map((m) => (
              <div
                key={m.id}
                className="flex flex-col gap-2 rounded-2xl border-2 border-border bg-surface px-3.5 py-3 shadow-[3px_3px_0_0_var(--color-border)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-ink">
                    {m.team_a_id ? (teamName.get(m.team_a_id) ?? "TBD") : "Bye"}
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink-muted">
                    {m.score_a ?? "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-ink">
                    {m.team_b_id ? (teamName.get(m.team_b_id) ?? "TBD") : "Bye"}
                  </span>
                  <span className="font-display text-sm font-extrabold text-ink-muted">
                    {m.score_b ?? "-"}
                  </span>
                </div>
                {isOwner && m.status === "pending" && m.team_a_id && m.team_b_id ? (
                  <div className="border-t border-border/30 pt-2">
                    <ScoreForm matchId={m.id} />
                  </div>
                ) : null}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
