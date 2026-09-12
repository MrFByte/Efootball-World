import type { StandingsRow } from "@/api";

export function StandingsTable({ standings }: { standings: StandingsRow[] }) {
  if (standings.length === 0) {
    return <p className="text-sm font-semibold text-ink-muted">No teams yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-card border-2 border-border bg-surface shadow-[4px_4px_0_0_var(--color-border)]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-surface-ink text-on-ink">
            <th className="px-3 py-2.5 font-display text-xs font-extrabold uppercase tracking-wide">
              Team
            </th>
            <th className="px-2 py-2.5 text-right font-display text-xs font-extrabold uppercase tracking-wide">
              P
            </th>
            <th className="px-2 py-2.5 text-right font-display text-xs font-extrabold uppercase tracking-wide">
              GD
            </th>
            <th className="px-3 py-2.5 text-right font-display text-xs font-extrabold uppercase tracking-wide">
              Pts
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => (
            <tr key={row.team_id} className={i % 2 === 1 ? "bg-bg-soft/50" : undefined}>
              <td className="px-3 py-2.5 font-bold text-ink">{row.name}</td>
              <td className="px-2 py-2.5 text-right text-ink-muted">{row.played}</td>
              <td className="px-2 py-2.5 text-right text-ink-muted">
                {row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}
              </td>
              <td className="px-3 py-2.5 text-right font-display font-extrabold text-ink">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
