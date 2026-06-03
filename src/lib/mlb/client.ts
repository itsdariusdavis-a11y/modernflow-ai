/**
 * Thin client for the MLB Stats API (https://statsapi.mlb.com).
 *
 * - In dev, requests go through the Vite proxy at `/statsapi` (see
 *   vite.config.ts) to avoid CORS friction.
 * - In prod, requests hit the API host directly. You can override the base via
 *   the `VITE_STATSAPI_BASE` env var (e.g. to point at your own proxy).
 */
import type {
  HittingSplitStat,
  PeopleResponse,
  PitchingSplitStat,
  ScheduleResponse,
  StandingsResponse,
  StatsResponse,
} from "./types";

const ENV_BASE = (import.meta.env.VITE_STATSAPI_BASE as string | undefined)?.replace(
  /\/$/,
  "",
);

const BASE =
  ENV_BASE ?? (import.meta.env.DEV ? "/statsapi" : "https://statsapi.mlb.com");

async function get<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) usp.set(k, String(v));
  const url = `${BASE}${path}?${usp.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MLB Stats API ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

/** Schedule for a single calendar date, hydrated with probable pitchers. */
export function getSchedule(date: string): Promise<ScheduleResponse> {
  return get<ScheduleResponse>("/api/v1/schedule", {
    sportId: 1,
    date,
    hydrate: "probablePitcher(note),linescore,team",
  });
}

/** A team's completed games across a date range (used for day-of-week splits). */
export function getTeamSchedule(
  teamId: number,
  startDate: string,
  endDate: string,
): Promise<ScheduleResponse> {
  return get<ScheduleResponse>("/api/v1/schedule", {
    sportId: 1,
    teamId,
    startDate,
    endDate,
    gameType: "R",
  });
}

/** Handedness / bio for a set of people (probable pitchers). */
export function getPeople(personIds: number[]): Promise<PeopleResponse> {
  return get<PeopleResponse>("/api/v1/people", {
    personIds: personIds.join(","),
  });
}

/** Team hitting split lines vs LHP (`vl`) and vs RHP (`vr`). */
export function getTeamHittingSplits(
  teamId: number,
  season: number,
): Promise<StatsResponse<HittingSplitStat>> {
  return get<StatsResponse<HittingSplitStat>>(`/api/v1/teams/${teamId}/stats`, {
    stats: "statSplits",
    sitCodes: "vl,vr",
    group: "hitting",
    season,
    gameType: "R",
    sportId: 1,
  });
}

/** Division standings including home/away/day/night split records. */
export function getStandings(season: number): Promise<StandingsResponse> {
  return get<StandingsResponse>("/api/v1/standings", {
    leagueId: "103,104",
    season,
    standingsTypes: "regularSeason",
    hydrate: "team",
  });
}

/** A pitcher's career line against an entire opposing club. */
export function getPitcherVsTeam(
  pitcherId: number,
  opposingTeamId: number,
): Promise<StatsResponse<PitchingSplitStat>> {
  return get<StatsResponse<PitchingSplitStat>>(`/api/v1/people/${pitcherId}/stats`, {
    stats: "vsTeam",
    group: "pitching",
    opposingTeamId,
    sportId: 1,
  });
}

/** A pitcher's career line against one specific batter (BvP). */
export function getPitcherVsBatter(
  pitcherId: number,
  batterId: number,
): Promise<StatsResponse<PitchingSplitStat>> {
  return get<StatsResponse<PitchingSplitStat>>(`/api/v1/people/${pitcherId}/stats`, {
    stats: "vsPlayer",
    group: "pitching",
    opposingPlayerId: batterId,
    sportId: 1,
  });
}

export interface BoxscoreLineup {
  teamId: number;
  batters: Array<{ id: number; fullName: string; battingOrder: string }>;
}

interface BoxscoreResponse {
  teams: {
    away: BoxscoreTeam;
    home: BoxscoreTeam;
  };
}
interface BoxscoreTeam {
  team: { id: number };
  battingOrder?: number[];
  players: Record<
    string,
    { person: { id: number; fullName: string }; battingOrder?: string }
  >;
}

/** Posted batting orders for a game (empty until lineups are released). */
export async function getGameLineups(
  gamePk: number,
): Promise<{ away: BoxscoreLineup; home: BoxscoreLineup }> {
  const box = await get<BoxscoreResponse>(`/api/v1/game/${gamePk}/boxscore`, {});
  const build = (t: BoxscoreTeam): BoxscoreLineup => {
    const order = t.battingOrder ?? [];
    const batters = order
      .map((pid) => {
        const p = t.players[`ID${pid}`];
        return p
          ? { id: p.person.id, fullName: p.person.fullName, battingOrder: p.battingOrder ?? "" }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return { teamId: t.team.id, batters };
  };
  return { away: build(box.teams.away), home: build(box.teams.home) };
}
