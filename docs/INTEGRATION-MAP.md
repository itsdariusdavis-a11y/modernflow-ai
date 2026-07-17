# Integration Map — How Everything Connects (GHL First)

The single mental model: **GoHighLevel is the hub. Everything else either feeds it,
reads from it, or serves a job GHL can't do well.** If a task touches leads, clients,
messaging, booking, or money — it happens in or through GHL. Full delivery how-to:
`docs/GHL-EXECUTION-GUIDE.md`.

```
                        ┌────────────────────────────┐
   LEADS IN             │        GOHIGHLEVEL         │        MONEY OUT
                        │  (hub: CRM · pipelines ·   │
 Website form ────────► │   SMS/email · calendars ·  │ ──► Stripe (invoices,
 Missed calls ────────► │   workflows · Conv. AI ·   │      subscriptions,
 Chat widget ─────────► │   reviews · client sites)  │      card-on-file)
 Outreach replies ────► │                            │
 GBP / socials ───────► │  agency sub-account +      │ ──► Daily team emails
                        │  one sub-account per client│      (from darius@)
                        └──────────┬─────────────────┘
                                   │
        feeds / reads (support layer — only where GHL is weak)
                                   │
   Firecrawl (lead lists, audits)──┤   Fireflies (call transcripts → recap →
   Claude Code repo (this) ────────┤     follow-up drafts → GHL notes)
   Higgsfield/Pixa (ad creative,  ─┤   Gamma (decks/proposals for calls)
     client photos)                │   Gmail (DRAFTS for review → you send)
   n8n (later: outreach machine) ──┤   Netlify (the marketing site itself)
                                   │   Routines (directive · wins · review)
```

## The flows, end to end

**1. Prospect → client (the money path — all GHL)**
Firecrawl builds the lead list → you/Ryan touch them (calls/SMS) → every conversation
becomes a GHL opportunity card → Missed Lead Audit (Firecrawl scrape + GHL Ask AI
one-pager) → strategy call on the GHL/Calendly calendar → Fireflies records it →
`/meeting-recap` drafts the follow-up → close on the call → GHL invoice + subscription
(Stripe) → onboarding checklist → clone tier snapshot into their new sub-account.

**2. Client delivery (all GHL)**
Sub-account per client → workflows from the guide's prompts (missed-call text-back,
speed-to-lead, reminders, reviews, reactivation) → Conversation AI on their number →
monthly numbers email (calls captured / response time / reviews gained). GHL IS the
product you sell.

**3. Your own funnel (GHL + repo site)**
modernflowai.com (decision: point at this repo's site via Netlify; env vars
`VITE_CALENDLY_URL` + `VITE_CONTACT_EMAIL` set the booking identity) → contact form
posts into GHL via `GHL_WEBHOOK_URL` → same speed-to-lead workflows you sell → your
own missed-call text-back doubles as the live sales demo.

**4. Accountability loop (Routines + GHL email)**
6:30am directive (notification) + GHL-sent daily emails to Darius & Ryan from
darius@modernflowai.com → evenings execute → 8pm Routine logs wins + refreshes the
dashboard → Monday review scores the week → ACTION-PLAN checkboxes advance → the
next morning's directive updates. Details: `docs/DAILY-OPS-SYSTEM.md`.

## Where GHL is NOT the tool (and that's correct)

| Job                              | Tool                    | Why not GHL                                                           |
| -------------------------------- | ----------------------- | --------------------------------------------------------------------- |
| Lead-list building & site audits | Firecrawl               | GHL has no scraper; this feeds GHL its raw material                   |
| Call recording → action items    | Fireflies               | Better transcripts/summaries; output lands in GHL notes               |
| Sales decks / proposals          | Gamma                   | GHL docs are weak; Gamma is client-experience polish                  |
| Ad creative & client photos      | Higgsfield + Pixa       | GHL doesn't generate media; creatives get deployed INTO GHL campaigns |
| The marketing website            | This repo + Netlify     | Far better site than GHL's builder; still posts leads INTO GHL        |
| Engineering & ops automation     | Claude Code (this repo) | The operating layer that runs everything above                        |
| Outreach at scale (later)        | n8n + Apollo            | Only after manual outreach proves the message                         |

## Rules that keep the map clean

1. **One system of record:** if a lead/client isn't in GHL, it doesn't exist.
2. **Support tools feed the hub** — their outputs (lists, recaps, decks, creatives)
   always land in GHL or get used in a GHL touchpoint. No orphaned artifacts.
3. **Client-facing sends come from GHL** (tracked, compliant, on-domain).
   Claude prepares drafts; humans and GHL do the sending.
4. **Don't duplicate GHL** — no separate CRMs, schedulers, or form tools. The only
   sanctioned exception is Calendly if a prospect flow already uses it.
