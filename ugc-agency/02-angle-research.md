# Stage 2 — Angle Research

The step most AI-creative attempts skip, and the reason they fail. Random clips without an angle strategy make the client do the strategist's job. The angle doc *is* the deliverable the client can't produce themselves.

---

## Core insight: the counter-narrative

**The counter-narrative outperforms the consensus.** If every competitor in a niche says the same thing, that message is wallpaper — scrolled past on sight. The winning hook contradicts the category script:

- Every vitamin brand: "instant energy" → winner: *"I stopped taking it for a week. Then I realized why I actually need it."*
- Every HVAC company: "fast, reliable, family-owned" → winner: *"The reason your AC guy keeps coming back every summer (and why ours doesn't have to)."*
- Every skincare brand: "glow in 7 days" → winner: *"This did nothing for 3 weeks. Here's why I didn't return it."*

Claude finds these contradictions fast because it can hold the whole competitive message landscape in context at once.

## The research prompt

```
Client: [BRAND NAME]
Product: [PRODUCT NAME]
Target audience: [DEMOGRAPHIC + purchase moment]
Price point: [PRICE]
Pain points from reviews: [PASTE FROM FOUNDATION DOC]
Competitor promises: [FROM BRIEF Q4]

Task:
1. Identify the 3 strongest UGC angles competitors are already running
   (check Meta Ad Library / TikTok Creative Center patterns for this
   niche). For each: the promise, the emotion, why it works.
2. Identify the counter-narrative: what does everyone in this niche
   claim that customers' reviews suggest is wrong, oversold, or missing
   the real point? Write the contrarian angle.
3. Write 5 hook variations per angle using these formulas:
   - "I was today years old when..."
   - "Stop scrolling if..."
   - "POV: you finally found..."
   - "This $[price] [product] replaced my $[bigger number] [routine/service]"
   - "The way my [thing] changed after [timeframe] of [product]"
   Rewrite each formula in the customer language extracted from reviews —
   no generic filler.
4. Output a creative strategy doc: for each angle, a 3-shot shot list
   (hook shot, demo shot, payoff shot), the emotion targeted, and
   whether it's for cold traffic (≤15s) or retargeting (≤30s).
```

## Curation pass (human, non-negotiable)

Claude will produce more angles than you need. Kill:

- Angles that require claims not on the approved list
- Counter-narratives that insult the customer rather than the category
- Hooks that are clever but don't connect to the purchase moment from the brief
- Anything a competitor is *already* running as a counter-narrative (it's consensus now)

Keep 3 angles per monthly batch. 20 videos ÷ 3 angles ≈ 6–7 variations each — enough for a real A/B read on Meta.

## Output of this stage

A one-page **Creative Strategy Doc** per month: 3 angles, 5 hooks each, shot lists, cold/retargeting split. Client approves this doc *before* any generation happens. This approval step is what makes revisions cheap.
