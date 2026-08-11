import { randomUUID } from 'node:crypto';
import { handler, json, fail, body } from './_lib/http';
import { readTab, upsertRow } from './_lib/sheets';
import { parseDeals } from './_lib/parse';
import { cell, num, str } from '../../shared/rows';
import { todayLA } from '../../shared/dates';
import { PEOPLE, STAGES, type Deal, type Person, type Stage } from '../../shared/types';

/**
 * POST /.netlify/functions/deals  { action: 'create' | 'update', deal }
 *
 * The stage gates live here as well as in the UI. A deal can't reach
 * "Deposit Paid" without money attached to it, and can't go "Dead" without a
 * reason — that's the whole point of the pipeline being honest.
 */
export default handler(async (req, person): Promise<Response> => {
  const input = await body<{
    action?: string;
    deal?: Partial<Deal> & { dead_reason?: string };
  }>(req);
  const deal = input.deal ?? {};
  const action = input.action === 'create' ? 'create' : 'update';

  const businessName = str(deal.business_name);
  if (action === 'create' && !businessName) return fail('Business name is required', 400);

  const stage = (STAGES as readonly string[]).includes(str(deal.stage))
    ? (str(deal.stage) as Stage)
    : 'Conversation';

  const depositAmount = Math.max(0, num(deal.deposit_amount));
  const depositDate = str(deal.deposit_date);
  if (stage === 'Deposit Paid' && (!depositAmount || !depositDate)) {
    return fail('Deposit Paid requires a deposit amount and date', 400);
  }

  const deadReason = str(deal.dead_reason);
  if (stage === 'Dead' && !deadReason && !/^dead:/i.test(str(deal.notes))) {
    return fail('Marking a deal Dead requires a reason', 400);
  }

  const existingTab = await readTab('deals');
  const existing = parseDeals(existingTab);

  let base: Deal | undefined;
  if (action === 'update') {
    base = existing.find((d) => d.id === str(deal.id));
    if (!base) return fail('Deal not found', 404);
  }

  const notes = deadReason
    ? [`Dead: ${deadReason}`, str(deal.notes) || base?.notes || ''].filter(Boolean).join(' — ')
    : str(deal.notes ?? base?.notes ?? '');

  const owner: Person = PEOPLE.includes(str(deal.owner) as Person)
    ? (str(deal.owner) as Person)
    : (base?.owner ?? person);

  const row: Deal = {
    id: base?.id ?? randomUUID(),
    business_name: businessName || (base?.business_name ?? ''),
    contact_name: str(deal.contact_name ?? base?.contact_name ?? ''),
    phone: str(deal.phone ?? base?.phone ?? ''),
    source: str(deal.source ?? base?.source ?? ''),
    owner,
    stage,
    deposit_amount: depositAmount || (stage === 'Dead' ? 0 : (base?.deposit_amount ?? 0)),
    deposit_date: depositDate || (base?.deposit_date ?? ''),
    balance_amount: Math.max(0, num(deal.balance_amount ?? base?.balance_amount ?? 0)),
    balance_date: str(deal.balance_date ?? base?.balance_date ?? ''),
    delivery_hours: Math.max(0, num(deal.delivery_hours ?? base?.delivery_hours ?? 0)),
    date_created: base?.date_created || todayLA(),
    // Any write is a touch. That's what keeps the 5-day stale flag meaningful.
    last_touch: todayLA(),
    next_action: str(deal.next_action ?? base?.next_action ?? ''),
    next_action_date: str(deal.next_action_date ?? base?.next_action_date ?? ''),
    notes,
  };

  const result = await upsertRow('deals', row, (r, index) => cell(r, index, 'id') === row.id);

  return json({ ok: true, action: result.action, deal: row });
});
