# ⚾ MLB Matchup Dashboard

An automated daily dashboard for every MLB game on a given date. For each game it
shows, for **both** teams:

- **Offense ranked 1–30 vs the handedness of the pitcher they're facing today**,
  with **AVG · OPS · RPG** (runs per game) in that split.
  _e.g. "Dodgers are #1 vs RHP — .291 / .842 / 5.6 RPG, facing a right-hander
  today."_
- **Starting pitcher history vs the opposing club**, and — once lineups are
  posted — **batter-vs-pitcher (BvP)** for each hitter in the lineup.
- **Home / Away record** (the away club's road record vs the home club's home
  record), shown for the side it applies to.
- **Day / Night record**, matched to whether today's game is a day or night game.
- **Day-of-week record** (e.g. "4–1 on Wednesdays"), computed for the weekday of
  today's game.

It refreshes for the current date automatically, so it's a fresh slate every day.
A date picker lets you look back/ahead.

## Two ways to run it

- **`live/index.html`** — a single self-contained file (no build, no deps) that
  you host anywhere and visit live; it auto-updates to the current day on every
  load. This is the "put it online" version. See [`live/README.md`](live/README.md).
- **The React/Vite app** (this folder) — the same dashboard as a dev project, for
  local hacking and extension.

A GitHub Pages workflow (`.github/workflows/deploy-sports.yml`) publishes
`live/` automatically.

## Data source

Everything comes from the **free, no-key [MLB Stats API](https://statsapi.mlb.com)**
— the same data that powers most public stat sites. It returns clean, structured
JSON, which is far more reliable than scraping a rendered site like ESPN (those
break whenever the page layout changes and need a headless browser). Endpoints used:

| Need | Endpoint |
| --- | --- |
| Today's games + probable pitchers | `/api/v1/schedule?sportId=1&date=…&hydrate=probablePitcher,linescore,team` |
| Pitcher handedness | `/api/v1/people?personIds=…` |
| Offense vs LHP / RHP (AVG/OPS/RPG) | `/api/v1/teams/{id}/stats?stats=statSplits&group=hitting&sitCodes=vl,vr` |
| Home / Away / Day / Night records | `/api/v1/standings?leagueId=103,104&season=…` (split records) |
| Day-of-week records | computed from each club's game log via `/api/v1/schedule?teamId=…` |
| Pitcher vs team (career) | `/api/v1/people/{id}/stats?stats=vsTeam&group=pitching&opposingTeamId=…` |
| Batter vs pitcher (BvP) | `/api/v1/people/{id}/stats?stats=vsPlayer&group=pitching&opposingPlayerId=…` |
| Posted lineups | `/api/v1/game/{gamePk}/boxscore` |

> **Day-of-week** records have no canned endpoint, so they're derived from each
> club's completed-game log (bucketed by the game's official calendar weekday).

## Running it

```bash
cd sports
npm install      # or pnpm install
npm run dev      # http://localhost:5173
```

In dev, requests are proxied through Vite (`/statsapi` → `statsapi.mlb.com`) to
avoid CORS issues. For a production build:

```bash
npm run build && npm run preview
```

### Network note

The MLB Stats API host must be reachable from wherever the app runs. In a
restricted/sandboxed environment (where `statsapi.mlb.com` isn't allow-listed),
the dashboard automatically falls back to a small **sample dataset** and shows a
banner — run it locally or on normal hosting to see live games. You can point at
a custom proxy with `VITE_STATSAPI_BASE` (see `.env.example`).

## How the pieces fit

```
src/
  lib/mlb/        typed MLB Stats API client + endpoints + team metadata
  lib/analytics/  offense splits & 1–30 rankings, situational records, matchup assembly
  hooks/          React Query orchestration (useDashboardData, useMatchupDetail)
  components/     MatchupCard, RankBadge, BvP detail panel, date bar
  sample/         offline fallback dataset
```

- **Rankings**: every club's `vl`/`vr` hitting line is pulled, then clubs are
  sorted by OPS within each handedness bucket to assign 1 (best) … 30 (worst).
  For each game, the batting side is matched to the rank vs its opponent's
  starter's hand.
- **Performance**: heavy calls (batter-vs-pitcher across a whole lineup) are
  **lazy** — they only fire when you expand a game. Team-wide fan-out uses bounded
  concurrency. React Query caches per day.

## Tech

React 19 · TypeScript · Vite · TanStack Query. No backend required — it's a static
SPA that talks to the public API directly.

## Caveats

- Splits/rankings use season-to-date numbers; early in the season small samples
  swing rankings.
- BvP samples are often tiny (a few career PAs) — useful color, not gospel.
- Probable pitchers and lineups populate as clubs announce them; the UI degrades
  gracefully (team-level history until a lineup is posted).
