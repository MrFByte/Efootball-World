import { FORMAT_LABEL } from "@/lib/tournament-rules";
import type { MatchResult } from "@/lib/types";

// ---- theme-provider.tsx ----------------------------------------------

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "efootball-world-theme";

// Runs before paint too (see the inline script in app/layout.tsx), so this
// only needs to read whatever class that script already applied.
export function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable (private mode, etc.) — theme just won't persist.
  }
}

export function nextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

// ---- game-card.tsx / coming-soon.tsx -----------------------------------

export type GameCardColor = "aqua" | "sand" | "futsol" | "blue" | "pink" | "icterine";

export const gameCardColorClasses: Record<GameCardColor, string> = {
  aqua: "bg-aqua",
  sand: "bg-sand",
  futsol: "bg-futsol",
  blue: "bg-blue",
  pink: "bg-pink",
  icterine: "bg-icterine",
};

// ---- tournament-card.tsx ------------------------------------------------

const tournamentBarColors = ["bg-aqua", "bg-sand", "bg-blue"];

export function getTournamentBarColor(index: number) {
  return tournamentBarColors[index % tournamentBarColors.length];
}

// Re-exported from lib/tournament-rules.ts (the single source shared
// with the create form) so callers importing from here still get one name.
export const tournamentFormatLabel = FORMAT_LABEL;

// ---- h2h-list.tsx ---------------------------------------------------------

export const h2hResultClasses: Record<MatchResult, string> = {
  W: "bg-aqua text-[#14140f]",
  L: "bg-pink text-[#14140f]",
  D: "bg-icterine text-[#14140f]",
};

const h2hAvatarColors = ["bg-sand", "bg-blue", "bg-futsol", "bg-aqua", "bg-pink"];

export function getH2HAvatarColor(index: number) {
  return h2hAvatarColors[index % h2hAvatarColors.length];
}

export function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}
