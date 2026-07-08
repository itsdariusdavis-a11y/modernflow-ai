# Stage 4 — Production Workflow (Higgsfield MCP)

Generation is the *last* step, after the strategy doc is approved and the Soul Character exists. This ordering keeps credit spend and revisions near zero.

---

## MCP setup (once)

Claude Desktop / claude.ai: **Settings → Connectors → Add Custom Connector** → enter the Higgsfield MCP details → Connect → Authorize.

Verify with: *"Can you see the Higgsfield tools? List what you can generate."* If yes, Claude can generate images and video directly in the conversation.

In Claude Code, the same server is added via `claude mcp add`.

## Batch production loop (per monthly pack)

For each approved angle × hook variation:

```
Using Soul Character [persona_id] and the approved strategy doc:

Produce video [N] of [total]:
- Angle: [angle name from strategy doc]
- Hook: [HOOK A/B/C text]
- Shot list: [3 shots from the doc]
- Spec: 9:16, [15s cold / 30s retargeting], "shot on iPhone" look —
  handheld micro-shake, natural light, slightly imperfect framing
- Product: [reference image asset ID]
- Text overlays: inside safe zones only (avoid top and bottom 15%)

Generate the image keyframes first, show me, then animate the
approved keyframes into video.
```

**Keyframes-first is the cost control.** Reviewing still frames is free-ish; regenerating video is not. Only animate approved frames.

## Platform spec sheet

| Placement | Ratio | Max length | Notes |
|-----------|-------|-----------|-------|
| TikTok / Reels / Shorts (cold) | 9:16 | 15s | Hook lands in first 1.5s |
| TikTok / Reels (retargeting) | 9:16 | 30s | Can assume product familiarity |
| FB feed | 1:1 | 15s | Crop from 9:16 master or generate native |
| **Safe zones** | — | — | Top ~15% and bottom ~15% of 9:16 frame are eaten by platform UI. No text, no product reveal, no CTA there. |

## The "authentic" spec (what makes it read as UGC)

- Handheld micro-shake — a locked-off tripod look kills it
- Natural / practical lighting, slight overexposure OK
- Persona talks *to* the lens, casual energy, imperfect delivery
- Real-world settings (bathroom, car, kitchen), never seamless backgrounds
- Perfect is the failure mode: if it looks like an ad, it performs like an ad

## QC checklist (every video, before delivery)

- [ ] Hook visible/spoken within first 1.5 seconds
- [ ] Correct persona and persona version for this vertical
- [ ] No claims outside the approved-claims list
- [ ] Text overlays inside safe zones
- [ ] Correct ratio + length for the placement
- [ ] Product legible and correct (label, color, packaging generation artifacts are the #1 giveaway — check hands and text on packaging)
- [ ] AI-content disclosure handled per client policy (see doc 07)
- [ ] Named per convention: `[client]_[angle]_[hookA/B/C]_[cold/rtg]_[v1].mp4`

## Delivery

Deliver as an organized folder (Drive) + a one-page **launch sheet**: which videos map to which angle, suggested audience per angle, and what to watch in the first 72h (hook rate = 3-sec views / impressions, then CTR). The launch sheet is what separates "here are files" from "here is a system" — it's most of what justifies the retainer.
