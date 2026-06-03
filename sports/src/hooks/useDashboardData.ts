import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getPeople,
  getSchedule,
  getStandings,
  getTeamHittingSplits,
  getTeamSchedule,
} from "../lib/mlb/client";
import { TEAMS } from "../lib/mlb/teams";
import { buildOffenseRankings, type Hand, type SplitLine } from "../lib/analytics/offense";
import { parseTeamSplits } from "../lib/analytics/offense";
import {
  parseStandings,
  weekdayRecordsFromSchedule,
  type TeamRecords,
  type WeekdayRecords,
} from "../lib/analytics/records";
import {
  buildMatchups,
  type Matchup,
  type ProbablePitcher,
} from "../lib/analytics/matchups";
import { mapPool, seasonOf } from "../lib/util";
import type { Handedness } from "../lib/mlb/types";

const DAY = 1000 * 60 * 60 * 24;

export interface DashboardData {
  matchups: Matchup[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  /** True when any of the underlying datasets is still settling. */
  fetching: boolean;
}

export function useDashboardData(date: string): DashboardData {
  const season = seasonOf(date);

  const scheduleQ = useQuery({
    queryKey: ["schedule", date],
    queryFn: () => getSchedule(date),
    staleTime: 5 * 60 * 1000,
  });

  const standingsQ = useQuery({
    queryKey: ["standings", season],
    queryFn: () => getStandings(season),
    staleTime: 60 * 60 * 1000,
  });

  const splitsQ = useQuery({
    queryKey: ["hittingSplits", season],
    staleTime: 60 * 60 * 1000,
    queryFn: async () => {
      const entries = await mapPool(TEAMS, 6, async (t) => {
        const res = await getTeamHittingSplits(t.id, season);
        return [t.id, parseTeamSplits(t.id, res)] as const;
      });
      return new Map<number, Record<Hand, SplitLine | null>>(entries);
    },
  });

  const weekdayQ = useQuery({
    queryKey: ["weekday", season, date],
    staleTime: 6 * 60 * 60 * 1000,
    queryFn: async () => {
      const start = `${season}-03-01`;
      const entries = await mapPool(TEAMS, 6, async (t) => {
        const res = await getTeamSchedule(t.id, start, date);
        return [t.id, weekdayRecordsFromSchedule(t.id, res)] as const;
      });
      return new Map<number, WeekdayRecords>(entries);
    },
  });

  // Probable-pitcher handedness depends on the schedule being loaded first.
  const pitcherIds = useMemo(() => {
    const ids = new Set<number>();
    for (const d of scheduleQ.data?.dates ?? []) {
      for (const g of d.games) {
        const a = g.teams.away.probablePitcher?.id;
        const h = g.teams.home.probablePitcher?.id;
        if (a) ids.add(a);
        if (h) ids.add(h);
      }
    }
    return [...ids].sort((x, y) => x - y);
  }, [scheduleQ.data]);

  const peopleQ = useQuery({
    queryKey: ["people", pitcherIds],
    enabled: pitcherIds.length > 0,
    staleTime: 12 * 60 * 60 * 1000,
    queryFn: async () => {
      const res = await getPeople(pitcherIds);
      const map = new Map<number, ProbablePitcher>();
      for (const p of res.people) {
        map.set(p.id, {
          id: p.id,
          name: p.fullName,
          hand: (p.pitchHand?.code ?? "R") as Handedness,
        });
      }
      return map;
    },
  });

  const matchups = useMemo<Matchup[]>(() => {
    const games = scheduleQ.data?.dates?.[0]?.games ?? [];
    if (games.length === 0) return [];
    const splits = splitsQ.data ?? new Map<number, Record<Hand, SplitLine | null>>();
    const rankings = buildOffenseRankings(splits);
    const records = standingsQ.data
      ? parseStandings(standingsQ.data)
      : new Map<number, TeamRecords>();
    const weekday = weekdayQ.data ?? new Map<number, WeekdayRecords>();

    // Fall back to schedule-supplied handedness if the people call is pending.
    const pitcherHand = peopleQ.data ?? new Map<number, ProbablePitcher>();
    if (!peopleQ.data) {
      for (const g of games) {
        for (const t of [g.teams.away, g.teams.home]) {
          const pp = t.probablePitcher;
          if (pp?.id && pp.pitchHand?.code) {
            pitcherHand.set(pp.id, {
              id: pp.id,
              name: pp.fullName,
              hand: pp.pitchHand.code,
            });
          }
        }
      }
    }

    return buildMatchups({ games, pitcherHand, rankings, records, weekday });
  }, [scheduleQ.data, splitsQ.data, standingsQ.data, weekdayQ.data, peopleQ.data]);

  const queries = [scheduleQ, standingsQ, splitsQ, weekdayQ];
  return {
    matchups,
    isLoading: scheduleQ.isLoading,
    isError: queries.some((q) => q.isError),
    error: queries.find((q) => q.isError)?.error,
    fetching: queries.some((q) => q.isFetching) || peopleQ.isFetching,
  };
}

export { DAY };
