# MIKA'S ROADSIDE & TOWING — GHL AI STUDIO MASTER PROMPT

**Platform:** GoHighLevel → **AI Studio → New AI Builder** (enable in Agency Settings →
Labs), or **Sites → Websites → Build with AI**. Choose the **Build** path, not Assist.

**Order of operations:** Part 1 (10 min of prep in GHL) → Part 2 (paste the master prompt,
one message) → Part 3 (fix whatever it missed) → Part 4 (the parts AI can't do).

---

# PART 1 — BUILD THESE IN GHL FIRST

The AI builder connects natively to assets that already exist in the sub-account. If they
don't exist yet, it invents placeholders you'll have to tear out.

1. **Sub-account** for Mika's Roadside & Towing. Fill in Business Profile — name,
   address, phone, timezone. The builder reads it.
2. **Form → "Dispatch Request"** (Sites → Forms):
   Full name · Phone · Vehicle year/make/model · *Where are you? Address, highway + mile
   marker, or nearest cross street* · What's going on? (dropdown: Won't start / Flat tire
   / Locked out / Out of gas / Accident / Stuck in ditch or mud / Need a tow to a shop /
   Other) · Photo upload (optional).
   → **Integrate → Share → copy the Form ID.** Name-based lookup fails in the current
   beta. The ID always works.
3. **Form → "Commercial Account Inquiry"**: company · contact · phone · email · fleet
   size · locations · service needed. Copy that Form ID too.
4. **Calendar → "Scheduled Tow / Transport"** — for non-emergency work (vehicle
   transport, junk removal, shop-to-shop moves). The builder attaches this as a native
   pop-up booking widget.
5. **Workflow → "Website Lead — Instant Response"**: Form Submitted → Create/Update
   Contact → tag `website-dispatch-request` → **instant SMS to customer** ("Got it —
   dispatch is calling you within 2 minutes. If it's urgent, call {{PHONE}} now.") →
   **instant SMS + call to Mika.** A tow lead is worthless in 20 minutes.
6. **A2P 10DLC** registration submitted if SMS goes out from this sub-account.

**Fill in every `{{TOKEN}}` in the prompt before pasting.** Any token you can't fill,
leave literally in place — the prompt instructs the builder to render it as visible text
so you catch it. A visible `{{PHONE}}` is a bug you'll find. A plausible fake phone
number is one you won't.

**Tokens you must supply:** `{{PHONE}}` `{{CITY}}` `{{RADIUS}}` `{{TOWN_LIST}}`
`{{ETA}}` `{{YEARS}}` `{{YEAR_FOUNDED}}` `{{TRUCKS}}` `{{DOT_NUMBER}}` `{{RATING}}`
`{{REVIEW_COUNT}}` `{{ADDRESS}}` `{{LOT_ADDRESS}}` `{{HOOK_FEE}}` `{{PER_MILE}}`
`{{DISPATCH_FORM_ID}}` `{{COMMERCIAL_FORM_ID}}`

---

# PART 2 — THE MASTER PROMPT

> Paste everything between the rules as **one message** in Build mode. Expect 3–5 minutes.
> Multi-page generation from a single detailed prompt is what this builder is best at —
> the more completely you describe the page structure upfront, the cleaner the build.

---

Build a complete multi-page website for **Mika's Roadside & Towing**, a 24/7 towing and
roadside assistance company based in {{CITY}}, serving a {{RADIUS}}-mile radius including
{{TOWN_LIST}}.

## Who this site is for

**70% of visitors are stranded motorists on a phone.** Broken down, locked out, dead
battery, flat tire, out of gas, in a wreck, or in a ditch. They are often one-handed, in
the dark or in direct sunlight, sometimes standing next to moving traffic, and frequently
low on battery. They found us on Google Maps and will decide in under 8 seconds whether
to call or hit back. **They do not read.**

The remaining 30% are fleet managers, property managers, auto shops, dealerships, and
insurance dispatchers. They *do* read, and they want licensing, insurance, response
commitments, and billing terms.

**The one job of this website is to produce a phone call.** Judge every design decision
against that.

## Brand and visual direction

Dark, industrial, high-contrast, and genuinely premium — a well-run fire station, not a
corporate logistics brochure. The name is a person's name, so it should feel like
heavy-duty equipment operated by people you'd trust with your car.

- Page background near-black graphite **#0B0E11**; raised cards **#151A20**; hairline
  borders **#232A33**.
- Primary action color safety amber **#FFB020**, hover **#FF8A00**. Secondary text steel
  gray **#8A94A2**.
- Two or three sections use an off-white **#F6F7F8** background with near-black text, to
  break up the scroll — specifically the pricing and FAQ sections.
- Headings: **Archivo**, bold to extra-bold, tight letter spacing, very large.
- Body: **Inter**.
- Small section labels, stat numbers, and the ETA figure: **JetBrains Mono**, uppercase,
  wide letter spacing. This should feel like a dispatch console.
- Every text/background pair must pass WCAG AA contrast. Amber on near-black is the
  workhorse pair — it stays readable in direct sunlight and at night, which is exactly
  when this site gets used.
- Squared-off buttons, softly rounded cards, thin amber accent rules. **No** decorative
  gradients, no glassmorphism, no pastel rounded startup look, no floating blobs.

**Imagery:** generate dark, realistic, photographic images of tow trucks actually
working — a flatbed loading a sedan at dusk with amber strobes lit, a wheel-lift on a
highway shoulder, an operator in hi-vis hooking up a vehicle at night, a winch-out from a
muddy ditch, a clean truck lineup at the yard. Moody, real, high contrast. **No** smiling
stock-photo people, **no** cartoon or illustrated trucks, **no** clip-art icons of tow
hooks.

## Universal rules — apply to every page

- **Mobile is the product; desktop is the brochure.** Design mobile-first. At every
  scroll position on every page, a large click-to-call button must be visible without
  scrolling.
- **Every phone number anywhere on the site is a clickable `tel:` link.** Header, hero,
  every service card, every triage tile, footer, everywhere.
- Tap targets at least 48px tall.
- **Copy voice:** plain, direct, calm, competent. Short sentences. Write like the person
  who is going to show up. Never use "your trusted partner in," "revolutionary,"
  "state-of-the-art," "we pride ourselves on," or "peace of mind." No exclamation points.
- **Never invent a phone number, license number, review, customer name, star rating,
  response time, insurance limit, certification, award, or number of years in business.**
  Where I have not given you a real value, output the `{{TOKEN}}` exactly as written, in
  visible text.
- Every page gets a unique title and meta description. Title pattern:
  `[Page Topic] in {{CITY}} | Mika's Roadside & Towing`.

## Sitewide header and footer

**Header (sticky):** logo left. Nav: Services, Service Areas, Pricing, About, Contact. On
the right, the phone number **{{PHONE}}** in large amber click-to-call text, plus an amber
**"Call Now"** button. On mobile, collapse the nav to a hamburger but keep a large amber
phone button permanently visible in the header bar.

**Footer:** business name · full address {{ADDRESS}} · 24/7 phone {{PHONE}} · email ·
"Open 24 hours" listed for all seven days · DOT {{DOT_NUMBER}} · links to every service
page · links to every service-area page · links to both resource articles · social links ·
accepted payment methods · `© {{YEAR_FOUNDED}}–present Mika's Roadside & Towing ·
Licensed & Insured · DOT {{DOT_NUMBER}}`.

---

# PAGE 1 — HOME

Build these sections in this exact order.

**1. Hero.** Full-width dark photograph of a flatbed at dusk, amber strobes on, with a
dark scrim over it so text stays fully readable.
- Mono label above headline: `24/7 EMERGENCY TOWING — {{CITY}} & {{RADIUS}} MILES`
- Headline: **"Stuck? We're already on the way."**
- Subhead: *"Flat tire on the shoulder. Won't start in a parking garage. Keys locked in
  the car at midnight. Call Mika's — a real dispatcher picks up, and a real truck rolls."*
- Two buttons side by side: a large amber **"CALL NOW — {{PHONE}}"** click-to-call, and a
  secondary outlined **"Request a Tow Online"** that scrolls to the dispatch form. The
  call button must be the single largest, highest-contrast element on the page.
- Directly beneath: a thin bar reading `AVERAGE ARRIVAL: {{ETA}} MINUTES IN {{CITY}}` in
  mono, with a small pulsing green dot and the words "Dispatcher on duty now."
- Below that, one line of small mono text:
  `LICENSED & INSURED · DOT {{DOT_NUMBER}} · {{RATING}}★ ({{REVIEW_COUNT}} GOOGLE REVIEWS) · SERVING {{CITY}} SINCE {{YEAR_FOUNDED}}`

**2. "What's going on?" triage grid.** Six large tappable cards, each one a click-to-call
link to {{PHONE}}. This is the highest-converting section on the page — make the cards
big, full-width stacked on mobile, at least 72px tall.

| Card | Line underneath |
|---|---|
| **Won't Start** | "Jump start or battery swap on the spot — most cars are running in 10 minutes." |
| **Flat Tire** | "We'll mount your spare, or tow you to the tire shop of your choice." |
| **Locked Out** | "No broken windows. No damage. We open it and you're on your way." |
| **Out of Gas** | "We bring enough fuel to get you to the next station." |
| **Accident** | "We handle the scene, the tow, and the paperwork with your insurer." |
| **Stuck in a Ditch** | "Mud, snow, soft shoulder, off the road — we winch it out." |

**3. Stat band.** Four numbers in large mono type across one row:
`{{YEARS}}+ years` · `24/7/365 dispatch` · `{{RADIUS}}-mile service area` ·
`{{TRUCKS}} trucks on the road`.

**4. Services grid.** Photo cards, each with a title, two lines of description, a "Learn
more" link, and an inline click-to-call link:
- **Emergency Towing** — "Flatbed and wheel-lift, 24 hours a day. Local or long-distance."
- **Roadside Assistance** — "Jump starts, tire changes, lockouts, and fuel delivery."
- **Accident Recovery & Winch-Outs** — "Off-road, ditch, mud, snow, and collision scenes."
- **Vehicle Transport** — "Shop-to-shop, dealership, auction, and long-haul moves."
- **Motorcycle, EV & Low-Clearance** — "Flatbed only, with soft straps and proper tie-downs."
- **Private Property Towing** — "Compliant unauthorized-vehicle removal for property managers."

**5. "Why people call Mika's instead."** Four points, each backed by something concrete:
- **We tell you the price before we hook up.** A flat hook fee plus a per-mile rate,
  quoted on the phone, and it doesn't change when we arrive.
- **Flatbed-first.** AWD, low-clearance, EV, and anything you care about goes on a
  flatbed — not dragged down the road on a wheel-lift.
- **A dispatcher answers, not an answering service.** Nights, weekends, holidays, 3am.
- **Licensed, insured, and local.** DOT {{DOT_NUMBER}}, based in {{CITY}} — not a
  national broker that subcontracts your car to whoever answers first.

**6. Transparent pricing teaser.** Light **#F6F7F8** background. A simple three-row table:
Local Tow (hook fee + first 5 miles) · Roadside Service (jump / tire / lockout / fuel) ·
Long-Distance (per mile). Show honest ranges. Underneath: *"Final price depends on
distance, vehicle weight, and whether recovery is needed — we quote it on the phone
before we dispatch, and it doesn't change when we arrive."* Button → Pricing page.

**7. How it works.** Four steps connected by a thin amber line:
**Call or tap** → **Tell us where you are** → **We quote it and dispatch** → **Truck
arrives, and you get a text with the driver's name.**

**8. Service area.** A map graphic with the covered towns listed as amber pills, each
linking to its own service-area page. Headline: **"Where we run."** Subhead: *"If you're
not sure you're in range, call — we usually are."*

**9. Dispatch request form.** Headline: **"Not an emergency? Send us the details."**
Use my existing GoHighLevel form, **Form ID `{{DISPATCH_FORM_ID}}`**. Submit button text:
**"Send My Location to Dispatch."** Beside the form, in large type, repeat the phone
number with: *"In a hurry? Just call — we answer 24/7."* The form must never be the only
option on screen.

**10. Reviews.** Real Google reviews with names, city, star rating, and date. Show the
aggregate `{{RATING}}★ from {{REVIEW_COUNT}} reviews` with a link to our Google Business
Profile. **Do not repeat or loop the same reviews to fill the layout — if there are only
four, show four.**

**11. Commercial & fleet band.** Visually distinct dark section. *"Fleet, dealership, or
property manager?"* — net terms, priority dispatch, one point of contact, monthly
invoicing, compliant private-property removal. Button: **"Set up an account."**

**12. Credentials.** A row of association and motor club logos in grayscale that go
full-color on hover. Use clearly-labeled placeholders; I'll supply the real logos.

**13. FAQ accordion.** Light background. Write real, specific, honest answers:
How much does a tow cost? · How fast can you get here? · Do you take AAA or work with my
insurance? · Can you tow an AWD, EV, or lowered car? · Is my car safe overnight? · How do
I get my car out of the impound lot? · Do you tow motorcycles? · What if I'm not with the
vehicle? · Do you tow in bad weather? · Can you tow to a shop I choose?

**14. Final CTA band.** Full-width dark photo. Headline **"Still stuck?"**, the phone
number displayed at headline size as a click-to-call link, and an amber "Call Now" button.

---

# PAGE 2 — SERVICES (overview)

Hero: **"Everything we do, 24 hours a day."** Sub: *"One number for a dead battery at 6am
and a rolled trailer at midnight."* Phone button in the hero. Then the full services grid
from the home page, expanded — each service gets a photo, a paragraph, a bulleted list of
what's included, and its own call button. End with the FAQ accordion and a CTA band.

# PAGES 3–7 — INDIVIDUAL SERVICE PAGES

**Emergency Towing · Roadside Assistance · Accident Recovery & Winch-Outs · Vehicle
Transport · Private Property Towing.**

Every one of these follows the same structure — 600–900 words of genuinely useful copy,
because this is what ranks:

1. Hero with the service name, one empathetic line written from inside the problem, and a
   large call button.
2. **"When you need this"** — three or four real scenarios, described concretely.
3. **"What's included"** — a specific list. Equipment, not adjectives.
4. **"What it costs"** — the honest range for this service, with a link to Pricing.
5. **"What to do while you wait"** — a short safety checklist. Hazards on, where to stand,
   stay in the vehicle if you're on a shoulder, what to have ready when the truck arrives.
6. **"Vehicles we handle"** — including the awkward ones: AWD, EV, lowered, oversized,
   motorcycles, no-key, no-wheels.
7. Three FAQs specific to this service.
8. Related services + a final CTA band.

For **Private Property Towing**, write to property managers instead of motorists: signage
compliance, authorization procedures, response times, documentation and photo records,
and how vehicle owners retrieve their car. Use the **Commercial Account Inquiry** form,
**Form ID `{{COMMERCIAL_FORM_ID}}`**, on this page.

For **Vehicle Transport**, add a **"Schedule a pickup"** button that opens my GoHighLevel
calendar as a pop-up booking widget.

# PAGE 8 — SERVICE AREAS

An index page with the coverage map and every town as a card. Then generate one dedicated
page per town in {{TOWN_LIST}}.

**These must be genuinely different pages, not the same page with the town name swapped.**
For each town: name the actual highways, exits, and landmarks we cover there; state the
typical response time to that town; list the services offered there; include a local
review if one exists; and write one paragraph in the voice of somebody who actually drives
those roads. **Tell me which towns you didn't have enough detail for** rather than padding
them with filler.

# PAGE 9 — PRICING

The most important trust page on the site. Nobody in this industry publishes pricing,
which is exactly why people distrust tow companies. Include:
- Hero: **"What a tow actually costs."** Sub: *"Most tow companies won't tell you. Here's
  our pricing."*
- A real price table with ranges: hook fee {{HOOK_FEE}}, per-mile {{PER_MILE}},
  after-hours, winch-out, daily storage.
- **"How tow pricing actually works"** — explain hook fee vs. per-mile vs. recovery time,
  in plain language.
- **"What makes a tow cost more"** — distance, vehicle weight, recovery difficulty,
  wheels locked or missing, off-road position.
- **"What we never charge for"** — be specific.
- Accepted payment methods, and whether we bill insurance directly.

No hedging, no "call for pricing." Blunt honesty is the entire point of this page.

# PAGE 10 — ABOUT

Mika's story, the crew with real names and faces, the fleet with real specs, and why this
business exists. This page is the reason a name-brand beats a national dispatch broker.
Photo-heavy. Use clearly-labeled photo placeholders where I need to supply real images.

# PAGE 11 — REVIEWS

Full reviews wall with the aggregate rating and a prominent link to the Google Business
Profile. Real reviews only, never duplicated to fill the grid.

# PAGE 12 — VEHICLE RELEASE

High-intent, low-competition, and nobody does it well. Lot address {{LOT_ADDRESS}},
release hours, the exact documents someone needs to bring, the fee schedule, what happens
if they can't come in person, and how to reach a human. Write it calm, clear, and
non-defensive — people landing here are already stressed and often angry. **This should be
the clearest page on the site.**

# PAGE 13 — COMMERCIAL & FLEET

Written for fleet managers, dealerships, auto shops, and property managers. Response-time
commitments, insurance certificates on request, net-30 billing, a dedicated dispatch line,
monthly invoicing, and compliance with local private-property towing statutes. Use the
Commercial Account Inquiry form, **Form ID `{{COMMERCIAL_FORM_ID}}`**.

# PAGE 14 — CONTACT

Phone at display size, email, address, map, hours (open 24 hours, 7 days), the dispatch
form, and the commercial inquiry form clearly separated with different headings.

# PAGES 15–16 — RESOURCES

**"What to do when your car breaks down on the highway"** and **"What to do after a car
accident."** Write these as genuinely useful safety checklists — hazards on, stay in the
vehicle if you're on a shoulder, where to stand if you get out, what to photograph, what
information to exchange, what to tell the tow operator. Put a click-to-call button after
the second section of each. These pages exist to be useful to somebody sitting in a car
with 15 minutes to kill, and to rank.

# PAGE 17 — THANK YOU

Confirmation after form submission. Restate the phone number at large size with *"We got
it. If this is urgent, call us — we answer 24/7."* Never leave a submitted user without a
call option.

---

Build the Home page first and show it to me before building the interior pages.

---

# PART 3 — FOLLOW-UP PROMPTS

Run these one at a time only if the first generation missed something. Screenshot the
section you're talking about and attach it — the builder reads visual context well.

1. `Make the "CALL NOW" button in the hero significantly larger. It should be the biggest, highest-contrast element on a mobile screen. Increase the phone number's font size inside the button and add more vertical padding.`
2. `Verify every phone number on every page is a clickable tel: link — header, hero, all six triage cards, every service card, the final CTA band, and the footer.`
3. `The dispatch form isn't submitting into my CRM. Here is the form ID: {{DISPATCH_FORM_ID}}. Use this specific GoHighLevel form for the dispatch request section.`
4. `On the Vehicle Transport page, add a "Schedule a pickup" button that opens my GoHighLevel calendar as a pop-up booking widget.`
5. `Review every page for made-up facts. List every place you used a specific number, rating, review, name, or claim, and tell me which came from my prompt and which you generated.`

---

# PART 4 — WHAT THE BUILDER WON'T DO

**1. The sticky mobile call bar.** Highest-impact element on a towing site, and GHL's AI
won't produce it reliably. Add it manually: **Funnel/Website Settings → Custom CSS/JS →
Footer Tracking Code**. Replace the number in both places.

```html
<style>
  #mika-callbar{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;gap:8px;
    padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:#0B0E11;
    border-top:1px solid #232A33;font-family:Inter,system-ui,sans-serif}
  #mika-callbar a{display:flex;align-items:center;justify-content:center;min-height:52px;
    border-radius:8px;text-decoration:none;font-weight:700;letter-spacing:.01em}
  #mika-callbar .mk-call{flex:3;background:#FFB020;color:#0B0E11;font-size:17px}
  #mika-callbar .mk-text{flex:1;background:transparent;color:#FFB020;border:1px solid #FFB020;font-size:15px}
  body{padding-bottom:84px}
  @media(min-width:768px){#mika-callbar{display:none}body{padding-bottom:0}}
</style>
<div id="mika-callbar">
  <a class="mk-call" href="tel:{{PHONE}}">CALL NOW — {{PHONE}}</a>
  <a class="mk-text" href="sms:{{PHONE}}">Text</a>
</div>
```

**2. SEO metadata + schema.** Page Settings → SEO Meta Data on every page. Use GHL's
**"Create with AI"** for a first pass, then fix it by hand. GHL can auto-generate
LocalBusiness schema from page content — run it on Home, every service page, and every
service-area page, then confirm the NAP it produced **matches the Google Business Profile
byte-for-byte.** Mismatched NAP is a local-ranking own-goal.

**3. Google Business Profile.** Primary category **Towing Service**; secondary **Emergency
Towing** and **Roadside Assistance**. Service areas = the same town list as the site.
Hours = open 24 hours, 7 days. The GBP drives more calls than the website does — the
website's job is to confirm the choice the map already made.

**4. Call tracking.** Swap the displayed number for a GHL tracking number after the site
is approved, so calls attach to contacts. Keep the real number on the GBP.

**5. Test the workflow.** Submit a real form from your own phone and confirm both SMS
messages fire.

**6. Geolocation "share my location" button** *(phase 2)*. A Custom HTML/JS element beside
the dispatch form that calls the browser Geolocation API and writes coordinates into the
location field. Removes the hardest field on the form — but ship the site first.

## Pre-launch QA — on an actual phone

- [ ] No `{{TOKEN}}` placeholders visible anywhere
- [ ] No fabricated phone numbers, license numbers, ratings, reviews, or years
- [ ] Call button visible without scrolling on every page at 390px
- [ ] Every phone number is a working `tel:` link — tap each one
- [ ] Sticky bar shows on mobile, hidden on desktop, doesn't cover the footer
- [ ] Dispatch form → contact in CRM → both SMS messages fire
- [ ] Calendar pop-up opens and a test booking lands
- [ ] Footer NAP matches the Google Business Profile exactly
- [ ] Every page has a unique title and meta description
- [ ] Reviews are real and not duplicated to fill space
- [ ] Loads in under ~3 seconds on cellular, not wifi
- [ ] Pricing page states actual numbers
- [ ] Open it on a phone at 10% battery in direct sunlight — that's the real use case

---

# APPENDIX — why it's built this way

Competitive teardown of **Guardian Fleet Services** (the reference site) and its 24
operating brands, **Knoxville Towing & Recovery**, and current towing conversion research.

**What Guardian does well — kept in this spec:** credential stacking with association
logos; concrete capability specs instead of adjectives (*"wreckers ranging from 25 to 100
tons with rotating recovery cranes," "GPS- and video camera-equipped"*); named testimonials
with city attribution; a coverage finder with a radius selector.

**Where it fails — every one of these is an opening:**

| Their gap | Our counter |
|---|---|
| Phone buried in a thin utility bar; page opens with paragraphs about fleet size | Call button is the largest element on the page |
| No ETA or response-time commitment anywhere in the category | The ETA bar under the hero |
| Zero price transparency — the reason people distrust tow companies | A full Pricing page with real numbers |
| Corporate, vehicle-centric copy ("The Solution for Your Towing & Heavy Haul Needs") | Written to a person in a ditch |
| Testimonial carousel visibly loops the same 5 reviews three times | Explicit "don't duplicate reviews" rule |
| WordPress/Divi bloat, slow on mobile | GHL-native, mobile-first |
| No "what do I do right now" content | Two resource articles + a wait-checklist on every service page |

**What Knoxville Towing & Recovery proves works:** empathy-first hero written from inside
the problem (*"Stranded with your truck? On a two-lane highway, in a ditch, in a storm, in
the middle of nowhere"*), owner-operator credibility as the differentiator, a hard
three-stat band, and a persistent floating click-to-call button.

**Category research:** towing traffic is overwhelmingly mobile and arrives from Google
Maps, so speed, tap-to-call, and credibility beat long-form content. Burying the phone or
loading slowly leaks a large share of traffic. The local 3-pack captures the plurality of
local clicks and review signals are a major ranking factor.

> **On GHL's "build from a reference URL" feature:** don't point it at Guardian's page.
> Its single worst trait is the buried phone number, and that's exactly what link-import
> carries over. If you use it at all, scope it narrowly — *"take design inspiration from
> the credentials logo band on [URL], nothing else."*
