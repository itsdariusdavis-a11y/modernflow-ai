# Stage 1 — Client Onboarding Brief

Six questions. Send as a GHL form (ModernFlow already has the webhook pipeline) or a shared doc. Everything Claude needs to extract angles comes from these answers plus the client's reviews.

---

## The 6-question brief

1. **Product & price.** What exactly are we selling, and at what price point? (Link to product page / service page.)
2. **Customer.** Who buys this? Age range, gender skew, and the *moment* they're in when they buy (new problem, gift, replenishment, emergency call-out?)
3. **Reviews.** Paste your 10 best and 5 worst reviews (or links to review pages / GMB profile). Verbatim — don't summarize.
4. **Competitors.** Who are your 3 biggest competitors, and what do their ads promise?
5. **Claims.** What claims are you allowed to make? What claims are you NOT allowed to make (regulated categories, guarantees you won't honor)?
6. **Past creative.** What have you already run? What worked, what died? (Screenshots or ad-library links.)

## Intake processing prompt

Paste the completed brief into the client's Claude workspace:

```
Here is a completed onboarding brief for [CLIENT].

1. Summarize the customer in 2 sentences: who they are and the moment
   of purchase.
2. Extract every distinct pain point, desire, and objection from the
   reviews — verbatim phrases, grouped by theme. Customer language
   beats copywriter language; we will reuse these phrases in hooks.
3. List the claims we may use and the claims we must never use.
4. Flag anything missing from the brief that blocks angle research.

Output as a "Client Foundation Doc" I can pin to this workspace.
```

## Why reviews matter most

Reviews are the highest-leverage input in the whole system. The best hooks are customers' own words read back to them ("I almost didn't buy this because..."). Bad reviews are equally valuable — every recurring complaint about *competitors* is an angle for the client.

## Checklist before moving to Stage 2

- [ ] Foundation Doc generated and pinned to the client workspace
- [ ] Approved-claims list confirmed by the client in writing
- [ ] Brand kit collected (logo, colors, tone words, banned words)
- [ ] Ad account access or at least ad-library links for past creative
