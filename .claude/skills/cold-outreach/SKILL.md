---
name: cold-outreach
description: Draft a personalized ModernFlow AI cold-email sequence and stage it as drafts for approval. Use when the user wants to contact/email prospects or "set up outreach" for a list. Args (optional): the lead list or segment, and the angle (e.g. "missed-call text-back angle for roofers"). Never sends without explicit approval.
---

# Cold outreach

Turn a prospect list into a personalized 4-touch sequence, staged as drafts. Fast path
for `outreach-agent` / `docs/sops/02-sales-outreach.md`.

## Steps

1. **Get inputs:** the lead list/segment and the chosen angle. One angle = one pain
   (slow follow-up, missed calls, no online booking, no review requests).
2. **Write the sequence** (default 4 touches: relevance → value/proof → pattern-interrupt
   → breakup). Rules: under ~90 words each, lowercase 2–5 word subject lines, one ask =
   a 15-min call, plain-spoken owner-to-owner tone, defensible proof only.
3. **Personalize** line 1 per lead from the "why they fit / signal" field. For
   high-value leads, run `seo-local` on their site first and open with one
   concrete, verifiable gap (review count/recency vs. the top map-pack competitor).
4. **Deliverability gate:** before the first send from a domain (or after any
   domain/volume change, or a bounce/spam spike), run `cold-email-deliverability`.
   Any BLOCKER means don't stage the campaign. Never run cold volume from the primary
   domain that carries client mail.
5. **Stage as drafts:** create Gmail drafts (or a draft Apollo campaign) with the send
   schedule. Show the user the copy + the send plan.
6. **Stop at the approval gate.** Only send after the user says "send it." Then route
   positive replies to `/book-call` (scheduling).

## Guardrails

- Default to drafts. No sending without explicit authorization.
- CAN-SPAM: real identity, physical address, easy opt-out in the footer.
- No fabricated clients or metrics. One sequence per segment — don't cross-blast.
