import { useCallback, useSyncExternalStore } from 'react';
import { fetchSnapshot, ApiError } from './api';
import type { Snapshot } from '@shared/types';

/**
 * A single shared snapshot of the Sheet, cached for 60 seconds so five screens
 * and two people don't hammer the Sheets API. Also persisted to localStorage so
 * that when Sheets is unreachable we can show the last known numbers with a
 * stale banner instead of an empty page.
 */

const CACHE_MS = 60_000;
const CACHE_KEY = 'mfa_ops_snapshot';

export interface StoreState {
  data: Snapshot | null;
  loading: boolean;
  /** Set when the last read failed but we still have older data to show. */
  stale: boolean;
  error: string | null;
  fetchedAt: number;
}

let state: StoreState = {
  data: readCache(),
  loading: false,
  stale: false,
  error: null,
  fetchedAt: 0,
};

const listeners = new Set<() => void>();
let inFlight: Promise<void> | null = null;

function readCache(): Snapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Snapshot) : null;
  } catch {
    return null;
  }
}

function writeCache(data: Snapshot): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Quota or private mode. The in-memory copy still works for this session.
  }
}

function set(patch: Partial<StoreState>): void {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState(): StoreState {
  return state;
}

export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
  state = { data: null, loading: false, stale: false, error: null, fetchedAt: 0 };
  listeners.forEach((fn) => fn());
}

/** Fetch the snapshot, honouring the 60s cache unless `force` is set. */
export function load(force = false): Promise<void> {
  const fresh = Date.now() - state.fetchedAt < CACHE_MS;
  if (!force && fresh && state.data) return Promise.resolve();
  if (inFlight) return inFlight;

  set({ loading: true, error: null });

  inFlight = fetchSnapshot()
    .then((data) => {
      writeCache(data);
      set({ data, loading: false, stale: false, error: null, fetchedAt: Date.now() });
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : 'Could not load data';
      // 401 is handled by the api layer bouncing to login; don't paint it stale.
      const isAuth = err instanceof ApiError && err.status === 401;
      set({
        loading: false,
        error: message,
        stale: !isAuth && Boolean(state.data),
      });
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * Apply a local edit immediately and return an undo. Used for optimistic
 * writes: patch, fire the request, and roll back if the write fails.
 */
export function patchLocal(fn: (snapshot: Snapshot) => Snapshot): () => void {
  const previous = state.data;
  if (!previous) return () => {};
  const next = fn(previous);
  set({ data: next });
  writeCache(next);
  return () => {
    set({ data: previous });
    writeCache(previous);
  };
}

/** Mark the cache expired so the next read hits the network. */
export function invalidate(): void {
  set({ fetchedAt: 0 });
}

export function useStore(): StoreState & { refresh: () => Promise<void> } {
  const snapshot = useSyncExternalStore(subscribe, getState, getState);
  const refresh = useCallback(() => load(true), []);
  return { ...snapshot, refresh };
}

/** Empty snapshot so screens can render structure before the first load lands. */
export const EMPTY: Snapshot = {
  daily_log: [],
  deals: [],
  standups: [],
  weekly_review: [],
  fetched_at: '',
};
