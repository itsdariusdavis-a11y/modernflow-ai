# ModernFlow AI — n8n Lead Outreach System

A 4-workflow n8n automation that takes leads from Apollo → Google Sheets → AI-personalized Gmail outreach → AI-handled replies with 1–10 interest scoring → Slack alerts → Calendly bookings.

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ 1. Apollo       │ →  │ Google Sheet     │ ←→ │ 2. AI Outreach   │
│    Lead Search  │    │ "Leads" (≈500)   │    │    (Gmail drip)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                              ↑    ↑
        ┌──────────────────┐  │    │  ┌──────────────────────┐
        │ 4. Calendly      │ ─┘    └─ │ 3. AI Reply Handler  │
        │    Booking Alert │          │    + Interest Score   │
        └────────┬─────────┘          └──────────┬───────────┘
                 └──────────→  Slack  ←──────────┘
```

## The 4 workflows

| File | What it does | Trigger |
|---|---|---|
| `workflow-1-apollo-lead-sourcing.json` | Searches Apollo for ~500 service-business owners, enriches emails, appends to Google Sheets | Manual (run once per list) |
| `workflow-2-initial-outreach.json` | Pulls `NEW` leads in small batches, Claude writes a personalized cold email per lead, sends from your Gmail, marks `CONTACTED` | Hourly cron, Mon–Fri 9am–4pm |
| `workflow-3-ai-reply-handler.json` | Watches the inbox; when a lead replies, Claude scores interest 1–10, writes a reply (Calendly link when warm), updates the sheet, and alerts Slack with the emoji scale | Gmail poll (every minute) |
| `workflow-4-calendly-booking-alert.json` | When someone books on Calendly, marks lead `BOOKED` and fires a 🔥🔥🔥📅 Slack alert | Calendly webhook |

### Interest scale in Slack

| Score | Emoji | Meaning |
|---|---|---|
| 9–10 | 🔥🔥 / 🔥🔥🔥 | **CALL IMMEDIATELY** — wants to talk / ready to move |
| 7–8 | ⚡ / 🔥 | Hot — asking specifics, pricing, timeline |
| 5–6 | 🙂 / 👀 | Warming up — curious, asking general questions |
| 3–4 | 😐 | Polite brush-off / "maybe later" |
| 1–2 | 🧊 | Not interested |

A 📅 line is added when the AI detects explicit booking intent.

---

## Setup

### Step 1 — Create the Google Sheet

Create a spreadsheet with one tab named **`Leads`** and this exact header row (row 1):

```
apollo_id | first_name | last_name | title | company | industry | email | linkedin_url | website | city | state | status | thread_id | interest_score | last_contact_at | notes
```

The `status` column drives everything: `NEW` → `CONTACTED` → `ENGAGED` / `HOT` → `BOOKED` (or `UNSUBSCRIBED`).

Copy the spreadsheet ID from its URL (`docs.google.com/spreadsheets/d/<THIS_PART>/edit`).

### Step 2 — Import the workflows

In n8n: **Workflows → Import from File** for each of the 4 JSON files.

### Step 3 — Create credentials in n8n

| Credential | Type in n8n | Used by | Notes |
|---|---|---|---|
| Apollo | **Header Auth** — name: `x-api-key`, value: your Apollo API key | Workflow 1 | Get the key at Apollo → Settings → Integrations → API |
| Google Sheets | **Google Sheets OAuth2** | All workflows | Sign in with the Google account that owns the sheet |
| Gmail | **Gmail OAuth2** | Workflows 2 & 3 | **Sign in with the exact Gmail you want emails sent from** |
| Anthropic | **Anthropic API** | Workflows 2 & 3 | API key from console.anthropic.com |
| Slack | **Slack OAuth2 / API** | Workflows 3 & 4 | Bot needs `chat:write`; invite it to your channel |

### Step 4 — Fill in the placeholders

In each imported workflow:

1. **Every Google Sheets node** → replace `REPLACE_WITH_SPREADSHEET_ID` with your spreadsheet ID, and select your Google credential.
2. **Workflow 2 → "Build Claude Request"** code node → set `SENDER_NAME` (and the Calendly URL if it ever changes — currently `https://calendly.com/ryan-modernflowai/30min`, same as the website).
3. **Workflow 3 → "Extract Sender + Message"** code node → set `OUR_ADDRESS` to your sending Gmail (prevents the bot replying to itself).
4. **Workflow 3 → "Build Claude Request"** code node → set `SENDER_NAME`.
5. **Slack nodes** → pick your channel (default `#modernflow-leads` — create it or change it).
6. **Workflow 1 → "Apollo People Search"** → tune the search filters (titles, locations, employee ranges, industry keywords) to your exact ICP.

### Step 5 — Wire up Calendly

1. Activate Workflow 4 and copy the **production webhook URL** from the Webhook node.
2. Calendly webhooks require a **Standard/Teams plan or higher**. Create the subscription (Calendly API or integrations page) for the event `invitee.created`, pointing at your n8n webhook URL.
3. Test by booking a slot yourself.

### Step 6 — Run it

1. Run **Workflow 1** manually once. Verify the sheet fills with leads, `status = NEW`.
2. **Spot-check the data** — delete junk rows before activating outreach.
3. Activate **Workflows 2, 3, and 4**.
4. Watch the first few sends in n8n's execution log and your Gmail Sent folder; tweak the prompt in "Build Claude Request" until you love the output.

---

## Important operational notes

### ⚠️ Deliverability (read this before sending 500 emails)

- **Gmail caps:** ~500 recipients/day (consumer Gmail) or ~2,000/day (Workspace). But sending anywhere near that from a cold-ish account will land you in spam and can get the account suspended.
- The workflow is deliberately throttled: **10 leads/hour × 8 business hours = max ~80/day**, with a 90-second pause between sends. The full 500 list takes about 6–7 business days. Resist the urge to crank it up.
- If the sending Gmail is new or rarely used, **warm it up first** (1–2 weeks of normal human sending, or a warm-up tool).
- Set up **SPF, DKIM, and DMARC** on your domain if using Workspace.
- Consider sending from `ryan@modernflowai.com` rather than a bare `@gmail.com` — reply rates and trust are meaningfully better.

### ⚖️ Compliance (CAN-SPAM)

Cold B2B email is legal in the US, but you must: use a real from-address, include a truthful subject, **include a physical postal address**, and honor opt-outs. Add your business address to the email signature in the Workflow 2 prompt. The reply handler auto-detects unsubscribe requests and sets `status = UNSUBSCRIBED` so the lead is never contacted again.

### 💰 Cost ballpark

- **Claude (`claude-opus-4-8`, $5/$25 per MTok):** roughly $0.02–0.04 per email written or reply handled → the full 500-lead campaign including replies typically lands around **$15–40 total**. If you want to cut LLM cost, switch `model` to `claude-sonnet-4-6` in the two "Build Claude Request" code nodes ($3/$15 per MTok) — quality is still strong for this task.
- **Apollo:** the bulk-enrich step consumes export/enrichment credits per revealed email — check your plan covers ~500.

### 🔧 Tuning

- **Lead criteria:** all Apollo filters live in one place (Workflow 1 → "Apollo People Search" node).
- **Email voice:** both prompts live in "Build Claude Request" code nodes — edit freely; the JSON output schema guarantees the workflow can always parse the result.
- **Scoring thresholds:** Slack emoji mapping is in Workflow 3 → "Build Slack Alert"; sheet status thresholds (`HOT` at ≥8) are in "Update Lead Score".
- **Follow-ups for non-responders:** not included yet. Natural v2: a workflow that finds `CONTACTED` leads with no reply after 4 days and sends one Claude-written bump email.

### 🦺 Safety valve (recommended for week 1)

If you want a human in the loop at first, change Workflow 3's "Send Gmail Reply" node operation from **Reply** to **Draft** — Claude's replies land in your Drafts folder for one-click review instead of auto-sending. Flip it back once you trust the output.
