# Findings — Research, Discoveries, Constraints

## 2026-07-05 — Repository survey (pre-Blueprint)

### What this repo already is
- **ModernFlow AI marketing website** — done-for-you AI automation agency targeting
  service businesses (contractors, plumbers, HVAC, electricians).
- Stack: React 19 + TypeScript + Vite + Tailwind CSS 4 + Framer Motion (client),
  Express 4 + tRPC 11 (server), MySQL/TiDB via Drizzle ORM, pnpm.
- 13-section single-page site; components in `client/src/components/`.
- Also contains two unrelated sub-projects: `baby-walking-tracker/` and `sports/`.

### Existing integrations (from README + code layout)
| Integration | Where | Status |
|---|---|---|
| GoHighLevel CRM | Contact form → `GHL_WEBHOOK_URL` inbound webhook (`server/routers.ts`) | Needs env var; untested here |
| Calendly | `client/src/hooks/useCalendly.ts` popup — `calendly.com/ryan-modernflowai/30min` | Client-side only |
| MySQL/TiDB | `drizzle/` + `drizzle.config.ts`, `DATABASE_URL` | Needs env var |
| Manus OAuth | Auth layer, `JWT_SECRET` auto-injected by Manus hosting | Replaceable |

### Environment variables required (none present in repo — `.env` is gitignored)
- `GHL_WEBHOOK_URL` — contact form → GoHighLevel
- `DATABASE_URL` — MySQL/TiDB
- `JWT_SECRET` — auth

### Existing docs worth reusing
- `GHL-INTEGRATION-GUIDE.md` — GoHighLevel webhook setup
- `AI-PLATFORM-MIGRATION-GUIDE.md` — porting to Lovable/Bolt/v0
- `FREE-HOSTING-GUIDE.md` — Netlify/Vercel deployment

### Constraints
- `.gitignore` already excludes `.env`; credentials must never be committed.
- `/.tmp/` added to `.gitignore` — all intermediate files route through it.
- Session GitHub scope: `itsdariusdavis-a11y/modernflow-ai` only.
- Work branch: `claude/blast-protocol-setup-kblyw3`.

### Open — awaiting Blueprint
The actual automation/system to build has NOT been specified yet. The repo is the
context, not the task. All five discovery questions pending (see task_plan.md).
