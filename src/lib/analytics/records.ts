/**
 * Win/loss records broken out by situation:
 *  - home / away and day / night come straight from the standings split records
 *  - day-of-week (e.g. "4-1 on Wednesdays") is computed from each club's
 *    completed-game log, since the API has no canned endpoint for it.
 */
import type { ScheduleResponse, StandingsResponse } from "../mlb/types";

export interface WLRecord {
  wins: number;
  losses: number;
}

export interface TeamRecords {
  overall: WLRecord;
  home: WLRecord;
  away: WLRecord;
  day: WLRecord;
  night: WLRecord;
}

const ZERO: WLRecord = { wins: 0, losses: 0 };

/** Map teamId -> {overall, home, away, day, night} from a standings payload. */
export function parseStandings(res: StandingsResponse): Map<number, TeamRecords> {
  const out = new Map<number, TeamRecords>();
  for (const league of res.records ?? []) {
    for (const tr of league.teamRecords ?? []) {
      const splits = tr.records?.splitRecords ?? [];
      const pick = (type: string): WLRecord => {
        const s = splits.find((r) => r.type === type);
        return s ? { wins: s.wins, losses: s.losses } : { ...ZERO };
      };
      out.set(tr.team.id, {
        overall: { wins: tr.wins, losses: tr.losses },
        home: pick("home"),
        away: pick("away"),
        day: pick("day"),
        night: pick("night"),
      });
    }
  }
  return out;
}

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export type WeekdayRecords = Record<Weekday, WLRecord>;

function emptyWeek(): WeekdayRecords {
  return WEEKDAYS.reduce((acc, d) => {
    acc[d] = { wins: 0, losses: 0 };
    return acc;
  }, {} as WeekdayRecords);
}

/**
 * Compute a club's record per weekday from its completed-game schedule.
 * Uses `officialDate` (YYYY-MM-DD) so the weekday matches the scorebook date,
 * and reads the win/loss from each side's linescore runs.
 */
export function weekdayRecordsFromSchedule(
  teamId: number,
  res: ScheduleResponse,
): WeekdayRecords {
  const week = emptyWeek();
  for (const date of res.dates ?? []) {
    for (const g of date.games ?? []) {
      if (g.status.abstractGameState !== "Final") continue;
      const home = g.teams.home;
      const away = g.teams.away;
      const isHome = home.team.id === teamId;
      const isAway = away.team.id === teamId;
      if (!isHome && !isAway) continue;

      const homeRuns = home.score ?? g.linescore?.teams?.home?.runs;
      const awayRuns = away.score ?? g.linescore?.teams?.away?.runs;
      if (homeRuns == null || awayRuns == null || homeRuns === awayRuns) continue;

      const teamWon = isHome ? homeRuns > awayRuns : awayRuns > homeRuns;
      const wd = weekdayOf(g.officialDate);
      if (!wd) continue;
      if (teamWon) week[wd].wins += 1;
      else week[wd].losses += 1;
    }
  }
  return week;
}

/** Parse YYYY-MM-DD to a weekday name without timezone drift. */
function weekdayOf(officialDate: string): Weekday | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(officialDate);
  if (!m) return null;
  // Construct at UTC noon to avoid any DST/offset edge cases.
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
  return WEEKDAYS[d.getUTCDay()];
}

export function fmtRecord(r: WLRecord | undefined): string {
  if (!r) return "—";
  return `${r.wins}-${r.losses}`;
}

export function winPct(r: WLRecord | undefined): number {
  if (!r) return 0;
  const g = r.wins + r.losses;
  return g > 0 ? r.wins / g : 0;
}
