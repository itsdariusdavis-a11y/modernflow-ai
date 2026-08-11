import type { Person, Snapshot } from '@shared/types';

const BASE = '/.netlify/functions';

export const TOKEN_KEY = 'mfa_ops_token';
export const PERSON_KEY = 'mfa_ops_person';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, person: Person): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PERSON_KEY, person);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PERSON_KEY);
}

/** Listeners fired when the server rejects our token, so the app can bounce to login. */
const expiryListeners = new Set<() => void>();

export function onSessionExpired(fn: () => void): () => void {
  expiryListeners.add(fn);
  return () => expiryListeners.delete(fn);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    // Offline, DNS, or a function cold-start timeout. Callers treat this the
    // same as a server error but the message should say what actually happened.
    throw new ApiError('Network unreachable', 0);
  }

  const text = await res.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearSession();
      expiryListeners.forEach((fn) => fn());
    }
    throw new ApiError(payload?.error ?? `Request failed (${res.status})`, res.status);
  }

  return payload as T;
}

export function login(person: Person, passcode: string) {
  return request<{ token: string; person: Person }>('/login', {
    method: 'POST',
    body: JSON.stringify({ person, passcode }),
  });
}

export function fetchSnapshot() {
  return request<Snapshot>('/data', { method: 'GET' });
}

export function post<T>(path: string, payload: unknown) {
  return request<T>(path, { method: 'POST', body: JSON.stringify(payload) });
}
