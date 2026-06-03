#!/usr/bin/env node
/**
 * Pre-renders a daily data snapshot for the dashboard by pulling from the free
 * MLB Stats API (https://statsapi.mlb.com). Runs in CI (GitHub Actions) where
 * the API is reachable, and writes sports/live/data/today.json — the deployed
 * page loads that for an instant first paint, then refreshes live in-browser.
 *
 * Usage:  node sports/scripts/build-snapshot.mjs [YYYY-MM-DD]
 * Default date is "today" in US Eastern time.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const API = process.env.STATSAPI_BASE || "https://statsapi.mlb.com";
const POOL = 6;
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "live", "data");

const TEAMS = [
  [110, "Baltimore Orioles", "BAL", "#DF4601"], [111, "Boston Red Sox", "BOS", "#BD3039"],
  [147, "New York Yankees", "NYY", "#003087"], [139, "Tampa Bay Rays", "TB", "#092C5C"],
  [141, "Toronto Blue Jays", "TOR", "#134A8E"], [145, "Chicago White Sox", "CWS", "#27251F"],
  [114, "Cleveland Guardians", "CLE", "#00385D"], [116, "Detroit Tigers", "DET", "#0C2340"],
  [118, "Kansas City Royals", "KC", "#004687"], [142, "Minnesota Twins", "MIN", "#002B5C"],
  [117, "Houston Astros", "HOU", "#002D62"], [108, "Los Angeles Angels", "LAA", "#BA0021"],
  [133, "Athletics", "ATH", "#003831"], [136, "Seattle Mariners", "SEA", "#0C2C56"],
  [140, "Texas Rangers", "TEX", "#003278"], [144, "Atlanta Braves", "ATL", "#CE1141"],
  [146, "Miami Marlins", "MIA", "#00A3E0"], [121, "New York Mets", "NYM", "#002D72"],
  [143, "Philadelphia Phillies", "PHI", "#E81828"], [120, "Washington Nationals", "WSH", "#AB0003"],
  [112, "Chicago Cubs", "CHC", "#0E3386"], [113, "Cincinnati Reds", "CIN", "#C6011F"],
  [158, "Milwaukee Brewers", "MIL", "#12284B"], [134, "Pittsburgh Pirates", "PIT", "#27251F"],
  [138, "St. Louis Cardinals", "STL", "#C41E3A"], [109, "Arizona Diamondbacks", "ARI", "#A71930"],
  [115, "Colorado Rockies", "COL", "#333366"], [119, "Los Angeles Dodgers", "LAD", "#005A9C"],
  [135, "San Diego Padres", "SD", "#2F241D"], [137, "San Francisco Giants", "SF", "#FD5A1E"],
];
const TEAM_BY_ID = new Map(TEAMS.map((t) => [t[0], { id: t[0], name: t[1], abbr: t[2], color: t[3] }]));
const teamMeta = (id) => TEAM_BY_ID.get(id) || { id, name: "Team " + id, abbr: String(id), color: "#64748b" };
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function etToday() {
  // en-CA yields YYYY-MM-DD; pin to US Eastern so late-UTC maps to the right day.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}
function seasonOf(date) { return Number(date.slice(0, 4)) || new Date().getFullYear(); }
function toNum(v) { if (v == null || v === "-" || v === ".---") return 0; const n = Number(v); return Number.isFinite(n) ? n : 0; }
function weekdayOf(d) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); if (!m) return WEEKDAYS[new Date().getUTCDay()]; return WEEKDAYS[new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)).getUTCDay()]; }
function inferDayNight(iso) { const d = new Date(iso); if (isNaN(d)) return "night"; const h = (d.getUTCHours() - 4 + 24) % 24; return h < 17 ? "day" : "night"; }

async function getJSON(path, params = {}) {
  const usp = new URLSearchParams(params);
  const res = await fetch(API + path + "?" + usp.toString(), {
    headers: { "User-Agent": "mlb-dashboard-snapshot/1.0 (+github actions)" },
  });
  if (!res.ok) throw new Error(`MLB Stats API ${res.status} for ${path}`);
  return res.json();
}
async function mapPool(items, concurrency, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

function parseTeamSplits(teamId, res) {
  const out = { L: null, R: null };
  const splits = res.stats?.[0]?.splits || [];
  for (const s of splits) {
    const code = s.split?.code; const hand = code === "vl" ? "L" : code === "vr" ? "R" : null;
    if (!hand) continue;
    const st = s.stat, g = st.gamesPlayed || 0;
    out[hand] = { teamId, avg: toNum(st.avg), ops: toNum(st.ops), runs: st.runs || 0, games: g, rpg: g > 0 ? (st.runs || 0) / g : 0 };
  }
  return out;
}
function buildRankings(teamSplits) {
  const rank = (hand) => {
    const lines = [...teamSplits.values()].map((s) => s[hand]).filter(Boolean).sort((a, b) => b.ops - a.ops);
    const map = new Map(); lines.forEach((l, i) => map.set(l.teamId, { ...l, rank: i + 1 })); return map;
  };
  return { L: rank("L"), R: rank("R") };
}
function parseStandings(res) {
  const out = new Map();
  for (const lg of res.records || []) for (const tr of lg.teamRecords || []) {
    const splits = tr.records?.splitRecords || [];
    const pick = (type) => { const s = splits.find((r) => r.type === type); return s ? { w: s.wins, l: s.losses } : { w: 0, l: 0 }; };
    out.set(tr.team.id, { overall: { w: tr.wins, l: tr.losses }, home: pick("home"), away: pick("away"), day: pick("day"), night: pick("night") });
  }
  return out;
}
function weekdayRecords(teamId, res) {
  const week = {}; WEEKDAYS.forEach((d) => (week[d] = { w: 0, l: 0 }));
  for (const date of res.dates || []) for (const g of date.games || []) {
    if (g.status.abstractGameState !== "Final") continue;
    const home = g.teams.home, away = g.teams.away;
    const isHome = home.team.id === teamId, isAway = away.team.id === teamId;
    if (!isHome && !isAway) continue;
    const hr = home.score ?? g.linescore?.teams?.home?.runs;
    const ar = away.score ?? g.linescore?.teams?.away?.runs;
    if (hr == null || ar == null || hr === ar) continue;
    const won = isHome ? hr > ar : ar > hr; const wd = weekdayOf(g.officialDate);
    won ? week[wd].w++ : week[wd].l++;
  }
  return week;
}

async function build(date) {
  const season = seasonOf(date);
  const [schedule, standingsRes, splitsArr, weekdayArr] = await Promise.all([
    getJSON("/api/v1/schedule", { sportId: 1, date, hydrate: "probablePitcher(note),linescore,team" }),
    getJSON("/api/v1/standings", { leagueId: "103,104", season, standingsTypes: "regularSeason" }),
    mapPool(TEAMS, POOL, async (t) => [t[0], parseTeamSplits(t[0], await getJSON(`/api/v1/teams/${t[0]}/stats`, { stats: "statSplits", sitCodes: "vl,vr", group: "hitting", season, gameType: "R", sportId: 1 }))]),
    mapPool(TEAMS, POOL, async (t) => [t[0], weekdayRecords(t[0], await getJSON("/api/v1/schedule", { sportId: 1, teamId: t[0], startDate: season + "-03-01", endDate: date, gameType: "R" }))]),
  ]);
  const rankings = buildRankings(new Map(splitsArr));
  const records = parseStandings(standingsRes);
  const weekday = new Map(weekdayArr);

  const games = schedule.dates?.[0]?.games || [];
  const ids = new Set();
  games.forEach((g) => [g.teams.away.probablePitcher, g.teams.home.probablePitcher].forEach((p) => p?.id && ids.add(p.id)));
  const people = new Map();
  if (ids.size) {
    try {
      const res = await getJSON("/api/v1/people", { personIds: [...ids].join(",") });
      res.people.forEach((p) => people.set(p.id, { id: p.id, name: p.fullName, hand: p.pitchHand?.code || "R" }));
    } catch { /* fall back to schedule handedness */ }
  }

  const pitcher = (p) => {
    if (!p?.id) return null;
    if (people.has(p.id)) return people.get(p.id);
    if (p.pitchHand?.code) return { id: p.id, name: p.fullName, hand: p.pitchHand.code };
    return { id: p.id, name: p.fullName || "TBD", hand: "R" };
  };
  const rankFor = (teamId, hand) => (hand === "L" ? rankings.L : rankings.R).get(teamId) || null;
  const side = (teamId, isHome, facing) => ({
    team: teamMeta(teamId), isHome,
    records: records.get(teamId) || null, weekday: weekday.get(teamId) || null,
    opposingPitcher: facing, offenseRank: facing ? rankFor(teamId, facing.hand) : null,
  });

  const matchups = games.map((g) => {
    const awayP = pitcher(g.teams.away.probablePitcher);
    const homeP = pitcher(g.teams.home.probablePitcher);
    return {
      gamePk: g.gamePk, officialDate: g.officialDate, weekday: weekdayOf(g.officialDate),
      dayNight: g.dayNight || inferDayNight(g.gameDate), status: g.status.detailedState,
      venue: g.venue?.name || null,
      awayId: g.teams.away.team.id, homeId: g.teams.home.team.id,
      awayStarter: awayP, homeStarter: homeP,
      away: side(g.teams.away.team.id, false, homeP),
      home: side(g.teams.home.team.id, true, awayP),
    };
  });

  return { date, generatedAt: new Date().toISOString(), gameCount: matchups.length, matchups };
}

const date = process.argv[2] || etToday();
console.log(`Building MLB snapshot for ${date} from ${API} …`);
const snapshot = await build(date);
await mkdir(OUT_DIR, { recursive: true });
await writeFile(join(OUT_DIR, "today.json"), JSON.stringify(snapshot));
await writeFile(join(OUT_DIR, `${date}.json`), JSON.stringify(snapshot));
console.log(`Wrote ${snapshot.gameCount} games to live/data/today.json (and ${date}.json).`);
if (snapshot.gameCount === 0) console.log("Note: 0 games scheduled for this date.");
