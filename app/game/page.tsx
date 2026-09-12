import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { GameCard } from "@/components/game-card";
import { ArrowLeftIcon } from "@/components/icons";
import { getGameHubCards } from "./lib";

export default async function GamePage() {
  const cards = await getGameHubCards();

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        <header className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </header>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Overview
          </Link>
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            Choose Your Arena
          </h1>
          <p className="max-w-md text-sm font-semibold text-ink-muted sm:text-base">
            Everything eFootball World has to offer, in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {cards.map((card) => (
            <GameCard key={card.href} {...card} />
          ))}
        </div>
      </div>
    </main>
  );
}
