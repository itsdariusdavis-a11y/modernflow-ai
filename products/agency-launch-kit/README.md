# The AI Agency Launch Kit

A passive-income digital product built from the operating assets in this repo. It
packages the systems ModernFlow AI actually runs — SOPs, n8n automations, prompt
templates, sales assets, and the command-center app — into a three-tier digital
product for people starting or productizing an AI automation agency.

**Why this product:** it monetizes work that already exists (near-zero build cost),
requires zero per-customer fulfillment (files delivered automatically by the sales
platform), and targets a _different buyer_ than the agency itself — aspiring agency
operators, not service businesses — so it does not cannibalize the DFY retainer offer.
It can even feed it: kit buyers who stall become "done-for-you" prospects.

## The three tiers

| Tier                          | Price    | Contents                                                                                                                                                             |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. The Playbook**           | **$97**  | 10 SOPs (`docs/sops/`), business plan + 30-day launch plan, 8 operator prompt templates (`company-os/02_Templates/`)                                                 |
| **2. The Automation Toolkit** | **$297** | Everything in Playbook + 4 n8n cold-email workflows (`automation/n8n/`), ServiceTitan follow-up system (`automations/servicetitan-followup/`), GHL integration guide |
| **3. Agency-in-a-Box**        | **$497** | Everything in Toolkit + Command Center app (`planner/index.html`), UGC Creative Engine (`ugc-agency/`), Static Ad Generator (`BRAND-AD-GENERATOR.md` + skill)        |

Pricing rationale and market comps: [`PRICING-AND-RESEARCH.md`](PRICING-AND-RESEARCH.md).

## How it stays passive

1. **Source of truth stays in this repo.** The sellable zips are assembled by
   [`build-packages.sh`](build-packages.sh) from an explicit allowlist of repo files —
   no copies to keep in sync. Improve an SOP, re-run the script, re-upload.
2. **Sanitization is automatic.** The build script strips personal contact details
   (email, Calendly link) and replaces them with buyer-facing placeholders. It never
   globs directories, so client data can't slip in by accident.
3. **The platform does fulfillment.** Lemon Squeezy (merchant of record) handles
   checkout, sales tax/VAT, file delivery, receipts, and refunds. After launch, the
   only recurring work is optional: answering the occasional support email.

## Files in this directory

| File                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `README.md`                | This file — product definition                                          |
| `PRICING-AND-RESEARCH.md`  | Market comps, pricing rationale, revenue math                           |
| `LAUNCH-CHECKLIST.md`      | Step-by-step: build zips → Lemon Squeezy → live links → traffic         |
| `MARKETING-PLAN-30-DAY.md` | 30-day go-to-market: channels, calendar, paid test, KPIs                |
| `creatives/`               | Ready-to-shoot video scripts, X posts/threads, IG carousels, ad prompts |
| `build-packages.sh`        | Assembles the three tier zips into `dist/` from repo sources            |
| `content/START-HERE.md`    | The buyer's entry point, included in every zip                          |
| `content/LICENSE.md`       | Single-operator commercial license, included in every zip               |
| `content/SALES-COPY.md`    | Ready-to-paste listing copy for each tier                               |

The marketing site has a matching sales page at `/toolkit`
(`client/src/pages/Toolkit.tsx`) — update its `CHECKOUT_URLS` once the Lemon Squeezy
products exist (step 3 of the launch checklist).

## What is deliberately excluded

- `company-os/01_Context/` — Darius/ModernFlow-specific business state
- Any live client builds, GHL sub-accounts, API keys, or webhook URLs
- The fabricated marketing stats flagged in `LAUNCH-PROMPT.md` ("500+ clients",
  "98% retention") — all product copy uses honest positioning: _"the systems our
  agency actually runs on."_
