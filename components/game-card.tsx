import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRightIcon } from "./icons";
import type { IconProps } from "./icons";
import { gameCardColorClasses, type GameCardColor } from "./lib";

interface GameCardProps {
  href: string;
  title: string;
  description: string;
  color: GameCardColor;
  icon: ComponentType<IconProps>;
  count?: number;
}

export function GameCard({ href, title, description, color, icon: Icon, count }: GameCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[184px] flex-col justify-between overflow-hidden rounded-card border-4 border-border p-6 text-[#14140f] shadow-[6px_6px_0_0_var(--color-border)] transition-transform duration-150 hover:-translate-y-1 hover:shadow-[9px_9px_0_0_var(--color-border)] active:translate-y-0 active:shadow-[3px_3px_0_0_var(--color-border)] sm:min-h-[208px] sm:p-7 ${gameCardColorClasses[color]}`}
    >
      <span
        aria-hidden
        className="dot-grid pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full text-[#14140f]/25"
      />
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-border bg-[#14140f] text-lime">
          <Icon className="h-6 w-6" />
        </span>
        {count !== undefined ? (
          <span className="rounded-full border-2 border-border bg-[#14140f] px-2.5 py-1 font-display text-xs font-extrabold text-lime">
            {count}
          </span>
        ) : null}
      </div>

      <div className="relative flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-extrabold leading-none sm:text-[1.75rem]">
            {title}
          </h3>
          <p className="mt-2 max-w-[20ch] text-sm font-semibold text-[#14140f]/75">
            {description}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-[#14140f] text-lime transition-transform duration-150 group-hover:translate-x-1">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
