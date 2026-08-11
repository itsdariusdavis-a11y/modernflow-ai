import { checkPasscode, issueToken } from './_lib/auth';
import { json, fail, body } from './_lib/http';
import { PEOPLE, type Person } from '../../shared/types';

/**
 * POST /.netlify/functions/login  { passcode, person } -> { token, person }
 *
 * The only unauthenticated endpoint. The passcode lives in a Netlify env var
 * and is compared here; it never reaches the client bundle.
 */
export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return fail('Use POST', 405);

  try {
    const { passcode, person } = await body<{ passcode?: string; person?: string }>(req);

    if (!PEOPLE.includes(person as Person)) return fail('Pick Darius or Ryan', 400);
    if (!passcode) return fail('Passcode required', 400);
    if (!checkPasscode(passcode)) return fail('Wrong passcode', 401);

    return json({ token: issueToken(person as Person), person });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[mfa-ops] login', message);
    return fail(message, 500);
  }
};
