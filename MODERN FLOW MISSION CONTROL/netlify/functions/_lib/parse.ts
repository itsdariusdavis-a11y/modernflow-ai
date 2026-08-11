import type { TabData } from './sheets';
import { cell, num, bool } from '../../../shared/rows';
import {
  PEOPLE,
  STAGES,
  type DailyLog,
  type Deal,
  type Person,
  type Stage,
  type Standup,
  type WeeklyReview,
} from '../../../shared/types';

/**
 * Sheet rows are strings typed by humans. Coerce defensively: an unrecognised
 * person or stage falls back to something valid rather than blowing up a read
 * that the whole dashboard depends on.
 */

function person(v: string): Person {
  return (PEOPLE as string[]).includes(v) ? (v as Person) : 'Darius';
}

function stage(v: string): Stage {
  return (STAGES as readonly string[]).includes(v) ? (v as Stage) : 'Conversation';
}

export function parseDailyLog({ index, rows }: TabData): DailyLog[] {
  return rows.map((r) => ({
    date: cell(r, index, 'date'),
    person: person(cell(r, index, 'person')),
    touches: num(cell(r, index, 'touches')),
    conversations: num(cell(r, index, 'conversations')),
    booked_calls: num(cell(r, index, 'booked_calls')),
    deposits_closed: num(cell(r, index, 'deposits_closed')),
    cash_collected: num(cell(r, index, 'cash_collected')),
    build_task_done: bool(cell(r, index, 'build_task_done')),
    blocker: cell(r, index, 'blocker'),
    note: cell(r, index, 'note'),
  }));
}

export function parseDeals({ index, rows }: TabData): Deal[] {
  return rows.map((r) => ({
    id: cell(r, index, 'id'),
    business_name: cell(r, index, 'business_name'),
    contact_name: cell(r, index, 'contact_name'),
    phone: cell(r, index, 'phone'),
    source: cell(r, index, 'source'),
    owner: person(cell(r, index, 'owner')),
    stage: stage(cell(r, index, 'stage')),
    deposit_amount: num(cell(r, index, 'deposit_amount')),
    deposit_date: cell(r, index, 'deposit_date'),
    balance_amount: num(cell(r, index, 'balance_amount')),
    balance_date: cell(r, index, 'balance_date'),
    delivery_hours: num(cell(r, index, 'delivery_hours')),
    date_created: cell(r, index, 'date_created'),
    last_touch: cell(r, index, 'last_touch'),
    next_action: cell(r, index, 'next_action'),
    next_action_date: cell(r, index, 'next_action_date'),
    notes: cell(r, index, 'notes'),
  }));
}

export function parseStandups({ index, rows }: TabData): Standup[] {
  return rows.map((r) => ({
    date: cell(r, index, 'date'),
    person: person(cell(r, index, 'person')),
    yesterday: cell(r, index, 'yesterday'),
    today: cell(r, index, 'today'),
    blocker: cell(r, index, 'blocker'),
    submitted_at: cell(r, index, 'submitted_at'),
  }));
}

export function parseWeeklyReview({ index, rows }: TabData): WeeklyReview[] {
  return rows.map((r) => ({
    week_number: num(cell(r, index, 'week_number')),
    start_date: cell(r, index, 'start_date'),
    end_date: cell(r, index, 'end_date'),
    cash_collected: num(cell(r, index, 'cash_collected')),
    touches: num(cell(r, index, 'touches')),
    conversations: num(cell(r, index, 'conversations')),
    closes: num(cell(r, index, 'closes')),
    biggest_objection: cell(r, index, 'biggest_objection'),
    one_change: cell(r, index, 'one_change'),
    written_by: (PEOPLE as string[]).includes(cell(r, index, 'written_by'))
      ? (cell(r, index, 'written_by') as Person)
      : '',
  }));
}
