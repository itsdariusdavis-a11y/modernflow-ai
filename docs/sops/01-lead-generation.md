# SOP 01 — Lead Generation

**Owner:** `lead-gen-agent` · **Skill:** `/prospect-sweep` · **System:** Apollo

## Goal

Produce clean, well-targeted prospect lists of service businesses that fit our ICP, so
outreach has high-quality fuel.

## ICP

- **Industries:** HVAC, plumbing, electrical, roofing, landscaping, general contracting,
  pest control, garage doors, remodeling — local/field-service businesses.
- **Size:** 5–100 employees (sweet spot 10–50).
- **Geography:** US and Canada; service-area businesses.
- **Decision-makers:** Owner, Founder, President, CEO, GM, Operations Manager, Marketing Manager.
- **Buying signals:** hiring, running ads, no online booking, slow/no review responses,
  outdated website — anything implying manual lead handling.

## Procedure

1. Confirm the ask: count (default 25), niche(s), region, extra filters.
2. Search Apollo with the ICP filters; enrich for verified emails + direct titles; pull
   job-posting signals to prioritize.
3. Clean: dedupe against existing data, drop mismatches, flag uncertain emails.
4. Deliver a table — Company · Contact · Title · Email (verified?) · Phone · City/State ·
   Employees · Website · "why they fit / signal" — plus total count and suggested segments.

## Definition of done

A deduplicated, ICP-matched list with verified-where-possible contacts and a fit reason
per row, ready to hand to SOP 02 (Sales Outreach).

## Guardrails

- Read/enrich only — never contact leads here.
- Keep PII in Apollo and the returned table; never in the repo.
- Thin results → widen one filter at a time and state the change.
