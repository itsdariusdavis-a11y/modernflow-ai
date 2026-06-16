---
name: weekly-report
description: Compile the ModernFlow AI weekly business report across pipeline, sales, delivery, and retention. Use when the user wants "the weekly numbers," a business status update, or KPIs. Args (optional): date range (defaults to the last 7 days). Read-only — it reports, it changes nothing.
---

# Weekly report

Give the owner a one-page, decision-ready picture. Fast path for `reporting-agent` /
`docs/sops/09-reporting.md`.

## Steps

1. **Set the window** (default: last 7 days) and note any data gaps.
2. **Pull read-only** from each system:
   - Top of funnel — leads added, outreach sent, reply rate, calls booked (Apollo/CRM).
   - Sales — proposals sent, close rate, new MRR, deals per pipeline stage (CRM).
   - Delivery — clients onboarded, automations live, open action items (CRM/Fireflies).
   - Retention — active clients, churn, at-risk accounts, overdue follow-ups.
3. **Write one page:** headline numbers, week-over-week change, what's working, what's
   slipping, then the **top 3 recommended actions**, each tagged with the owner specialist.
4. Offer to post the digest internally via `comms-agent` (draft first).

## Guardrails

- Read-only across all systems — never modify records or send anything.
- Be honest about gaps and small samples; don't invent numbers.
- Lead with the decision: what should change this week?
