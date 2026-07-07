# Stage 3 — Soul Characters

One consistent AI persona per vertical, defined once, reused across every campaign for clients in that vertical. This replaces the casting call and is the single biggest cost/consistency lever in the system.

**Trade-off, stated plainly:** one face limits demographic range. But in-feed, recognition converts better than novelty — a returning face builds parasocial familiarity across a client's whole ad account. Build *separate* Souls per vertical instead of stretching one across niches. Skincare Sarah cannot sell power tools, and neither can she sell HVAC tune-ups.

---

## Character definition template

```
Create a Soul Character for UGC videos:

Name: [name] ([vertical] persona)
Age: [age]
Look: [hair, makeup level, overall vibe]
Wardrobe: [2-3 consistent style anchors]
Setting: [default environment + lighting]
Expression range: [3 named expressions you'll actually direct]

Generate 3 reference angles: close-up selfie, mid-shot holding
product, side profile in action.
Save as "[name]_[vertical]_01" for reuse across all videos.
```

## ModernFlow starter roster

| Persona | Vertical | Definition |
|---------|----------|------------|
| **Sarah** | Skincare / beauty DTC | 26, brunette, natural makeup, cozy aesthetic. Neutral tones, oversized sweater. Bright bathroom, natural light, plants. Expressions: excited surprise, genuine concern, satisfied smile. |
| **Mike** | Home services (HVAC/plumbing/electrical) | 38, short beard, approachable homeowner (NOT a tradesman — the *customer*). Flannel or plain tee. Suburban kitchen/garage, daylight. Expressions: exasperated "not again", relieved, impressed. |
| **Jess** | Fitness / supplements | 29, athletic, hair tied back, minimal makeup. Leggings + tank. Home gym corner / kitchen counter with shaker. Expressions: mid-effort grit, skeptical eyebrow, post-workout glow. |
| **Dana** | Food & beverage / restaurants | 31, warm smile, casual-trendy. Denim jacket. Car front seat / kitchen table (where people actually film food takes). Expressions: first-bite reaction, "you have to try this" lean-in, contented nod. |

Add personas as verticals are signed; never fork an existing persona's look for a different vertical.

## Two ways to create the face

1. **Direct generation** — run the template above through your image model, generate the 3 reference angles, save with the naming convention.
2. **Composite method** — take two royalty-safe reference looks and prompt: *"Combine the appearances of these two people into a new, realistic person who does not resemble either source."* The output must be a **new synthetic person** — never a recognizable likeness of a real individual (see compliance doc: likeness/right-of-publicity risk).

## Consistency rules

- Reference images are the source of truth. Every video generation for that vertical passes the saved references (`sarah_skincare_01` etc.) as character input to Higgsfield.
- The persona's *setting* and *wardrobe anchors* stay fixed; only the product and script change. Feed-level recognition comes from the whole frame, not just the face.
- Version personas explicitly (`_01`, `_02`). If a client requests a look change, that's a new version — never silently drift.
- Keep a `characters/` registry per client workspace: persona name, version, reference asset IDs, which campaigns used it.
