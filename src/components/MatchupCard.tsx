import { useState } from "react";
import type { Matchup, MatchupSide } from "../lib/analytics/matchups";
import { fmtRate } from "../lib/analytics/offense";
import { fmtRecord, type Weekday } from "../lib/analytics/records";
import type { Handedness } from "../lib/mlb/types";
import { RankBadge } from "./RankBadge";
import { MatchupDetailPanel } from "./MatchupDetailPanel";

const HAND_LABEL: Record<Handedness, string> = { L: "LHP", R: "RHP", S: "SHP" };

export function MatchupCard({ m }: { m: Matchup }) {
  const [open, setOpen] = useState(false);
  const timeOfDay = m.dayNight ?? "night";
  return (
    <div className="card">
      <div className="card-head">
        <div className="teams">
          {m.away.team.abbr} <span className="muted">@</span> {m.home.team.abbr}
        </div>
        <div className="meta">
          {m.venue && <span className="pill">{m.venue}</span>}
          <span className="pill">{m.weekday}</span>
          <span className={`pill ${timeOfDay}`}>
            {timeOfDay === "day" ? "☀ Day game" : "☾ Night game"}
          </span>
          <span className="pill">{m.statusDetailed}</span>
        </div>
      </div>

      <div className="sides">
        <Side side={m.away} weekday={m.weekday} dayNight={timeOfDay} />
        <Side side={m.home} weekday={m.weekday} dayNight={timeOfDay} />
      </div>

      <button className="expand-btn" onClick={() => setOpen((v) => !v)}>
        {open ? "▾ Hide pitching matchups (BvP)" : "▸ Show pitching matchups & batter-vs-pitcher"}
      </button>
      {open && <MatchupDetailPanel m={m} />}
    </div>
  );
}

function Side({
  side,
  weekday,
  dayNight,
}: {
  side: MatchupSide;
  weekday: Weekday;
  dayNight: "day" | "night";
}) {
  const hand = side.opposingPitcher?.hand;
  const rank = side.offenseRank;
  const haRecord = side.isHome ? side.records?.home : side.records?.away;
  const dnRecord = dayNight === "day" ? side.records?.day : side.records?.night;
  const wdRecord = side.weekday?.[weekday];

  return (
    <div className="side">
      <div className="side-head">
        <span className="team-dot" style={{ background: side.team.color }} />
        <span className="team-name">{side.team.name}</span>
        <span className="ha-tag">{side.isHome ? "HOME" : "AWAY"}</span>
      </div>

      <div className="section-label">
        Offense {hand ? `vs ${HAND_LABEL[hand]}` : "vs starter"}
      </div>
      <div className="offense">
        <RankBadge rank={rank?.rank ?? null} />
        <div>
          <div className="statline">
            <div className="stat">
              <span className="v">{fmtRate(rank?.avg ?? 0)}</span>
              <span className="k">AVG</span>
            </div>
            <div className="stat">
              <span className="v">{fmtRate(rank?.ops ?? 0)}</span>
              <span className="k">OPS</span>
            </div>
            <div className="stat">
              <span className="v">{rank ? rank.rpg.toFixed(1) : "—"}</span>
              <span className="k">RPG</span>
            </div>
          </div>
          <div className="facing">
            {side.opposingPitcher ? (
              <>
                Facing <b>{side.opposingPitcher.name}</b> (
                {side.opposingPitcher.hand}-handed)
              </>
            ) : (
              <span className="muted">Probable starter not yet announced</span>
            )}
          </div>
        </div>
      </div>

      <div className="section-label">Situational records</div>
      <div className="chips">
        <Chip k="Overall" v={fmtRecord(side.records?.overall)} />
        <Chip
          k={side.isHome ? "Home" : "Away"}
          v={fmtRecord(haRecord)}
          highlight
        />
        <Chip k={dayNight === "day" ? "Day" : "Night"} v={fmtRecord(dnRecord)} highlight />
        <Chip k={`${weekday.slice(0, 3)}.`} v={fmtRecord(wdRecord)} highlight />
      </div>
    </div>
  );
}

function Chip({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className={`chip${highlight ? " hl" : ""}`}>
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}
