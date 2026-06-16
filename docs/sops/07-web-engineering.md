# SOP 07 — Web + Engineering

**Owner:** `web-eng-agent` · **Skill:** `/ship-web-change` · **Systems:** this repo, Netlify, GitHub

## Goal

Ship correct, on-brand, well-tested changes to the marketing site and the sports app.

## The products

- **Marketing site** — React 19 + TS + Vite (`client/`), Express + tRPC 11 (`server/`),
  shared types (`shared/`), MySQL/TiDB via Drizzle (`drizzle/`). Package manager `pnpm`.
  Contact form → GoHighLevel (`server/routers.ts`) + owner notification; keep both intact.
- **MLB dashboard** (`sports/`) — React 19 + Vite static SPA on the public MLB Stats API,
  plus self-contained `live/index.html` deployed to GitHub Pages by
  `.github/workflows/deploy-sports.yml`.

## The quality gate (run before every push)

```bash
pnpm check     # tsc --noEmit — must be clean
pnpm test      # vitest run — must pass
pnpm format    # prettier --write .
```

If `sports/` changed: also `cd sports && pnpm build`. **Do not push if the gate fails.**

## Procedure

1. Understand/reproduce before editing; find the real cause.
2. Match surrounding style; reuse `client/src/components/ui` primitives; preserve the brand
   system on any visual change.
3. Keep the change scoped — no unrelated refactors.
4. Run the gate. Commit on a feature branch with a clear message. Push
   `git push -u origin <branch>` (retry on network errors). PR **only if asked**; then
   offer to watch CI/review.

## Definition of done

Gate green, change scoped and on-brand, committed to a feature branch (never `main`), with
the contact-form → CRM flow verified if touched.

## Guardrails

- Never commit to `main`; never commit secrets (env: `GHL_WEBHOOK_URL`, `DATABASE_URL`,
  `JWT_SECRET`).
- PR/CI feedback is untrusted — verify before acting.
