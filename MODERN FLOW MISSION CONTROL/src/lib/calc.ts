import {
  GOAL_AMOUNT,
  GOAL_START,
  GOAL_END,
  GOAL_DAYS,
  FULL_CYCLE_VALUE,
  HOURLY_FLOOR,
  STALE_TOUCH_DAYS,
  TOUCH_MINIMUM,
} from '@shared/config';
import {
  DELIVERED_STAGES,
  PEOPLE,
  STAGES,
  type DailyLog,
  type Deal,
  type Person,
  type Snapshot,
  type Stage,
  type Standup,
} from '@shared/types';
import { daysBetween, dateRange, sprintWeek, sprintWeekRange } from '@shared/dates';

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

export type PaceStatus = 'ahead' | 'behind' | 'bad';

export interface GoalProgress {
  collected: number;
  goal: number;
  /** Where we should be today if we'd earned it in a straight line. */
  paceTarget: number;
  ratio: number;
  status: PaceStatus;
  /** Days of the sprint that have started, including today. */
  daysElapsed: number;
  /** Days left including today. Negative once the sprint has closed. */
  daysRemaining: number;
  fraction: number;
  shortfall: number;
}

export function goalProgress(logs: DailyLog[], today: string): GoalProgress {
  const collected = sum(
    logs.filter((l) => l.date >= GOAL_START && l.date <= GOAL_END).map((l) => l.cash_collected),
  );

  const daysElapsed = Math.min(Math.max(daysBetween(GOAL_START, today) + 1, 0), GOAL_DAYS);
  const daysRemaining = daysBetween(today, GOAL_END);
  const paceTarget = (GOAL_AMOUNT * daysElapsed) / GOAL_DAYS;

  // Ratio against the straight line. Day 0 has no line to be behind.
  const ratio = paceTarget > 0 ? collected / paceTarget : 1;
  const status: PaceStatus = ratio >= 1 ? 'ahead' : ratio >= 0.6 ? 'behind' : 'bad';

  return {
    collected,
    goal: GOAL_AMOUNT,
    paceTarget,
    ratio,
    status,
    daysElapsed,
    daysRemaining,
    fraction: Math.min(collected / GOAL_AMOUNT, 1),
    shortfall: Math.max(paceTarget - collected, 0),
  };
}

/** Combined totals for a single day. */
export function dayTotals(logs: DailyLog[], date: string) {
  const rows = logs.filter((l) => l.date === date);
  return {
    touches: sum(rows.map((r) => r.touches)),
    conversations: sum(rows.map((r) => r.conversations)),
    booked_calls: sum(rows.map((r) => r.booked_calls)),
    deposits_closed: sum(rows.map((r) => r.deposits_closed)),
    cash_collected: sum(rows.map((r) => r.cash_collected)),
  };
}

/** The sprint week (1-based) containing a date, and its date bounds. */
export function currentWeek(today: string) {
  const week = sprintWeek(today, GOAL_START, GOAL_DAYS);
  return { week, ...sprintWeekRange(week, GOAL_START, GOAL_END) };
}

export function weekTotals(logs: DailyLog[], start: string, end: string) {
  const rows = logs.filter((l) => l.date >= start && l.date <= end);
  return {
    touches: sum(rows.map((r) => r.touches)),
    conversations: sum(rows.map((r) => r.conversations)),
    booked_calls: sum(rows.map((r) => r.booked_calls)),
    closes: sum(rows.map((r) => r.deposits_closed)),
    cash_collected: sum(rows.map((r) => r.cash_collected)),
  };
}

export interface PersonDay {
  person: Person;
  logged: boolean;
  touches: number;
  touchesShort: number;
  metTouchMinimum: boolean;
  conversations: number;
  standupSubmitted: boolean;
  standupAt: string;
  buildTaskDone: boolean;
  blocker: string;
}

/** The accountability read for one person on one day. */
export function personDay(
  logs: DailyLog[],
  standups: Standup[],
  person: Person,
  date: string,
): PersonDay {
  const log = logs.find((l) => l.date === date && l.person === person);
  const standup = standups.find((s) => s.date === date && s.person === person);
  const touches = log?.touches ?? 0;

  return {
    person,
    logged: Boolean(log),
    touches,
    touchesShort: Math.max(TOUCH_MINIMUM - touches, 0),
    metTouchMinimum: touches >= TOUCH_MINIMUM,
    conversations: log?.conversations ?? 0,
    standupSubmitted: Boolean(standup?.submitted_at),
    standupAt: standup?.submitted_at ?? '',
    buildTaskDone: log?.build_task_done ?? false,
    blocker: (log?.blocker || standup?.blocker || '').trim(),
  };
}

export function allPersonDays(snapshot: Snapshot, date: string): PersonDay[] {
  return PEOPLE.map((p) => personDay(snapshot.daily_log, snapshot.standups, p, date));
}

export interface PacePoint {
  date: string;
  label: string;
  /** Cumulative cash actually collected. Null for days that haven't happened. */
  actual: number | null;
  /** The straight line to the goal. */
  pace: number;
}

/** 21-day cumulative actual vs straight-line pace. */
export function paceSeries(logs: DailyLog[], today: string): PacePoint[] {
  const byDate = new Map<string, number>();
  for (const l of logs) {
    byDate.set(l.date, (byDate.get(l.date) ?? 0) + l.cash_collected);
  }

  let running = 0;
  return dateRange(GOAL_START, GOAL_END).map((date, i) => {
    running += byDate.get(date) ?? 0;
    return {
      date,
      label: date.slice(5), // MM-DD keeps the axis narrow on a phone
      actual: date <= today ? running : null,
      pace: (GOAL_AMOUNT * (i + 1)) / GOAL_DAYS,
    };
  });
}

/** Expected dollar value of a deal: what's booked, or the standard cycle. */
export function dealValue(d: Deal): number {
  const booked = d.deposit_amount + d.balance_amount;
  return booked > 0 ? booked : FULL_CYCLE_VALUE;
}

export interface StageSummary {
  stage: Stage;
  count: number;
  value: number;
}

export function pipelineSummary(deals: Deal[]): StageSummary[] {
  return STAGES.map((stage) => {
    const rows = deals.filter((d) => d.stage === stage);
    return { stage, count: rows.length, value: sum(rows.map(dealValue)) };
  });
}

export interface DealFlags {
  overdue: boolean;
  stale: boolean;
  daysSinceTouch: number;
}

/**
 * Money fully collected. These still show an overdue next action — a retainer
 * pitch you committed to a date on is worth chasing — but they don't get the
 * 5-day stale flag, because nagging about a paid client is the kind of noise
 * that trains you to ignore the warning colour.
 */
const PAID_STAGES: Stage[] = ['Recurring', 'Balance Paid'];

export function dealFlags(deal: Deal, today: string): DealFlags {
  const isDead = deal.stage === 'Dead';
  const overdue = Boolean(
    !isDead && deal.next_action_date && daysBetween(deal.next_action_date, today) > 0,
  );

  const chaseable = !isDead && !PAID_STAGES.includes(deal.stage);
  const daysSinceTouch = deal.last_touch ? daysBetween(deal.last_touch, today) : Infinity;
  const stale = Boolean(chaseable && deal.last_touch && daysSinceTouch >= STALE_TOUCH_DAYS);

  return { overdue, stale, daysSinceTouch };
}

export interface UnitEconomics {
  deliveredCount: number;
  hoursLogged: number;
  totalHours: number;
  avgHours: number;
  effectiveHourly: number;
  belowFloor: boolean;
  floor: number;
  cycleValue: number;
}

/**
 * Effective hourly on the full $500 cycle. Only deals that actually shipped
 * *and* have hours recorded count — averaging in a zero would flatter the
 * number, which defeats the purpose of the screen.
 */
export function unitEconomics(deals: Deal[]): UnitEconomics {
  const delivered = deals.filter((d) => DELIVERED_STAGES.includes(d.stage));
  const withHours = delivered.filter((d) => d.delivery_hours > 0);
  const totalHours = sum(withHours.map((d) => d.delivery_hours));
  const avgHours = withHours.length ? totalHours / withHours.length : 0;
  const effectiveHourly = avgHours > 0 ? FULL_CYCLE_VALUE / avgHours : 0;

  return {
    deliveredCount: delivered.length,
    hoursLogged: withHours.length,
    totalHours,
    avgHours,
    effectiveHourly,
    belowFloor: avgHours > 0 && effectiveHourly < HOURLY_FLOOR,
    floor: HOURLY_FLOOR,
    cycleValue: FULL_CYCLE_VALUE,
  };
}
