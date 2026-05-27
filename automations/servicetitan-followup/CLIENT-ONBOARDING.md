# ServiceTitan Follow-Up Automation — What We Need From You

**Prepared by:** ModernFlow AI
**For:** [CLIENT NAME]

---

## What you're getting

A fully-automated post-job follow-up that fires within minutes of every completed
ServiceTitan job. Every customer gets a personalized thank-you, a review request,
and (where eligible) a maintenance-plan offer — sent through your GoHighLevel
account so all conversations stay in one place.

You don't need to do anything once it's live. We monitor and maintain it.

---

## What we need from you to turn it on

We've already built and tested the entire automation against a ServiceTitan
sandbox. To go live on **your** account we only need three things:

### 1. ServiceTitan API access (the main one)

You'll request these from ServiceTitan's developer portal. We'll walk you
through it on a 15-minute call, or you can do it yourself:

1. Log in to ServiceTitan as an **Owner** or **Admin**.
2. Go to **Settings → Integrations → API Application Access**.
3. Click **Connect New App** and search for **"ModernFlow AI"** (or, until we're
   listed, ask ServiceTitan support to whitelist our developer account —
   we'll provide the ID).
4. Approve the following permissions (read-only except where noted):
   - **Customers** — Read
   - **Jobs** — Read
   - **Invoices** — Read
   - **Customer Notes** — Read + Write *(so we can log an audit trail back)*
   - **Webhooks / Webhook Subscriptions** — Read + Write *(so we can subscribe to job-completion events)*

Once approved, ServiceTitan will give you **four values**. Send them to us in a
password manager share (1Password, Bitwarden) — **never email or Slack**:

| Value | Where to find it |
|---|---|
| **Tenant ID** | Top of the API Application Access page (numeric) |
| **App Key** | Shown once when the app is approved — store it immediately |
| **Client ID** | Shown on the app's detail page |
| **Client Secret** | Shown once when generated — store it immediately |

> If anyone loses the App Key or Client Secret, ServiceTitan can regenerate it
> — but doing so invalidates the old one and we'd have to re-deploy. Save them
> the first time.

### 2. GoHighLevel access

We need **one** of the following:

- **Option A (preferred):** A sub-account user login with **Workflows** and
  **Settings** permissions. We'll create the follow-up workflow and template the
  SMS/email copy.
- **Option B:** You set up an Inbound Webhook workflow in GHL yourself (we'll
  send you the 3-step instructions) and just send us the webhook URL.

### 3. Your review link + business basics

A one-page form we'll send over. It captures:

- Your Google Business Profile review link (we shorten and track clicks)
- Business name as it should appear in messages
- Reply-to email address
- SMS sender number (if you already have one in GHL)
- Hours during which automated SMS may send (default 8am–7pm local)
- Final approval on the thank-you / review-request copy

---

## Timeline

| Day | What happens |
|---|---|
| **Day 0** | You send credentials. We swap them into our sandbox-tested workflow. |
| **Day 1** | We point the workflow at a single test job in your account. You see the SMS land on your phone. |
| **Day 2** | We enable on all completed jobs. We monitor the first 25 sends. |
| **Day 7** | First weekly report: jobs processed, messages sent, review-link clicks. |

Total elapsed: **about one week from creds-in-hand to live**.

---

## Security & data handling

- Credentials live only in encrypted environment variables on our automation
  host. We never store them in source code.
- We are read-only on ServiceTitan with one exception: writing a single Note
  back to the customer record to confirm the automation fired. We do not
  modify jobs, invoices, or pricing.
- You can revoke our API access at any time from
  **Settings → Integrations → API Application Access** in ServiceTitan —
  takes effect within seconds.

---

## What happens if something breaks

- Every run is logged. If a send fails (bad phone number, GHL outage, etc.) we
  get an alert.
- Failed sends do not block the next job — each job is independent.
- We provide a weekly report and a Slack channel (or email) for issues.

---

## Frequently asked questions

**Q: Will this send to customers who've asked not to be contacted?**
No. We check ServiceTitan's `doNotMail` flag and GHL's opt-out list before
every send.

**Q: Can a tech turn off the follow-up for a specific job?**
Yes — they tag the job with `no-followup` in ServiceTitan and the automation
skips it. We can wire any tag you already use.

**Q: Do we have to switch from ServiceTitan?**
No. ServiceTitan stays your source of truth. This sits alongside it.

**Q: Can we add more follow-ups later (unpaid invoices, maintenance reminders)?**
Yes — the workflow is built as a template. Each new follow-up is a 1–2 day
add-on once the first one is live.

---

## Next step

Reply with a good time for a 15-minute creds-handoff call, or send the
ServiceTitan four values + GHL webhook URL via 1Password and we'll take it
from there.

— Ryan, ModernFlow AI
