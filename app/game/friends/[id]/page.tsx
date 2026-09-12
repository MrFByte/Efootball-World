import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { StatCard } from "@/components/stat-card";
import { H2HList } from "@/components/h2h-list";
import { LogH2HForm } from "@/components/log-h2h-form";
import { getInitials } from "@/components/lib";
import type { H2HResult } from "@/lib/selectors";
import { getFriendDetail } from "./lib";

export default async function FriendDetailPage({ params }: PageProps<"/game/friends/[id]">) {
  const { id } = await params;
  const { friend, h2h } = await getFriendDetail(id);

  const results: H2HResult[] = h2h.matches.map((m) => ({
    id: m.id,
    opponentId: friend.id,
    opponentName: friend.username,
    scoreFor: m.score_a,
    scoreAgainst: m.score_b,
    result: m.score_a === m.score_b ? "D" : m.score_a > m.score_b ? "W" : "L",
    playedAt: m.played_at,
  }));

  const total = h2h.record.wins + h2h.record.losses + h2h.record.draws;
  const winRate = total === 0 ? 0 : Math.round((h2h.record.wins / total) * 100);

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/game/friends"
          className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Friends
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface-ink font-display text-base font-extrabold text-on-ink">
            {getInitials(friend.username)}
          </span>
          <div className="flex flex-col">
            <h1 className="font-display text-2xl font-extrabold leading-none text-ink sm:text-3xl">
              {friend.username}
            </h1>
            {friend.gamer_id ? (
              <span className="text-xs font-bold text-ink-muted">{friend.gamer_id}</span>
            ) : null}
          </div>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Win Rate" value="%" accent={`${winRate}`} />
          <StatCard label="Record" value={`${h2h.record.wins}-${h2h.record.losses}-${h2h.record.draws}`} />
          <StatCard label="Matches" value={`${total}`} />
        </section>

        <LogH2HForm friendId={friend.id} />

        <section className="flex flex-col gap-3 pb-4">
          <h2 className="font-display text-lg font-extrabold text-ink">Match History</h2>
          {results.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">No matches logged yet.</p>
          ) : (
            <H2HList results={results} />
          )}
        </section>
      </div>
    </main>
  );
}
