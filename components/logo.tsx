import { BallIcon } from "./icons";

export function Logo({ withName = true }: { withName?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface-ink text-lime sm:h-10 sm:w-10">
        <BallIcon className="h-5 w-5" />
      </span>
      {withName ? (
        <span className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
          eFootball World
        </span>
      ) : null}
    </div>
  );
}
