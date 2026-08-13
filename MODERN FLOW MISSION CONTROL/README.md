# MFA Ops

Internal daily operations scoreboard for Modern Flow AI. Two seats: Darius and Ryan.

It exists so neither of us can lie to ourselves about the numbers, and so we can
check in without a meeting. It is a scoreboard and a log — not a CRM, not a project
manager, not a client-facing product.

**Setup instructions live in [SETUP.md](SETUP.md).** Read that first.

## Quick start

```bash
npm install
cp .env.example .env    # fill in the five values — see SETUP.md
npm run dev             # http://localhost:5180
npm run seed            # optional: sample data so the UI isn't empty
```

## The goal it tracks

$3,000 collected between **Aug 11 and Aug 31, 2026** — 21 days. The dashboard's
headline number is cash actually collected against that, coloured against a
straight-line pace: green on or ahead, amber behind, red below 60% of pace.

All of that lives in [`shared/config.ts`](shared/config.ts). Change the goal, the
window, the touch minimum, or the hourly floor there and every screen follows.

## Screens

| Route       | What it's for                                                            |
| ----------- | ------------------------------------------------------------------------ |
| `/`         | The money number, both people's day, 21-day pace chart, pipeline summary |
| `/log`      | Log today's numbers. The write path — under 20 seconds, one-handed       |
| `/standup`  | Yesterday / today / blocker, both people side by side                    |
| `/pipeline` | Every deal, filterable and sortable, with stage gates                    |
| `/review`   | Weekly gates vs actuals, biggest objection, one change                   |
| `/econ`     | Effective hourly on the $500 cycle. Red below $60/hr                     |

## Shareable demo

```bash
npm run demo    # -> dist-demo/mfa-ops-demo.html
```

Builds the whole app into one self-contained HTML file with sample data and no
backend. Useful for looking at the UI before the Google Sheet exists, or for
showing someone the thing without giving them the passcode.

It stubs `fetch` at the network boundary (`demo/stub.ts`) rather than replacing
the data layer, so the cache, optimistic writes, rollback, and retry are all the
real code. Writes work and persist until you refresh. Demo passcode is `demo`.

## How it's put together

```
src/                 React app (screens, components, derived metrics in lib/calc.ts)
shared/              Types, config, date math, row (de)serialization — used by both sides
netlify/functions/   The server. One function per write, one for reads, one for login
scripts/seed.ts      Sample data
```

**Google Sheets is the database.** Four tabs, one round trip to read all of them,
cached client-side for 60 seconds. Reads map columns by header name, so reordering
columns in the Sheet is safe.

**Auth** is one shared passcode checked in a Netlify Function. It's exchanged for an
HMAC-signed token, so the passcode is never stored on the device and no secret ever
reaches the browser bundle. The signed-in name comes from the token on every write —
neither of us can log numbers under the other's name.

**Writes are optimistic** with a real failure state. A failed save rolls the UI back,
says "Not saved", keeps your input, and offers Retry. Nothing is dropped silently.

**Reads degrade to cache.** If the Sheet is unreachable you get the last known data
behind an amber stale banner rather than a blank page.

**Dates are America/Los_Angeles**, always. "Today" rolls over at local midnight, not
UTC midnight, regardless of the device's timezone.

## Conventions

- Every number renders in JetBrains Mono via the `.num` class so columns line up and
  changing figures don't shift the layout.
- Palette and fonts are defined in `tailwind.config.js`. **No cyan, no Space Grotesk** —
  those belong to a different project and this build keeps zero visual overlap with it.
- The only animation is a fade on route change.

## Note on the folder name

The enclosing folder is named `MODERN FLOW MISSION CONTROL`, but the application is
called **MFA Ops** everywhere it's visible — page title, login, nav, deploy. That's
deliberate; keep it that way.
