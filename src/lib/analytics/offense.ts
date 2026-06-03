/**
 * Offensive splits vs pitcher handedness, plus 1-30 league rankings.
 *
 * For each club we read its hitting line vs LHP (`vl`) and vs RHP (`vr`) and
 * derive AVG, OPS and runs-per-game. Clubs are then ranked 1 (best) .. 30
 * (worst) by OPS within each handedness bucket — so "ranked #1 vs RHP" means
 * the best OPS against right-handed pitching in the league.
 */
import type { Handedness, HittingSplitStat, StatsResponse } from "../mlb/types";

export interface SplitLine {
  teamId: number;
  avg: number;
  ops: number;
  rpg: number;
  runs: number;
  games: number;
}

export interface RankedSplit extends SplitLine {
  rank: number; // 1 = best OPS in league for this handedness
}

export type Hand = "L" | "R";

/** Pull the `vl` / `vr` lines out of a team's statSplits response. */
export function parseTeamSplits(
  teamId: number,
  res: StatsResponse<HittingSplitStat>,
): Record<Hand, SplitLine | null> {
  const out: Record<Hand, SplitLine | null> = { L: null, R: null };
  const splits = res.stats?.[0]?.splits ?? [];
  for (const s of splits) {
    const code = s.split?.code;
    const hand: Hand | null = code === "vl" ? "L" : code === "vr" ? "R" : null;
    if (!hand) continue;
    const st = s.stat;
    const games = st.gamesPlayed ?? 0;
    out[hand] = {
      teamId,
      avg: toNum(st.avg),
      ops: toNum(st.ops),
      runs: st.runs ?? 0,
      games,
      rpg: games > 0 ? (st.runs ?? 0) / games : 0,
    };
  }
  return out;
}

export interface OffenseRankings {
  /** teamId -> ranked split vs LHP */
  vsL: Map<number, RankedSplit>;
  /** teamId -> ranked split vs RHP */
  vsR: Map<number, RankedSplit>;
}

/** Build league-wide 1-30 rankings from every team's split lines. */
export function buildOffenseRankings(
  teamSplits: Map<number, Record<Hand, SplitLine | null>>,
): OffenseRankings {
  const rank = (hand: Hand): Map<number, RankedSplit> => {
    const lines = [...teamSplits.values()]
      .map((s) => s[hand])
      .filter((l): l is SplitLine => l !== null)
      .sort((a, b) => b.ops - a.ops);
    const map = new Map<number, RankedSplit>();
    lines.forEach((line, i) => map.set(line.teamId, { ...line, rank: i + 1 }));
    return map;
  };
  return { vsL: rank("L"), vsR: rank("R") };
}

export function rankFor(
  rankings: OffenseRankings,
  teamId: number,
  pitcherHand: Handedness,
): RankedSplit | null {
  const map = pitcherHand === "L" ? rankings.vsL : rankings.vsR;
  return map.get(teamId) ?? null;
}

function toNum(v: string | undefined): number {
  if (v == null || v === "-" || v === ".---") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Format a rate stat the baseball way: .280, .800 (no leading zero). */
export function fmtRate(n: number, digits = 3): string {
  if (!Number.isFinite(n) || n === 0) return "—";
  return n.toFixed(digits).replace(/^0/, "");
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}
