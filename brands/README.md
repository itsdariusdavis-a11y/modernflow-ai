# Brands Workspace

Each brand you generate ads for gets its own folder here. This is the working directory for the **Static Ad Generator** pipeline (see `.claude/skills/static-ad-generator/SKILL.md`).

## Adding a new brand

1. Create the folder structure:

   ```bash
   mkdir -p brands/{brand-name}/product-images
   ```

2. Drop 1-3 product photos into `brands/{brand-name}/product-images/` — front of packaging, an angled shot, and a lifestyle shot if you have one. PNG, JPG, and WebP all work. These are the reference images ChatGPT Images 2.0 uses to anchor on your real product.

3. Tell Claude the brand name and URL, e.g.:

   > "Generate ads for Acme Wellness — https://acmewellness.com — product: Acme Daily Greens"

   Claude runs Phase 1 (Brand DNA research) → Phase 2 (prompt generation) → Phase 3 (image generation) automatically.

## What ends up in each brand folder

```
brands/{brand-name}/
├── product-images/     # You provide these (committed)
├── brand-dna.md        # Phase 1 output — the brand's visual identity (committed)
├── prompts.json        # Phase 2 output — 40 filled ad prompts (committed)
└── outputs/            # Phase 3 output — generated ad images + gallery (gitignored)
```

Generated images in `outputs/` are gitignored — they're cheap to regenerate and heavy to store. The Brand DNA and prompts are committed so any teammate (or future session) can re-run generation without redoing research.

## Prerequisites for Phase 3

```bash
pip install requests
export FAL_KEY="your-key-here"   # https://fal.ai/dashboard/keys — never commit this
```

## Useful commands

```bash
# Full run
python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/{brand-name}

# Test a subset first (cheaper)
python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/{brand-name} --templates 1,7,13 --quality medium

# More variations per template to pick winners from
python .claude/skills/static-ad-generator/references/generate_ads.py --brand brands/{brand-name} --variations 3
```

Open `brands/{brand-name}/outputs/index.html` in a browser to review everything in one gallery.
