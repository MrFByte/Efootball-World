import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { StatCard } from "@/components/stat-card";
import { TournamentCard } from "@/components/tournament-card";
import { H2HList } from "@/components/h2h-list";
import { ArrowRightIcon, BallIcon } from "@/components/icons";
import { getAvatarInitial, getOverviewData } from "./lib";
import { FORMAT_ROUTE } from "@/lib/tournament-rules";

export default async function Home() {
  const { user, tournaments, h2h, recentH2H } = await getOverviewData();

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        <header className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/account"
              aria-label="Edit profile"
              title="Edit profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface-ink font-display text-sm font-extrabold text-on-ink transition-transform active:scale-90 sm:h-11 sm:w-11"
            >
              {getAvatarInitial(user.username)}
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            Hey, {user.username}
          </h1>
          <p className="text-sm font-bold text-ink/70 sm:text-base">Ready for kickoff?</p>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard label="Win Rate" value="%" accent={`${h2h.winRate}`} />
          <StatCard label="Active Comps" value={`${tournaments.length}`} />
          <StatCard label="H2H Record" value={`${h2h.wins}-${h2h.losses}-${h2h.draws}`} />
        </section>

        <section className="relative overflow-hidden rounded-card border-2 border-border bg-surface-ink px-6 py-7 shadow-[6px_6px_0_0_var(--color-border)] sm:px-10 sm:py-9">
          <span
            aria-hidden
            className="dot-grid pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 rounded-full text-lime/20 sm:h-52 sm:w-52"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 flex h-32 w-32 items-center justify-center rounded-full bg-lime/90 sm:h-40 sm:w-40"
          >
            <BallIcon className="h-16 w-16 text-[#14140f]/80 sm:h-20 sm:w-20" />
          </span>

          <div className="relative flex max-w-xs flex-col gap-3 sm:max-w-sm">
            <span className="w-fit rounded-full border-2 border-border bg-lime px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
              New
            </span>
            <h2 className="font-display text-3xl font-extrabold leading-[0.95] text-on-ink sm:text-4xl">
              Jump into the game
            </h2>
            <p className="text-sm font-semibold text-on-ink/70 sm:text-base">
              Leagues, cups, friends and your overall stats — all in one hub.
            </p>
            <Link
              href="/game"
              className="mt-2 flex w-fit items-center gap-2 rounded-full border-2 border-border bg-lime px-5 py-3 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 sm:text-base"
            >
              Go to Game
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              Your Leagues &amp; Cups
            </h2>
            <Link
              href="/game/league"
              className="text-sm font-extrabold text-ink/60 underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          {tournaments.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">
              No active leagues or cups yet — start one from the Game hub.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {tournaments.map((t, i) => (
                <Link key={t.id} href={`/game/${FORMAT_ROUTE[t.format]}/${t.id}`}>
                  <TournamentCard tournament={t} index={i} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 pb-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">
              Recent Head-to-Head
            </h2>
            <Link
              href="/game/friends"
              className="text-sm font-extrabold text-ink/60 underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentH2H.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">
              No head-to-head matches logged yet — add a friend to get started.
            </p>
          ) : (
            <H2HList results={recentH2H} />
          )}
        </section>
      </div>
    </main>
  );
}
