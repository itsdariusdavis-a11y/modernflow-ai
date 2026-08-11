import { handler, json, fail, body } from './_lib/http';
import { upsertRow } from './_lib/sheets';
import { cell, num, str } from '../../shared/rows';
import type { WeeklyReview } from '../../shared/types';

/**
 * POST /.netlify/functions/weekly-review
 *
 * Upsert on week_number. The four number fields are actuals computed by the
 * client from daily_log and sent along, so the review row stays readable on its
 * own in the Sheet without recomputing history.
 */
export default handler(async (req, person): Promise<Response> => {
  const input = await body<Partial<WeeklyReview>>(req);
  const week = Math.round(num(input.week_number));
  if (!week || week < 1) return fail('week_number is required', 400);

  const row: WeeklyReview = {
    week_number: week,
    start_date: str(input.start_date),
    end_date: str(input.end_date),
    cash_collected: num(input.cash_collected),
    touches: Math.round(num(input.touches)),
    conversations: Math.round(num(input.conversations)),
    closes: Math.round(num(input.closes)),
    biggest_objection: str(input.biggest_objection),
    one_change: str(input.one_change),
    written_by: person,
  };

  const result = await upsertRow(
    'weekly_review',
    row,
    (r, index) => num(cell(r, index, 'week_number')) === week,
  );

  return json({ ok: true, action: result.action, review: row });
});
