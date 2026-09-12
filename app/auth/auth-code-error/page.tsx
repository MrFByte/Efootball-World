import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <Logo />
        <div className="flex flex-col gap-3 rounded-card border-2 border-border bg-surface px-6 py-8 shadow-[6px_6px_0_0_var(--color-border)] sm:px-8">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Sign-in didn&apos;t go through
          </h1>
          <p className="text-sm font-semibold text-ink-muted sm:text-base">
            That sign-in link expired or was already used. Try again.
          </p>
          <Link
            href="/login"
            className="mt-2 flex w-fit items-center gap-2 self-center rounded-full border-2 border-border bg-lime px-5 py-3 font-display text-sm font-extrabold text-[#14140f] transition-transform active:scale-95 sm:text-base"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}
