import type { Matchup } from "../lib/analytics/matchups";
import { teamMeta } from "../lib/mlb/teams";
import { useMatchupDetail, type PitcherDetail } from "../hooks/useMatchupDetail";

export function MatchupDetailPanel({ m }: { m: Matchup }) {
  // away team's starter is the pitcher the HOME lineup faces, and vice-versa
  const awayStarter = m.home.opposingPitcher;
  const homeStarter = m.away.opposingPitcher;

  const { data, isLoading, isError } = useMatchupDetail({
    gamePk: m.gamePk,
    awayTeamId: m.away.team.id,
    homeTeamId: m.home.team.id,
    awayPitcher: awayStarter,
    homePitcher: homeStarter,
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="detail">
        <div className="loading">Loading pitcher history & batter-vs-pitcher…</div>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="detail">
        <div className="empty">Couldn’t load pitching detail for this game.</div>
      </div>
    );
  }

  return (
    <div className="detail">
      <div className="detail-grid">
        <PitcherBlock
          detail={data.away}
          starterTeam={m.away.team.name}
          opponentTeam={m.home.team.name}
        />
        <PitcherBlock
          detail={data.home}
          starterTeam={m.home.team.name}
          opponentTeam={m.away.team.name}
        />
      </div>
    </div>
  );
}

function PitcherBlock({
  detail,
  starterTeam,
  opponentTeam,
}: {
  detail: PitcherDetail | null;
  starterTeam: string;
  opponentTeam: string;
}) {
  if (!detail) {
    return (
      <div>
        <div className="section-label">{starterTeam} starter</div>
        <div className="empty">Probable starter not yet announced.</div>
      </div>
    );
  }
  const opp = teamMeta(detail.opponentTeamId);
  return (
    <div>
      <div className="section-label">
        {starterTeam} — {detail.pitcher.name} ({detail.pitcher.hand}HP) vs {opponentTeam}
      </div>
      <table className="bvp">
        <thead>
          <tr>
            <th>Opponent / Batter</th>
            <th>PA/BF</th>
            <th>AVG</th>
            <th>OPS</th>
            <th>HR</th>
            <th>K</th>
            <th>BB</th>
          </tr>
        </thead>
        <tbody>
          <tr className="team-row">
            <td>vs {opp.abbr} (career)</td>
            <td>{detail.vsTeam.battersFaced || "—"}</td>
            <td>{detail.vsTeam.avgAgainst}</td>
            <td>{detail.vsTeam.opsAgainst}</td>
            <td>{detail.vsTeam.homeRuns}</td>
            <td>{detail.vsTeam.strikeOuts}</td>
            <td>{detail.vsTeam.baseOnBalls}</td>
          </tr>
          {detail.lineupPosted ? (
            detail.vsBatters.map((b) => (
              <tr key={b.batterId}>
                <td>{b.batterName}</td>
                <td>{b.line.atBats || b.line.battersFaced || "—"}</td>
                <td>{b.line.avgAgainst}</td>
                <td>{b.line.opsAgainst}</td>
                <td>{b.line.homeRuns}</td>
                <td>{b.line.strikeOuts}</td>
                <td>{b.line.baseOnBalls}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="empty">
                Lineup not posted yet — showing team-level history. Re-open closer to
                first pitch for batter-vs-pitcher splits.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
