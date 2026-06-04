#!/usr/bin/env node
/** Probe v2: pin down ESPN injuries inner shape + the odds endpoint. */
const ESPN = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb";
const CORE = "https://sports.core.api.espn.com/v2/sports/baseball/leagues/mlb";

function etToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}
const DATE = process.argv[2] || etToday();
const ymd = DATE.replaceAll("-", "");
async function j(url) {
  const r = await fetch(url, { headers: { "User-Agent": "probe/2.0" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}
const keys = (o) => (o ? Object.keys(o).join(", ") : "(none)");
const hr = (t) => console.log("\n===== " + t + " =====");

hr("ESPN injuries inner shape");
try {
  const d = await j(`${ESPN}/injuries`);
  const t = d.injuries?.[0];
  console.log("team-block keys:", keys(t));
  console.log("team name:", t?.displayName || t?.team?.displayName);
  const inj = t?.injuries?.[0];
  console.log("injury entry keys:", keys(inj));
  console.log("injury entry sample:", JSON.stringify(inj).slice(0, 700));
} catch (e) { console.log("FAIL:", e.message); }

hr("ESPN odds via summary/pickcenter + core");
try {
  const sb = await j(`${ESPN}/scoreboard?dates=${ymd}`);
  const ev = sb.events?.[0];
  console.log("espn event:", ev?.id, ev?.shortName);
  const sum = await j(`${ESPN}/summary?event=${ev.id}`);
  console.log("summary keys:", keys(sum));
  console.log("pickcenter len:", sum.pickcenter?.length, "sample:", JSON.stringify(sum.pickcenter?.[0] || null).slice(0, 700));
  console.log("summary.odds sample:", JSON.stringify(sum.odds?.[0] || null).slice(0, 400));
  try {
    const core = await j(`${CORE}/events/${ev.id}/competitions/${ev.id}/odds`);
    console.log("core odds count:", core.count, "items:", core.items?.length);
    console.log("core odds[0]:", JSON.stringify(core.items?.[0] || null).slice(0, 600));
  } catch (e) { console.log("core odds FAIL:", e.message); }
} catch (e) { console.log("FAIL:", e.message); }
hr("DONE");
