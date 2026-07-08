# SOP 07 — Web + Engineering

**Owner:** `web-eng-agent` · **Skill:** `/ship-web-change` · **Systems:** this repo, Netlify, GitHub

## Goal

Ship correct, on-brand, well-tested changes to the ModernFlow AI marketing site.

## Scope

- **In scope — the marketing site** — React 19 + TS + Vite (`client/`), Express + tRPC 11
  (`server/`), shared types (`shared/`), MySQL/TiDB via Drizzle (`drizzle/`). Package
  manager `pnpm`. Contact form → GoHighLevel (`server/routers.ts`) + owner notification;
  keep both intact.
- **OUT OF SCOPE — `sports/`** — a standalone MLB analytics side project, unrelated to
  ModernFlow AI. Don't touch, build, deploy, or review it as part of ModernFlow work.

## The quality gate (run before every push)

```bash
pnpm check     # tsc --noEmit — must be clean
pnpm test      # vitest run — must pass
pnpm format    # prettier --write .
```

**Do not push if the gate fails.**

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
