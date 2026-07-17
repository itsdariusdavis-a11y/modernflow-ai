# ModernFlow AI — Turnaround Action Plan

Created 2026-07-17 from the full business audit (see the audit report PDF for evidence
and reasoning). This is the canonical execution doc. The weekly review Routine measures
progress against THIS file. Update statuses inline; don't fork new plan documents.

## Ground truth (as of 2026-07-17)

- Lifetime revenue: $1,000 (Ecomax deposit, Apr 15). MRR: $0. Clients live: 0.
- Ecomax (Andy, ecomax.repairs@gmail.com): PAID, undelivered. Build stopped May 21
  at 2 of 9 workflows. Specs for the rest already written (Drive: `ecomax-*` docs).
- Ron Hayes (rhayes@lahydrojet.com): warm, went dark in April. No invoice ever sent.
- Outreach: 0 touches/day against a 30–40/day plan. No business meetings since May 7.
- modernflowai.com serves the GHL-built site (no booking CTA); this repo's site is
  not deployed to the domain.

## Priority 0 — Deliver Ecomax (unlocks: $1,000 cash + $297/mo + case study + referral)

- [ ] Review + send the two Gmail drafts (Andy, Ron) — fill in bracketed dates first
- [ ] Fix 2 trigger filters per `ecomax-efficient-path.md` (60 seconds, GHL Workflow AI)
- [ ] Build W2–W7b from the written prompts (Drive: `ecomax-w*-build.md`) — 1–2 evenings
- [ ] Run the QA prompt from `ecomax-build-and-qa-complete.md`
- [ ] Record walkthrough video → send to Andy with launch-call slots
- [ ] Launch call → go live → invoice remaining $1,000 → start $297/mo subscription
- [ ] Referral ask (free chatbot add-on deal from Apr 7 call — already agreed)

## Priority 1 — Decisions (this week, cheap, unblock everything)

- [ ] **Ryan decision rule:** message Ryan — "restarting the sprint Monday, are you in
      for the plan's 25–35 touches/day?" His next 7 days of behavior is the answer.
      Either branch is fine; the undecided middle is not.
- [ ] **One website:** point modernflowai.com at this repo's site (Netlify) and keep GHL
      for client sub-accounts only — or consciously kill this repo's site. Stop
      maintaining both. (Recommended: this repo's site; it's better and you control it.)
- [ ] **One pricing story:** founding offer $497/mo setup-waived (first 10) + standard
      tiers after. Update company-os/01_Context/01-company.md to match BUSINESS-PLAN.md.
- [ ] Add a booking CTA to whatever site is live (today the GHL site has NONE).

## Priority 2 — 30-day sales restart (after Ecomax ships)

- [ ] Pick ONE niche + metro (recommended: plumbing/hydrojet, San Diego — warm context)
- [ ] Lead list: 150 businesses (Google Maps + Yelp) — name, phone, email, review count
- [ ] 10–15 touches per evening solo (25–35/day if Ryan is in) — calls 4–6pm, SMS/email after
- [ ] Missed Lead Audit before every booked call (the hook that books calls)
- [ ] Log 4 numbers nightly: touches / conversations / calls booked / closes
- [ ] Targets: 3+ strategy calls by day 14 · first new close by day 21–30 (solo pace)

## Priority 3 — After 3 paying clients (not before)

- [ ] Template GHL snapshots per tier (delivery ≤6h/client)
- [ ] Monthly numbers email automated (churn defense — clients cancel what they can't see)
- [ ] Referral program: free month per closed referral
- [ ] End founding pricing; new clients at $497+ standard
- [ ] Only now: revisit n8n outreach automations / UGC line / paid channels

## Standing rules (enforced by the weekly review)

1. **Sell > build.** No new internal tooling, playbooks, or site polish while
   touches/day < target and any client is undelivered. A paying client's request is
   the only exception.
2. **Claims must be verifiable.** Nothing goes on any site or pitch that can't be
   backed with a named, consenting client or a cited source. (The fabricated
   testimonials/stats were removed 2026-07-17 — do not reintroduce.)
3. **Money math is MRR-first.** Setup fees are cash, not the goal. The scoreboard
   number is MRR against $3,000.
4. **Every deal gets a next step with a date.** A deal with no scheduled next touch
   is a dead deal — the Apr–Jul pipeline died of exactly this.
5. **Weekly review is non-negotiable** (automated Routine, Mondays): touches,
   pipeline, delivery debt, MRR vs. goal, drift against this file.
