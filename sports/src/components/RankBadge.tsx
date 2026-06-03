import { ordinal } from "../lib/analytics/offense";

/** Color-graded 1-30 rank chip (green = elite, red = bottom of the league). */
export function RankBadge({ rank }: { rank: number | null }) {
  if (rank == null) {
    return (
      <div className="rank" style={{ background: "#334155", color: "#cbd5e1" }}>
        <span className="num">—</span>
        <span className="lbl">N/A</span>
      </div>
    );
  }
  return (
    <div className="rank" style={{ background: rankColor(rank) }} title={`${ordinal(rank)} of 30`}>
      <span className="num">{rank}</span>
      <span className="lbl">OF 30</span>
    </div>
  );
}

function rankColor(rank: number): string {
  // 1 -> green, ~15 -> amber, 30 -> red
  const t = (rank - 1) / 29; // 0..1
  const hue = 130 - t * 130; // 130 (green) .. 0 (red)
  return `hsl(${hue}, 70%, 55%)`;
}
