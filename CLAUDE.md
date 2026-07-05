# CLAUDE.md — Project Constitution (ModernFlow AI)

> Governing document for all agent work in this repo. If logic changes, the
> relevant `/architecture/` SOP is updated **before** the code.

## Operating Protocol
This project runs on **B.L.A.S.T.** (Blueprint → Link → Architect → Stylize →
Trigger) with the **A.N.T.** 3-layer build:

- **A — Architecture** (`/architecture/`): markdown SOPs — goals, inputs, tool
  logic, edge cases. The deterministic source of truth.
- **N — Navigation**: reasoning/routing layer (the agent). Routes data between
  SOPs and Tools; performs no complex work itself.
- **T — Tools** (`/execution/`): deterministic, atomic, testable scripts.
  Credentials live in `.env` only. Intermediates route through `/.tmp/`.

### Hard rules
1. **Data-First** — no logic is written until the input/output JSON schema below
   is confirmed by the user.
2. **Never guess business logic.** Ambiguity → ask, then log the answer here.
3. **Surgical changes** — touch only what the task requires. The existing
   marketing site (`client/`, `server/`, `shared/`) is not modified unless the
   Blueprint says so.
4. **No unverified shipping** — every output needs a test, screenshot, or
   one-line verify command.
5. **Credentials** never enter git. `.env` is gitignored; `.env.example`
   documents the contract.
6. **Memory discipline** — `/memory/` files are updated as work happens:
   progress.md (append-only log), decisions.md (choice + reason),
   findings.md (research), task_plan.md (checklists).

## Repository Context
Full-stack marketing site for ModernFlow AI (done-for-you AI automation agency
for service businesses). React 19 + TS + Tailwind 4 + Framer Motion / Express 4
+ tRPC 11 / MySQL-TiDB via Drizzle / pnpm. Existing integrations: GoHighLevel
inbound webhook (contact form), Calendly popup, Manus OAuth.

**This repo is also Darius's working workspace for an automation-business
course** — successive builds ("bricks") will land here under the B.L.A.S.T.
protocol, each one a step toward the North Star.

---

## Data Schemas
> ⛔ **PENDING BLUEPRINT** — defined only after discovery Q4 (Delivery Payload)
> is answered. Coding in `/execution/` is blocked until this section is filled.

```jsonc
// INPUT SHAPE:  (pending)
// OUTPUT SHAPE: (pending)
```

## Behavioral Rules
> ⛔ PENDING — from discovery Q5 (tone, must-dos, must-not-dos, refusal triggers).

## Architectural Invariants
1. A.N.T. layer separation is never violated (no business logic in Navigation).
2. All intermediate files go through `/.tmp/`, never the repo root.
3. A project is "Complete" only when the payload lands at its final destination.

---

## B.L.A.S.T. Phase Outputs

### B — Blueprint  🟡 IN PROGRESS
| Question | Answer |
|---|---|
| North Star | Build a skill set and automation business (brick by brick, via a course followed in this workspace) that generates enough income for Darius to leave his 9-5 and spend more time with his family and 10-month-old son. Every build here is measured against: *does this move the business toward replacing the 9-5 income?* |
| Integrations + credentials | **All available services enabled** ("all of them, just in case"): Gmail, Google Calendar, Google Drive, Slack, Apollo.io, Firecrawl, Fireflies, Netlify (workspace connectors — OAuth already live); GoHighLevel webhook, Calendly, MySQL/TiDB (repo — GHL_WEBHOOK_URL and DATABASE_URL still need values in .env). Each link gets a green Phase L probe before any build depends on it. |
| Source of Truth | Deferred — per-build |
| Delivery Payload | Deferred — per-build |
| Behavioral Rules | Deferred — per-build |

> This constitution was created per the course's Part 1 ("Universal CLAUDE.md
> Protocol"). Each subsequent course build re-runs discovery Q2–Q5 for that
> build and records the answers in its own section below.

### L — Link  ⬜
Connectivity verification results: _pending (see /memory/progress.md)_

### A — Architect  ⬜
SOPs written: _none yet (see /architecture/)_

### S — Stylize  ⬜
Payload format + verification: _pending_

### T — Trigger  ⬜
| Trigger | Mechanism | Documented |
|---|---|---|
| _none yet_ | | |

## Maintenance Log (long-term stability)
_Initialized empty. Filled during Phase T. Every production failure follows the
self-annealing loop: analyze trace → patch /execution/ → test → write lesson
into the corresponding /architecture/ SOP._
