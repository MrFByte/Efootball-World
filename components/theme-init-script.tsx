import { THEME_STORAGE_KEY } from "./lib";

// Blocking inline script placed in <head> so the correct theme class is set
// before first paint — avoids a light/dark flash on load. Must stay a raw
// string (it runs before any React/module code), so it duplicates the tiny
// bit of logic in lib.ts's readInitialTheme/applyTheme rather than importing
// them; the storage key itself is still shared, not duplicated.
export function ThemeInitScript() {
  const script = `
(function () {
  try {
    var stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
