# ModernFlow AI — Company OS

A practical operating system for running ModernFlow AI as a one-person company with Claude carrying the handoffs: research, content, sales prep, and operations. You keep direction, pricing, customer trust, and every irreversible decision. Claude carries preparation and production. Your tools (GoHighLevel, Calendly, email, calendar) carry the transactions.

## The three layers

1. **You own direction** — market, promise, price, priorities, acceptable risk.
2. **Claude carries preparation** — researches, organizes, drafts, compares, extracts, formats, follows the defined processes in this folder.
3. **Your tools carry transactions** — GoHighLevel (CRM + pipeline), Calendly (booking), Gmail/calendar, the website contact form → GHL webhook.

## Setup (one time, ~30 minutes)

1. **Create a Claude Project** named `ModernFlow AI Operations` (not "My Claude Project").
2. **Upload the four context files** from `01_Context/` to the Project's knowledge:
   - `01-company.md` — offer, pricing, guarantees, decision rules
   - `02-customer.md` — the contractor customer, real objections, bad fits
   - `03-voice-and-standards.md` — how ModernFlow sounds, banned phrases, quality bar
   - `04-operating-context.md` — what is true *this week* (update every Friday)
3. **Paste `project-instructions.md`** into the Project's custom instructions.
4. **Connect tools in this order**, testing a read-only workflow before adding the next:
   1. Calendar
   2. Email
   3. Google Drive / document storage
   4. GoHighLevel (only after the morning brief works from email + calendar)
   5. Accounting/payments last, and only with explicit approval rules
5. If using Claude Cowork or Claude Code on your machine, give it access to **this folder only** — not your whole computer.

## Folder map

| Folder | What goes here |
|--------|----------------|
| `00_Inbox/` | Raw material waiting to be processed: call notes, GHL exports, screenshots, transcripts |
| `01_Context/` | Approved company knowledge Claude may use repeatedly |
| `02_Templates/` | Reusable prompt templates for research, sales, content, and operations |
| `03_Outputs/` | Finished drafts Claude produced (morning briefs, research, content drafts) |
| `04_Review/` | Anything that must be human-checked before it leaves the company (proposals, outreach, invoices) |
| `05_Logs/` | Short records of what was used, changed, or produced |
| `06_Skills/` | Claude Skill folders — zip and upload each one to Claude's customization area |
| `07_Archive/` | Completed projects and old versions that should not affect current work |

The separation that matters: **raw material → approved context → generated work → human review**. Nothing goes from `03_Outputs` to a customer without passing through `04_Review` and your eyes.

## The four departments

All four run inside the one Project. Split into separate Projects only when volume causes confusion.

| Department | Template | What it does |
|-----------|----------|--------------|
| Research | `02_Templates/research-brief.md` | Prepares a decision, not a pile of links |
| Sales | `02_Templates/prospect-qualification.md`, `reply-prep.md`, `proposal.md` | Qualifies contractors, preps replies, drafts proposals |
| Content | `02_Templates/content-interview.md` | Extracts *your* point before drafting anything |
| Operations | `02_Templates/morning-brief.md`, `weekly-review.md` | One view of commitments, pipeline, and slippage |

## Skills

When a template has worked manually several times, it graduates to a Skill (`06_Skills/`). Build them in this order, as the need appears:

1. **morning-brief** — reduces email + calendar + GHL pipeline noise into decisions
2. **proposal-builder** — converts strategy-call notes into a proposal at approved pricing
3. **weekly-review** — finds slippage, bottlenecks, and processes worth systematizing

Each Skill folder contains a `skill.md`. Zip the folder and add it through Claude's customization area, then invoke with `/proposal-builder`, `/morning-brief`, `/weekly-review`.

## Automation boundary

**Automate preparation. Keep authorization human.**

Safe to schedule: morning briefs, weekly pipeline summaries, strategy-call prep docs, competitor monitoring, draft review-request follow-up lists, Friday reviews.

Never automated: sending customer emails or SMS, publishing content, changing prices or discounts, issuing refunds under the 30-day guarantee, signing or accepting contracts, moving money, deleting files, anything touching a client's ad spend.

## Where to start

See `30-DAY-PLAN.md`. Do not build all of this in week one — start with the morning brief run manually, and let your corrections become the system.
