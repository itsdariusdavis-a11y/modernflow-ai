import { handler, json, body } from './_lib/http';
import { upsertRow } from './_lib/sheets';
import { cell, str } from '../../shared/rows';
import { todayLA } from '../../shared/dates';
import type { Standup } from '../../shared/types';

const YMD = /^\d{4}-\d{2}-\d{2}$/;

/**
 * POST /.netlify/functions/standup
 *
 * Upsert on (date, person). Editing today's standup keeps the original
 * submitted_at only if the caller passes it back; otherwise the timestamp
 * reflects the latest edit, which is the honest reading.
 */
export default handler(async (req, person): Promise<Response> => {
  const input = await body<Partial<Standup>>(req);
  const date = YMD.test(str(input.date)) ? str(input.date) : todayLA();

  const row: Standup = {
    date,
    person,
    yesterday: str(input.yesterday),
    today: str(input.today),
    blocker: str(input.blocker),
    submitted_at: new Date().toISOString(),
  };

  const result = await upsertRow(
    'standups',
    row,
    (r, index) => cell(r, index, 'date') === date && cell(r, index, 'person') === person,
  );

  return json({ ok: true, action: result.action, standup: row });
});
