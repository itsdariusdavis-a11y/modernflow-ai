/**
 * Every date in this app is a calendar date in America/Los_Angeles, formatted
 * YYYY-MM-DD. "Today" rolls over at local midnight, never at UTC midnight.
 * Nothing here should ever use the host machine's timezone.
 */

export const TZ = 'America/Los_Angeles';

const ymdFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const hourFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hour: 'numeric',
  hour12: false,
});

/** Calendar date in LA for a given instant (defaults to now). */
export function todayLA(now: Date = new Date()): string {
  return ymdFormatter.format(now);
}

/** Hour of day (0-23) in LA for a given instant. */
export function hourLA(now: Date = new Date()): number {
  return Number(hourFormatter.format(now));
}

/** Parse YYYY-MM-DD into a UTC-noon Date, which is safe for day arithmetic. */
export function parseYMD(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

export function addDays(ymd: string, days: number): string {
  const dt = parseYMD(ymd);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseYMD(to).getTime() - parseYMD(from).getTime()) / 86_400_000);
}

/** Inclusive list of dates from `start` to `end`. */
export function dateRange(start: string, end: string): string[] {
  const out: string[] = [];
  for (let d = start; daysBetween(d, end) >= 0; d = addDays(d, 1)) out.push(d);
  return out;
}

/** e.g. "Mon Aug 11" */
export function shortDate(ymd: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(parseYMD(ymd));
}

/** e.g. "Aug 11" */
export function tinyDate(ymd: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(parseYMD(ymd));
}

/** Local clock time for an ISO timestamp, e.g. "8:42 AM". */
export function timeLA(iso: string): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: '2-digit',
  }).format(dt);
}

/** Monday-anchored week start for a date. */
export function weekStart(ymd: string): string {
  const dt = parseYMD(ymd);
  const dow = dt.getUTCDay(); // 0 = Sunday
  const backToMonday = (dow + 6) % 7;
  return addDays(ymd, -backToMonday);
}

/**
 * Sprint week number (1-based) for a date, counted from the sprint start in
 * 7-day blocks. Dates before the sprint return 1; after, the last block.
 */
export function sprintWeek(ymd: string, start: string, totalDays: number): number {
  const offset = daysBetween(start, ymd);
  const maxWeek = Math.ceil(totalDays / 7);
  return Math.min(Math.max(Math.floor(offset / 7) + 1, 1), maxWeek);
}

/** Inclusive [start, end] dates covered by a sprint week number. */
export function sprintWeekRange(
  week: number,
  start: string,
  end: string,
): { start_date: string; end_date: string } {
  const s = addDays(start, (week - 1) * 7);
  const e = addDays(start, week * 7 - 1);
  return { start_date: s, end_date: daysBetween(e, end) < 0 ? end : e };
}
