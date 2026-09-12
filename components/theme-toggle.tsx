"use client";

import { useTheme } from "./theme-provider";
import { MoonIcon, SunIcon } from "./icons";

// Icon visibility is driven by the `dark` class (via Tailwind's dark:
// variant) rather than the `theme` value from context, so the button
// renders identically on the server and on first client render — the
// pre-paint script in app/layout.tsx already set the right class before
// hydration runs. Only aria-pressed reads client state, so hydration
// warnings for that single attribute are suppressed.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle day / night mode"
      aria-pressed={theme === "dark"}
      suppressHydrationWarning
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-ink transition-transform active:scale-90 sm:h-11 sm:w-11"
    >
      <SunIcon className="hidden h-5 w-5 dark:block" />
      <MoonIcon className="block h-5 w-5 dark:hidden" />
    </button>
  );
}
