# Launch Checklist — AI Agency Launch Kit

Total hands-on time: roughly one afternoon. After step 5 the product runs itself.

## 1. Build the packages (5 min)

```bash
cd products/agency-launch-kit
./build-packages.sh
```

Produces three zips in `dist/` (git-ignored). The script scrubs personal contact
details and fails loudly if sanitization misses anything. Spot-check one zip:
unzip it, skim `START-HERE.md` and one SOP.

## 2. Set up the support address (10 min)

Product files and license point buyers to **support@modernflowai.com**. Create it
as a free alias/route to the main inbox. Optional: an auto-responder with links
to the runbooks answers most questions with zero touch.

## 3. Create the Lemon Squeezy store (45–60 min, one time)

1. Sign up at lemonsqueezy.com → create store "ModernFlow AI".
2. Connect payout (bank), complete identity verification.
3. Create **three products**, one per tier. For each:
   - Paste title/subtitle/description from `content/SALES-COPY.md` (plus the FAQ block).
   - Pricing: single payment — $97 / $297 / $497.
   - Upload the matching zip from `dist/` as the delivered file.
   - Enable "generate license keys" OFF (not needed), receipts ON.
4. Set the store-wide refund policy to 14 days.
5. Copy each product's **checkout URL**.

Why Lemon Squeezy: 5% + 50¢ and it's the merchant of record — it files sales
tax/VAT so nothing recurring lands on you. (See `PRICING-AND-RESEARCH.md`.)

## 4. Wire the website (10 min)

In `client/src/pages/Toolkit.tsx`, replace the three placeholder values in
`CHECKOUT_URLS` with the live checkout URLs. Then run the standard gate and ship:

```bash
pnpm check && pnpm test && pnpm format
```

Deploy via the normal Netlify flow. The page is live at `modernflowai.com/toolkit`.

## 5. Verify the loop end-to-end (15 min)

- Buy the $97 tier yourself with Lemon Squeezy's test mode (or a real card +
  self-refund): checkout works → email arrives → zip downloads → files open.
- Check the receipt shows the right product name and support address.

**At this point the product is fully passive.** Everything below is optional
growth work.

## 6. Evergreen traffic (spread over the following weeks, all optional)

- [ ] Add a "Toolkit" link to the site's main nav/footer (one-line change).
- [ ] List Tier 2 on Gumroad too — 10% fee, but its Discover marketplace brings
      buyers you don't have to find. Reuse the same zip + copy.
- [ ] Post the "not a course — the actual files" angle in the n8n subreddit,
      r/GoHighLevel, and the GHL/automation Facebook groups (each allows
      self-promo threads; read the rules first).
- [ ] Publish one SEO page per niche later ("HVAC cold email automation
      template") linking to /toolkit.
- [ ] Add the kit link to email signatures and the agency's proposal footer —
      prospects who don't buy DFY sometimes buy DIY.

## 7. Maintenance loop (near zero)

- When an SOP or workflow in the repo improves: `./build-packages.sh`, re-upload
  the changed zip in Lemon Squeezy (existing buyers automatically get the new
  file on re-download).
- Watch the support inbox ~weekly. If the same question arrives twice, answer it
  in the relevant README and rebuild — that's the whole content treadmill.

## Rules that still apply (from CLAUDE.md)

- No fabricated stats in any listing or post — positioning is "the systems our
  agency actually runs on," which is true and stronger.
- Keep client PII out of the product; the build script's allowlist + final grep
  guard enforce this, so add new files to the script deliberately, never by glob.
