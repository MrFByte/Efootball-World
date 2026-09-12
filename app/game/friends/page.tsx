import Link from "next/link";
import { ArrowLeftIcon, UsersIcon } from "@/components/icons";
import { AddFriendForm } from "@/components/add-friend-form";
import { AcceptFriendButton } from "@/components/accept-friend-button";
import { getH2HAvatarColor, getInitials } from "@/components/lib";
import { getFriendsOverview } from "./lib";

export default async function FriendsPage() {
  const { accepted, incomingPending, outgoingPending } = await getFriendsOverview();

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

        <div className="flex flex-col gap-1">
          <span className="flex w-fit items-center gap-2 rounded-full border-2 border-border bg-blue px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wide text-[#14140f]">
            <UsersIcon className="h-3.5 w-3.5" />
            Friends
          </span>
          <h1 className="font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">
            Friends &amp; H2H
          </h1>
        </div>

        <AddFriendForm />

        {incomingPending.length > 0 ? (
          <section className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-extrabold text-ink">Friend Requests</h2>
            <ul className="flex flex-col gap-2">
              {incomingPending.map((f) => (
                <li
                  key={f.friendshipId}
                  className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface px-3.5 py-3"
                >
                  <span className="flex-1 truncate text-sm font-bold text-ink">{f.user.username}</span>
                  <AcceptFriendButton friendshipId={f.friendshipId} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="flex flex-col gap-3 pb-4">
          <h2 className="font-display text-lg font-extrabold text-ink">
            Your Friends ({accepted.length})
          </h2>
          {accepted.length === 0 ? (
            <p className="text-sm font-semibold text-ink-muted">
              No friends yet — add one by username above.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {accepted.map((f, i) => (
                <li key={f.friendshipId}>
                  <Link
                    href={`/game/friends/${f.user.id}`}
                    className="flex items-center gap-3 rounded-2xl border-2 border-border bg-surface px-3.5 py-3 transition-transform active:scale-[0.99] sm:px-4"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-border font-display text-sm font-extrabold text-[#14140f] ${getH2HAvatarColor(i)}`}
                    >
                      {getInitials(f.user.username)}
                    </span>
                    <span className="flex-1 truncate text-sm font-bold text-ink sm:text-base">
                      {f.user.username}
                    </span>
                    {f.user.gamer_id ? (
                      <span className="shrink-0 text-xs font-bold text-ink-muted">{f.user.gamer_id}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {outgoingPending.length > 0 ? (
            <p className="text-xs font-bold text-ink-muted">
              Pending: {outgoingPending.map((f) => f.user.username).join(", ")}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
