import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeftIcon } from "@/components/icons";
import { EditProfileForm } from "@/components/edit-profile-form";
import { getAccountPageData } from "./lib";

export default async function AccountPage() {
  const { profile } = await getAccountPageData();

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </header>

        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            Your Profile
          </h1>
          <p className="text-sm font-bold text-ink-muted">
            Update your username, eFootball ID or avatar.
          </p>
        </div>

        <EditProfileForm profile={profile} />
      </div>
    </main>
  );
}
