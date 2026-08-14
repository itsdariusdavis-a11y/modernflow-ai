# MIKA'S ROADSIDE & TOWING — AI STUDIO WEBSITE BUILD PROMPT

> **How to use:** Open Google AI Studio → **Build**. Fill in the `INTAKE` block below
> (anything left blank gets a sensible default — the prompt tells the model what to do).
> Then paste everything below the horizontal rule as your first message. Build it in the
> six phases at the bottom; do **not** paste the whole thing and then ask for ten changes
> at once — one phase, preview, next phase.
>
> **Research basis:** competitive teardown of Guardian Fleet Services (the reference site
> Darius supplied) plus its 24 operating brands, Knoxville Towing & Recovery, and current
> towing local-SEO/conversion research. Findings are summarized in
> `## COMPETITIVE INTELLIGENCE` so the model designs *against* real competitors instead
> of guessing.

---

## THE PROMPT

You are my senior product designer, front-end engineer, and conversion copywriter,
building a complete marketing website for a towing and roadside assistance company.

Your single success metric is **phone calls from stranded motorists and signed fleet
accounts** — not visual novelty. Every decision gets judged against: *does this get a
panicked person with 12% battery to tap the call button in under five seconds?*

---

### INTAKE — I fill this in; use defaults where I left it blank

| # | Field | My answer |
|---|---|---|
| 1 | Legal / display business name | Mika's Roadside & Towing |
| 2 | Owner name + short origin story | |
| 3 | Primary phone (dispatch, 24/7) | |
| 4 | Secondary / office phone | |
| 5 | Email | |
| 6 | Physical address + storage/impound lot address | |
| 7 | Home city + metro | |
| 8 | Service radius (miles) and named towns/counties covered | |
| 9 | Years in business / year founded | |
| 10 | Fleet: how many trucks, what types (flatbed, wheel-lift, heavy wrecker, rotator) | |
| 11 | Do you do heavy-duty / commercial recovery, or light-duty only? | |
| 12 | Do you have an impound/storage lot? Vehicle-release hours + fees? | |
| 13 | USDOT # / MC # / state tow license # | |
| 14 | Insurance carrier + coverage limits worth advertising | |
| 15 | Motor club / insurance networks you're contracted with (AAA, Agero, Quest, Honk, Urgently) | |
| 16 | Google rating + review count | |
| 17 | Pricing you're willing to publish (hook fee, per-mile, after-hours) | |
| 18 | Real photos available? (trucks, crew, lot) yes/no | |
| 19 | Where leads should go (email, GoHighLevel webhook, SMS) | |
| 20 | Domain | |

**If a field is blank:** use a clearly-marked placeholder in the format
`{{PHONE}}`, `{{CITY}}`, `{{DOT_NUMBER}}` etc., collect every one of them into a single
`src/config/site.ts` file at the top of the codebase, and list them back to me at the end
so I can fill them in one place. **Never invent a phone number, license number, review
count, response time, years in business, or customer name.** Fabricated trust signals are
the one thing that will get this site rejected. If you need a number to make a layout
work, use a placeholder token, not a fake value.

---

### THE BUSINESS

Mika's Roadside & Towing is an owner-operated towing and roadside assistance company.
It sells four things, to three different buyers:

**Buyer 1 — the stranded motorist (70% of revenue, 95% of traffic).**
Broken down, locked out, dead battery, flat tire, out of gas, in a ditch, or just been
in a wreck. They are on a phone, often one-handed, often in the dark or in direct
sunlight, often upset, sometimes standing on a shoulder next to traffic. They found this
site from Google Maps or a search like "tow truck near me." They will spend **under 8
seconds** deciding whether to call or hit back. They do not read.

**Buyer 2 — the local business / fleet manager (high LTV, low volume).**
Property managers needing illegal-parking removal, auto shops and dealerships needing
vehicle transport, small delivery/contractor fleets needing a reliable after-hours
number. They *do* read. They want licensing, insurance, response-time commitments,
billing terms, and a real human contact.

**Buyer 3 — the insurance adjuster / motor club dispatcher.**
Wants credentials, coverage map, capabilities list, and a direct dispatch line.

**Services to present:**
- Emergency towing (light & medium duty — flatbed and wheel-lift)
- Accident recovery & winch-outs (ditch, mud, snow, off-road)
- Jump starts & battery service
- Flat tire change / spare install
- Lockout service
- Fuel delivery
- Long-distance & vehicle transport
- Motorcycle / EV / low-clearance & luxury transport (flatbed only)
- Private property / unauthorized vehicle removal (B2B)
- Junk & non-running vehicle removal
- *(Include heavy-duty recovery only if intake #11 says yes — do not advertise
  capability that doesn't exist.)*

---

### COMPETITIVE INTELLIGENCE — what I want you to beat

I researched the reference site (guardianfleetservice.com) and the broader category.
Here is what's actually true about this market. Design against it.

**What the big national player (Guardian Fleet Services) does well — match this:**
- Real credential stacking: association logos (TRAA, state towing associations, ATA,
  fire departments) in a trust band near the footer.
- Concrete capability specs, not adjectives — *"heavy-duty wreckers ranging from 25 to
  100 tons with rotating recovery cranes,"* *"GPS- and video camera-equipped."* Numbers
  beat "professional."
- A location finder with a radius selector.
- Named testimonials with city attribution, not anonymous blurbs.
- Deep footer with real service/resource links for SEO.

**Where it fails — exploit every one of these:**
1. **It is not built for an emergency.** The phone number sits in a thin utility bar in
   tiny type; the body content opens with paragraphs about fleet size. There is no
   large, unmissable call target above the fold. → *Mika's hero must be a call button
   first and a website second.*
2. **No ETA, no response-time commitment anywhere.** The single most important thing to
   a stranded person is "how long until someone gets here," and nobody in this category
   answers it. → *Own it.*
3. **Zero price transparency.** Every towing site hides pricing, which is exactly why
   people distrust tow companies. → *Publish an honest price range and explain how tow
   pricing actually works. This is the single biggest differentiator available.*
4. **Copy is corporate and vehicle-centric** ("The Solution for Your Towing & Heavy Haul
   Needs"). Nobody in a ditch identifies with that. → *Write to a person, not a fleet.*
5. **The testimonial carousel visibly loops the same 5 reviews three times.** Sloppy.
6. **Generic stock-ish imagery and a CMS-bloated build** (WordPress + Divi-class page
   builders on the sub-brands). → *Ship something fast and hand-built.*
7. **No "what do I do right now" content.** A stranded person has 15 minutes to kill and
   real safety questions. Nobody serves them. → *Free SEO and trust, sitting on the
   table.*

**What the best small operator in the category (Knoxville Towing & Recovery) proves works
— steal the mechanic, not the look:**
- Empathy-first hero written *from inside the problem*: "Stranded with your truck? On a
  two-lane highway, in a ditch, in a storm, in the middle of nowhere."
- Owner-operator credibility as the differentiator ("we're veteran drivers ourselves").
- A hard three-stat band: **60+ combined years · 24/7 · 150-mile radius.**
- A persistent floating click-to-call button.

**Category research findings to bake in as requirements:**
- Most towing traffic is mobile and arrives from Google Maps — speed, tap-to-call, and
  credibility beat long-form content.
- Burying the phone number or loading slowly leaks a large share of traffic; sites built
  properly for this vertical convert meaningfully better than generic templates.
- The Google local 3-pack captures the plurality of local clicks, and review signals are
  a significant local ranking factor → the site must feed and reinforce the Google
  Business Profile (matching NAP, review surfacing, service + city pages).
- High-contrast color (amber/orange on near-black) is a *functional* choice here: it
  stays readable in direct sun and at night, which is when this site gets used.

---

### DESIGN DIRECTION

**Positioning in one line:** *the tow company that tells you the truth — what it costs,
how long it'll take, and who's driving.*

The name is "Mika's" — a person's name. So the brand is **not** faceless-industrial. It
is **heavy-duty equipment operated by people you'd trust with your car.** Steel and
safety-amber, warmed by real photography of real people. Think a well-run fire station,
not a corporate logistics deck.

**Color system** (define as CSS custom properties / Tailwind theme tokens, never
hard-coded hexes):

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0B0E11` | Page background (near-black graphite) |
| `--ink-raised` | `#151A20` | Cards, raised surfaces |
| `--ink-line` | `#232A33` | Hairline borders, dividers |
| `--amber` | `#FFB020` | Primary CTA, active states, the "beacon" |
| `--amber-hot` | `#FF8A00` | CTA hover / pressed, gradient partner |
| `--beacon` | `#FF3B30` | Emergency-only accent. Sparingly — max 2 uses per page |
| `--steel` | `#8A94A2` | Secondary text on dark |
| `--paper` | `#F6F7F8` | Light-section background |
| `--paper-ink` | `#11151A` | Text on light sections |
| `--go` | `#22C55E` | "Available now" / dispatch-live indicator only |

Dark is the default. Use one or two light (`--paper`) sections mid-page to break the
scroll and carry dense content (pricing table, FAQ) — a full dark page is fatiguing on a
phone in daylight. All text must clear **WCAG AA (4.5:1)**; run the numbers, don't
eyeball it. Amber on near-black is the workhorse pair.

**Typography** (Google Fonts only, preloaded, `font-display: swap`):
- Display / headings: **Archivo** 700–800, tight tracking (`-0.02em`), generous size —
  hero H1 at `clamp(2.5rem, 7vw, 4.5rem)`.
- Body: **Inter** 400/500, `1.0625rem` base on mobile, 1.6 line-height, max 68ch measure.
- Numerals, labels, stat blocks, ETA figures: **JetBrains Mono** 500, uppercase,
  `0.08em` tracking. Small mono labels above section headings (e.g. `// 24/7 DISPATCH`)
  give the whole site a dispatch-console feel. Use them consistently.

**Texture and motion:**
- Hairline 1px borders in `--ink-line`, generous corner radius `12px` on cards, `999px`
  on pills, `8px` on buttons (buttons should feel solid, not soft).
- One subtle diagonal amber caution-stripe motif (45°, low opacity, 4px stripes) as a
  section divider or behind the emergency band. Once or twice — it's seasoning, not the
  meal.
- Motion: fade-and-rise on scroll, `16px` travel, `240ms`, `cubic-bezier(0.16,1,0.3,1)`,
  staggered `40ms`. Nothing bounces. Nothing parallaxes. **Respect
  `prefers-reduced-motion` and disable all of it.**
- Hero background: a single dark, high-quality photo of a flatbed at dusk with amber
  strobes, under a `linear-gradient(to right, rgba(11,14,17,.94), rgba(11,14,17,.55))`
  scrim so the headline always passes contrast. **No hero video** — it costs LCP and
  mobile data, and our user has neither to spare.

**Imagery rules:**
- Prefer real photos of Mika's actual trucks and crew. Where intake #18 says none exist,
  use clearly-labeled placeholder `<img>` elements with descriptive `alt` text and a
  `data-photo-brief` attribute describing the shot to commission (e.g.
  `"flatbed loading a sedan at dusk, amber strobes on, operator in hi-vis"`), so the real
  photos drop in later without a redesign.
- Never use grinning-stock-photo people. This is a job site, not a brochure.
- Every image: explicit `width`/`height`, `loading="lazy"` below the fold,
  `fetchpriority="high"` on the hero only, modern format with fallback.

---

### THE CONVERSION SPINE — non-negotiable

These five mechanics matter more than every visual decision combined.

1. **The call button is never more than one thumb-reach away.**
   - Desktop: phone number in the header at ≥`1.25rem`, amber, `tel:` linked, with a
     `Call Now` button beside it.
   - Mobile: a **fixed bottom action bar** on every page, always visible, `72px` tall,
     safe-area-inset aware, split into two targets — a dominant amber
     **`CALL NOW — {{PHONE}}`** (75% width, `tel:` link) and a secondary
     **`Text Us`** (`sms:` link). Minimum 48×48px tap targets. The bar must never cover
     the last section — add matching bottom padding to `<main>`.
2. **Every phone link is instrumented.** Every `tel:` and `sms:` element fires a
   `trackCall(location)` event through a single `src/lib/analytics.ts` shim (console.log
   in dev; a documented `window.dataLayer.push` in prod) so we can see which section
   drives calls. Give each one a distinct location label: `header`, `hero`,
   `sticky_bar`, `service_card_lockout`, `footer`, etc.
3. **Two paths, always, side by side in the hero.** Emergency and non-emergency are
   completely different users:
   - Primary (amber, largest element on the page): **`CALL NOW — {{PHONE}}`** with
     `24/7 · Live dispatcher, not a call center` beneath it.
   - Secondary (ghost/outline): **`Request a Tow Online`** → opens the dispatch form.
4. **The dispatch form is 4 fields, not 9.** Name, phone, vehicle, and location — where
   "location" has a **`📍 Use my current location`** button that calls the browser
   Geolocation API, drops lat/long into a hidden field, and reverse-displays the
   coordinates as confirmation text. Optional: a "what happened" select (Won't start /
   Flat tire / Locked out / Accident / Out of gas / Other) and a photo upload. Submit
   button reads **`Send My Location to Dispatch`**, not "Submit." On success, show a
   confirmation panel with the phone number again and the line *"We got it. If this is
   urgent, call us — we answer 24/7."* Never leave a submitted user without a call
   option. Validate inline, never on submit-only, and never block submission on a
   malformed field the dispatcher could figure out anyway.
5. **The ETA promise is the hero's third element.** A live-feeling band:
   `AVERAGE ARRIVAL: {{ETA}} MINUTES IN {{CITY}}` with a small pulsing `--go` dot and
   `Dispatcher on duty now`. Pull the number from `site.ts`. If intake gives no real
   ETA, use the placeholder and tell me to measure it — but keep the component, because
   nobody else in this category has one.

---

### SITE MAP

```
/                          Home
/services                  Services overview
/services/emergency-towing
/services/roadside-assistance
/services/accident-recovery
/services/vehicle-transport
/services/private-property-towing     (B2B track)
/service-areas             Coverage map + index of all city pages
/service-areas/{city}      One page per named town/county from intake #8
/pricing                   Honest pricing + how tow pricing works
/about                     Mika, the crew, the fleet
/fleet                     Equipment list with real specs
/reviews                   Full reviews wall + link to Google profile
/resources/what-to-do-after-a-breakdown
/resources/what-to-do-after-an-accident
/vehicle-release           Impound/storage lot: hours, fees, documents needed
/commercial                Fleet, dealership, property manager track
/contact
```

Build **Home in full first.** Then build every other page against a shared layout,
shared components, and page-level content objects — I don't want fifteen bespoke pages,
I want one system with fifteen content configs.

---

### HOME PAGE — section by section

Write real copy. Placeholders are only for facts I have to supply (phone, city, license
numbers, ratings, ETA). Voice: **plain, direct, calm, competent.** Short sentences. No
"revolutionary," no "your trusted partner in," no exclamation points. Talk like the
person who is going to show up.

**1. Header (sticky, `backdrop-blur`, condenses on scroll)**
Logo lockup · nav (Services, Service Areas, Pricing, About, Contact) · phone in amber ·
`Call Now` button. Mobile: logo + a single amber phone icon button; hamburger opens a
full-screen sheet with the phone number pinned at its top.

**2. Hero**
- Mono eyebrow: `// 24/7 EMERGENCY TOWING · {{CITY}} & {{RADIUS}} MILES`
- H1: **`Stuck? We're already on the way.`**
- Sub: *"Flat tire on the shoulder. Won't start in a parking garage. Keys locked in the
  car at midnight. Call Mika's — a real dispatcher picks up, and a real truck rolls."*
- Dual CTA per the conversion spine.
- ETA band.
- Micro trust row directly under the buttons, mono, `--steel`:
  `LICENSED & INSURED · DOT {{DOT_NUMBER}} · {{RATING}}★ ({{REVIEW_COUNT}} Google reviews) · SINCE {{YEAR}}`

**3. Emergency triage grid — "What's going on?"**
Six large tap-targets, icon + label, each a `tel:` link with its own tracking label
(this is the single highest-converting section on a towing site — make the cards big):
`Won't Start` · `Flat Tire` · `Locked Out` · `Out of Gas` · `Accident` · `In a Ditch`.
Each card, on hover/focus, reveals one line of reassurance ("Jump start or battery swap
on the spot — most cars back running in 10 minutes").

**4. Stat band** (mono numerals, count-up on scroll, reduced-motion safe)
`{{YEARS}}+ years` · `24/7/365 dispatch` · `{{RADIUS}}-mile service area` ·
`{{TRUCKS}} trucks on the road`.

**5. Services grid**
Cards with a photo, a title, two lines of plain description, and a `Learn more →` link
plus an inline `Call` link. Do not use icon-only cards — photos of the actual work
convert better than line icons in the trades.

**6. "Why people call Mika's instead" — the differentiator block**
Four points, each with a hard proof element, not an adjective:
- **We tell you the price before we hook up.** Flat hook fee + per-mile, quoted on the
  phone. → links to /pricing
- **Flatbed-first.** AWD, low-clearance, EV, and anything you care about goes on a
  flatbed, not dragged on a wheel-lift.
- **A dispatcher answers, not an answering service.** Nights, weekends, holidays.
- **Licensed, insured, and local.** DOT `{{DOT_NUMBER}}`, `{{INSURANCE}}` coverage,
  based in `{{CITY}}` — not a national broker that subcontracts your car to a stranger.

**7. Transparent pricing teaser** (light `--paper` section — a deliberate break)
A real, honest 3-row table: Local Tow (hook + first 5 miles), Roadside Service (jump /
tire / lockout / fuel), Long-Distance (per mile). Show ranges. Add a short, honest note:
*"Final price depends on distance, vehicle weight, and whether recovery is needed —
we quote it on the phone before we dispatch, and it doesn't change when we arrive."*
CTA → /pricing.

**8. How it works — 4 steps**
`Call or tap ` → `Tell us where you are (or share your location)` → `We quote it and
dispatch` → `Truck arrives, you get a text with the driver's name`. Horizontal on
desktop with a connecting amber line, vertical timeline on mobile.

**9. Service area**
A styled map (static SVG or a lightweight embed — **no paid map SDK, no API key**) with
the covered towns listed as amber pills, each linking to its `/service-areas/{city}`
page. Headline: `Where we run.` Sub: `If you're not sure you're in range, call — we
usually are.`

**10. Reviews**
Real Google reviews only, with names, city, star rating, and date. Three-up on desktop,
swipeable on mobile. **Do not loop the same reviews to fill space** — if there are only
four, show four. Include the aggregate `{{RATING}}★ from {{REVIEW_COUNT}} reviews` with a
link out to the Google Business Profile.

**11. Commercial / fleet band** (dark, visually distinct, caution-stripe divider above)
`Fleet, dealership, or property manager?` — net terms, priority dispatch, one point of
contact, monthly invoicing, private-property removal compliance. CTA:
`Set up an account` → /commercial.

**12. Credentials & affiliations**
Grayscale logo row (state towing association, TRAA, motor clubs, chamber, BBB) that goes
full-color on hover. Only include logos I confirm in intake #15 — placeholders otherwise.

**13. FAQ accordion** (8–10 questions, real answers, `FAQPage` schema)
How much does a tow cost? · How fast can you get here? · Do you take insurance or AAA? ·
Can you tow an AWD / EV / lowered car? · Is my car safe overnight? · How do I get my car
out of the impound lot? · Do you tow motorcycles? · What if I'm not with the vehicle? ·
Do you tow in bad weather? · Can you tow to a shop of my choice?

**14. Final CTA band**
Full-bleed dusk photo, scrim, H2 `Still stuck?`, the phone number at display size as the
headline element, `Call Now` button. Then the footer.

**15. Footer**
NAP block (exactly matching the Google Business Profile — this is a local-SEO
requirement, not a nicety), hours (`Open 24 hours` × 7), phone, email, license numbers,
service links, city links, resource links, social, payment methods accepted, and
`© {{YEAR}} Mika's Roadside & Towing · Licensed & Insured · DOT {{DOT_NUMBER}}`.

---

### THE OTHER PAGES — briefs

- **Service pages:** hero with the service name + phone, "when you need this," what's
  included, what it costs, what to do while you wait, vehicles we handle, 3 relevant
  FAQs, related services, CTA band. ~600–900 words of genuinely useful copy each
  (this is what ranks).
- **City pages:** *not* spun duplicates. Each gets: local landmarks/highways we cover by
  name, typical response time to that town, a real local review if available, the
  services offered there, and a short paragraph written like a person who drives those
  roads. Same layout, distinct content. Build one excellent template + a content object
  per city, and flag any city where I haven't supplied unique content.
- **/pricing:** the trust page. A real table, an explanation of how towing is priced
  (hook fee, per-mile, after-hours, winching, storage/day), what makes a tow cost more,
  what we'll never charge for, and payment methods. Blunt honesty is the entire point.
- **/vehicle-release:** high-intent, low-competition. Lot address, release hours, exact
  documents required, fee schedule, and a calm tone — people arriving here are stressed
  and often angry. Make it the clearest page on the site.
- **/about:** Mika's story, the crew with real names and faces, the fleet, why the
  business exists. This page is the reason a name-brand beats a national broker.
- **/commercial:** written for Buyer 2 — response-time commitments, insurance
  certificates on request, net-30, dedicated line, compliance with local
  private-property towing statutes, and a longer inquiry form (company, fleet size,
  locations, contact).

---

### TECHNICAL SPEC

- **Stack:** React + TypeScript + Vite + Tailwind. Client-side routing. No backend
  required — the dispatch form POSTs to a single configurable endpoint defined in
  `site.ts` (`FORM_ENDPOINT`), with a clear `TODO` comment showing how to point it at a
  GoHighLevel inbound webhook. Log the payload to the console in dev so I can verify the
  shape.
- **Architecture:** one `src/config/site.ts` holding every business fact, phone number,
  service definition, city list, price row, FAQ, and review. Pages read from it. I must
  be able to change the phone number, add a city, or add a service in **one file**.
- **Components:** `Header`, `StickyCallBar`, `Hero`, `TriageGrid`, `StatBand`,
  `ServiceCard`, `PricingTable`, `HowItWorks`, `ServiceAreaMap`, `ReviewCard`,
  `FaqAccordion`, `CtaBand`, `DispatchForm`, `Footer`, `Seo`. Typed props, no `any`.
- **Performance budget — treat as acceptance criteria:** LCP < 2.0s on a throttled 4G
  mobile profile; total JS < 150KB gzipped; zero layout shift (CLS < 0.05); no
  render-blocking third-party scripts; fonts preloaded and subset. This site's users are
  on bad connections in bad places.
- **Accessibility:** semantic landmarks, one `<h1>` per page, visible amber focus rings
  (never `outline: none`), full keyboard operability, `aria-live` on form status,
  accordion built on real buttons with `aria-expanded`, all interactive targets ≥44px,
  and AA contrast throughout. Test the whole site with a keyboard before you call it
  done.
- **SEO:**
  - Unique title/meta per page, pattern:
    `24/7 Emergency Towing in {{CITY}} | Mika's Roadside & Towing`
  - JSON-LD: `AutomotiveBusiness` (with `@id`, `areaServed`, `geo`,
    `openingHoursSpecification` for 24/7, `aggregateRating`, `priceRange`, `sameAs` →
    Google Business Profile + socials), `Service` per service page, `FAQPage` on pages
    with FAQs, `BreadcrumbList` site-wide.
  - `sitemap.xml`, `robots.txt`, canonical tags, OG/Twitter cards with a branded image.
  - NAP in the footer must be byte-identical to the Google Business Profile.
  - Descriptive `alt` on every image; keyword-relevant but written for a human.
- **Responsive:** design mobile-first at 390px, then 768, 1024, 1440. Check 320px doesn't
  break. The mobile experience is the product; the desktop one is the brochure.
- **Code quality:** no dead code, no commented-out blocks, no lorem ipsum anywhere in
  the final output, no unused Tailwind config. Every placeholder token appears in
  `site.ts` and nowhere else.

---

### HARD RULES

1. **Never fabricate** a phone number, license number, review, customer name, rating,
   response time, certification, insurance limit, or years in business. Placeholder
   tokens only.
2. **No stock-photo people.** Real work photos or labeled placeholders with shot briefs.
3. **No hero video, no carousel autoplay, no parallax, no cursor effects, no AI-slop
   gradient blobs.** Restraint reads as competence in this category.
4. **No looping/duplicated testimonials to fill a carousel.**
5. **Do not bury the phone number.** If a section pushes the primary call target below
   the fold on a 390px screen, the section is wrong.
6. **Don't invent claims about response time or price.** Use the tokens.
7. **Ask me before adding any third-party dependency** beyond React/Vite/Tailwind and an
   icon set.

---

### BUILD ORDER — one phase at a time, then stop and show me

**Phase 1 — Foundation.** Project scaffold, Tailwind theme with the full token set,
fonts, `src/config/site.ts` with every field from intake stubbed and typed, `Header`,
`Footer`, `StickyCallBar`, `Seo` component, routing shell. Show me the theme tokens
rendered on a swatch page so I can approve the palette before you build on it.
*Done when:* I can navigate to every route and see a correct header/footer/sticky bar,
and every color and font is a token.

**Phase 2 — Home, above the fold.** Hero, ETA band, trust micro-row, triage grid,
sticky call bar wired to `trackCall`. *Done when:* on a 390px viewport, the call button
is the largest element on screen and every `tel:` link logs a distinct tracking label.

**Phase 3 — Home, the rest.** Stats, services grid, differentiators, pricing teaser, how
it works, service area, reviews, commercial band, credentials, FAQ, final CTA.
*Done when:* the whole home page is real copy, zero lorem, and Lighthouse mobile
performance ≥ 90.

**Phase 4 — Dispatch form.** Full `DispatchForm` with geolocation, inline validation,
success state, and the configurable endpoint. *Done when:* I can submit it and see a
correctly-shaped payload logged, and the success state still shows the phone number.

**Phase 5 — Interior pages.** All service pages, the city-page template + one filled
example, pricing, about, fleet, reviews, vehicle release, commercial, contact, and the
two resource articles. *Done when:* every route has unique titles, meta, and copy — and
you've told me which cities still need unique content from me.

**Phase 6 — Polish and ship.** Schema JSON-LD, sitemap, robots, OG images, a full
keyboard + contrast pass, reduced-motion pass, 320px check, and a final report.

**Your final report must include:** (a) every `{{PLACEHOLDER}}` token and what I need to
supply for it, (b) every photo brief to commission, (c) the Lighthouse mobile scores,
(d) anything you had to guess at, and (e) the three things you'd change next to increase
call volume.

Start with Phase 1. Confirm your understanding of the brand direction in three sentences
first, then build.
