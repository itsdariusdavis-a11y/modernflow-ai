# Jev / System One reference (vendored)

Upstream: https://github.com/sebastianbennis/jev-system-one-reference (MIT, edition 1.1.1,
commit `45d47fc`). Independent third-party reference, not an official TypeSafe AI publication.
`LICENSE` and `THIRD_PARTY_NOTICES.md` are kept alongside it as required. Do not edit
`Jev_System_One_Reference.md`; re-sync from upstream instead.

## What it is

Jev is a text-in, typed-answer classifier API (`choice`, `noul`, `score` questions, each with a
probability). It does **not** generate text, count, compare dates, or read images/audio. Its
own reference says "cannot hallucinate" means schema-safe only, not correct.

## Status in ModernFlow AI: reference only, NOT integrated

No code in this repo calls Jev. There is no API key, no waitlist access, and no accuracy
evidence on our data. Nothing here is wired into `server/routers.ts` or any automation.

## Where it could earn its place (candidates, unvalidated)

| Candidate | Process | Why it fits | Gate before building |
| --- | --- | --- | --- |
| Classify outreach replies (interested / not now / unsubscribe / out-of-office) | `outreach-agent`, SOP 02 | High volume, cheap, fixed label set, `other` fallback | Label 100+ real replies; beat the current approach on them |
| Tag contact-form leads by trade and urgency before the GHL push | `contact.submit` | Small label set, message is short text | Must be additive and fail open: the GHL + notify paths must keep working if Jev is down |
| Triage inbox / Slack threads | `comms-agent`, SOP 08 | Routing by topic | Draft-only; never auto-send |

## Where it does NOT fit

- Writing emails, proposals, or ad copy (generation).
- Anything involving dates, counts, or revenue math (reporting).
- Anything treated as a security or compliance boundary: lead text is untrusted and can steer answers.

## Rules if someone builds on this

1. Lead/client text sent to a third-party API is PII leaving our tools. Check the provider's
   data terms first (CLAUDE.md PII rule) and prefer synthetic fixtures for tests.
2. Keep Jev advisory. A classification may label or route to a human; it must not send
   messages, delete CRM records, or book anything on its own.
3. Validate responses and treat failures as failures, not as a default label.
4. Benchmark against a boring baseline (keyword rules, or a small LLM already available)
   on labelled data from this business. Independent numbers in Section 14 of the reference
   show Jev below a supervised encoder where labelled data exists.
5. Re-check access paths, pricing and model IDs at the source (reference Section 5 is a
   2026-09-20 snapshot).
