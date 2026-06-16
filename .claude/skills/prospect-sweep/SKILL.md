---
name: prospect-sweep
description: Build a fresh, targeted ModernFlow AI prospect list from Apollo. Use when the user wants new leads, a target list, or to "find prospects/companies" in a niche or region. Args (optional, free text): niche, region, count, extra filters — e.g. "HVAC, Texas, 50 leads".
---

# Prospect sweep

Produce a clean, deduplicated lead list matching the ModernFlow ICP. This is the fast
path for `lead-gen-agent` / `docs/sops/01-lead-generation.md`.

## Steps

1. **Parse the request.** Pull niche(s), region, target count, and any extra filters from
   the args. If count is missing, default to 25. If niche is missing, ask which one.
2. **Apply the ICP** (service businesses, 5–100 employees, US/CA, decision-maker titles:
   Owner/Founder/President/CEO/GM/Ops Manager). Add buying-signal filters where useful
   (hiring, no online booking).
3. **Search Apollo**, enrich for verified emails + direct titles, and pull a job-posting
   signal where it sharpens prioritization.
4. **Clean:** dedupe, drop mismatches, flag uncertain emails.
5. **Return a table:** Company · Contact · Title · Email (verified?) · Phone · City/State ·
   Employees · Website · "why they fit / signal." End with total count and suggested
   segments for messaging.

## Guardrails

- Read/enrich only — do not contact anyone. Hand the list to `/cold-outreach`.
- Keep lead PII in Apollo and the returned table; never write it into the repo.
- If results are thin, widen one filter at a time and state what changed.
