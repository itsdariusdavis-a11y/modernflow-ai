#!/usr/bin/env node
/**
 * One-off endpoint probe (run in CI where the network is open). Confirms the
 * exact shapes/fields for the new features before we build them:
 *   #1 pitcher last-3 starts (gameLog)   #2/#3 bullpen (roster + reliever stats)
 *   #4 last-10 (standings)               #5 injuries   #6 odds (ESPN)
 * Prints compact PASS/FAIL summaries. Delete after we've read the results.
 */
const MLB = "https://statsapi.mlb.com";
const ESPN = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb";

function etToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}
const DATE = process.argv[2] || etToday();
const SEASON = Number(DATE.slice(0, 4));
const ymd = DATE.replaceAll("-", "");

async function j(url) {
  const r = await fetch(url, { headers: { "User-Agent": "probe/1.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}
const keys = (o) => (o ? Object.keys(o).join(", ") : "(none)");
function hr(t) { console.log("\n===== " + t + " ====="); }

const out = {};

// Grab a probable pitcher id + a team id from today's schedule.
async function context() {
  hr("CONTEXT: schedule " + DATE);
  const s = await j(`${MLB}/api/v1/schedule?sportId=1&date=${DATE}&hydrate=probablePitcher,team`);
  const games = s.dates?.[0]?.games || [];
  console.log(`games today: ${games.length}`);
  const g = games.find((x) => x.teams.away.probablePitcher?.id || x.teams.home.probablePitcher?.id) || games[0];
  out.pitcherId = g?.teams?.away?.probablePitcher?.id || g?.teams?.home?.probablePitcher?.id;
  out.teamId = g?.teams?.home?.team?.id || 119;
  out.gamePk = g?.gamePk;
  console.log(`using pitcherId=${out.pitcherId} teamId=${out.teamId} gamePk=${out.gamePk}`);
}

async function p1_gameLog() {
  hr("#1 pitcher gameLog");
  try {
    const d = await j(`${MLB}/api/v1/people/${out.pitcherId}/stats?stats=gameLog&group=pitching&season=${SEASON}&sportId=1`);
    const splits = d.stats?.[0]?.splits || [];
    console.log(`entries: ${splits.length}`);
    const last = splits.slice(-3);
    for (const s of last) {
      console.log(`  date=${s.date} opp=${s.opponent?.abbreviation || s.opponent?.name} isHome=${s.isHome} GS=${s.stat?.gamesStarted} IP=${s.stat?.inningsPitched} ER=${s.stat?.earnedRuns} H=${s.stat?.hits} BB=${s.stat?.baseOnBalls} K=${s.stat?.strikeOuts} ERA=${s.stat?.era}`);
    }
    console.log("split keys:", keys(last[0]));
    console.log("stat keys:", keys(last[0]?.stat));
  } catch (e) { console.log("FAIL:", e.message); }
}

async function p2_roster_relievers() {
  hr("#2/#3 roster + reliever season stats");
  try {
    const r = await j(`${MLB}/api/v1/teams/${out.teamId}/roster?rosterType=active`);
    const pitchers = (r.roster || []).filter((x) => x.position?.abbreviation === "P");
    console.log(`active roster: ${r.roster?.length}, pitchers: ${pitchers.length}`);
    console.log("roster entry keys:", keys(r.roster?.[0]));
    // hydrate season pitching stats to find relievers (GS≈0)
    const ids = pitchers.map((x) => x.person.id).slice(0, 8);
    const h = await j(`${MLB}/api/v1/people?personIds=${ids.join(",")}&hydrate=stats(group=[pitching],type=[season],season=${SEASON})`);
    for (const p of h.people || []) {
      const st = p.stats?.[0]?.splits?.[0]?.stat;
      if (st) console.log(`  ${p.fullName}: G=${st.gamesPlayed} GS=${st.gamesStarted} IP=${st.inningsPitched} ER=${st.earnedRuns} ERA=${st.era} WHIP=${st.whip}`);
    }
  } catch (e) { console.log("FAIL:", e.message); }
}

async function p3_reliever_rest() {
  hr("#3 reliever appearance dates + pitch counts (gameLog)");
  try {
    // reuse the probable pitcher's gameLog to confirm pitch-count field availability
    const d = await j(`${MLB}/api/v1/people/${out.pitcherId}/stats?stats=gameLog&group=pitching&season=${SEASON}&sportId=1`);
    const s = (d.stats?.[0]?.splits || []).slice(-1)[0];
    console.log("last outing date:", s?.date, "pitchesThrown:", s?.stat?.numberOfPitches ?? s?.stat?.pitchesThrown, "battersFaced:", s?.stat?.battersFaced);
    console.log("pitch-count-ish stat keys:", keys(s?.stat));
  } catch (e) { console.log("FAIL:", e.message); }
}

async function p4_standings() {
  hr("#4 standings split types (lastTen?)");
  try {
    const d = await j(`${MLB}/api/v1/standings?leagueId=103,104&season=${SEASON}&standingsTypes=regularSeason`);
    const tr = d.records?.[0]?.teamRecords?.[0];
    const types = (tr?.records?.splitRecords || []).map((x) => x.type);
    console.log("split types:", types.join(", "));
    const l10 = tr?.records?.splitRecords?.find((x) => x.type === "lastTen");
    console.log("lastTen:", l10 ? `${l10.wins}-${l10.losses}` : "(missing)");
  } catch (e) { console.log("FAIL:", e.message); }
}

async function p5_injuries() {
  hr("#5 injuries — try several sources");
  // a) MLB roster injured
  for (const rt of ["injured", "40Man", "fullRoster"]) {
    try {
      const r = await j(`${MLB}/api/v1/teams/${out.teamId}/roster?rosterType=${rt}&hydrate=person`);
      const withStatus = (r.roster || []).filter((x) => x.status && x.status.code && x.status.code !== "A");
      console.log(`MLB rosterType=${rt}: total=${r.roster?.length} non-active-status=${withStatus.length} sampleStatus=${JSON.stringify(r.roster?.[0]?.status)}`);
      if (withStatus[0]) console.log(`   e.g. ${withStatus[0].person.fullName} -> ${JSON.stringify(withStatus[0].status)}`);
    } catch (e) { console.log(`MLB rosterType=${rt} FAIL:`, e.message); }
  }
  // b) ESPN injuries
  try {
    const d = await j(`${ESPN}/injuries`);
    console.log("ESPN /injuries top keys:", keys(d));
    const first = d.injuries?.[0];
    console.log("ESPN injuries sample:", first ? `${first.displayName || first.team?.displayName} count=${(first.injuries||[]).length}` : JSON.stringify(d).slice(0, 200));
  } catch (e) { console.log("ESPN /injuries FAIL:", e.message); }
}

async function p6_odds() {
  hr("#6 odds — ESPN scoreboard");
  try {
    const d = await j(`${ESPN}/scoreboard?dates=${ymd}`);
    const ev = d.events?.[0];
    const comp = ev?.competitions?.[0];
    console.log("events:", d.events?.length, "first event:", ev?.shortName);
    console.log("competition keys:", keys(comp));
    console.log("odds present:", !!comp?.odds, "odds sample:", JSON.stringify(comp?.odds?.[0] || null).slice(0, 400));
  } catch (e) { console.log("ESPN scoreboard FAIL:", e.message); }
}

await context();
await p1_gameLog();
await p2_roster_relievers();
await p3_reliever_rest();
await p4_standings();
await p5_injuries();
await p6_odds();
hr("DONE");
