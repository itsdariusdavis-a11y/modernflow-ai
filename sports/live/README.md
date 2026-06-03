# Live dashboard (zero-build)

`index.html` is the **entire dashboard in one self-contained file** — no build
step, no dependencies. It fetches live data from the MLB Stats API in the
browser, so **every visit shows the current day automatically** (it reads the
calendar date on load, caches per-day in `localStorage`, and rolls forward to the
new slate if you leave the tab open past midnight).

## Put it online

Pick any of these — the file is host-agnostic:

- **GitHub Pages** — merge this to `main` and enable Pages (Settings → Pages →
  Source = "GitHub Actions"). The included workflow `.github/workflows/deploy-sports.yml`
  publishes `sports/live/`. _Pages on a private repo needs a paid GitHub plan._
- **Netlify / Cloudflare Pages / Vercel** — drag `index.html` into a new site, or
  point the host at this folder. Free, works on private repos.
- **Locally** — just open `index.html`, or `npx serve sports/live`.

## Daily updates

Two layers, so it's always current:

1. **Server-side daily snapshot** — the GitHub Action
   (`.github/workflows/deploy-sports.yml`) runs on a cron a few times a day,
   executes `sports/scripts/build-snapshot.mjs` to pull the full slate from the
   MLB Stats API, and bakes it into the deployed page as `data/today.json`. So
   the page is fresh every day even before any browser fetch.
2. **Live in-browser refresh** — on load the page reads the snapshot for an
   instant first paint, then refreshes against the API directly (picking up
   lineups/scores as the day goes on). The cache key is the date, so a new day =
   a fresh fetch automatically.

Use **↻** to force-refresh, or the date arrows to browse other days. To build a
snapshot locally: `node sports/scripts/build-snapshot.mjs` (needs internet).

## If the API is blocked

The MLB Stats API (`statsapi.mlb.com`) sends permissive CORS headers, so direct
browser calls normally work. If your network blocks it, route through a proxy and
pass it via the query string:

```
https://your-site/?api=https://your-proxy.example.com
```
