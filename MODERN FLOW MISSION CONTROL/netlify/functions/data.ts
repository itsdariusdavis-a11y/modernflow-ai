import { handler, json } from './_lib/http';
import { readAll } from './_lib/sheets';
import { parseDailyLog, parseDeals, parseStandups, parseWeeklyReview } from './_lib/parse';
import type { Snapshot } from '../../shared/types';

/**
 * GET /.netlify/functions/data -> the whole dataset in one round trip.
 *
 * Four tabs is small enough that paging or per-screen endpoints would just add
 * failure modes. The client caches this for 60s.
 */
export default handler(
  async (): Promise<Response> => {
    const tabs = await readAll();

    const snapshot: Snapshot = {
      daily_log: parseDailyLog(tabs.daily_log),
      deals: parseDeals(tabs.deals),
      standups: parseStandups(tabs.standups),
      weekly_review: parseWeeklyReview(tabs.weekly_review),
      fetched_at: new Date().toISOString(),
    };

    return json(snapshot);
  },
  { method: 'GET' },
);
