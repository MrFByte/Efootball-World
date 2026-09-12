// Single source of truth for every backend URL. Nothing outside this file
// should build a Supabase Edge Function URL by hand — import `api` instead.
// See backend/README.md for how these functions are deployed.

const FUNCTIONS_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL ?? "";

function functionUrl(path: string) {
  return `${FUNCTIONS_BASE_URL}/${path}`;
}

export const api = {
  users: {
    get: (id: string) => functionUrl(`get-user/${id}`),
  },
  profile: {
    get: () => functionUrl("profile-get"),
    setup: () => functionUrl("profile-setup"),
    update: () => functionUrl("profile-update"),
  },
  friends: {
    request: () => functionUrl("friends-request"),
    accept: (friendshipId: string) => functionUrl(`friends-accept/${friendshipId}`),
  },
  tournaments: {
    create: () => functionUrl("tournaments-create"),
    get: (id: string) => functionUrl(`tournaments-get/${id}`),
    addTeam: (id: string) => functionUrl(`tournaments-add-team/${id}`),
    generateBracket: (id: string) => functionUrl(`tournaments-generate-bracket/${id}`),
    standings: (id: string) => functionUrl(`tournaments-standings/${id}`),
  },
  matches: {
    update: (id: string) => functionUrl(`matches-update/${id}`),
  },
  h2h: {
    log: () => functionUrl("h2h-log"),
    get: (friendId: string) => functionUrl(`h2h-get/${friendId}`),
    poster: (h2hId: string) => functionUrl(`h2h-poster/${h2hId}`),
  },
} as const;

// True once NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL is set — callers can check
// this before hitting the network instead of relying on a fetch to fail.
export const isBackendConfigured = FUNCTIONS_BASE_URL.length > 0;
