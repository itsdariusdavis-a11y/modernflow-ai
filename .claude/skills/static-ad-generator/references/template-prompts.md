# Static Ad Template Library — ChatGPT Images 2.0

40 standardized static ad prompt templates. Each template is a complete image generation prompt with `[BRACKETED PLACEHOLDERS]` that Phase 2 fills in from the Brand DNA document.

Rules for filling templates:

- Prepend the brand's **Image Generation Prompt Modifier** (from `brand-dna.md`) to every prompt.
- All on-image copy must stay wrapped in double quotes ("...") — this is what makes ChatGPT Images 2.0 render text verbatim.
- Replace color placeholders with exact hex codes from the Brand DNA.
- `needs_product_images: true` templates must describe the real packaging so the edit endpoint can anchor on the reference photos.
- Aspect ratios: 1:1 (feed), 4:5 (feed, more real estate), 9:16 (stories/reels).

---

## Template 1 — headline

- aspect_ratio: 4:5 | needs_product_images: true

Bold direct-response static ad. Solid [PRIMARY COLOR HEX] background. Giant headline at top in [PRIMARY FONT STYLE], color [HEADLINE TEXT COLOR HEX]: "[PUNCHY 4-7 WORD HEADLINE]". Smaller subhead beneath: "[ONE-SENTENCE BENEFIT SUBHEAD]". Below the text, the actual [PRODUCT DESCRIPTION — exact packaging, colors, label placement] photographed straight-on at eye level, studio lighting, soft shadow grounding it. [BRAND NAME] logo small at bottom center. Clean, high-contrast, professional Meta ad aesthetic.

## Template 2 — offer-promotion

- aspect_ratio: 1:1 | needs_product_images: true

Promotional offer ad. Background in [SECONDARY COLOR HEX] with subtle texture. Top banner strip in [ACCENT COLOR HEX] with white text: "[LIMITED TIME OFFER LABEL]". Center: the actual [PRODUCT DESCRIPTION] at a slight 15-degree angle, crisp studio lighting. Large price treatment: "[OFFER — e.g. 25% OFF YOUR FIRST ORDER]" in bold [PRIMARY FONT STYLE]. Button-shaped CTA pill at bottom in [CTA COLOR HEX] reading "[CTA TEXT]". Energetic but on-brand, retail promotion feel.

## Template 3 — testimonial-card

- aspect_ratio: 1:1 | needs_product_images: false

Minimal testimonial card ad. Soft [BACKGROUND COLOR HEX] background. Large opening quotation mark in [ACCENT COLOR HEX]. Centered testimonial in elegant [PRIMARY FONT STYLE]: "[2-SENTENCE CUSTOMER TESTIMONIAL IN NATURAL CUSTOMER LANGUAGE]". Below: five gold stars, then "— [FIRST NAME L.], Verified Customer" in smaller type. Generous whitespace, editorial spacing, premium DTC feel. [BRAND NAME] wordmark small at bottom.

## Template 4 — us-vs-them

- aspect_ratio: 4:5 | needs_product_images: true

Two-column comparison ad. Left column header "[BRAND NAME]" on [PRIMARY COLOR HEX] panel; right column header "Other [CATEGORY] Brands" on desaturated gray panel. Left column shows the actual [PRODUCT DESCRIPTION] looking vibrant; right shows a generic unbranded competitor product looking dull. Below each, 4 checklist rows: left side green checkmarks with "[BENEFIT 1]", "[BENEFIT 2]", "[BENEFIT 3]", "[BENEFIT 4]"; right side red X marks with "[DRAWBACK 1]", "[DRAWBACK 2]", "[DRAWBACK 3]", "[DRAWBACK 4]". Clean table layout, legible sans-serif rows.

## Template 5 — before-after-ugc

- aspect_ratio: 4:5 | needs_product_images: false

Authentic UGC-style before-and-after split image shot on a phone camera. Left half labeled "Before" in casual white text with subtle drop shadow, showing [BEFORE STATE RELEVANT TO PRODUCT CATEGORY]. Right half labeled "After", showing [AFTER STATE — visibly improved]. Same person/setting both sides, natural indoor lighting, slightly imperfect framing for authenticity. Small caption strip at bottom: "[SHORT FIRST-PERSON RESULT CLAIM]". Realistic iPhone photo quality, not studio-polished.

## Template 6 — review-card

- aspect_ratio: 1:1 | needs_product_images: false

Faux e-commerce review screenshot ad. White card on [BACKGROUND COLOR HEX] background, rendered like a real product review UI: circular avatar placeholder, reviewer name "[FIRST NAME L.]", "Verified Buyer" badge in green, five filled gold stars, review title in bold: "[SHORT REVIEW TITLE]", review body: "[3-SENTENCE AUTHENTIC CUSTOMER REVIEW]", and a "Helpful (47)" link at bottom. Crisp UI rendering, realistic typography, subtle card shadow.

## Template 7 — stat-callout-radial

- aspect_ratio: 1:1 | needs_product_images: true

Product hero with radial stat callouts. The actual [PRODUCT DESCRIPTION] perfectly centered on [BACKGROUND COLOR HEX], studio lit with soft rim light. Four thin callout lines radiating from the product to small stat labels at compass points, each in [PRIMARY FONT STYLE]: "[STAT 1 — e.g. 20g protein]", "[STAT 2]", "[STAT 3]", "[STAT 4]". Numbers oversized in [ACCENT COLOR HEX], labels small beneath. Technical, infographic-clean, premium spacing.

## Template 8 — manifesto

- aspect_ratio: 4:5 | needs_product_images: false

Text-only brand manifesto ad. Full-bleed [PRIMARY COLOR HEX] background. Left-aligned manifesto set in [PRIMARY FONT STYLE], color [TEXT COLOR HEX], with strong line breaks like poetry: "[5-7 LINE MANIFESTO — short declarative lines about what the brand believes, why the category is broken, and what they made instead]". One key line highlighted in [ACCENT COLOR HEX]. [BRAND NAME] logo bottom-left. Confident editorial typography, zero imagery, ink-on-paper feel.

## Template 9 — press-editorial

- aspect_ratio: 4:5 | needs_product_images: true

Faux magazine editorial feature. Layout mimics a premium print magazine page: masthead-style publication header "[FICTIONAL-NEUTRAL EDITORIAL LABEL — e.g. THE EDIT]", large serif headline: "[EDITORIAL-STYLE HEADLINE ABOUT THE PRODUCT]", subhead deck in italic, and a hero photo region showing the actual [PRODUCT DESCRIPTION] styled on [EDITORIAL SURFACE/PROPS], moody directional lighting. Body copy columns of small greeked text. Sophisticated print typography, generous margins.

## Template 10 — imessage-screenshot

- aspect_ratio: 9:16 | needs_product_images: false

Faux iPhone iMessage conversation screenshot. Realistic iOS messages UI on white, contact name "[CASUAL CONTACT NAME — e.g. Jess 💕]" at top. Gray incoming bubble: "[FRIEND ASKING ABOUT THE PROBLEM]". Blue outgoing bubble: "[ENTHUSIASTIC RECOMMENDATION OF THE PRODUCT WITH SPECIFIC RESULT]". Gray reply: "[CURIOUS FOLLOW-UP]". Blue reply: "[WHERE TO GET IT + PUSH]". Authentic iOS font, status bar, message timestamps. Pixel-accurate UI.

## Template 11 — post-it-note

- aspect_ratio: 1:1 | needs_product_images: false

Handwritten post-it note ad. A single yellow sticky note photographed slightly angled on a [SURFACE — e.g. fridge door, laptop lid, bathroom mirror], natural light. Handwritten marker text in believable casual handwriting: "[SHORT PERSONAL REMINDER-STYLE MESSAGE ABOUT THE PRODUCT — e.g. reorder before you run out!!]" with a small underline or arrow doodle. Shallow depth of field, authentic domestic scene, lo-fi native-feeling ad.

## Template 12 — feature-callout

- aspect_ratio: 4:5 | needs_product_images: true

Annotated product breakdown. The actual [PRODUCT DESCRIPTION] large and centered on [BACKGROUND COLOR HEX], soft studio light. Five thin annotation lines pointing to specific parts of the packaging/product, each labeled in clean [PRIMARY FONT STYLE]: "[FEATURE 1]", "[FEATURE 2]", "[FEATURE 3]", "[FEATURE 4]", "[FEATURE 5]". Headline at top: "[WHAT MAKES IT DIFFERENT HEADLINE]". Technical diagram aesthetic with premium ad polish.

## Template 13 — negative-hook

- aspect_ratio: 4:5 | needs_product_images: true

Negative-hook bait-and-switch ad. Stark [DARK BACKGROUND HEX] background. Massive contrarian headline in bold [PRIMARY FONT STYLE]: "[NEGATIVE HOOK — e.g. Stop Buying [CATEGORY PRODUCT].]" Subhead in smaller type flips it: "[THE TWIST — until you've read the label / tried one that actually works]". The actual [PRODUCT DESCRIPTION] small at bottom right as the reveal, dramatic spotlight. High tension, editorial black-and-white feel with one [ACCENT COLOR HEX] element.

## Template 14 — ingredient-breakdown

- aspect_ratio: 4:5 | needs_product_images: true

"What's inside" ingredient transparency ad. The actual [PRODUCT DESCRIPTION] on the left third against [BACKGROUND COLOR HEX]. Right two-thirds: a vertical stack of 4 ingredient rows, each with a small photorealistic ingredient image ([INGREDIENT 1-4 — raw form]) plus name in bold and one-line benefit: "[INGREDIENT + BENEFIT LINES]". Headline top: "[TRANSPARENCY HEADLINE — e.g. Nothing to Hide]". Clean grid, apothecary-label typography.

## Template 15 — founder-note

- aspect_ratio: 4:5 | needs_product_images: false

Founder letter ad. Warm [BACKGROUND COLOR HEX] textured paper background. Typewriter-style or refined serif letter: header "A note from our founder", then 4-5 short sincere sentences: "[FOUNDER STORY — the frustration that started the brand, what they built, the promise to the customer]". Handwritten-style signature "[FOUNDER FIRST NAME]" at bottom in ink. Intimate, personal, direct-mail feel. [BRAND NAME] wordmark small at bottom.

## Template 16 — benefits-checklist

- aspect_ratio: 4:5 | needs_product_images: true

Checklist benefit ad. [PRIMARY COLOR HEX] background. Headline top in [PRIMARY FONT STYLE]: "[OUTCOME HEADLINE]". Below, 5 large checklist rows, each a rounded [ACCENT COLOR HEX] checkmark plus bold benefit line: "[BENEFIT 1]" through "[BENEFIT 5]". The actual [PRODUCT DESCRIPTION] anchored bottom-right at an angle, studio lit. Crisp iconography, generous line spacing, thumb-stopping contrast.

## Template 17 — problem-solution-split

- aspect_ratio: 1:1 | needs_product_images: true

Diagonal problem/solution split ad. Top-left triangle: desaturated, moody photo representing [THE PROBLEM STATE] with overlaid text "[PROBLEM LABEL]". Bottom-right triangle: bright [PRIMARY COLOR HEX] field with the actual [PRODUCT DESCRIPTION] crisply lit and text "[SOLUTION LABEL]". Clean diagonal divider with subtle shadow. Bold contrast between the two halves, single CTA pill at bottom: "[CTA TEXT]".

## Template 18 — macro-texture

- aspect_ratio: 1:1 | needs_product_images: true

Extreme macro product shot. Ultra close-up of [PRODUCT TEXTURE DETAIL — e.g. the product surface, formula texture, packaging material] filling the frame, shot on a 100mm macro lens, razor-thin depth of field, dramatic side lighting revealing texture. Small elegant caption bottom-left in [PRIMARY FONT STYLE]: "[SENSORY ONE-LINER]". [BRAND NAME] logo subtle top-right. Luxurious, tactile, appetite-appeal focused.

## Template 19 — flat-lay

- aspect_ratio: 1:1 | needs_product_images: true

Editorial flat-lay. Top-down shot of the actual [PRODUCT DESCRIPTION] centered on [SURFACE — e.g. linen, marble, terrazzo] surrounded by an artful arrangement of [4-6 CONTEXTUAL PROPS — ingredients, tools, lifestyle objects tied to the brand]. Soft natural window light from the left, gentle shadows. Colors graded to match [BRAND COLOR PALETTE]. Small headline top corner: "[SHORT LIFESTYLE HEADLINE]". Instagram-premium styling.

## Template 20 — unboxing

- aspect_ratio: 4:5 | needs_product_images: true

Unboxing moment ad. First-person POV: hands opening the actual [PRODUCT PACKAGING DESCRIPTION] on a [SURFACE], tissue paper and branded box details visible, the product being lifted out. Warm natural light, shallow depth of field, genuine anticipation energy. Caption text overlay in casual [PRIMARY FONT STYLE]: "[EXCITED FIRST-IMPRESSION LINE]". UGC-meets-editorial quality.

## Template 21 — social-proof-stack

- aspect_ratio: 4:5 | needs_product_images: false

Stacked social proof ad. [BACKGROUND COLOR HEX] background with three overlapping review cards at slight angles, each a white rounded card with five gold stars and a short quote: "[REVIEW SNIPPET 1]", "[REVIEW SNIPPET 2]", "[REVIEW SNIPPET 3]" with names "— [NAME 1]", "— [NAME 2]", "— [NAME 3]". Headline top: "[SOCIAL PROOF HEADLINE — e.g. 12,000+ Five-Star Reviews]". Subtle drop shadows, believable UI-card rendering.

## Template 22 — as-seen-in

- aspect_ratio: 1:1 | needs_product_images: true

Press credibility ad. The actual [PRODUCT DESCRIPTION] centered on clean [BACKGROUND COLOR HEX], premium studio lighting. Above it, headline: "[CREDIBILITY HEADLINE]". Below, a horizontal "AS SEEN IN" strip with 4 generic prestigious-looking editorial wordmarks in gray ([USE NEUTRAL FICTIONAL PUBLICATION NAMES — do not use real trademarked publication logos]). Balanced, trustworthy, premium composition.

## Template 23 — discount-code-card

- aspect_ratio: 1:1 | needs_product_images: true

Discount code coupon ad. Designed like a premium gift card / boarding pass on [BACKGROUND COLOR HEX]: dashed perforation line, large code in monospace type: "[CODE — e.g. WELCOME20]", label "[DISCOUNT DESCRIPTION — e.g. 20% off your first order]", small terms line. The actual [PRODUCT DESCRIPTION] peeking from the card's edge. Ticket/coupon skeuomorphism, crisp print-quality rendering, [ACCENT COLOR HEX] highlights.

## Template 24 — bundle-offer

- aspect_ratio: 1:1 | needs_product_images: true

Bundle value ad. Three of the actual [PRODUCT DESCRIPTION] arranged in a tight group on [BACKGROUND COLOR HEX], hero studio lighting. Bracket graphic grouping them with label: "[BUNDLE NAME — e.g. The Starter Trio]". Price anchor treatment: "[ORIGINAL PRICE]" struck through, "[BUNDLE PRICE]" large in [ACCENT COLOR HEX], plus badge "[SAVINGS CALLOUT — e.g. SAVE $18]". CTA pill bottom: "[CTA TEXT]". Retail-clean, value-forward.

## Template 25 — tweet-screenshot

- aspect_ratio: 1:1 | needs_product_images: false

Faux tweet screenshot ad. Realistic social post UI card centered on [BACKGROUND COLOR HEX]: circular avatar, display name "[CASUAL DISPLAY NAME]", handle "[@handle]", post text: "[FUNNY OR EMPHATIC ONE-LINER ABOUT THE PRODUCT THAT READS LIKE A REAL VIRAL POST]", engagement row showing high numbers (replies, reposts, likes). Pixel-accurate UI, authentic font rendering, subtle card shadow.

## Template 26 — notes-app

- aspect_ratio: 9:16 | needs_product_images: false

Faux iPhone Notes app screenshot. Realistic iOS Notes UI: title "[LISTICLE TITLE — e.g. things that actually fixed my (problem)]", then a bulleted list of 5 items in the iOS Notes font where item 3 is "[PRODUCT NAME + specific praise]" subtly bolder/starred, the rest are believable generic habits: "[ITEM 1]", "[ITEM 2]", "[ITEM 4]", "[ITEM 5]". Status bar, yellow accent, authentic spacing. Native-content feel.

## Template 27 — search-bar

- aspect_ratio: 1:1 | needs_product_images: false

Search suggestion ad. Clean white background with a realistic search-engine search bar UI centered, query typed: "[PROBLEM SEARCH QUERY — e.g. why am I always tired at 3pm]". Below, dropdown of 4 autocomplete suggestions, the last one highlighted in [ACCENT COLOR HEX]: "[BRAND NAME + SOLUTION SUGGESTION]". Minimal, clever, instantly readable. Small brand wordmark bottom corner.

## Template 28 — routine-steps

- aspect_ratio: 4:5 | needs_product_images: true

Daily routine ad. Horizontal 3-step timeline on [BACKGROUND COLOR HEX]: "Step 1", "Step 2", "Step 3" with a small photo circle each — steps showing [ROUTINE CONTEXT PHOTOS] and one step featuring the actual [PRODUCT DESCRIPTION]. Each step captioned: "[STEP 1 CAPTION]", "[STEP 2 CAPTION]", "[STEP 3 CAPTION]". Headline top: "[ROUTINE HEADLINE — e.g. Your New Morning, Simplified]". Friendly instructional design, numbered badges in [ACCENT COLOR HEX].

## Template 29 — in-hand-lifestyle

- aspect_ratio: 4:5 | needs_product_images: true

Lifestyle in-hand shot. A hand with natural skin texture holding the actual [PRODUCT DESCRIPTION] toward camera, [LIFESTYLE SETTING — e.g. sunlit kitchen, city street, gym] softly blurred behind, golden-hour light. Product label crisp and fully legible. Small text overlay bottom in [PRIMARY FONT STYLE]: "[CASUAL BENEFIT ONE-LINER]". Authentic yet polished, shot-on-mirrorless aesthetic.

## Template 30 — kitchen-counter-scene

- aspect_ratio: 4:5 | needs_product_images: true

Domestic still-life scene. The actual [PRODUCT DESCRIPTION] on a bright [KITCHEN/BATHROOM COUNTER DESCRIPTION] amid believable everyday context — [2-3 CONTEXT PROPS], morning window light, steam or freshness cues. Composition rule-of-thirds, product label facing camera. Headline in upper negative space: "[EVERYDAY RITUAL HEADLINE]". Warm, aspirational-but-attainable home aesthetic.

## Template 31 — on-the-go

- aspect_ratio: 4:5 | needs_product_images: true

Portability ad. The actual [PRODUCT DESCRIPTION] tucked into [BAG/POCKET CONTEXT — gym bag side pocket, backpack, jacket pocket] mid-motion, candid documentary framing, natural light. Text overlay: "[PORTABILITY HEADLINE — e.g. Fits Your Life, Literally]". Motion energy, real-world context, crisp product label despite candid style.

## Template 32 — myth-vs-fact

- aspect_ratio: 4:5 | needs_product_images: false

Myth vs fact educational ad. Two stacked cards on [BACKGROUND COLOR HEX]. Top card labeled "MYTH" in red with strikethrough styling: "[COMMON CATEGORY MISCONCEPTION]". Bottom card labeled "FACT" in [ACCENT COLOR HEX]: "[THE CORRECTING TRUTH THAT FAVORS THE PRODUCT'S APPROACH]". Clean editorial typography, authoritative but friendly tone, small "[BRAND NAME]" attribution bottom.

## Template 33 — three-reasons-why

- aspect_ratio: 4:5 | needs_product_images: true

Numbered listicle ad. Headline top: "3 Reasons People Switch to [BRAND NAME]". Three horizontal rows, each with an oversized number in [ACCENT COLOR HEX] and a bold reason plus one-line support: "[REASON 1 + SUPPORT]", "[REASON 2 + SUPPORT]", "[REASON 3 + SUPPORT]". The actual [PRODUCT DESCRIPTION] along the right edge, partially cropped, studio lit. Editorial-listicle rhythm, high scannability.

## Template 34 — star-rating-hero

- aspect_ratio: 1:1 | needs_product_images: true

Rating-led hero ad. The actual [PRODUCT DESCRIPTION] centered on [BACKGROUND COLOR HEX] with soft gradient vignette. Directly above it, a row of five large gold stars and "[RATING — e.g. 4.9/5]" in bold, with "from [REVIEW COUNT]+ reviews" beneath in smaller type. One-line quote under the product: "[SHORT PUNCHY REVIEW QUOTE]". Symmetrical, trust-forward, premium studio finish.

## Template 35 — guarantee-badge

- aspect_ratio: 1:1 | needs_product_images: true

Risk-reversal guarantee ad. The actual [PRODUCT DESCRIPTION] slightly right of center on [BACKGROUND COLOR HEX]. Large embossed seal/badge graphic left in [ACCENT COLOR HEX] reading "[GUARANTEE — e.g. 60-DAY MONEY-BACK GUARANTEE]" in circular text with a checkmark center. Headline top: "[CONFIDENCE HEADLINE — e.g. Love It or It's Free]". Trust-heavy composition, tactile badge detail, clean layout.

## Template 36 — seasonal-moment

- aspect_ratio: 4:5 | needs_product_images: true

Seasonal campaign ad. The actual [PRODUCT DESCRIPTION] styled in a [CURRENT/UPCOMING SEASON OR HOLIDAY] scene — [SEASONAL PROPS AND PALETTE] harmonized with [BRAND COLOR PALETTE], cinematic seasonal lighting. Headline in [PRIMARY FONT STYLE]: "[SEASONAL HEADLINE TYING PRODUCT TO THE MOMENT]". Optional corner badge: "[SEASONAL OFFER]". Warm, timely, scroll-stopping.

## Template 37 — meme-style

- aspect_ratio: 1:1 | needs_product_images: false

Meme-format ad. Classic top-text/bottom-text meme layout over a relatable stock-style photo of [RELATABLE EVERYDAY STRUGGLE SCENE tied to the product category]. Top text in bold white with black outline: "[SETUP LINE]". Bottom text: "[PUNCHLINE THAT NAME-DROPS THE PRODUCT OR BENEFIT]". Intentionally casual, slightly compressed look, native-social feel. Tiny [BRAND NAME] watermark corner.

## Template 38 — faq-card

- aspect_ratio: 1:1 | needs_product_images: false

FAQ objection-handling ad. Clean card UI on [BACKGROUND COLOR HEX] styled like an expandable FAQ: question row with bold text "[TOP PURCHASE OBJECTION AS A QUESTION — e.g. Does it actually work?]" and a "+" icon, expanded answer beneath in regular weight: "[REASSURING 2-SENTENCE ANSWER WITH A SPECIFIC PROOF POINT]". Two collapsed question rows below: "[FAQ 2]", "[FAQ 3]". Realistic web-UI rendering, calm and credible.

## Template 39 — comparison-table

- aspect_ratio: 4:5 | needs_product_images: true

Detailed comparison table ad. A clean 3-column table: feature column, "[BRAND NAME]" column headed by a small photo of the actual [PRODUCT DESCRIPTION] on [PRIMARY COLOR HEX], and "Brand X" column in gray. Five feature rows: "[FEATURE ROW 1-5]" with green checks in the brand column and red X or dash in the competitor column. Headline top: "[COMPARISON HEADLINE — e.g. See the Difference]". Precise table rendering, legible at feed size.

## Template 40 — story-cta

- aspect_ratio: 9:16 | needs_product_images: true

Full-screen story/reel static ad. Vertical composition: top third is a bold headline in [PRIMARY FONT STYLE] on [PRIMARY COLOR HEX]: "[VERTICAL HOOK HEADLINE]". Middle: the actual [PRODUCT DESCRIPTION] large, dramatic studio lighting with colored gel matching [ACCENT COLOR HEX]. Bottom third: benefit line "[ONE-LINE BENEFIT]", then a thumb-reachable CTA pill: "[CTA TEXT]" with a small upward arrow and "Shop Now" affordance. Designed for stories placement with safe margins top and bottom.
