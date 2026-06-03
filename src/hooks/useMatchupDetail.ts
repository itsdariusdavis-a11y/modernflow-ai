import { useQuery } from "@tanstack/react-query";
import {
  getGameLineups,
  getPitcherVsBatter,
  getPitcherVsTeam,
} from "../lib/mlb/client";
import { parsePitcherLine, type PitcherLine } from "../lib/analytics/matchups";
import { mapPool } from "../lib/util";
import type { ProbablePitcher } from "../lib/analytics/matchups";

export interface BatterVsPitcher {
  batterId: number;
  batterName: string;
  line: PitcherLine;
}

export interface PitcherDetail {
  pitcher: ProbablePitcher;
  opponentTeamId: number;
  vsTeam: PitcherLine;
  vsBatters: BatterVsPitcher[];
  lineupPosted: boolean;
}

export interface MatchupDetail {
  away: PitcherDetail | null; // away starter vs home lineup
  home: PitcherDetail | null; // home starter vs away lineup
}

interface Args {
  gamePk: number;
  awayTeamId: number;
  homeTeamId: number;
  awayPitcher: ProbablePitcher | null;
  homePitcher: ProbablePitcher | null;
  enabled: boolean;
}

/**
 * On demand, pull each starter's career line vs the opposing club, plus the
 * batter-vs-pitcher (BvP) line for every hitter in the opposing lineup once
 * lineups are posted.
 */
export function useMatchupDetail(args: Args) {
  const { gamePk, awayTeamId, homeTeamId, awayPitcher, homePitcher, enabled } = args;
  return useQuery({
    queryKey: ["matchupDetail", gamePk, awayPitcher?.id, homePitcher?.id],
    enabled,
    staleTime: 30 * 60 * 1000,
    queryFn: async (): Promise<MatchupDetail> => {
      const lineups = await getGameLineups(gamePk).catch(() => null);

      const build = async (
        pitcher: ProbablePitcher | null,
        opponentTeamId: number,
        opponentBatters: { id: number; fullName: string }[],
      ): Promise<PitcherDetail | null> => {
        if (!pitcher) return null;
        const vsTeamRes = await getPitcherVsTeam(pitcher.id, opponentTeamId).catch(
          () => null,
        );
        const vsTeam = vsTeamRes
          ? parsePitcherLine(vsTeamRes, "vs Team")
          : parsePitcherLine({ stats: [] }, "vs Team");

        const vsBatters = await mapPool(opponentBatters, 4, async (b) => {
          const res = await getPitcherVsBatter(pitcher.id, b.id).catch(() => null);
          const line = res
            ? parsePitcherLine(res, b.fullName)
            : parsePitcherLine({ stats: [] }, b.fullName);
          return { batterId: b.id, batterName: b.fullName, line };
        });

        return {
          pitcher,
          opponentTeamId,
          vsTeam,
          vsBatters,
          lineupPosted: opponentBatters.length > 0,
        };
      };

      const homeBatters = lineups?.home.batters ?? [];
      const awayBatters = lineups?.away.batters ?? [];

      const [away, home] = await Promise.all([
        build(awayPitcher, homeTeamId, homeBatters), // away starter faces home lineup
        build(homePitcher, awayTeamId, awayBatters), // home starter faces away lineup
      ]);

      return { away, home };
    },
  });
}
