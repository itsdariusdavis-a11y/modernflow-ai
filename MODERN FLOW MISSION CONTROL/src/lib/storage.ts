/**
 * localStorage that can't take the app down.
 *
 * Accessing `window.localStorage` throws outright in some contexts — a
 * sandboxed/opaque origin, Safari with cookies blocked, private mode at quota.
 * Since the session token, the chosen person, and the cached snapshot are all
 * read during startup, an unguarded throw means a blank page rather than a
 * degraded one. Falling back to an in-memory map keeps the app fully usable for
 * the session; you just get signed out when the tab closes.
 */

const memory = new Map<string, string>();

let available: boolean | null = null;

function usable(): boolean {
  if (available !== null) return available;
  try {
    const probe = '__mfa_ops_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export const storage = {
  get(key: string): string | null {
    if (!usable()) return memory.get(key) ?? null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory.get(key) ?? null;
    }
  },

  set(key: string, value: string): void {
    memory.set(key, value);
    if (!usable()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Quota exceeded — the in-memory copy above still holds.
    }
  },

  remove(key: string): void {
    memory.delete(key);
    if (!usable()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* nothing useful to do */
    }
  },
};
