# Brand Static Ad Generator

A system inside Claude Code that generates production-ready static ads for any brand — from brand research to finished creatives — using ChatGPT Images 2.0 via the FAL API. Give it a brand name and a URL; get back a folder of 40+ on-brand ad images.

Based on the SCALE AI "Claude Code Static Ad Generator Playbook" for DTC brands and creative agencies.

## How it works — three phases

1. **Brand Research** — Claude reverse-engineers the brand's visual identity via web search (fonts, hex colors, packaging, photography style, Meta ads, positioning, competitors) and compiles a **Brand DNA** document, including a 50-75 word *Image Generation Prompt Modifier* that gets prepended to every ad prompt.
2. **Prompt Generation** — Claude fills a library of 40 proven static ad templates (headlines, us-vs-them, testimonial cards, UGC, review screenshots, stat callouts, manifestos, faux iPhone screenshots, and more) with brand-specific details, and writes them to `prompts.json` tagged with aspect ratio and whether they need product reference photos.
3. **Image Generation** — A Python script fires every prompt at ChatGPT Images 2.0 on FAL. Templates that show the real product use the `/edit` endpoint with your product photos attached so the model matches your actual packaging; lifestyle/UGC templates use text-to-image. Results download into organized folders with an HTML gallery.

## Where everything lives

| Piece | Path |
|---|---|
| Skill file (the brain — all phase instructions) | `.claude/skills/static-ad-generator/SKILL.md` |
| Template library (40 ad formats) | `.claude/skills/static-ad-generator/references/template-prompts.md` |
| Generation script (FAL API) | `.claude/skills/static-ad-generator/references/generate_ads.py` |
| Brand workspaces | `brands/{brand-name}/` (see `brands/README.md`) |

Because the skill lives in `.claude/skills/`, Claude Code auto-discovers it — in any session in this repo, just say **"generate ads for [brand] — [url]"** and the pipeline runs.

## Quick-start checklist

- [x] Project folder structure (`.claude/skills/`, `references/`, `brands/`)
- [x] Skill file with the Brand Research and Prompt Generation system prompts
- [x] Template library (40 templates — customize over time)
- [x] Python generation script
- [ ] Set your FAL API key in the shell you'll run the script from: `export FAL_KEY="your-key-here"` (get one at https://fal.ai/dashboard/keys — never commit it)
- [ ] `pip install requests`
- [ ] Create a brand folder and drop in 1-3 product images (`brands/{name}/product-images/`)
- [ ] Run Phase 1 (Brand Research) → Phase 2 (Prompt Generation) → Phase 3 (Image Generation)
- [ ] Review `brands/{name}/outputs/index.html` and pick winners for your ad account
- [ ] Iterate on templates based on what performs

## Running generation

```bash
# Everything
python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/{brand-name}

# Subset while iterating (cheaper + faster)
python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/{brand-name} --templates 1,7,13 --quality medium

# Multiple options per template
python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/{brand-name} --variations 3
```

## Cost and performance

ChatGPT Images 2.0 on FAL is token-metered: a typical high-quality ad lands around **$0.15-$0.25**; a full 40-template run at high quality is roughly **$6-$10** and takes ~40-80 minutes serially — kick it off and walk away. Use `--quality medium` when dialing in templates; `low` only for throwaway tests (text rendering and product detail degrade).

## Extending the system

- **Customer review mining** — scrape real reviews (e.g. via Apify) before Phase 2 and inject actual customer language into the copy fields; quoted copy renders verbatim.
- **Batch brand processing** — loop the whole pipeline over a client list: create folder → Phase 1-2-3 → next brand.
- **Copy refinement loop** — after reviewing outputs, feed the winners back to Claude with notes, regenerate prompts, re-run Phase 3.
- **Template versioning** — the template library is the long-term competitive asset. Every winning Meta ad format you spot becomes a new template.
