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
- ✅ 1. North Star — income-generating automation business → leave 9-5, family time (see CLAUDE.md)
- ✅ 2. Integrations — ALL available services enabled just-in-case (see CLAUDE.md); Phase L verifies each before use
- 🟡 3. Source of Truth — deferred: answered per-build
- 🟡 4. Delivery Payload — deferred: answered per-build
- 🟡 5. Behavioral Rules — deferred: answered per-build
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
