import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowLeftIcon } from "./icons";
import type { IconProps } from "./icons";
import { gameCardColorClasses, type GameCardColor } from "./lib";

interface ComingSoonProps {
  title: string;
  description: string;
  color: GameCardColor;
  icon: ComponentType<IconProps>;
}

export function ComingSoon({ title, description, color, icon: Icon }: ComingSoonProps) {
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

        <div
          className={`relative flex flex-1 flex-col items-start justify-center gap-5 overflow-hidden rounded-card border-4 border-border p-8 text-[#14140f] shadow-[8px_8px_0_0_var(--color-border)] sm:p-12 ${gameCardColorClasses[color]}`}
        >
          <span
            aria-hidden
            className="dot-grid pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full text-[#14140f]/20"
          />
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-[#14140f] text-lime">
            <Icon className="h-7 w-7" />
          </span>
          <div className="relative">
            <span className="inline-block rounded-full border-2 border-border bg-[#14140f] px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-lime">
              Coming Soon
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-none sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-base font-semibold text-[#14140f]/75">
              {description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
