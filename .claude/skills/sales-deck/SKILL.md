---
name: sales-deck
description: Generate an on-brand ModernFlow AI sales/pitch deck in Gamma. Use when the user wants a pitch deck, sales deck, or proposal presentation for a prospect or niche. Args (optional): prospect/niche and the tier to anchor on. Produces a draft deck link for review.
---

# Sales deck

Create a skimmable, on-brand pitch deck. Fast path for `content-marketing-agent` /
`docs/sops/06-content-marketing.md`.

## Steps

1. **Get inputs:** target prospect or niche, and the tier to anchor on (default Growth).
2. **Outline** (default flow): Hook (the pain) → Cost of slow follow-up → The ModernFlow
   system (lead capture + speed-to-lead, booking, reviews) → How it works in 4 steps →
   Results/proof → Pricing tiers → Next step (book a call). Tailor the hook + examples
   to the niche.
3. **Apply the brand:** emerald→teal→cyan gradient on near-black, Outfit headings,
   DM Sans body, confident plain-spoken voice. Keep each slide to one idea.
4. **Generate in Gamma**, return the draft link plus the editable source.
5. Note any `[PLACEHOLDER]` items (real metrics/logos) the user must fill before sending.

## Guardrails

- Draft only — don't publish/share externally without approval.
- No invented testimonials, logos, or metrics; mark placeholders clearly.
- If a request fights the brand system, flag it and propose an on-brand alternative.
