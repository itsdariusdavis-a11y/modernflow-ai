# Quality Failure Modes & Compliance

The failure modes are known and avoidable. The compliance items are non-negotiable — one ad-account ban or FTC problem costs more than a year of retainers.

---

## What kills performance

| Failure | Why it fails | Fix |
|---------|-------------|-----|
| **Corporate UGC** | Perfect lighting + steady cam reads as an ad → instant scroll | Handheld micro-shake, natural light, imperfect framing are features, not bugs |
| **One face, all niches** | Skincare Sarah selling power tools breaks believability for both brands | Separate Soul Character per vertical, no exceptions (doc 03) |
| **Ignoring safe zones** | TikTok/Reels UI covers top and bottom ~15% — text there is invisible | Safe-zone check is a hard QC gate (doc 04) |
| **Generating before strategy** | Random clips force the client to do the strategist's job → churn | Strategy doc approved before any generation (doc 02) |
| **Underpricing** | $300 attracts clients with no ad spend → no data, no case studies, infinite revisions | $1,500 floor, qualify on ad spend (doc 05) |
| **Skipping curation at volume** | AI output volume without judgment ships noise in 9:16 | Human pass on every angle doc and every batch |

## Compliance (adapted, not optional)

### 1. AI-generated content disclosure

- **Meta** requires disclosure of AI-generated/digitally-altered content in ads in a growing set of categories, and photorealistic AI people can trip automated policy review regardless. **TikTok** requires AI-generated content labeling.
- Default policy: **label AI-generated creative as AI-generated** using each platform's built-in disclosure toggle, and put the policy choice in the client contract so it's their informed call, documented.
- Never present a Soul Character as a *real customer giving a real testimonial*. UGC-*style* creative (a persona demonstrating/presenting the product) is fine; a fabricated testimonial with fabricated experience is an FTC problem (§255 endorsement rules) for the client and the agency.

### 2. Claims discipline

- Only claims from the client's approved list (doc 01, Q5). Health, financial, and before/after claims are the fastest route to ad-account bans.
- The system prompt enforces this (doc 00), but QC re-checks it — models drift.

### 3. Likeness and portfolio rules

- Soul Characters must be **new synthetic people**. Never generate a recognizable likeness of a real person (right-of-publicity liability), and never composite from images you don't have rights to use as references.
- **Portfolio spec work:** making sample videos for brands you don't work with is standard for pitching *that brand* ("here's what we'd make for you"). It is **not** OK to publish them publicly implying a client relationship, or to use a brand's trademarks in your own marketing. Label all spec work "Concept / spec work — not affiliated." The original playbook's "permission doesn't matter" is wrong — it matters exactly when the portfolio starts working.

### 4. Contract essentials

- Client owns delivered assets; agency retains right to reuse *non-branded* persona references (the Soul Character belongs to the vertical roster, not the client — state this explicitly)
- Disclosure policy (item 1) chosen and signed
- Approved-claims list attached as an exhibit
- Revision scope: one round per batch, changes to approved strategy doc are a new batch
