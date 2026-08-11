import { bearer, verifyToken } from './auth';
import type { Person } from '../../../shared/types';

const JSON_HEADERS = {
  'content-type': 'application/json',
  'cache-control': 'no-store',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export function fail(message: string, status = 400): Response {
  return json({ error: message }, status);
}

/**
 * Wrap a handler so every function shares the same auth gate and error shape.
 * Config problems (missing env vars, a mis-headered tab) surface as 500 with a
 * readable message — this is an internal tool for two people, so a useful error
 * beats a generic one.
 */
export function handler(
  fn: (req: Request, person: Person) => Promise<Response>,
  opts: { method?: 'GET' | 'POST' } = {},
) {
  return async (req: Request): Promise<Response> => {
    const method = opts.method ?? 'POST';
    if (req.method !== method) return fail(`Use ${method}`, 405);

    const person = verifyToken(bearer(req));
    if (!person) return fail('Not signed in', 401);

    try {
      return await fn(req, person);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[mfa-ops]', message);
      return fail(message, 500);
    }
  };
}

/** Parse a JSON body, returning `{}` rather than throwing on garbage. */
export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}
