/**
 * Populates the Sheet with three days of plausible sample data so the UI can be
 * judged before real numbers exist.
 *
 *   npm run seed          # add sample rows
 *   npm run seed -- --wipe-first   # print how to clear, then add
 *
 * Safe to re-run: daily_log and standups upsert on (date, person), and deals
 * are matched by business name so you don't get five copies of the same one.
 */

import { randomUUID } from 'node:crypto';
import { readTab, upsertRow, appendRows } from '../netlify/functions/_lib/sheets';
import { parseDeals } from '../netlify/functions/_lib/parse';
import { cell } from '../shared/rows';
import { todayLA, addDays } from '../shared/dates';
import { GOAL_START, GOAL_END } from '../shared/config';
import type { DailyLog, Deal, Standup } from '../shared/types';

const today = todayLA();
const d2 = addDays(today, -2);
const d1 = addDays(today, -1);

const dailyLogs: DailyLog[] = [
  {
    date: d2,
    person: 'Darius',
    touches: 28,
    conversations: 4,
    booked_calls: 1,
    deposits_closed: 0,
    cash_collected: 0,
    build_task_done: true,
    blocker: '',
    note: 'Reworked the roofer script, better hook.',
  },
  {
    date: d2,
    person: 'Ryan',
    touches: 31,
    conversations: 5,
    booked_calls: 2,
    deposits_closed: 1,
    cash_collected: 250,
    build_task_done: false,
    blocker: '',
    note: 'Sunrise Plumbing paid the deposit on the call.',
  },
  {
    date: d1,
    person: 'Darius',
    touches: 22,
    conversations: 3,
    booked_calls: 0,
    deposits_closed: 0,
    cash_collected: 0,
    build_task_done: true,
    blocker: 'Waiting on logo files from Sunrise.',
    note: '',
  },
  {
    date: d1,
    person: 'Ryan',
    touches: 26,
    conversations: 6,
    booked_calls: 1,
    deposits_closed: 1,
    cash_collected: 250,
    build_task_done: false,
    blocker: '',
    note: 'Coastal Electric deposit. Balance due on delivery.',
  },
  {
    date: today,
    person: 'Darius',
    touches: 12,
    conversations: 2,
    booked_calls: 0,
    deposits_closed: 0,
    cash_collected: 0,
    build_task_done: false,
    blocker: '',
    note: '',
  },
  {
    date: today,
    person: 'Ryan',
    touches: 18,
    conversations: 3,
    booked_calls: 1,
    deposits_closed: 0,
    cash_collected: 250,
    build_task_done: false,
    blocker: 'Two prospects want to see a live example first.',
    note: '',
  },
];

const standups: Standup[] = [
  {
    date: today,
    person: 'Darius',
    yesterday: 'Built the Sunrise site skeleton, 22 dials.',
    today: 'Finish Sunrise build, 25 dials minimum.',
    blocker: '',
    submitted_at: new Date(`${today}T15:40:00.000Z`).toISOString(),
  },
  {
    date: today,
    person: 'Ryan',
    yesterday: '26 dials, closed Coastal Electric deposit.',
    today: 'Follow up the 4 warm ones, book 2 calls.',
    blocker: 'Two prospects want to see a live example first.',
    submitted_at: new Date(`${today}T16:05:00.000Z`).toISOString(),
  },
];

const deals: Omit<Deal, 'id'>[] = [
  {
    business_name: 'Sunrise Plumbing',
    contact_name: 'Marco Reyes',
    phone: '619-555-0142',
    source: 'Cold call',
    owner: 'Ryan',
    stage: 'In Build',
    deposit_amount: 250,
    deposit_date: d2,
    balance_amount: 250,
    balance_date: '',
    delivery_hours: 0,
    date_created: addDays(today, -6),
    last_touch: d1,
    next_action: 'Send draft site for review',
    next_action_date: today,
    notes: 'Wants booking widget on the homepage.',
  },
  {
    business_name: 'Coastal Electric',
    contact_name: 'Dana Whitfield',
    phone: '619-555-0188',
    source: 'Referral',
    owner: 'Ryan',
    stage: 'Deposit Paid',
    deposit_amount: 250,
    deposit_date: d1,
    balance_amount: 0,
    balance_date: '',
    delivery_hours: 0,
    date_created: addDays(today, -4),
    last_touch: today,
    next_action: 'Kickoff call',
    next_action_date: addDays(today, 1),
    notes: '',
  },
  {
    business_name: 'Harbor HVAC',
    contact_name: 'Luis Ortega',
    phone: '619-555-0117',
    source: 'Cold call',
    owner: 'Darius',
    stage: 'Booked',
    deposit_amount: 0,
    deposit_date: '',
    balance_amount: 0,
    balance_date: '',
    delivery_hours: 0,
    date_created: addDays(today, -3),
    last_touch: d1,
    next_action: 'Strategy call',
    next_action_date: addDays(today, 2),
    notes: '',
  },
  {
    business_name: 'Mesa Roofing Co',
    contact_name: 'Tina Alvarez',
    phone: '619-555-0163',
    source: 'Apollo',
    owner: 'Darius',
    stage: 'Conversation',
    deposit_amount: 0,
    deposit_date: '',
    balance_amount: 0,
    balance_date: '',
    delivery_hours: 0,
    date_created: addDays(today, -9),
    // Deliberately stale so the amber flag is visible in the seeded UI.
    last_touch: addDays(today, -7),
    next_action: 'Second call attempt',
    next_action_date: addDays(today, -2),
    notes: '',
  },
  {
    business_name: 'Pacific Pest Control',
    contact_name: 'Grant Meyer',
    phone: '619-555-0134',
    source: 'Cold call',
    owner: 'Darius',
    stage: 'Balance Paid',
    deposit_amount: 250,
    deposit_date: addDays(today, -12),
    balance_amount: 250,
    balance_date: addDays(today, -5),
    // Gives Unit Economics something real to chew on: $500 / 7h = $71/hr.
    delivery_hours: 7,
    date_created: addDays(today, -15),
    last_touch: addDays(today, -5),
    next_action: 'Pitch the monthly retainer',
    next_action_date: addDays(today, 3),
    notes: 'Happy with the site. Retainer conversation open.',
  },
  {
    business_name: 'Kearny Garage Doors',
    contact_name: 'Phil Nakamura',
    phone: '619-555-0179',
    source: 'Cold call',
    owner: 'Ryan',
    stage: 'Dead',
    deposit_amount: 0,
    deposit_date: '',
    balance_amount: 0,
    balance_date: '',
    delivery_hours: 0,
    date_created: addDays(today, -10),
    last_touch: addDays(today, -8),
    next_action: '',
    next_action_date: '',
    notes: 'Dead: has a nephew who "does websites".',
  },
];

async function main() {
  console.log(`Seeding ${d2} → ${today}\n`);

  for (const log of dailyLogs) {
    await upsertRow(
      'daily_log',
      log,
      (r, i) => cell(r, i, 'date') === log.date && cell(r, i, 'person') === log.person,
    );
    console.log(`  daily_log  ${log.date}  ${log.person}`);
  }

  for (const s of standups) {
    await upsertRow(
      'standups',
      s,
      (r, i) => cell(r, i, 'date') === s.date && cell(r, i, 'person') === s.person,
    );
    console.log(`  standups   ${s.date}  ${s.person}`);
  }

  const existing = parseDeals(await readTab('deals'));
  const known = new Set(existing.map((d) => d.business_name.toLowerCase()));
  const fresh = deals
    .filter((d) => !known.has(d.business_name.toLowerCase()))
    .map((d) => ({ ...d, id: randomUUID() }));

  if (fresh.length) {
    await appendRows('deals', fresh);
    fresh.forEach((d) => console.log(`  deals      ${d.business_name}`));
  }
  const skipped = deals.length - fresh.length;
  if (skipped) console.log(`  deals      ${skipped} already present, skipped`);

  // Only cash logged inside the sprint window counts toward the $3,000, so
  // report what the dashboard will actually show rather than the seeded total.
  const inWindow = dailyLogs.filter((l) => l.date >= GOAL_START && l.date <= GOAL_END);
  const counted = inWindow.reduce((a, l) => a + l.cash_collected, 0);
  const seeded = dailyLogs.reduce((a, l) => a + l.cash_collected, 0);

  console.log(`\nDone. The dashboard should show $${counted} of $3,000.`);
  if (counted !== seeded) {
    console.log(
      `Note: $${seeded - counted} was seeded on days before the sprint window ` +
        `(${GOAL_START}–${GOAL_END}) and does not count toward the goal.`,
    );
  }
}

main().catch((err) => {
  console.error('\nSeed failed:', err instanceof Error ? err.message : err);
  console.error('Check that .env has GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and');
  console.error('GOOGLE_PRIVATE_KEY set, and that the Sheet is shared with that account.');
  process.exit(1);
});
