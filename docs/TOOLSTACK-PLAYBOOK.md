# ModernFlow AI — Tool Stack Playbook

Every connected tool, what it's for, when to use it, and the exact way to execute with
it. Ordered by revenue priority, not alphabetically. Companion to
`docs/GHL-EXECUTION-GUIDE.md` (delivery) and `docs/ACTION-PLAN.md` (what to do when).

> **Standing rule:** a tool only earns time when it serves the current priority
> (deliver Ecomax → revive warm deals → outreach). Everything else stays parked no
> matter how fun it is. Draft-first safety applies everywhere: nothing sends to a
> human without your review.

---

## Tier 1 — Revenue-critical this month

### GoHighLevel — delivery + your own funnel

The delivery platform. Full guide with copy-paste prompts: `docs/GHL-EXECUTION-GUIDE.md`.

### Gmail + Google Calendar (via Claude)

- **What:** outreach follow-ups, deal revival, booking. Claude drafts; you send.
- **Execute:** in any Claude Code session —
  - "Draft a follow-up to [prospect] referencing [detail]" → lands in Gmail drafts.
  - `/cold-outreach [segment/angle]` → staged sequence as drafts, never auto-sent.
  - `/book-call [who, purpose]` → finds slots, drafts the invite.
- **Right now:** two revival drafts (Andy, Ron) are sitting in Gmail — review, fill
  bracketed dates, send.

### Fireflies — meeting intelligence

- **What:** records/transcribes every sales call; your objection library and follow-up
  fuel. It captured the Ecomax and Hayes commitments that made the audit possible.
- **Execute:** after every call — `/meeting-recap [meeting]` → decisions, action items
  with owners, and a follow-up email draft. Paste action items into the GHL
  opportunity card the same evening.
- **Habit:** send the recap within 2 hours of a sales call — it doubles as the
  "professional operation" signal to prospects.

### Firecrawl — research engine

- **What:** web scraping/search for lead lists and Missed Lead Audits.
- **Execute (lead list, Priority 2):** "Use Firecrawl to find [trade] businesses in
  [metro]: business name, phone, website, review count from Google Maps/Yelp results.
  Build me a 50-row list as a spreadsheet." Then verify numbers before outreach.
- **Execute (pre-call audit):** "Scrape [prospect site]. Does it have a visible phone,
  form, chat, booking link? Response promises? Load speed issues? Summarize what
  they're leaking." → feeds the audit one-pager prompt in the GHL guide Part 4.

---

## Tier 2 — Sales assets (use as deals warrant)

### Gamma — decks & proposals

- **What:** AI presentations/proposals in the ModernFlow brand.
- **Execute:** `/sales-deck [prospect/niche, tier]` → draft deck link for review.
  Best use: the 5-slide audit-reveal deck for strategy calls (their numbers → the
  leak → live demo → founding offer → next step). One deck per niche, reused,
  personalized on slide 1 only. Also: export to PDF for the founding-offer one-pager
  the business plan calls for.

### Apollo — prospect data (⚠️ currently disconnected)

- **What:** contact enrichment + email finding at scale.
- **Status:** OAuth expired — reconnect in claude.ai connector settings before use.
- **When:** NOT needed for the first 150-lead local list (Maps/Yelp via Firecrawl is
  better for trades). Reconnect when you outgrow local scraping or want owner emails
  at volume. Then: `/prospect-sweep HVAC, San Diego, 50 leads`.

### Higgsfield — marketing creative engine (ads, video, UGC)

- **What:** image/video/audio generation — static ads, UGC-style talking-head videos,
  explainer videos, product shots. Also `virality_predictor` for scoring ad hooks.
- **When (be honest about this):** paid ads are a Priority-3 channel — after 3 paying
  clients and case-study numbers. Before that, Higgsfield's ROI is (a) client
  deliverables you can charge for, (b) organic social proof-of-work posts.
- **Execute — static ad set (uses the repo's `/static-ad-generator` skill + `brands/`):**
  1. In Claude Code: "Run the static-ad-generator for [client/ModernFlow]" — it walks
     brand research → prompt generation → image generation. ModernFlow's own brand DNA
     is already built at `brands/modernflow-ai/` (prompts.json ready).
  2. Or directly: "Use Higgsfield to generate 4 static ad images for [business]:
     [offer], brand colors [x], headline '[hook]', 1:1 and 9:16 crops."
  3. Score before spending: "Run virality_predictor on these" → keep the top 1–2.
- **Execute — UGC/explainer video:** "Make a 30-second UGC-style video ad for
  [client]: a homeowner realizes they missed a plumber's callback, then shows the
  instant text-back fixing it. Casual phone-shot look, end card with [business] logo
  and booking CTA." (Higgsfield loads its workflow catalog automatically for
  made-to-brief videos.) The full UGC service line playbook — personas, angles,
  pricing at $1.5–3k/mo — is in `ugc-agency/` when you're ready to sell it as a product.
- **Guardrail:** generation costs credits. Batch of 4, pick 1, iterate — don't spray.

### Pixa — image editing

- **What:** edit/upscale/retouch generated or client photos (background removal,
  cleanup for websites and GBP profiles).
- **Execute:** "Upload these client job-site photos to Pixa, remove backgrounds,
  brighten, and give me web-ready versions" — cheap way to make client sites look pro.

---

## Tier 3 — Infrastructure (already built; operate, don't expand)

### This repo's Claude Code operating layer

Your staff. Each process has an agent + skill (`CLAUDE.md` for the full map):

- `/prospect-sweep` — build lead lists · `/cold-outreach` — draft sequences
- `/book-call` — schedule without double-booking · `/meeting-recap` — post-call package
- `/client-onboarding [name, tier]` — runs the onboarding checklist when a deal closes
- `/weekly-report` — business scoreboard on demand
- `/ship-web-change` — any site edit through the typecheck/test/format gate
- **Weekly Review Routine** (Mondays ~9am PT): auto-audits pipeline/delivery/drift
  against `docs/ACTION-PLAN.md`. Recreate it in the claude.ai Routines UI once to give
  it Gmail/Calendar/Fireflies read access.

### Netlify — deploy the real website

- **Decision pending (ACTION-PLAN P1):** point modernflowai.com at this repo's site.
- **Execute:** merge PR #9 → in Netlify: New site from Git → this repo →
  build `pnpm build`, publish dir `dist/public` → set env vars `VITE_CALENDLY_URL`
  and `VITE_CONTACT_EMAIL` (your identity, not Ryan's, if going solo) → point the
  domain's DNS at Netlify → keep the GHL site only as client infrastructure.

### n8n workflows (`automation/n8n/` + `automations/`)

- 4-workflow outreach machine (Apollo → drip → AI reply handling → booking alerts) and
  the ServiceTitan follow-up product. All placeholder-credentialed by design.
- **When:** outreach automation only after manual outreach proves the message
  (Priority 2 done). ServiceTitan follow-up = fastest **productized** offer for
  ServiceTitan shops: set one client's env vars, move off sandbox URLs, charge monthly.
- Note: `automation/` vs `automations/` overlap — `automation/n8n/` is the canonical
  outreach build; `automations/mfa-lead-gen/` is a superseded variant (see audit).

### Slack — internal comms

- Ops notifications (n8n reply alerts route here) and, with a partner, the deal-handoff
  channel. Solo: park it.

### Hugging Face

- No role in the current plan. Park it.

---

## The weekly operating rhythm (ties it all together)

| When              | What                                                               | Tool                    |
| ----------------- | ------------------------------------------------------------------ | ----------------------- |
| Mon morning       | Weekly Review Routine reports scoreboard + drift                   | Routine (auto)          |
| Mon evening       | Act on review: update `docs/ACTION-PLAN.md` checkboxes, fix stalls | Claude Code             |
| Tue–Thu evenings  | 10–15 outreach touches; log in GHL pipeline                        | GHL + Gmail drafts      |
| After any call    | `/meeting-recap` → follow-up draft sent same evening               | Fireflies               |
| Fri evening       | `/weekly-report`; queue next week's lead batch                     | Claude Code + Firecrawl |
| Monthly (1st Mon) | Client numbers emails; review tool spend vs MRR                    | GHL                     |
