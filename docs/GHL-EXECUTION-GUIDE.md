# GoHighLevel Execution Guide — Step by Step, With Prompts

How to execute every delivery task in GoHighLevel using its AI tools (Workflow AI,
Conversation AI / AI Employee, Content AI, Reviews AI). Written for evenings-after-9-5
execution. Follow the order — it's sequenced by revenue impact per `docs/ACTION-PLAN.md`.

> **The one habit that makes this work:** every prompt below goes into GHL's AI boxes
> (Workflow AI's "What do you want to automate?", Conversation AI's bot instructions),
> then you TEST with your own phone before showing a client. Never skip the test text.

---

## Part 1 — The standard client build (~2 evenings per client)

> This is the reusable build pattern for every new client, distilled from the
> workflow-spec docs in Google Drive (the `*-build.md` prompt format). Build it once
> in a template sub-account, snapshot it, and each client starts at 80% done.

### Evening 1 — workflows

1. **Open** the client's sub-account → Automation → Workflows.
2. **Write the workflow specs first, build second.** Draft one short spec doc per
   workflow (W1 lead confirmation, W2 nurture, W3 booking, W4 reminders, W5 service
   reminder + W5H due-date helper, W6 reactivation, W7 reviews) with: trigger, exact
   filters (which form/pipeline/stage — misfiltered triggers were the #1 defect found
   in past builds), steps, and message copy. The Drive `*-build.md` docs show
   the format; the reusable prompts in Part 2 below are the starting copy.
3. **Build each workflow:** + Create Workflow → paste the spec's prompt into the
   "What do you want to automate?" box → review what Workflow AI generates against
   the spec's checklist → Save (don't publish yet).
4. **Publish in dependency order:** helpers before consumers (a due-date helper
   publishes before the reminder workflow that reads its field).

### Evening 2 — QA + handoff

5. **Run a QA pass with Ask AI:** paste a QA prompt listing every workflow, its
   trigger, its filter, and its expected output, and ask for a GO/NO-GO check on
   misfiltered triggers, dead-end branches, and missing waits. Fix reds, rerun until GO.
6. **Live-fire test with your own phone:** submit each form, call the tracked number
   and hang up (missed-call text-back must fire), book a test appointment, mark a test
   opportunity Closed Won (review request must fire). Screenshot each firing.
7. **Record the walkthrough** (Loom or phone screen-record, 5–8 min): site → form fill
   → the instant text you received → pipeline view → review request.
8. **On the launch call:** Payments → Invoices → send any remaining balance. Then
   Payments → Subscriptions → the monthly starting that day, card on file. Do not
   leave the call without both.
9. **Snapshot it:** Agency view → Snapshots → save this build as the tier template so
   the next client starts at 80% done.

---

## Part 2 — Reusable Workflow AI prompts (every client, every tier)

Build these once in a **template sub-account**, then Agency view → Snapshots → create
per-tier snapshots. Every future client is then a clone + rename, not a rebuild.
Paste each prompt into Workflow AI's prompt box, review, test, publish.

### 2.1 Missed-call text-back (the flagship — every tier)

```
When an inbound call to the business number is missed or goes to voicemail,
wait 30 seconds, then send this SMS to the caller:

"Hey — this is {{business.name}}. Sorry we missed your call, we're probably
on a job. What do you need help with? Reply here and we'll get right back
to you, or book a time that works: {{booking_link}}"

Only send if the caller is not already an open conversation from the last
24 hours (no double-texting). Tag the contact "missed-call-captured".
Notify the account owner by push notification with the caller's number.
If the contact replies, stop this workflow and let Conversation AI take over.
```

Test: call the tracked number from your phone, hang up after 2 rings, confirm the SMS.

### 2.2 Speed-to-lead form responder (every tier)

```
When any website form is submitted, immediately:
1. Create/update the contact and tag "web-lead".
2. Send SMS: "Hi {{contact.first_name}}, got your request — this is
   {{business.name}}. Quick question so we can quote you right: what's the
   issue and what area are you in? Or grab a time here: {{booking_link}}"
3. Send a backup email with the same message.
4. Create an opportunity in the "Service Pipeline" in stage "New Lead".
5. If no reply after 1 hour, send one follow-up SMS: "Still want a hand with
   this today? We have room on the schedule."
6. Notify the owner via the mobile app.
```

### 2.3 Appointment confirmations + no-show rescue (Growth+)

```
When an appointment is booked on any calendar:
1. Instantly SMS: confirmation with date/time and "reply C to confirm".
2. 24 hours before: reminder SMS.
3. 1 hour before: reminder SMS with tech/owner name.
4. 5 minutes after start time, if appointment status is not "showed":
   SMS "Running late? No problem — reply here or rebook: {{booking_link}}"
5. If status becomes "no-show": wait 2 hours, send rebooking SMS, max 2 attempts
   over 3 days, then tag "no-show-cold".
```

### 2.4 Review request after job completion (Growth+)

```
When an opportunity in "Service Pipeline" moves to "Closed Won":
1. Wait 3 hours (same-day but not instant).
2. SMS: "Thanks for choosing {{business.name}}! Mind leaving us a quick
   review? It takes 30 seconds and helps a ton: {{review_link}}"
3. If no click after 3 days, one email follow-up with the same link.
4. Tag "review-requested". If a review comes in (Reviews trigger), tag
   "review-left" and stop.
```

### 2.5 Database reactivation (run quarterly — instant revenue for clients)

```
For every contact tagged "past-customer" with no activity in 6+ months,
send this SMS over a drip (50/day max, business hours only):

"Hi {{contact.first_name}} — {{business.name}} here. It's been a while since
your last {{service_type}}. We're booking [seasonal service] this month and
past customers get priority slots. Want us to pencil you in? Reply YES."

On reply YES: create opportunity, notify owner, hand off to Conversation AI
to book. On STOP: mark DND.
```

### 2.6 Next-service-due helper (any recurring trade)

```
When an opportunity moves to "Closed Won", read the service type field:
- oil change / minor service → set next_service_due_date to 6 months out
- [service B] → 12 months out
Then a second workflow: every day, find contacts whose next_service_due_date
is 14 days away, and send the service-reminder SMS with the booking link.
```

---

## Part 3 — Conversation AI / AI Employee (Elite tier + your own site)

Location: sub-account → Settings → Conversation AI (or AI Agents). Mode: start
**Suggestive**, switch to **Auto-pilot** after a week of good suggestions.

**Bot instruction prompt (template — fill the brackets from the client's onboarding form):**

```
You are the virtual assistant for [BUSINESS NAME], a [TRADE] company serving
[AREA]. Your ONLY goals, in order: (1) answer the customer's question briefly
and warmly, (2) collect name, phone, address/area, and what they need,
(3) book them into the calendar using the booking link.

Services and pricing you may quote: [LIST — ranges only, e.g. "drain clearing
from $99"]. For anything else say pricing depends on the job and offer to book
a free estimate.

Hours: [HOURS]. If asked for emergency service outside hours: [EMERGENCY POLICY].

Rules: Never invent prices, availability, or guarantees. Never diagnose complex
jobs by text — book them instead. If someone is angry or mentions a complaint,
apologize once, do not argue, and tell them [OWNER NAME] will call them
personally — then notify the owner. Keep replies under 3 sentences. Always end
with a question or the booking link.
```

Test: text the number 10 ways (price shopper, emergency, angry customer, vague
"you guys do roofs?", after-hours) before letting it near a client.

---

## Part 4 — Your OWN agency sub-account (dogfood everything)

Your live site (modernflowai.com, GHL-built) currently has **no booking CTA** — fix first.

1. Calendar: create "Strategy Call — 20 min" (or connect Calendly). Add the link as a
   button on the site header + hero + footer.
2. Install prompts 2.1 and 2.2 on your own number and site forms — your own
   missed-call text-back IS the sales demo ("watch what happens when I don't answer").
3. Pipeline "ModernFlow AI Sales": New Lead → Contacted → Audit Done → Call Booked →
   Call Held → Proposal → Closed Won / Closed Lost. Every outreach conversation gets a
   card. No card, no deal.
4. Missed Lead Audit workflow for prospects: save a Content AI/Ask AI prompt that turns
   your test results into the audit one-pager:

```
Write a one-page "Missed Lead Audit" for [BUSINESS], a [TRADE] in [CITY].
Findings: called [DATE/TIME] — [rang out / voicemail]; texted — [no reply
after X hours]; website form — [no response in X hours]; after-hours coverage
— [none]. Average [TRADE] job in [CITY] is worth $[X–Y]. At [N] missed
inquiries/week, estimate monthly lost revenue (show the math, use the
conservative end). End with the three fixes we install and one line: "We fix
this in 7 days, guaranteed." Keep it under 250 words, plain language, no hype.
```

5. Monthly numbers email (churn defense — non-negotiable per BUSINESS-PLAN.md): first
   Monday monthly, per client, 5 minutes: calls captured, leads responded <5 min,
   reviews gained. Send even when the numbers are modest. Clients cancel what they
   can't see.

---

## Part 5 — Payments checklist (where the money actually moves)

- Stripe is already connected and has processed live payments.
- Founding-offer closes: subscription product "Growth+ Founding — $497/mo" with a
  3-month minimum in the agreement; card on file **on the close call**, not after.
- Text-to-pay: send every invoice by SMS too — trades owners live in their texts.
