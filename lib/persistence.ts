import { Asset } from "./types";

export type RecentSession = {
  id: string;
  clientName: string;
  plantName: string;
  savedAt: string;
};

const RECENTS_KEY = "sparesview-recent-sessions";
const MAX_RECENTS = 8;

export function getRecentSessions(): RecentSession[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as RecentSession[]) : [];
  } catch {
    return [];
  }
}

// Snapshot helpers for useSyncExternalStore: the snapshot must be referentially
// stable between calls, so cache the parsed list keyed on the raw string.
const EMPTY_RECENTS: RecentSession[] = [];
let recentsCache: { raw: string | null; value: RecentSession[] } = { raw: null, value: EMPTY_RECENTS };

export function getRecentSessionsSnapshot(): RecentSession[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(RECENTS_KEY);
  } catch {
    return EMPTY_RECENTS;
  }
  if (raw !== recentsCache.raw) {
    let value: RecentSession[] = EMPTY_RECENTS;
    try {
      value = raw ? (JSON.parse(raw) as RecentSession[]) : EMPTY_RECENTS;
    } catch {
      value = EMPTY_RECENTS;
    }
    recentsCache = { raw, value };
  }
  return recentsCache.value;
}

export function getServerRecentsSnapshot(): RecentSession[] {
  return EMPTY_RECENTS;
}

export function subscribeToRecents(): () => void {
  return () => {};
}

/** Add or refresh an entry in the recent-sessions list kept in this browser. */
export function rememberSession(id: string, clientName: string, plantName: string) {
  try {
    const rest = getRecentSessions().filter((r) => r.id !== id);
    const next = [{ id, clientName, plantName, savedAt: new Date().toISOString() }, ...rest];
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next.slice(0, MAX_RECENTS)));
  } catch {
    // localStorage unavailable (private mode etc.) — recents list just won't show
  }
}

/** Fire-and-forget save of the asset list. The app never blocks on this. */
export function saveAssets(sessionId: string | null, assets: Asset[]) {
  if (!sessionId) return;
  fetch(`/api/sessions/${sessionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assets }),
  }).catch(() => {
    console.warn("[persistence] could not save assets — continuing in memory only");
  });
}
