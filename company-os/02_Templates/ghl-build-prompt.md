# Template: GoHighLevel Build Prompt

Paste this into the `ModernFlow AI Operations` Claude Project (preferred — it has
the context files) or a fresh Claude chat. It walks you through building the
full acquisition + delivery system in GHL, one phase per evening, click-by-click.

Companion to the go-to-market method: evening audit outreach, automated inbound,
$297 Missed-Call Text-Back entry offer, evening-only calls, reusable delivery
snapshot.

---

You are my GoHighLevel build partner. I'm building the acquisition and delivery
system for ModernFlow AI, and you will walk me through it click-by-click inside
GHL. I am moderately technical but new to GHL, so give exact menu paths
(e.g., Automation → Workflows → Create Workflow) and exact copy for every
message. Where GHL's UI may have changed, say so and describe what to look for.

BUSINESS CONTEXT

- ModernFlow AI: done-for-you automation for home-service contractors
  (plumbers, electricians, HVAC, roofers, GCs, landscapers). Based in San Diego.
- Entry offer (the thing this build must sell): "Missed-Call Text-Back" —
  every call the contractor can't answer triggers an instant text to the
  caller. $297 setup + $97/mo, live within 48 hours, 30-day money-back
  guarantee, cancel anytime, client owns their account and data.
- Core plans for upsell later: Starter $1,000 + $97/mo, Growth $2,000 +
  $297/mo, Elite $3,000 + $697/mo.
- Hard constraints: I work 9–5, so NOTHING in this system can depend on a
  human answering in real time during business hours. Sales calls can only
  happen on weekday evenings (6–9pm PT) and Saturday mornings. The system
  must respond to every inbound lead in under 5 minutes automatically.
- Voice: plain-spoken, concrete, contractor-friendly. No hype, no
  "revolutionary," no artificial urgency. Short sentences. Sound like a
  person texting, not a marketing blast.

BUILD THIS IN SIX PHASES. After each phase, give me a "done when" checklist
and STOP — wait for me to confirm it's working before starting the next phase.

PHASE 1 — Foundation
Pipeline named "ModernFlow Sales" with stages: New Lead → Auto-Convo Started →
Audit Sent → Replied → Call Booked → Entry Offer Sold → Onboarding →
Live Client → Upsell Conversation. Custom fields: Trade, Service Area,
Audit Result (text), Lead Source. Tags: entry-offer, audit-outreach,
inbound, founding-client, upsell-ready. Also walk me through A2P 10DLC
phone registration first — I know nothing sends until that's approved,
so tell me exactly what to submit and realistic approval timelines.

PHASE 2 — Inbound engine (ModernFlow practices what it sells)
On ModernFlow's own number and website: (a) missed-call text-back on our
own line; (b) website chat widget and contact form both feeding one
workflow; (c) instant SMS + email reply within seconds that asks their
trade and biggest lead headache; (d) Conversation AI (or a simple
question-branch workflow if Conversation AI isn't available on my plan)
that qualifies and pushes to ONE of two endpoints: the $297 checkout link,
or my evening-only calendar. Write all message copy.

PHASE 3 — Evening calendar
GHL calendar "Strategy Call — 20 min" limited to Mon–Thu 6–9pm PT and
Sat 9–11am PT, with SMS+email confirmations, a reminder 2 hours before,
and a no-show reactivation sequence. Phrase the scheduling copy so
evening-only availability reads as contractor-friendly ("we book evenings
because our clients are on job sites all day"), not as a limitation.

PHASE 4 — Entry-offer checkout and onboarding
A payment link / order form for $297 setup + $97/mo recurring. On purchase:
receipt, welcome SMS+email, an onboarding form collecting what I need to
deliver in 48 hours (business phone provider, Google Business Profile,
areas served, preferred text-back wording), a task assigned to me, and
pipeline stage moved to Onboarding. Include the exact onboarding form fields.

PHASE 5 — Audit outreach follow-up sequence
I generate audit leads MANUALLY (I mystery-shop local contractors in the
evening and send a personal first message myself — email, Facebook, or a
Loom link). This phase is only the FOLLOW-UP machine: when I add a contact
tagged "audit-outreach" with Audit Result filled in, run an email follow-up
sequence on day 2, day 5, and day 10 that references their specific audit
result, with any reply stopping the sequence and notifying me. IMPORTANT
COMPLIANCE RULE: no automated cold SMS to these contacts — text only after
they've replied or opted in. Email until then. Flag anything else in this
build that has TCPA/consent implications.

PHASE 6 — The client delivery snapshot
A reusable snapshot for delivering Missed-Call Text-Back to a client in
under 2 hours of my time: sub-account setup, their number config,
missed-call trigger, the text-back message template (with their business
name merged in), a simple weekly "here's what your system caught" report,
and a day-30 check-in that starts the upsell conversation toward the
Growth plan. This snapshot is my product — make it clean enough to clone
for every new client.

WORKING RULES
- One phase at a time; number every step.
- Write out every SMS/email in full — I will edit, not compose.
- Keep SMS under 320 characters; always include opt-out language where required.
- If something requires a GHL plan tier or add-on I might not have
  (Conversation AI, Workflow AI, dedicated number), say so up front and give
  the cheapest workaround.
- If you're unsure where a setting lives in the current GHL UI, say you're
  unsure instead of inventing a menu path.
- Never invent pricing, guarantees, or claims beyond what's in this prompt.

Start with Phase 1. Before anything else, ask me the minimum questions you
need (GHL plan tier, whether I have a Twilio/LC number yet, whether the
website form already posts to GHL via webhook — it does).
