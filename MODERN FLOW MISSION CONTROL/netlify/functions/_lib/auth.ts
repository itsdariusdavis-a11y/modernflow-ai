import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { PEOPLE, type Person } from '../../../shared/types';

/**
 * One shared passcode, two named users. The passcode is compared server-side
 * and never persisted by the client — a successful login returns a signed
 * token instead, so the passcode itself only ever exists in the login request.
 */

const TOKEN_TTL_DAYS = 30;

function secret(): string {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 16) {
    throw new Error('Missing APP_SECRET (needs 16+ chars). See SETUP.md.');
  }
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

/** Constant-time compare that tolerates length mismatch without leaking it. */
function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', 'cmp').update(a).digest();
  const hb = createHmac('sha256', 'cmp').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPasscode(input: string): boolean {
  const expected = process.env.APP_PASSCODE;
  if (!expected) throw new Error('Missing APP_PASSCODE. See SETUP.md.');
  return safeEqual(String(input ?? ''), expected);
}

export function issueToken(person: Person): string {
  const exp = Date.now() + TOKEN_TTL_DAYS * 86_400_000;
  const nonce = randomBytes(6).toString('base64url');
  const payload = `${person}.${exp}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | null): Person | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [person, expRaw, nonce, sig] = parts;
  const payload = `${person}.${expRaw}.${nonce}`;
  if (!safeEqual(sig, sign(payload))) return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  return PEOPLE.includes(person as Person) ? (person as Person) : null;
}

/** Pull the bearer token off a request. */
export function bearer(req: Request): string | null {
  const header = req.headers.get('authorization') ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}
