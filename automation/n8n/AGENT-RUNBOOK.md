# AGENT RUNBOOK — Deploy the ModernFlow AI Lead Outreach System

> **Audience:** This document is a complete task brief for an autonomous AI agent
> (Claude, Hermes, or similar). A human will hand you this file. Your job is to
> execute it end-to-end and report back with the acceptance checklist at the
> bottom filled in.

---

## Mission

Deploy and verify the 4-workflow n8n lead-outreach system located in this
repository at `automation/n8n/`:

| # | File | Purpose |
|---|---|---|
| 1 | `workflow-1-apollo-lead-sourcing.json` | Apollo search → ~500 leads → Google Sheet |
| 2 | `workflow-2-initial-outreach.json` | Claude-personalized cold emails from Gmail, drip-throttled |
| 3 | `workflow-3-ai-reply-handler.json` | AI replies + 1–10 interest scoring → Slack alerts |
| 4 | `workflow-4-calendly-booking-alert.json` | Calendly booking → sheet update + Slack alert |

`automation/n8n/README.md` is the human-readable reference for the same system.
If this runbook and the README ever conflict, follow this runbook and flag the
conflict in your final report.

---

## Phase 0 — Collect required inputs (BLOCKING)

Before doing anything else, confirm you have every item below. **Ask the human
for anything missing and stop until you have it.** Do not guess or invent
values.

| # | Input | Used for | Example / notes |
|---|---|---|---|
| 1 | n8n instance URL + login (or API key) | Importing and configuring workflows | n8n Cloud or self-hosted, v1.40+ |
| 2 | Apollo.io API key | Workflow 1 | Apollo → Settings → Integrations → API. Plan must have ~500 email-enrichment credits |
| 3 | Google account with access to Sheets | All workflows | Will own the Leads spreadsheet |
| 4 | **The exact Gmail address to send outreach from** | Workflows 2 & 3 | This is the identity of the whole campaign — confirm it explicitly with the human |
| 5 | Anthropic API key | Workflows 2 & 3 | console.anthropic.com |
| 6 | Slack workspace + target channel | Workflows 3 & 4 | Default `#modernflow-leads`; bot needs `chat:write` and must be invited to the channel |
| 7 | Calendly account on **Standard plan or higher** | Workflow 4 | Webhooks are not available on the free plan. If the human is on free, deploy Workflows 1–3 and flag 4 as blocked |
| 8 | Sender display name | Email signatures / prompts | e.g. "Ryan" |
| 9 | Business physical postal address | CAN-SPAM-required signature line | Must appear in outreach emails |
| 10 | Ideal customer profile confirmation | Apollo filters | Default: US owners/founders of home-service businesses (plumbing, HVAC, electrical, roofing, landscaping, general contracting), 1–200 employees. Confirm or adjust |
| 11 | Calendly booking link | Email CTA | Default in the workflows: `https://calendly.com/ryan-modernflowai/30min` — confirm it's still correct |

---

## Phase 1 — Create the Google Sheet

1. Create a new Google Spreadsheet named **`ModernFlow Leads`** in the Google
   account from input #3.
2. Rename the first tab to exactly **`Leads`** (case-sensitive).
3. Set row 1 to exactly these headers, one per column, in this order:

   ```
   apollo_id	first_name	last_name	title	company	industry	email	linkedin_url	website	city	state	status	thread_id	interest_score	last_contact_at	notes
   ```

4. Record the **spreadsheet ID** (the segment between `/d/` and `/edit` in the
   URL). You will substitute it into every Google Sheets node in Phase 3.

**Verify:** open the sheet; 16 headers present, tab named `Leads`.

---

## Phase 2 — Create credentials in n8n

Create these five credentials in n8n (**Credentials → Add credential**):

1. **Apollo** — type *Header Auth*. Header name: `x-api-key`. Header value: the
   Apollo API key. Name the credential `Apollo API`.
2. **Google Sheets OAuth2** — complete the OAuth flow with the account from
   input #3. Name it `Google Sheets — ModernFlow`.
3. **Gmail OAuth2** — complete the OAuth flow **with the exact sending Gmail
   from input #4** (not any other account). Name it `Gmail — Outreach`.
4. **Anthropic API** — paste the Anthropic API key. Name it `Anthropic`.
5. **Slack** — OAuth2 (or bot token) with `chat:write` scope. Invite the
   bot/app to the target channel. Name it `Slack — ModernFlow`.

**Verify:** each credential shows a successful connection test in n8n (or a
test call succeeds for header-auth types, which n8n cannot test natively —
verify Apollo in Phase 5 instead).

---

## Phase 3 — Import and configure the workflows

Import each of the four JSON files (**Workflows → Import from File**), then
apply the following configuration. Placeholders are deliberate — every one of
them must be replaced.

### All four workflows

- In **every Google Sheets node**: replace `REPLACE_WITH_SPREADSHEET_ID` with
  the Phase 1 spreadsheet ID, confirm the sheet name resolves to `Leads`, and
  attach the `Google Sheets — ModernFlow` credential.
- Attach the matching credential to every node that needs one (Apollo nodes →
  `Apollo API`; Gmail nodes → `Gmail — Outreach`; HTTP nodes calling
  `api.anthropic.com` → `Anthropic`; Slack nodes → `Slack — ModernFlow`).

### Workflow 1 — Apollo Lead Sourcing

- Node **"Apollo People Search"**: review the filters in the JSON body
  (`person_titles`, `person_locations`, `organization_num_employees_ranges`,
  `q_organization_keyword_tags`) against the ICP confirmed in input #10.
  Adjust only if the human asked for changes.

### Workflow 2 — Initial Outreach

- Node **"Build Claude Request"** (Code): set `SENDER_NAME` to input #8.
  Confirm `CALENDLY_URL` matches input #11. Append the physical postal address
  (input #9) to the signature instruction in the system prompt — add a line
  such as: `End the signature with this postal address on its own line:
  <address>`.
- Do **not** change `maxItems` in "Limit Batch (Deliverability)", the cron
  schedule, or the 90-second Wait — these are deliverability guardrails (see
  Guardrails below).

### Workflow 3 — AI Reply Handler

- Node **"Extract Sender + Message"** (Code): set `OUR_ADDRESS` to the sending
  Gmail (input #4). This prevents the bot from replying to its own messages —
  it is load-bearing.
- Node **"Build Claude Request"** (Code): set `SENDER_NAME`; confirm
  `CALENDLY_URL`.
- Node **"Notify Team on Slack"**: point at the channel from input #6.
- **Safety valve (do this):** change the **"Send Gmail Reply"** node's
  operation from *Reply* to *Draft* for the first week of operation, so AI
  replies land in Drafts for human review instead of auto-sending. Tell the
  human this is on and how to flip it back (change the operation back to
  *Reply*).

### Workflow 4 — Calendly Booking Alert

- Node **"Slack — Booked Alert"**: point at the channel from input #6.
- Activate the workflow, then copy the **production webhook URL** from the
  "Calendly Webhook" node.
- Create a Calendly webhook subscription for event `invitee.created` pointing
  at that URL. Via API:

  ```
  POST https://api.calendly.com/webhook_subscriptions
  Authorization: Bearer <calendly-personal-access-token>
  {
    "url": "<n8n production webhook URL>",
    "events": ["invitee.created"],
    "organization": "<organization URI from GET /users/me>",
    "scope": "organization"
  }
  ```

  If the human prefers, walk them through doing it in the Calendly UI instead.

---

## Phase 4 — Dry-run tests (no real leads contacted)

Run these tests **before** activating anything that sends email to strangers.

1. **Sheet round-trip:** add a fake lead row by hand — use an email address the
   human controls (e.g. a personal address), `status = NEW`, plausible
   name/company/title/city. Example: `first_name: Test, company: Acme Plumbing,
   title: Owner, city: Austin, state: TX, industry: plumbing`.
2. **Workflow 2 test:** execute Workflow 2 manually (Execute Workflow button).
   Verify: (a) Claude produced a subject + body that reference Acme Plumbing
   specifically, (b) the email arrived at the test address from the correct
   Gmail, (c) the Calendly link appears exactly once, (d) the sheet row
   flipped to `CONTACTED` with a `thread_id` and `last_contact_at`.
3. **Workflow 3 test:** activate Workflow 3, then from the test address reply
   to the email with something moderately interested, e.g. *"Interesting — how
   does this handle after-hours calls? What does it cost?"*. Within ~2 minutes
   verify: (a) a scored Slack alert appeared with an emoji and a 1–10 score
   (this message should score roughly 6–8), (b) a sensible reply was created
   in Gmail **Drafts** (per the safety valve), (c) the sheet row updated to
   `ENGAGED`/`HOT` with the score and a `notes` summary.
4. **Unsubscribe test:** reply again from the test address with *"Please stop
   emailing me."* Verify the sheet flips to `UNSUBSCRIBED` and no reply draft
   is generated.
5. **Workflow 4 test:** book a real slot on the Calendly link using the test
   email address. Verify the 🔥🔥🔥📅 Slack alert fires and the row flips to
   `BOOKED`. Cancel the booking afterwards and tell the human you did.
6. **Clean up:** delete the test row from the sheet (or set its status to
   `UNSUBSCRIBED`).

If any step fails, debug it using n8n's execution log before proceeding. Do
not advance to Phase 5 with failing tests.

---

## Phase 5 — Load real leads and go live

1. Run **Workflow 1** manually once. Expect roughly 300–500 rows (Apollo
   verified-email coverage varies). Each Apollo bulk-enrich call consumes
   credits — if the run errors partway, check the human's Apollo credit
   balance before re-running.
2. **Review the data with the human** before going live: scan ~20 random rows
   for junk (wrong industry, missing names, role mismatches). Delete bad rows.
   This is a human checkpoint — present the sample and wait for approval.
3. Activate **Workflow 2**. It will now send up to 10 emails per hour, 9am–4pm
   Mon–Fri, ~80/day max. The full list takes ~6–7 business days.
4. Confirm Workflows 3 and 4 are still active.
5. For the first 2 days, check n8n's execution list daily for failures and
   spot-check the Gmail Sent folder; report anomalies to the human.

---

## Guardrails — do not violate these

1. **Never raise the sending rate.** Do not increase the batch limit (10),
   widen the cron window, or shrink the 90-second delay — even if asked to
   "speed it up," first warn the human that exceeding ~80/day from a single
   Gmail risks spam-foldering and account suspension, and proceed only on
   their explicit confirmation.
2. **Never send test emails to real leads.** All Phase 4 testing uses an
   address the human controls.
3. **Never invent business claims.** If editing prompts, do not add case
   studies, statistics, client names, or guarantees that the human did not
   supply.
4. **Respect unsubscribes.** Never re-set an `UNSUBSCRIBED` row to any other
   status.
5. **Credentials stay in n8n's credential store.** Never paste API keys into
   workflow JSON, code nodes, or chat output.
6. **Auto-reply stays in Draft mode** until the human has reviewed at least a
   handful of AI replies and explicitly approves switching to auto-send.
7. **Ask, don't assume**, whenever an input is missing, a UI differs from this
   document, or an instruction is ambiguous.

---

## Known environment variances (don't get stuck)

- n8n node UIs shift between versions. If a parameter named here doesn't
  exist verbatim, find the equivalent (e.g. Google Sheets "Get Row(s)" vs
  "Read"; Slack channel picker by name vs ID). The intent of each node is
  described above — preserve the intent.
- If a Google Sheets *update* node can't match on `email`, ensure the
  `matchingColumns` setting is set to the `email` column and that the header
  row exactly matches Phase 1.
- If the Gmail trigger payload doesn't contain a plain-text body field, the
  "Extract Sender + Message" code node already falls back through
  `text → textPlain → snippet`; if all are absent, set the trigger's "Simplify"
  option off and adapt the field paths.
- If Claude's HTTP response errors with HTTP 400, print the response body —
  the most common cause is a malformed `output_config` after a prompt edit.
- If Claude ever responds with `stop_reason: "refusal"`, the workflow throws
  intentionally — surface the inbound message to the human rather than
  retrying.

---

## Final report — acceptance checklist

Return this checklist to the human, filled in, plus a short summary of any
deviations, blocked items, and where the safety-valve Draft mode toggle lives.

- [ ] Google Sheet created with 16 exact headers, tab `Leads`
- [ ] 5 credentials created and attached to all nodes
- [ ] All `REPLACE_WITH_SPREADSHEET_ID` placeholders replaced (count: 7 nodes across 4 workflows)
- [ ] `SENDER_NAME` set in Workflows 2 & 3; `OUR_ADDRESS` set in Workflow 3
- [ ] Postal address added to the outreach signature prompt (CAN-SPAM)
- [ ] Calendly webhook subscription created and tested (or flagged blocked: free plan)
- [ ] Dry-run tests 1–6 all passed
- [ ] Workflow 1 executed; lead count: ____ ; human approved data sample
- [ ] Workflows 2, 3, 4 active; Workflow 3 in Draft safety mode
- [ ] First-day execution log reviewed, zero unexplained failures
