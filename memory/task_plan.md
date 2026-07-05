# Task Plan — B.L.A.S.T. Protocol

> Living checklist. Update after every phase transition.
> Status legend: ⬜ not started · 🟡 in progress · ✅ done · ⛔ blocked

## Protocol 0 — Initialization
- ✅ Create `/memory/` (task_plan, findings, progress, decisions)
- ✅ Create `CLAUDE.md` Project Constitution at repo root
- ✅ Create A.N.T. skeleton: `/architecture/`, `/execution/`, `/.tmp/`
- ✅ HALT — no logic in `/execution/` until Blueprint is approved

## Phase B — Blueprint (Vision & Logic)  🟡 IN PROGRESS
Discovery questions (asked one at a time, in order):
- ⬜ 1. North Star — the singular outcome that means we won
- ⬜ 2. Integrations — external services + credential readiness
- ⬜ 3. Source of Truth — where the primary data lives
- ⬜ 4. Delivery Payload — how/where the final result lands
- ⬜ 5. Behavioral Rules — tone, must-dos, must-not-dos, refusal triggers
Then:
- ⬜ Define JSON Data Schema (input → output) in CLAUDE.md
- ⬜ Research prior art → log in `/memory/findings.md`
- ⬜ Blueprint approved by user → unlock coding

## Phase L — Link (Connectivity)  ⬜
- ⬜ Test every API connection/credential from Phase B
- ⬜ Build minimal probe scripts in `/execution/`
- ⬜ All links green → proceed (broken link = halt)

## Phase A — Architect (A.N.T. build)  ⬜
- ⬜ Write SOPs in `/architecture/` (goals, inputs, tool logic, edge cases)
- ⬜ Define Navigation layer (routing between SOPs and Tools)
- ⬜ Build deterministic, atomic, testable Tools in `/execution/`

## Phase S — Stylize (Refinement & Delivery)  ⬜
- ⬜ Format payload for delivery quality
- ⬜ Frontend styling (if applicable)
- ⬜ Every output ships with a verify step
- ⬜ User sign-off before deployment

## Phase T — Trigger (Deployment & Self-Healing)  ⬜
- ⬜ Transfer logic to production
- ⬜ Set up firing mechanism (cron / webhook / manual / event) — document in CLAUDE.md
- ⬜ Finalize Maintenance Log in CLAUDE.md
- ⬜ Self-annealing loop active (analyze → patch → test → update SOP)
