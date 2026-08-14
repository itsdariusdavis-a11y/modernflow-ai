# MIKA'S ROADSIDE & TOWING — GHL AI STUDIO BUILD KIT

> **Platform:** GoHighLevel **AI Studio → New AI Builder** (Labs), or
> **Sites → Websites → Build with AI**. Use the **Build** path (free-form prompt), not
> **Assist** (guided fields) — we know exactly what we want.
>
> **This is not one prompt.** GHL's builder is conversational and takes ~2–3 minutes per
> generation cycle, so the winning pattern is: **do the prep inside GHL first → paste
> ONE master prompt → then run the numbered refinement prompts one at a time → then do
> the manual GHL steps the AI can't do.** Dumping 4,000 words into the first message
> makes GHL's builder drop requirements silently.
>
> **Research basis:** competitive teardown of Guardian Fleet Services (the reference site
> Darius supplied) and its 24 operating brands, Knoxville Towing & Recovery, current
> towing conversion/local-SEO research, and HighLevel's own Funnel & Website AI docs.

---

## STEP 0 — DO THIS IN GHL BEFORE YOU PROMPT

The AI builder wires into assets that already exist in the sub-account. Build these
first or it will invent placeholders you have to redo.

1. **Sub-account** for Mika's Roadside & Towing. Set **Business Profile** (name,
   address, phone, timezone) — the builder reads it.
2. **Brand colors** in Settings → Business Profile / brand: primary `#FFB020`,
   dark `#0B0E11`. Also state them in the prompt; belt and suspenders.
3. **Form: "Dispatch Request"** (Sites → Forms). Fields, in this order:
   - Full name *(required)*
   - Phone *(required)*
   - Vehicle year / make / model *(required)*
   - Where are you? Address, highway + mile marker, or nearest cross street *(required, long text)*
   - What's going on? *(dropdown: Won't start / Flat tire / Locked out / Out of gas / Accident / Stuck in ditch or mud / Need a tow to a shop / Other)*
   - Photo of the vehicle / location *(optional file upload)*
   
   Then **Integrate → Share → copy the Form ID.** You will paste that ID into the
   builder. Name-based lookup fails often in the current beta; the ID always works.
4. **Form: "Commercial Account Inquiry"** — company, contact, phone, email, fleet size,
   locations, service needed. Copy that Form ID too.
5. **Calendar: "Scheduled Tow / Transport"** (Calendars → new). For non-emergency work:
   vehicle transport, junk removal, shop-to-shop moves. The builder can attach this as a
   native pop-up booking widget.
6. **Workflow: "Website Lead — Instant Response"** — Form Submitted trigger → Create/
   Update Contact → tag `website-dispatch-request` → **instant SMS to the customer**
   ("Got it — dispatch is calling you in the next 2 minutes. If it's urgent, call
   {{PHONE}} now.") → **instant SMS + call notification to Mika**. A tow lead is worthless
   in 20 minutes. Build this before launch, not after.
7. **A2P 10DLC registration** submitted, if SMS is going out from this sub-account.

---

## THE INTAKE — fill this in before you prompt

Everything in `{{DOUBLE BRACES}}` below must be replaced with a real value or the AI will
invent one. **Never let it publish a fabricated phone number, license number, review
count, rating, response time, or years in business.**

| # | Field | Value |
|---|---|---|
| 1 | Owner name + one-line origin story | |
| 2 | 24/7 dispatch phone | |
| 3 | Office phone / email | |
| 4 | Physical address (must match Google Business Profile exactly) | |
| 5 | Impound / storage lot address + release hours | |
| 6 | Home city + metro | |
| 7 | Service radius (miles) + named towns/counties | |
| 8 | Year founded / years in business | |
| 9 | Fleet: how many trucks, what types | |
| 10 | Heavy-duty & commercial recovery — yes or no? | |
| 11 | USDOT # / MC # / state tow license # | |
| 12 | Insurance carrier + limits worth advertising | |
| 13 | Motor clubs / networks (AAA, Agero, Quest, Honk, Urgently) | |
| 14 | Google rating + review count | |
| 15 | Publishable pricing (hook fee, per-mile, after-hours, storage/day) | |
| 16 | Average arrival time in the home city | |
| 17 | Real photos of trucks/crew/lot? | |
| 18 | Dispatch Request **Form ID** | |
| 19 | Commercial Inquiry **Form ID** | |
| 20 | Domain | |

**Rule for missing values:** leave the `{{TOKEN}}` literally in the prompt and tell the
builder to render it as visible placeholder text. A visible `{{PHONE}}` on a staging page
is a bug you'll catch. A plausible-looking fake phone number is one you won't.

---

## COMPETITIVE INTELLIGENCE — the reasoning behind the spec

Read this so you can defend the design choices to Mika, and so you know what to reject
when GHL's AI hands back something generic.

**What Guardian Fleet Services (the reference site) does well — worth keeping:**
- Credential stacking: association logos (TRAA, state towing associations, ATA, local
  fire departments) in a trust band above the footer.
- Concrete capability specs instead of adjectives — *"heavy-duty wreckers ranging from 25
  to 100 tons with rotating recovery cranes," "GPS- and video camera-equipped."*
  Numbers beat "professional."
- Named testimonials with city attribution.
- A location finder with a radius selector.

**Where it fails — every one of these is an opening:**
1. **It is not built for an emergency.** The phone sits in a thin utility bar in small
   type; the page opens with paragraphs about fleet size. There is no large, unmissable
   call target above the fold.
2. **No ETA or response-time commitment anywhere.** The #1 question a stranded person
   has, unanswered across the entire category.
3. **Zero price transparency** — which is exactly why people distrust tow companies.
4. **Corporate, vehicle-centric copy** ("The Solution for Your Towing & Heavy Haul
   Needs"). Nobody in a ditch identifies with that.
5. **The testimonial carousel visibly loops the same 5 reviews three times.**
6. **WordPress/Divi bloat** across the sub-brands — slow on mobile.
7. **No "what do I do right now" content** for someone with 15 minutes to kill and real
   safety questions.

**What the best small operator in that network (Knoxville Towing & Recovery) proves:**
empathy-first hero written from inside the problem *("Stranded with your truck? On a
two-lane highway, in a ditch, in a storm, in the middle of nowhere")*, owner-operator
credibility as the differentiator, a hard three-stat band (60+ years · 24/7 · 150-mile
radius), and a persistent floating click-to-call button.

**Category research:** towing traffic is overwhelmingly mobile and arrives from Google
Maps — speed, tap-to-call, and credibility beat long-form content. Burying the phone or
loading slowly leaks a large share of traffic. The local 3-pack captures the plurality of
local clicks and review signals are a major ranking factor, so the site's NAP must match
the Google Business Profile byte-for-byte. Amber-on-near-black is a *functional* choice
here: it stays readable in direct sun and at night, which is exactly when this site gets
used.

> **On the "clone this URL" feature:** GHL AI Studio can import from a reference link.
> **Don't point it at Guardian's page.** You'd inherit its worst trait — the buried phone
> number. If you want to use link import, use it later and narrowly: *"take design
> inspiration from the credentials/association logo band on [URL], nothing else."*

---

## THE MASTER PROMPT — paste this as your first message in Build mode

Fill in every `{{TOKEN}}` first. Paste as one message. Expect 2–3 minutes.

---

Build a complete, multi-page website for **Mika's Roadside & Towing**, a 24/7 towing and
roadside assistance company in {{CITY}} serving a {{RADIUS}}-mile radius including
{{TOWN LIST}}.

**Who this site is for.** 70% of visitors are stranded motorists on a phone — broken
down, locked out, dead battery, flat tire, out of gas, in a wreck, or in a ditch. They
are often one-handed, in the dark or in direct sunlight, sometimes standing next to
traffic, and frequently low on battery. They found us on Google Maps and will decide in
under 8 seconds whether to call or hit back. **They do not read.** The rest are fleet
managers, property managers, auto shops, and insurance dispatchers who *do* read and want
licensing, insurance, and response commitments.

**The one job of this website is to get a phone call.** Design every decision around
that.

**Brand and visual direction.** Dark, industrial, high-contrast, and premium — a well-run
fire station, not a corporate logistics brochure. Primary background near-black graphite
`#0B0E11`, raised cards `#151A20`, hairline borders `#232A33`. Primary action color
safety amber `#FFB020` with `#FF8A00` for hover. Secondary text steel gray `#8A94A2`.
Use light sections in off-white `#F6F7F8` with near-black text for the pricing and FAQ
sections to break up the scroll. Headings in **Archivo** bold, tight letter spacing, very
large. Body in **Inter**. Use a monospace font (**JetBrains Mono**) uppercase with wide
letter spacing for small section labels, stat numbers, and the ETA figure — it should
feel like a dispatch console. Every text/background pair must pass WCAG AA contrast.
Sharp corners on buttons, rounded cards, thin amber accent lines. No gradients-as-
decoration, no glassmorphism, no rounded pastel look.

**Imagery.** Generate dark, realistic, photographic images of tow trucks at work — a
flatbed loading a sedan at dusk with amber strobes on, a wheel-lift on a highway
shoulder, an operator in hi-vis gear hooking up a vehicle, a winch-out from a muddy
ditch. No smiling stock-photo people. No cartoon or illustrated icons of trucks. Dark,
moody, real.

**Build these pages:**
Home · Services (overview) · Emergency Towing · Roadside Assistance · Accident Recovery ·
Vehicle Transport · Private Property Towing · Service Areas · Pricing · About · Reviews ·
Vehicle Release (impound lot) · Commercial & Fleet · Contact · Thank You.

**The Home page, in this exact section order:**

1. **Sticky header** — logo left; nav (Services, Service Areas, Pricing, About, Contact);
   the phone number `{{PHONE}}` on the right in large amber text as a click-to-call link;
   an amber **"Call Now"** button beside it. On mobile, collapse the nav but keep a large
   amber phone button always visible in the header.
2. **Hero** — full-width dark photo of a flatbed at dusk with a dark scrim so text stays
   readable. Small mono label above the headline: `24/7 EMERGENCY TOWING — {{CITY}} & {{RADIUS}} MILES`.
   Headline: **"Stuck? We're already on the way."** Subhead: *"Flat tire on the shoulder.
   Won't start in a parking garage. Keys locked in the car at midnight. Call Mika's — a
   real dispatcher picks up, and a real truck rolls."* Two buttons side by side: a large
   amber **"CALL NOW — {{PHONE}}"** click-to-call (this must be the single largest,
   highest-contrast element on the page) and a secondary outlined **"Request a Tow
   Online"** that scrolls to the dispatch form. Under the buttons, a thin bar reading
   `AVERAGE ARRIVAL: {{ETA}} MINUTES IN {{CITY}}` with a small green dot and
   "Dispatcher on duty now." Below that, one line of small mono text:
   `LICENSED & INSURED · DOT {{DOT_NUMBER}} · {{RATING}}★ ({{REVIEW_COUNT}} GOOGLE REVIEWS) · SINCE {{YEAR}}`.
3. **"What's going on?" triage grid** — six large tappable cards, each one a click-to-call
   link to `{{PHONE}}`: **Won't Start · Flat Tire · Locked Out · Out of Gas · Accident ·
   Stuck in a Ditch.** Each card has an icon, the label, and one short reassuring line
   (e.g. "Jump start or battery swap on the spot — most cars are running in 10 minutes").
   Make these cards big and thumb-friendly; this is the highest-converting section.
4. **Stat band** — four numbers in large mono type: `{{YEARS}}+ years` · `24/7/365 dispatch` ·
   `{{RADIUS}}-mile service area` · `{{TRUCKS}} trucks on the road`.
5. **Services grid** — photo cards for Emergency Towing, Roadside Assistance (jump
   starts, tire changes, lockouts, fuel delivery), Accident Recovery & Winch-Outs,
   Vehicle Transport & Long-Distance, Motorcycle/EV/Low-Clearance Flatbed Transport, and
   Private Property Towing. Each card: photo, title, two lines of plain description, a
   "Learn more" link, and a click-to-call link.
6. **"Why people call Mika's instead"** — four points, each with concrete proof, not
   adjectives: **(a) We tell you the price before we hook up** — flat hook fee plus
   per-mile, quoted on the phone, and it doesn't change when we arrive. **(b)
   Flatbed-first** — AWD, low-clearance, EV, and anything you care about goes on a
   flatbed, not dragged on a wheel-lift. **(c) A dispatcher answers, not an answering
   service** — nights, weekends, holidays. **(d) Licensed, insured, and local** — DOT
   {{DOT_NUMBER}}, based in {{CITY}}, not a national broker that subcontracts your car to
   a stranger.
7. **Transparent pricing teaser** — light background section. A simple 3-row table: Local
   Tow (hook fee + first 5 miles), Roadside Service (jump / tire / lockout / fuel),
   Long-Distance (per mile). Show honest ranges. Below it: *"Final price depends on
   distance, vehicle weight, and whether recovery is needed — we quote it on the phone
   before we dispatch, and it doesn't change when we arrive."* Button to the Pricing page.
8. **How it works** — four steps with a connecting amber line: **Call or tap** →
   **Tell us where you are** → **We quote it and dispatch** → **Truck arrives and you get
   a text with the driver's name.**
9. **Service area** — a map graphic with the covered towns listed as amber pills, each
   linking to its own service-area page. Headline: **"Where we run."** Subhead: *"If
   you're not sure you're in range, call — we usually are."*
10. **Dispatch request form** — headline **"Not an emergency? Send us the details."**
    Use my existing GoHighLevel form, Form ID `{{DISPATCH_FORM_ID}}`. Submit button text:
    **"Send My Location to Dispatch."** Directly beside the form, in large type, repeat
    the phone number with the line *"In a hurry? Just call — we answer 24/7."* The form
    must never be the only option on screen.
11. **Reviews** — real Google reviews with names, city, star rating, and date. Show the
    aggregate `{{RATING}}★ from {{REVIEW_COUNT}} reviews` with a link to our Google
    Business Profile. **Do not repeat or loop the same reviews to fill the layout — if
    there are only four, show four.**
12. **Commercial & fleet band** — visually distinct dark section: *"Fleet, dealership, or
    property manager?"* Net terms, priority dispatch, one point of contact, monthly
    invoicing, compliant private-property removal. Button: **"Set up an account."**
13. **Credentials** — a row of association and motor club logos in grayscale that go
    full-color on hover. Use placeholders labeled clearly; I'll supply the real logos.
14. **FAQ accordion** — How much does a tow cost? · How fast can you get here? · Do you
    take AAA or insurance? · Can you tow an AWD, EV, or lowered car? · Is my car safe
    overnight? · How do I get my car out of the impound lot? · Do you tow motorcycles? ·
    What if I'm not with the vehicle? · Do you tow in bad weather? · Can you tow to a shop
    I choose? Write real, specific, honest answers.
15. **Final CTA band** — full-width dark photo, headline **"Still stuck?"**, the phone
    number displayed at headline size as a click-to-call link, and an amber "Call Now"
    button.
16. **Footer** — business name, full address, 24/7 phone, email, "Open 24 hours" for all
    seven days, DOT and license numbers, links to every service page and every service-area
    page, resource links, social links, payment methods accepted, and
    `© {{YEAR}} Mika's Roadside & Towing · Licensed & Insured · DOT {{DOT_NUMBER}}`.

**Copy rules — apply to every page.** Write plain, direct, calm, competent copy. Short
sentences. Talk like the person who is going to show up. Never write "your trusted
partner in," "revolutionary," "state-of-the-art," or "we pride ourselves on." No
exclamation points. **Never invent a phone number, license number, review, customer name,
star rating, response time, insurance limit, certification, or number of years in
business.** Where you don't have a real value from me, output the placeholder token
exactly as written, in visible text, so I can find and replace it.

**Mobile is the product.** Design mobile-first. On every page, at every scroll position,
a large click-to-call button must be visible without scrolling. Every phone number
anywhere on the site is a `tel:` click-to-call link. Tap targets at least 48px.

Build the Home page first and show it to me before building the interior pages.

---

## REFINEMENT PROMPTS — run these one at a time, in order

GHL's builder handles one clear instruction far better than five. Take a screenshot of
the section you're talking about and attach it — the builder reads visual context well.

1. `Make the "CALL NOW" button in the hero significantly larger — it should be the biggest, highest-contrast element on the page on a mobile screen. Increase the phone number's font size inside it and add more vertical padding.`
2. `Verify every phone number on every page is a clickable tel: link, including the one in the header, the hero, all six triage cards, every service card, the final CTA band, and the footer.`
3. `The six triage cards ("Won't Start," "Flat Tire," etc.) are too small on mobile. Make them full-width stacked cards with at least 72px of height and larger icons.`
4. `Add the ETA bar under the hero buttons if it's missing: "AVERAGE ARRIVAL: {{ETA}} MINUTES IN {{CITY}}" in monospace uppercase, with a small pulsing green dot and the text "Dispatcher on duty now."`
5. `The dispatch form isn't submitting into my CRM. Here is the form ID: {{DISPATCH_FORM_ID}}. Use this specific GoHighLevel form for the dispatch request section.` *(Same for the commercial page with `{{COMMERCIAL_FORM_ID}}`.)*
6. `On the Vehicle Transport and Private Property Towing pages, add a "Schedule a pickup" button that opens my GoHighLevel calendar as a pop-up booking widget.` *(The builder will show you a calendar picker — select "Scheduled Tow / Transport.")*
7. `Now build the Pricing page. It's the most important trust page on the site. Include a real price table with ranges, a section explaining how tow pricing actually works (hook fee, per-mile rate, after-hours, winching charges, daily storage), a section on what makes a tow cost more, a short list of what we never charge for, and accepted payment methods. Blunt honesty is the entire point of this page — no hedging, no "call for pricing."`
8. `Now build the Vehicle Release page for our impound lot. Lot address, release hours, the exact documents someone needs to bring, the fee schedule, and what to do if they can't come in person. Write it in a calm, clear, non-defensive tone — people landing here are already stressed and often angry. This should be the clearest page on the site.`
9. `Now build the service-area pages, one per town: {{TOWN LIST}}. Each one must be genuinely different, not the same page with the town name swapped. For each, name the actual highways and landmarks we cover in that town, state the typical response time there, list the services we offer there, and write one paragraph in the voice of someone who actually drives those roads. Tell me which towns you didn't have enough detail for.`
10. `Now build the two resource articles: "What to do when your car breaks down on the highway" and "What to do after a car accident." Write them as genuinely useful safety checklists — hazards on, stay in the vehicle if you're on a shoulder, where to stand, what to photograph, what to tell the tow operator. Put a click-to-call button after the second section of each.`
11. `Review every page for made-up facts. List for me every place you used a specific number, rating, review, name, or claim, and tell me which ones came from my prompt and which ones you generated.`

---

## WHAT THE BUILDER WON'T DO — do these by hand in GHL

**1. The sticky mobile call bar.** The single highest-impact element on a towing site,
and GHL's AI won't produce it reliably. Add it yourself: **Funnel/Website Settings →
Custom CSS/JS → Footer Tracking Code** (or a Custom HTML element on the global footer
section). Replace the phone number in both places:

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
  <a class="mk-call" href="tel:{{PHONE}}">CALL NOW — {{PHONE_DISPLAY}}</a>
  <a class="mk-text" href="sms:{{PHONE}}">Text</a>
</div>
```

**2. SEO metadata + schema.** On every page: **Page Settings → SEO Meta Data**. Use
GHL's **"Create with AI"** for a first pass, then fix it. Title pattern:
`24/7 Emergency Towing in {{CITY}} | Mika's Roadside & Towing`. GHL can auto-generate
LocalBusiness schema from page content — run it on Home, every service page, and every
service-area page, then verify the NAP it produced **matches the Google Business Profile
byte-for-byte.** Mismatched NAP is a local-ranking own-goal.

**3. Google Business Profile alignment.** Primary category **Towing Service**; secondary
**Emergency Towing** and **Roadside Assistance**. Service areas = the same town list as
the site. Hours = open 24 hours, 7 days. The GBP does more for call volume than the
website does — the website's job is to confirm the choice the map already made.

**4. Call tracking.** Swap the displayed number for a GHL tracking number so calls attach
to contacts and show up in reporting. Do this *after* the site is approved, and keep the
real number in the GBP.

**5. Connect the workflow.** Confirm both forms trigger "Website Lead — Instant Response"
and that the SMS actually fires. Submit a real test from your own phone.

**6. Geolocation "share my location" button** *(optional, phase 2)*. Not something GHL's
AI will build. Add a Custom HTML/JS element beside the dispatch form with a button that
calls the browser Geolocation API and writes the coordinates into the location field.
Worth doing — it removes the hardest field on the form — but ship the site first.

---

## PRE-LAUNCH QA — check every one of these on an actual phone

- [ ] No `{{TOKEN}}` placeholders left visible on any page
- [ ] No fabricated phone numbers, license numbers, ratings, reviews, or years in business
- [ ] Call button visible without scrolling on every page at 390px width
- [ ] Every phone number is a working `tel:` link (tap each one)
- [ ] Sticky call bar shows on mobile, hidden on desktop, doesn't cover the footer
- [ ] Dispatch form submits → contact appears in CRM → instant SMS fires to both sides
- [ ] Calendar pop-up opens and a test booking lands on the calendar
- [ ] Footer NAP matches the Google Business Profile exactly
- [ ] Every page has a unique title and meta description
- [ ] Testimonials are real and not duplicated to fill space
- [ ] Site loads in under ~3 seconds on cellular, not wifi
- [ ] Pricing page is live and actually states numbers
- [ ] Test on a phone at ~10% battery in direct sunlight — that's the real use case
