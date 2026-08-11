import { handler, json, body } from './_lib/http';
import { upsertRow } from './_lib/sheets';
import { cell, num, bool, str } from '../../shared/rows';
import { todayLA } from '../../shared/dates';
import type { DailyLog } from '../../shared/types';

const YMD = /^\d{4}-\d{2}-\d{2}$/;

/**
 * POST /.netlify/functions/daily-log
 *
 * Upsert on (date, person) so re-submitting the same day corrects the row
 * instead of duplicating it. `person` comes from the auth token, never the
 * request body — neither of us can log numbers under the other's name.
 */
export default handler(async (req, person): Promise<Response> => {
  const input = await body<Partial<DailyLog>>(req);
  const date = YMD.test(str(input.date)) ? str(input.date) : todayLA();

  const row: DailyLog = {
    date,
    person,
    touches: Math.max(0, Math.round(num(input.touches))),
    conversations: Math.max(0, Math.round(num(input.conversations))),
    booked_calls: Math.max(0, Math.round(num(input.booked_calls))),
    deposits_closed: Math.max(0, Math.round(num(input.deposits_closed))),
    cash_collected: Math.max(0, num(input.cash_collected)),
    build_task_done: bool(input.build_task_done),
    blocker: str(input.blocker),
    note: str(input.note),
  };

  const result = await upsertRow(
    'daily_log',
    row,
    (r, index) => cell(r, index, 'date') === date && cell(r, index, 'person') === person,
  );

  return json({ ok: true, action: result.action, log: row });
});
