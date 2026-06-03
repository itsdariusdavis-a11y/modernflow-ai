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

There's no server cron needed: the page is data-driven off "today" each time it
loads. The cache key is the date, so a new day = a fresh fetch automatically.
Use **↻** to force-refresh, or the date arrows to browse other days.

## If the API is blocked

The MLB Stats API (`statsapi.mlb.com`) sends permissive CORS headers, so direct
browser calls normally work. If your network blocks it, route through a proxy and
pass it via the query string:

```
https://your-site/?api=https://your-proxy.example.com
```
