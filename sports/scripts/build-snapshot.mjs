#!/usr/bin/env node
/**
 * Pre-renders the complete daily data snapshot for the dashboard. Runs in CI
 * (GitHub Actions) where the network is open, and writes a committed
 * sports/live/today.json that githack serves for an instant, complete first
 * paint — no heavy browser fan-out, and no ESPN CORS dependency.
 *
 * Sources:
 *   MLB Stats API  — schedule, offense splits, records, bullpen, pitcher last-3
 *   ESPN           — injuries (all teams, one call) and betting odds (pickcenter)
 *
 * Usage: node sports/scripts/build-snapshot.mjs [YYYY-MM-DD]   (default: today ET)
 */
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MLB = process.env.STATSAPI_BASE || "https://statsapi.mlb.com";
const ESPN = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb";
const POOL = 6;
const __dirname = dirname(fileURLToPath(import.meta.url));
const LIVE_DIR = join(__dirname, "..", "live");

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

// ESPN team displayName -> our MLB id (full names match; Athletics city varies).
const norm = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");
const NAME2ID = new Map(TEAMS.map((t) => [norm(t[1]), t[0]]));
function espnNameToId(name) {
  const n = norm(name);
  if (NAME2ID.has(n)) return NAME2ID.get(n);
  if (n.includes("athletics")) return 133;
  return null;
}

function etToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}
const seasonOf = (d) => Number(d.slice(0, 4)) || new Date().getFullYear();
const toNum = (v) => (v == null || v === "-" || v === ".---" ? 0 : Number(v) || 0);
function weekdayOf(d) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  if (!m) return WEEKDAYS[new Date().getUTCDay()];
  return WEEKDAYS[new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)).getUTCDay()];
}
function inferDayNight(iso) {
  const d = new Date(iso); if (isNaN(d)) return "night";
  return (d.getUTCHours() - 4 + 24) % 24 < 17 ? "day" : "night";
}
// "26.2" innings -> outs (26*3 + 2); and back.
function ipToOuts(ip) {
  if (ip == null) return 0;
  const [w, f = "0"] = String(ip).split(".");
  return (Number(w) || 0) * 3 + (Number(f) || 0);
}
const outsToIp = (o) => `${Math.floor(o / 3)}.${o % 3}`;

async function j(url) {
  const r = await fetch(url, { headers: { "User-Agent": "mlb-dashboard-snapshot/2.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}
const mlb = (path, params = {}) => j(`${MLB}${path}?${new URLSearchParams(params)}`);
async function mapPool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

// ---- offense splits vs hand (existing) --------------------------------------
function parseTeamSplits(teamId, res) {
  const out = { L: null, R: null };
  for (const s of res.stats?.[0]?.splits || []) {
    const hand = s.split?.code === "vl" ? "L" : s.split?.code === "vr" ? "R" : null;
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

// ---- records incl. last-10 (#4) ---------------------------------------------
function parseStandings(res) {
  const out = new Map();
  for (const lg of res.records || []) for (const tr of lg.teamRecords || []) {
    const splits = tr.records?.splitRecords || [];
    const pick = (type) => { const s = splits.find((r) => r.type === type); return s ? { w: s.wins, l: s.losses } : { w: 0, l: 0 }; };
    out.set(tr.team.id, {
      overall: { w: tr.wins, l: tr.losses }, home: pick("home"), away: pick("away"),
      day: pick("day"), night: pick("night"), lastTen: pick("lastTen"),
    });
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
    const hr = home.score ?? g.linescore?.teams?.home?.runs, ar = away.score ?? g.linescore?.teams?.away?.runs;
    if (hr == null || ar == null || hr === ar) continue;
    (isHome ? hr > ar : ar > hr) ? week[weekdayOf(g.officialDate)].w++ : week[weekdayOf(g.officialDate)].l++;
  }
  return week;
}

// ---- bullpen strength / rank (#2) -------------------------------------------
async function buildBullpens(season) {
  const entries = await mapPool(TEAMS, 5, async (t) => {
    try {
      const r = await mlb(`/api/v1/teams/${t[0]}/roster`, { rosterType: "active" });
      const pids = (r.roster || []).filter((x) => x.position?.abbreviation === "P").map((x) => x.person.id);
      if (!pids.length) return [t[0], null];
      const h = await mlb("/api/v1/people", { personIds: pids.join(","), hydrate: `stats(group=[pitching],type=[season],season=${season})` });
      let outs = 0, er = 0, hits = 0, bb = 0, k = 0, arms = [];
      for (const p of h.people || []) {
        const st = p.stats?.[0]?.splits?.[0]?.stat;
        if (!st || (st.gamesStarted || 0) !== 0 || ipToOuts(st.inningsPitched) === 0) continue;
        outs += ipToOuts(st.inningsPitched); er += st.earnedRuns || 0; hits += st.hits || 0; bb += st.baseOnBalls || 0; k += st.strikeOuts || 0;
        arms.push({ id: p.id, name: p.fullName, era: toNum(st.era), ip: st.inningsPitched, g: st.gamesPlayed || 0 });
      }
      if (outs === 0) return [t[0], null];
      const ip = outs / 3;
      arms.sort((a, b) => a.era - b.era);
      return [t[0], { ip: outsToIp(outs), era: er * 9 / ip, whip: (hits + bb) / ip, k9: (k * 9) / ip, arms: arms.slice(0, 4) }];
    } catch { return [t[0], null]; }
  });
  const map = new Map(entries);
  const ranked = [...map.entries()].filter(([, v]) => v).sort((a, b) => a[1].era - b[1].era);
  ranked.forEach(([, v], i) => { v.rank = i + 1; v.of = ranked.length; });
  return map;
}

// ---- pitcher last-3 starts (#1) ---------------------------------------------
async function last3Starts(pitcherId, season) {
  if (!pitcherId) return [];
  try {
    const d = await mlb(`/api/v1/people/${pitcherId}/stats`, { stats: "gameLog", group: "pitching", season, sportId: 1 });
    const starts = (d.stats?.[0]?.splits || []).filter((s) => (s.stat?.gamesStarted || 0) >= 1);
    return starts.slice(-3).reverse().map((s) => ({
      date: s.date, opp: teamMeta(s.opponent?.id).abbr, isHome: !!s.isHome,
      ip: s.stat?.inningsPitched, er: s.stat?.earnedRuns ?? null, h: s.stat?.hits ?? null,
      bb: s.stat?.baseOnBalls ?? null, k: s.stat?.strikeOuts ?? null, np: s.stat?.numberOfPitches ?? null,
    }));
  } catch { return []; }
}

// ---- injuries (#5, ESPN) ----------------------------------------------------
async function buildInjuries() {
  const byTeam = new Map();
  try {
    const d = await j(`${ESPN}/injuries`);
    for (const t of d.injuries || []) {
      const id = espnNameToId(t.displayName);
      if (!id) continue;
      byTeam.set(id, (t.injuries || []).map((x) => ({
        name: x.athlete?.displayName || `${x.athlete?.firstName || ""} ${x.athlete?.lastName || ""}`.trim(),
        pos: x.athlete?.position?.abbreviation || "",
        status: x.status || x.type?.description || "",
        detail: x.shortComment || x.type?.detail || "",
      })));
    }
  } catch (e) { console.log("injuries FAIL:", e.message); }
  return byTeam;
}

// ---- odds (#6, ESPN) --------------------------------------------------------
async function buildOdds(ymd) {
  const byHomeId = new Map();
  try {
    const sb = await j(`${ESPN}/scoreboard?dates=${ymd}`);
    const events = (sb.events || []).map((ev) => {
      const comp = ev.competitions?.[0];
      const home = comp?.competitors?.find((c) => c.homeAway === "home");
      return { id: ev.id, homeId: espnNameToId(home?.team?.displayName) };
    }).filter((e) => e.homeId);
    await mapPool(events, 5, async (e) => {
      try {
        const sum = await j(`${ESPN}/summary?event=${e.id}`);
        const pc = (sum.pickcenter || []).find((p) => p.homeTeamOdds && p.awayTeamOdds) || sum.pickcenter?.[0];
        if (pc) byHomeId.set(e.homeId, {
          provider: pc.provider?.name || "",
          homeML: pc.homeTeamOdds?.moneyLine ?? null, awayML: pc.awayTeamOdds?.moneyLine ?? null,
          spread: pc.spread ?? null, total: pc.overUnder ?? null,
          favorite: pc.homeTeamOdds?.favorite ? "home" : pc.awayTeamOdds?.favorite ? "away" : null,
          details: pc.details || "",
        });
      } catch { /* odds may not be posted yet */ }
    });
  } catch (e) { console.log("odds FAIL:", e.message); }
  return byHomeId;
}

// ---- assemble ----------------------------------------------------------------
async function build(date) {
  const season = seasonOf(date), ymd = date.replaceAll("-", "");
  const [schedule, standingsRes, splitsArr, weekdayArr, bullpens, injuries, odds] = await Promise.all([
    mlb("/api/v1/schedule", { sportId: 1, date, hydrate: "probablePitcher(note),linescore,team" }),
    mlb("/api/v1/standings", { leagueId: "103,104", season, standingsTypes: "regularSeason" }),
    mapPool(TEAMS, POOL, async (t) => [t[0], parseTeamSplits(t[0], await mlb(`/api/v1/teams/${t[0]}/stats`, { stats: "statSplits", sitCodes: "vl,vr", group: "hitting", season, gameType: "R", sportId: 1 }))]),
    mapPool(TEAMS, POOL, async (t) => [t[0], weekdayRecords(t[0], await mlb("/api/v1/schedule", { sportId: 1, teamId: t[0], startDate: season + "-03-01", endDate: date, gameType: "R" }))]),
    buildBullpens(season),
    buildInjuries(),
    buildOdds(ymd),
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
      const res = await mlb("/api/v1/people", { personIds: [...ids].join(",") });
      res.people.forEach((p) => people.set(p.id, { id: p.id, name: p.fullName, hand: p.pitchHand?.code || "R" }));
    } catch { /* fall back to schedule hand */ }
  }
  // pitcher last-3 (one gameLog per probable starter)
  const last3 = new Map(await mapPool([...ids], POOL, async (id) => [id, await last3Starts(id, season)]));

  const pitcher = (p) => {
    if (!p?.id) return null;
    const base = people.get(p.id) || { id: p.id, name: p.fullName || "TBD", hand: p.pitchHand?.code || "R" };
    return { ...base, last3: last3.get(p.id) || [] };
  };
  const rankFor = (teamId, hand) => (hand === "L" ? rankings.L : rankings.R).get(teamId) || null;
  const bp = (id) => { const b = bullpens.get(id); return b ? { rank: b.rank, of: b.of, era: round(b.era), whip: round(b.whip, 2), k9: round(b.k9, 1), arms: b.arms } : null; };
  const side = (teamId, isHome, facing) => ({
    team: teamMeta(teamId), isHome,
    records: records.get(teamId) || null, weekday: weekday.get(teamId) || null,
    opposingPitcher: facing ? { id: facing.id, name: facing.name, hand: facing.hand } : null,
    offenseRank: facing ? rankFor(teamId, facing.hand) : null,
    bullpen: bp(teamId), injuries: injuries.get(teamId) || [],
  });

  const matchups = games.map((g) => {
    const awayP = pitcher(g.teams.away.probablePitcher), homeP = pitcher(g.teams.home.probablePitcher);
    const homeId = g.teams.home.team.id;
    return {
      gamePk: g.gamePk, officialDate: g.officialDate, weekday: weekdayOf(g.officialDate),
      dayNight: g.dayNight || inferDayNight(g.gameDate), status: g.status.detailedState,
      venue: g.venue?.name || null,
      awayId: g.teams.away.team.id, homeId,
      awayStarter: awayP, homeStarter: homeP,
      away: side(g.teams.away.team.id, false, homeP),
      home: side(homeId, true, awayP),
      odds: odds.get(homeId) || null,
    };
  });

  return { date, generatedAt: new Date().toISOString(), gameCount: matchups.length, matchups };
}
const round = (n, d = 2) => (Number.isFinite(n) ? Number(n.toFixed(d)) : null);

const date = process.argv[2] || etToday();
console.log(`Building MLB snapshot for ${date} from ${MLB} (+ ESPN) …`);
const snap = await build(date);
await mkdir(join(LIVE_DIR, "data"), { recursive: true });
const payload = JSON.stringify(snap);
await writeFile(join(LIVE_DIR, "today.json"), payload); // committed; served by githack
await writeFile(join(LIVE_DIR, "data", "today.json"), payload); // Pages-artifact copy
const withOdds = snap.matchups.filter((m) => m.odds).length;
const withBp = snap.matchups.filter((m) => m.away.bullpen || m.home.bullpen).length;
const injTeams = new Set(); snap.matchups.forEach((m) => { if (m.away.injuries.length) injTeams.add(m.awayId); if (m.home.injuries.length) injTeams.add(m.homeId); });
console.log(`games=${snap.gameCount} odds=${withOdds} bullpenGames=${withBp} injuryTeams=${injTeams.size}`);
console.log(`last3 sample:`, JSON.stringify(snap.matchups[0]?.awayStarter?.last3?.[0] || null));
console.log(`odds sample:`, JSON.stringify(snap.matchups.find((m) => m.odds)?.odds || null));
