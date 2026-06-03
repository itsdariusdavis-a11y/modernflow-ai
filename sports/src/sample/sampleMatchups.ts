/**
 * A small, representative dataset used when the live MLB Stats API can't be
 * reached (e.g. an offline/sandboxed environment). It lets the dashboard render
 * a realistic example. Numbers here are illustrative, not live.
 */
import type { Matchup, MatchupSide } from "../lib/analytics/matchups";
import { teamMeta } from "../lib/mlb/teams";
import type { Handedness } from "../lib/mlb/types";
import type { RankedSplit } from "../lib/analytics/offense";
import type { TeamRecords, WeekdayRecords } from "../lib/analytics/records";

const week = (wins: number, losses: number): WeekdayRecords => ({
  Sunday: { wins: 3, losses: 4 },
  Monday: { wins: 5, losses: 2 },
  Tuesday: { wins: 4, losses: 5 },
  Wednesday: { wins, losses },
  Thursday: { wins: 2, losses: 3 },
  Friday: { wins: 6, losses: 3 },
  Saturday: { wins: 4, losses: 4 },
});

const rec = (
  o: [number, number],
  h: [number, number],
  a: [number, number],
  d: [number, number],
  n: [number, number],
): TeamRecords => ({
  overall: { wins: o[0], losses: o[1] },
  home: { wins: h[0], losses: h[1] },
  away: { wins: a[0], losses: a[1] },
  day: { wins: d[0], losses: d[1] },
  night: { wins: n[0], losses: n[1] },
});

const split = (rank: number, avg: number, ops: number, rpg: number): RankedSplit => ({
  teamId: 0,
  rank,
  avg,
  ops,
  rpg,
  runs: Math.round(rpg * 60),
  games: 60,
});

function side(
  teamId: number,
  isHome: boolean,
  records: TeamRecords,
  weekday: WeekdayRecords,
  pitcher: { name: string; hand: Handedness },
  offense: RankedSplit,
): MatchupSide {
  return {
    team: teamMeta(teamId),
    isHome,
    records,
    weekday,
    opposingPitcher: { id: 0, name: pitcher.name, hand: pitcher.hand },
    offenseRank: offense,
  };
}

export const SAMPLE_MATCHUPS: Matchup[] = [
  {
    gamePk: 1,
    gameDate: "2026-06-03T22:10:00Z",
    officialDate: "2026-06-03",
    weekday: "Wednesday",
    dayNight: "night",
    statusDetailed: "Scheduled",
    venue: "Petco Park",
    away: side(
      119, // Dodgers
      false,
      rec([40, 22], [22, 9], [18, 13], [12, 6], [28, 16]),
      week(4, 1),
      { name: "Dylan Cease", hand: "R" },
      split(1, 0.291, 0.842, 5.6),
    ),
    home: side(
      135, // Padres
      true,
      rec([35, 27], [20, 12], [15, 15], [10, 9], [25, 18]),
      week(3, 2),
      { name: "Yoshinobu Yamamoto", hand: "R" },
      split(11, 0.256, 0.738, 4.4),
    ),
  },
  {
    gamePk: 2,
    gameDate: "2026-06-03T17:05:00Z",
    officialDate: "2026-06-03",
    weekday: "Wednesday",
    dayNight: "day",
    statusDetailed: "Scheduled",
    venue: "Fenway Park",
    away: side(
      110, // Orioles
      false,
      rec([33, 29], [18, 13], [15, 16], [9, 8], [24, 21]),
      week(2, 3),
      { name: "Garrett Crochet", hand: "L" },
      split(7, 0.262, 0.761, 4.7),
    ),
    home: side(
      111, // Red Sox
      true,
      rec([34, 28], [21, 10], [13, 18], [11, 7], [23, 21]),
      week(5, 1),
      { name: "Zach Eflin", hand: "R" },
      split(4, 0.271, 0.79, 5.1),
    ),
  },
  {
    gamePk: 3,
    gameDate: "2026-06-03T23:20:00Z",
    officialDate: "2026-06-03",
    weekday: "Wednesday",
    dayNight: "night",
    statusDetailed: "Scheduled",
    venue: "Citi Field",
    away: side(
      144, // Braves
      false,
      rec([36, 26], [19, 12], [17, 14], [10, 7], [26, 19]),
      week(4, 1),
      { name: "Kodai Senga", hand: "R" },
      split(3, 0.274, 0.802, 5.2),
    ),
    home: side(
      121, // Mets
      true,
      rec([37, 25], [22, 9], [15, 16], [13, 6], [24, 19]),
      week(3, 3),
      { name: "Spencer Strider", hand: "R" },
      split(9, 0.258, 0.745, 4.5),
    ),
  },
];
