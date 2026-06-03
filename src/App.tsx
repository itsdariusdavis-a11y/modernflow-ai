import { useMemo, useState } from "react";
import { DateBar } from "./components/DateBar";
import { MatchupCard } from "./components/MatchupCard";
import { useDashboardData } from "./hooks/useDashboardData";
import { SAMPLE_MATCHUPS } from "./sample/sampleMatchups";
import { isoDate } from "./lib/util";

export default function App() {
  const [date, setDate] = useState(isoDate());
  const { matchups, isLoading, isError, fetching } = useDashboardData(date);

  // If live data fails (e.g. offline/blocked host), fall back to sample data so
  // the dashboard still demonstrates the layout.
  const usingSample = isError && matchups.length === 0;
  const shown = useMemo(
    () => (usingSample ? SAMPLE_MATCHUPS : matchups),
    [usingSample, matchups],
  );

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <div className="app-title">⚾ MLB Matchup Dashboard</div>
        </div>
        <DateBar date={date} onChange={setDate} />
      </header>
      <div className="app-sub">
        Offense ranked 1–30 vs the handedness of today’s opposing starter (AVG · OPS ·
        RPG), plus home/away, day/night and day-of-week records and batter-vs-pitcher
        history. Data: MLB Stats API.
      </div>

      {usingSample && (
        <div className="banner warn">
          ⚠ Showing <b>sample data</b> — the live MLB Stats API couldn’t be reached from
          here. Run locally (<code>npm run dev</code>) where{" "}
          <code>statsapi.mlb.com</code> is reachable to see real games.
        </div>
      )}
      {isError && !usingSample && (
        <div className="banner err">Some datasets failed to load; showing partial data.</div>
      )}
      {fetching && !usingSample && (
        <div className="banner">Refreshing live data for {date}…</div>
      )}

      {isLoading && !usingSample ? (
        <div className="loading">Loading today’s slate…</div>
      ) : shown.length === 0 ? (
        <div className="empty">No games scheduled for {date}.</div>
      ) : (
        <div className="matchups">
          {shown.map((m) => (
            <MatchupCard key={m.gamePk} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}
