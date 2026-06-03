/** Assembles the per-game "matchup" model the dashboard renders. */
import { teamMeta, type TeamMeta } from "../mlb/teams";
import type {
  Handedness,
  PitchingSplitStat,
  ScheduleGame,
  StatsResponse,
} from "../mlb/types";
import {
  rankFor,
  type OffenseRankings,
  type RankedSplit,
} from "./offense";
import {
  WEEKDAYS,
  type TeamRecords,
  type Weekday,
  type WeekdayRecords,
} from "./records";

export interface ProbablePitcher {
  id: number;
  name: string;
  hand: Handedness;
}

export interface MatchupSide {
  team: TeamMeta;
  isHome: boolean;
  records: TeamRecords | null;
  weekday: WeekdayRecords | null;
  /** The pitcher THIS lineup is facing (the opponent's probable starter). */
  opposingPitcher: ProbablePitcher | null;
  /** This club's offensive rank/line vs that pitcher's handedness. */
  offenseRank: RankedSplit | null;
}

export interface Matchup {
  gamePk: number;
  gameDate: string;
  officialDate: string;
  weekday: Weekday;
  dayNight: "day" | "night" | null;
  statusDetailed: string;
  venue: string | null;
  away: MatchupSide;
  home: MatchupSide;
}

export interface MatchupInputs {
  games: ScheduleGame[];
  pitcherHand: Map<number, ProbablePitcher>;
  rankings: OffenseRankings;
  records: Map<number, TeamRecords>;
  weekday: Map<number, WeekdayRecords>;
}

export function buildMatchups(input: MatchupInputs): Matchup[] {
  const { games, pitcherHand, rankings, records, weekday } = input;
  return games.map((g) => {
    const awayPitcher = probableOf(g.teams.away.probablePitcher?.id, pitcherHand);
    const homePitcher = probableOf(g.teams.home.probablePitcher?.id, pitcherHand);
    const awayId = g.teams.away.team.id;
    const homeId = g.teams.home.team.id;

    const side = (
      teamId: number,
      isHome: boolean,
      facing: ProbablePitcher | null,
    ): MatchupSide => ({
      team: teamMeta(teamId),
      isHome,
      records: records.get(teamId) ?? null,
      weekday: weekday.get(teamId) ?? null,
      opposingPitcher: facing,
      offenseRank: facing ? rankFor(rankings, teamId, facing.hand) : null,
    });

    return {
      gamePk: g.gamePk,
      gameDate: g.gameDate,
      officialDate: g.officialDate,
      weekday: weekdayOf(g.officialDate),
      dayNight: g.dayNight ?? inferDayNight(g.gameDate),
      statusDetailed: g.status.detailedState,
      venue: g.venue?.name ?? null,
      // away batters face the HOME pitcher; home batters face the AWAY pitcher
      away: side(awayId, false, homePitcher),
      home: side(homeId, true, awayPitcher),
    };
  });
}

function probableOf(
  id: number | undefined,
  map: Map<number, ProbablePitcher>,
): ProbablePitcher | null {
  if (id == null) return null;
  return map.get(id) ?? null;
}

function weekdayOf(officialDate: string): Weekday {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(officialDate);
  if (!m) return WEEKDAYS[new Date().getUTCDay()];
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12));
  return WEEKDAYS[d.getUTCDay()];
}

function inferDayNight(iso: string): "day" | "night" | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  // Rough US-eastern heuristic; the API usually supplies dayNight directly.
  const hourET = (d.getUTCHours() - 4 + 24) % 24;
  return hourET < 17 ? "day" : "night";
}

// ---- Pitcher-vs-team / vs-batter normalization ------------------------------

export interface PitcherLine {
  label: string;
  games: number;
  ip: string;
  era: string;
  whip: string;
  avgAgainst: string;
  opsAgainst: string;
  strikeOuts: number;
  baseOnBalls: number;
  homeRuns: number;
  hits: number;
  atBats: number;
  battersFaced: number;
}

const EMPTY_LINE: Omit<PitcherLine, "label"> = {
  games: 0,
  ip: "0.0",
  era: "—",
  whip: "—",
  avgAgainst: "—",
  opsAgainst: "—",
  strikeOuts: 0,
  baseOnBalls: 0,
  homeRuns: 0,
  hits: 0,
  atBats: 0,
  battersFaced: 0,
};

/** Collapse a vsTeam / vsPlayer stats payload into a single display line. */
export function parsePitcherLine(
  res: StatsResponse<PitchingSplitStat>,
  label: string,
): PitcherLine {
  const splits = res.stats?.[0]?.splits ?? [];
  if (splits.length === 0) return { label, ...EMPTY_LINE };
  // vsTeam/vsPlayer typically return one aggregate split; fold defensively.
  const acc = splits.reduce(
    (a, s) => {
      const st = s.stat;
      a.atBats += st.atBats ?? 0;
      a.hits += st.hits ?? 0;
      a.homeRuns += st.homeRuns ?? 0;
      a.strikeOuts += st.strikeOuts ?? 0;
      a.baseOnBalls += st.baseOnBalls ?? 0;
      a.battersFaced += st.battersFaced ?? 0;
      a.games += st.gamesPlayed ?? 0;
      a.lastIp = st.inningsPitched ?? a.lastIp;
      a.lastEra = st.era ?? a.lastEra;
      a.lastWhip = st.whip ?? a.lastWhip;
      a.lastAvg = st.avg ?? a.lastAvg;
      a.lastOps = st.ops ?? a.lastOps;
      return a;
    },
    {
      atBats: 0,
      hits: 0,
      homeRuns: 0,
      strikeOuts: 0,
      baseOnBalls: 0,
      battersFaced: 0,
      games: 0,
      lastIp: "0.0",
      lastEra: "—",
      lastWhip: "—",
      lastAvg: "—",
      lastOps: "—",
    },
  );
  const avgAgainst =
    splits.length === 1
      ? acc.lastAvg
      : acc.atBats > 0
        ? (acc.hits / acc.atBats).toFixed(3).replace(/^0/, "")
        : "—";
  return {
    label,
    games: acc.games,
    ip: acc.lastIp,
    era: acc.lastEra,
    whip: acc.lastWhip,
    avgAgainst,
    opsAgainst: acc.lastOps,
    strikeOuts: acc.strikeOuts,
    baseOnBalls: acc.baseOnBalls,
    homeRuns: acc.homeRuns,
    hits: acc.hits,
    atBats: acc.atBats,
    battersFaced: acc.battersFaced,
  };
}
