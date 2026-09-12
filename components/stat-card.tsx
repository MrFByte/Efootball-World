interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-card border-2 border-border bg-surface-ink px-4 py-4 shadow-[4px_4px_0_0_var(--color-border)] sm:px-5 sm:py-5">
      <span className="text-[11px] font-extrabold uppercase tracking-wide text-on-ink/60 sm:text-xs">
        {label}
      </span>
      <span className="font-display text-2xl font-extrabold leading-none text-on-ink sm:text-3xl">
        {accent ? (
          <>
            <span className="text-lime">{accent}</span>
            {value}
          </>
        ) : (
          value
        )}
      </span>
    </div>
  );
}
