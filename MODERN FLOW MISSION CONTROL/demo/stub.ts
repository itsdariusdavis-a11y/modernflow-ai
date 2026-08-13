import { demoSnapshot } from './fixture';
import { todayLA } from '../shared/dates';
import type { DailyLog, Deal, Snapshot, Standup, WeeklyReview } from '../shared/types';

/**
 * Intercepts the Netlify Function calls so the demo runs with no backend.
 *
 * This deliberately stubs at the network boundary rather than swapping out the
 * app's data layer, so everything above it — the 60s cache, optimistic writes,
 * rollback, the retry path — is the real code running unmodified. Writes work
 * and persist for the session; a refresh resets to the sample data.
 */

const PREFIX = '/.netlify/functions/';
const PASSCODE = 'demo';

let db: Snapshot = demoSnapshot();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** Mirrors the server: person comes from the token, not the request body. */
function personFromToken(init?: RequestInit): 'Darius' | 'Ryan' {
  const auth = String(
    (init?.headers as Record<string, string> | undefined)?.authorization ?? '',
  );
  return auth.includes('Ryan') ? 'Ryan' : 'Darius';
}

function handle(name: string, init: RequestInit | undefined): Response {
  const body = init?.body ? JSON.parse(String(init.body)) : {};
  const person = personFromToken(init);
  const today = todayLA();

  switch (name) {
    case 'login': {
      if (body.passcode !== PASSCODE) {
        return json({ error: `Demo passcode is "${PASSCODE}"` }, 401);
      }
      return json({ token: `demo.${body.person}`, person: body.person });
    }

    case 'data':
      return json({ ...db, fetched_at: new Date().toISOString() });

    case 'daily-log': {
      const row: DailyLog = { ...body, date: body.date || today, person };
      db = {
        ...db,
        daily_log: [
          ...db.daily_log.filter((l) => !(l.date === row.date && l.person === person)),
          row,
        ],
      };
      return json({ ok: true, log: row });
    }

    case 'standup': {
      const row: Standup = {
        ...body,
        date: body.date || today,
        person,
        submitted_at: new Date().toISOString(),
      };
      db = {
        ...db,
        standups: [
          ...db.standups.filter((s) => !(s.date === row.date && s.person === person)),
          row,
        ],
      };
      return json({ ok: true, standup: row });
    }

    case 'deals': {
      const incoming = body.deal ?? {};

      if (body.action === 'create') {
        const deal: Deal = {
          id: `demo-${Date.now()}`,
          business_name: '',
          contact_name: '',
          phone: '',
          source: '',
          owner: person,
          stage: 'Conversation',
          deposit_amount: 0,
          deposit_date: '',
          balance_amount: 0,
          balance_date: '',
          delivery_hours: 0,
          date_created: today,
          last_touch: today,
          next_action: '',
          next_action_date: '',
          notes: '',
          ...incoming,
        };
        db = { ...db, deals: [...db.deals, deal] };
        return json({ ok: true, deal });
      }

      // Same gates the real function enforces.
      if (
        incoming.stage === 'Deposit Paid' &&
        (!incoming.deposit_amount || !incoming.deposit_date)
      ) {
        return json({ error: 'Deposit Paid requires a deposit amount and date' }, 400);
      }
      if (
        incoming.stage === 'Dead' &&
        !incoming.dead_reason &&
        !/^dead:/i.test(incoming.notes ?? '')
      ) {
        return json({ error: 'Marking a deal Dead requires a reason' }, 400);
      }

      db = {
        ...db,
        deals: db.deals.map((d) =>
          d.id === incoming.id ? { ...d, ...incoming, last_touch: today } : d,
        ),
      };
      return json({ ok: true });
    }

    case 'weekly-review': {
      const row: WeeklyReview = { ...body, written_by: person };
      db = {
        ...db,
        weekly_review: [
          ...db.weekly_review.filter((r) => r.week_number !== row.week_number),
          row,
        ],
      };
      return json({ ok: true, review: row });
    }

    default:
      return json({ error: `Unknown function: ${name}` }, 404);
  }
}

export function installStub(): void {
  const real = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (!url.includes(PREFIX)) return real(input as RequestInfo, init);

    const name = url.split(PREFIX)[1].split('?')[0];
    // A little latency so the saving/saved states are actually visible.
    await new Promise((r) => setTimeout(r, 220));
    return handle(name, init);
  };
}

export const DEMO_PASSCODE = PASSCODE;
