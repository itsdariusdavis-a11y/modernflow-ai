# Automated Customer Follow-Up

### Powered by ModernFlow AI

**Prepared for:** [Client Name]
**Date:** [Date]
**Prepared by:** Ryan Davis — ModernFlow AI
**Contact:** ryan@modernflowai.com

---

## At a glance

Every time you complete a job in ServiceTitan, your customer automatically
gets a personalized thank-you text and email — with a one-tap link to leave
a 5-star Google review.

- **Sends within 2 hours of job completion.** Fast enough to capture the moment, late enough for the tech to leave the driveway.
- **Personalized for every customer.** Their first name, your tech's name, the service they just had.
- **Routes replies straight to your inbox.** When a customer texts back, you see it instantly.
- **Honors opt-outs automatically.** If someone replies STOP, they never get another message — and ServiceTitan is updated to reflect that.
- **Logged in ServiceTitan.** Every send creates a note on the customer's record so your CSRs see exactly what was sent.

You do nothing. We do nothing. The system runs forever.

---

## Table of contents

1. [The outcome](#1-the-outcome)
2. [How it works](#2-how-it-works)
3. [What your customers see](#3-what-your-customers-see)
4. [Your investment](#4-your-investment)
5. [What we need from you](#5-what-we-need-from-you)
6. [Timeline](#6-timeline)
7. [Your controls](#7-your-controls)
8. [Security and privacy](#8-security-and-privacy)
9. [Reporting and what success looks like](#9-reporting-and-what-success-looks-like)
10. [Frequently asked questions](#10-frequently-asked-questions)
11. [Next step](#11-next-step)

---

## 1. The outcome

Service businesses leave money on the table in two places:

- **Reviews.** 70% of customers will leave a Google review when asked — but only 13% leave one without being asked. Most service businesses simply forget to ask, or rely on techs who are too busy.
- **Repeat customers.** A customer who's heard from you in the last 90 days is 3x more likely to book again. Most CRMs sit silent for months between jobs.

This automation fixes both — without adding work to anyone on your team.

**Expected results in the first 90 days:**

| Metric | Typical lift |
|---|---|
| New Google reviews per month | **4–6x** baseline |
| Google review star average | **+0.3 to +0.5** |
| Repeat bookings from existing customers | **+20–30%** |
| Inbound calls (from review-driven search ranking) | **+15–25%** in months 3–6 |

These figures are from industry benchmarks for service businesses using
ServiceTitan. Your specific lift depends on your current review velocity
and your local market.

---

## 2. How it works

Four steps. Three of them are invisible to you.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   1. ServiceTitan marks a job "Completed"                                │
│                          │                                               │
│                          ▼                                               │
│   2. Our system reads the job + customer details (name, service type,    │
│      technician name, contact info)                                      │
│                          │                                               │
│                          ▼                                               │
│   3. After a 2-hour buffer, sends a personalized SMS + email             │
│      with your Google review link                                        │
│                          │                                               │
│                          ▼                                               │
│   4. Logs a note on the customer's record in ServiceTitan so your        │
│      CSRs can see the follow-up happened                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**When a customer replies:**

- If they reply **STOP, CANCEL, UNSUBSCRIBE**, etc. → we set "Do Not Mail" on their ServiceTitan record so they never get another automated message.
- If they reply with anything else (a question, a thank-you, a complaint) → we email the reply to you immediately and add a note to their ServiceTitan record so your team can respond personally.

---

## 3. What your customers see

### The SMS

> Hi Sarah, thanks for choosing **Apex HVAC**! If Mike earned 5 stars, would you mind sharing? https://g.page/r/CXxxxx/review — Reply STOP to opt out.

### The email

```
Subject: Thanks from Apex HVAC — quick favor?

Hi Sarah,

Thanks for letting Apex HVAC take care of your AC tune-up today.

If Mike earned a 5-star experience, would you mind taking 30 seconds
to share that? It genuinely makes a huge difference for a local
business like ours.

           ┌────────────────────────────────┐
           │   Leave a quick review →       │
           └────────────────────────────────┘

Either way — thank you for the trust.

— The Apex HVAC team
```

The messages are **fully customizable**. The names, business name,
review link, and tone all adjust to match your brand. We'll send you
the exact copy to approve before anything goes live.

---

## 4. Your investment

### Setup (one-time)

| Item | Cost |
|---|---|
| ModernFlow AI build + integration + testing | **[SEE PROPOSAL]** |
| Twilio brand registration (US legal requirement, see §6) | $4 one-time |
| Resend domain verification | Free |

### Ongoing (monthly)

| Item | Cost |
|---|---|
| ModernFlow AI managed service (monitoring + reports + tweaks) | **[SEE PROPOSAL]** |
| Twilio phone number | $1.15/mo |
| Twilio SMS messaging | $0.0083 per text (~$8 per 1,000 sends) |
| Twilio 10DLC registration | ~$2/mo |
| Resend email (free tier covers most service businesses) | $0 up to 3,000 emails/mo |
| ServiceTitan API access | $0 (included with your existing plan) |

**For a typical service business doing ~200 completed jobs/month:**
Total usage costs run **under $30/month**, on top of our management fee.

> **For context:** GoHighLevel charges $97–$497/month and includes SMS at
> 2–4x the Twilio rate. By going direct, you pay only for what you actually
> use and you own the accounts outright.

---

## 5. What we need from you

We collect everything in **one secure 1Password share** so nothing sensitive
ever touches email or text. Set aside about 45 minutes of your time, spread
across one or two calls.

### Block A — ServiceTitan API access *(15 minutes)*

We'll do this on a screen-share call.

1. Log in to ServiceTitan as an **Owner** or **Admin**.
2. Go to **Settings → Integrations → API Application Access**.
3. Approve our app (we provide the developer ID on the call).
4. Approve these permission scopes:
   - Customers — Read + Write
   - Jobs — Read
   - Invoices — Read
   - Customer Notes — Write
   - Webhook Subscriptions — Read + Write

ServiceTitan then shows you four values. You send them to us via
1Password share:

| Value | Description |
|---|---|
| Tenant ID | A numeric ID at the top of the page |
| App Key | Shown once when the app is approved |
| Client ID | On the app detail page |
| Client Secret | Shown once when the app is approved |

> **Important:** The App Key and Client Secret are shown **only once**.
> Save them to 1Password immediately. If you lose them, ServiceTitan can
> regenerate them, but the old ones stop working.

### Block B — Twilio account *(15 minutes + 1–3 week waiting period)*

Twilio is what actually sends the text messages. It's the same service
GoHighLevel uses under the hood — going direct just saves you the markup.

1. Sign up at **twilio.com** with your business email.
2. Buy one local phone number (typically $1.15/month) — pick one with your area code.
3. **Submit A2P 10DLC registration** — this is a US legal requirement for
   business SMS. Twilio walks you through it; takes about 10 minutes to
   submit. Approval takes 1–3 weeks.
4. Send us via 1Password:
   - Account SID
   - Auth Token
   - The phone number you purchased

### Block C — Resend account *(10 minutes)*

Resend sends the email portion. They have a generous free tier.

1. Sign up at **resend.com**.
2. Add your business domain (e.g. `apexhvac.com`).
3. Resend gives you 3 DNS records (SPF, DKIM, DMARC) to add at your
   domain host (GoDaddy, Cloudflare, etc.). Your web/domain person can
   do this in 5 minutes — we can also walk them through it.
4. Once the domain is verified, send us via 1Password:
   - Resend API key
   - The verified sending email address (e.g. `service@apexhvac.com`)

### Block D — Business basics *(you supply, 5 minutes)*

A simple form we'll send you. It captures:

| Item | Example |
|---|---|
| Business name as it should appear in messages | `Apex HVAC` |
| Your Google review link | `https://g.page/r/CXxxxx/review` |
| Owner notification email (where replies forward) | `owner@apexhvac.com` |
| Time zone | `America/Phoenix` |
| Acceptable send window | default 8am–7pm local |
| Tags or job types to **exclude** from follow-up | e.g. warranty, internal, recall |
| Final approval on SMS + email copy | we send you the draft to review |

---

## 6. Timeline

| Day | What happens | Who acts |
|---|---|---|
| **Day 0** | Kickoff call. We submit ServiceTitan API access request, you submit Twilio 10DLC registration, we add Resend DNS records. | Both |
| **Day 0–2** | We point the workflow at your ServiceTitan sandbox. We run one test job and confirm SMS + email arrive correctly on your phone. | ModernFlow |
| **Day 2–21** | Waiting on Twilio 10DLC approval (the only real delay). Other prep continues. | Twilio |
| **Day after 10DLC approval** | We move the workflow to your production ServiceTitan tenant and enable on all completed jobs. We watch the first 25 sends live. | ModernFlow |
| **Week 1 live** | First weekly report. | ModernFlow |

**The 10DLC wait is unavoidable** — it's a federal SMS compliance step that
applies to every business that sends automated text messages in the US.
Submitting on Day 0 is the most important thing you can do to compress the
timeline.

---

## 7. Your controls

You control this system. You can shut any part of it down at any time.

| To do this | Do this |
|---|---|
| **Pause all follow-ups** | Email us, or deactivate the workflow in n8n yourself (we'll show you how). Effect is immediate. |
| **Stop messages to one customer** | Set their "Do Not Mail" flag in ServiceTitan. We check it before every send. |
| **Skip follow-up for a single job** | Have the tech tag the job with `no-followup` (or any tag you choose) in ServiceTitan. The automation will skip it. |
| **Revoke our API access entirely** | ServiceTitan → Settings → Integrations → API Application Access → Revoke. Takes effect in seconds. |
| **Rotate Twilio or Resend keys** | Both are your accounts. Generate a new key, send us the new one, we swap it in n8n. |

---

## 8. Security and privacy

We take this seriously because we're operating on your customer data.

- **Credentials are encrypted.** Your API keys live as encrypted environment variables on our automation host. They never appear in source code, chat logs, or emails.
- **We are read-only on ServiceTitan** with two exceptions:
  1. Writing a Note on a customer record when we send a follow-up (audit trail).
  2. Setting `doNotMail = true` when a customer replies STOP (compliance).
- **No data leaves the system.** Customer details are read from ServiceTitan, used to render the message, and discarded. We don't store customer lists, message bodies, or contact info anywhere persistent.
- **Twilio and Resend are your accounts.** You own them. You can see every message sent in their dashboards. You can revoke our API keys without affecting your access.
- **PII handling.** We process names, phone numbers, and emails strictly to send the follow-up message. No marketing lists. No data sharing with third parties.

---

## 9. Reporting and what success looks like

You'll get a weekly email with:

- **Jobs processed** — how many completed jobs we saw
- **Messages sent** — SMS and email volume
- **Review-link clicks** — how many customers tapped through
- **New reviews logged** — Google reviews in your business profile that week
- **Replies received** — customer responses that came back through the inbox
- **Opt-outs** — STOP replies (we track to keep volume healthy)
- **Errors** — anything that failed (rare, but transparent when it happens)

After the first 30 days, we'll have enough data to show a clear before/after
on review velocity. We use this in the monthly check-in to suggest message
tweaks if needed.

---

## 10. Frequently asked questions

**Q: Will this send to customers who said not to be contacted?**
No. We check ServiceTitan's `doNotMail` flag on every send. If it's set,
we skip the customer entirely. STOP replies update that flag automatically.

**Q: What if a customer's number isn't a cell phone?**
We only send SMS to numbers ServiceTitan has marked as mobile. Landlines
get the email follow-up only.

**Q: Can a tech turn off the follow-up for a specific job?**
Yes — they tag the job (or the customer) with a "no-followup" tag in
ServiceTitan. We can match any tag you already use.

**Q: What about HIPAA, PCI, or other regulations?**
Service businesses don't typically trigger HIPAA. We don't process payment
info, so PCI doesn't apply. We're compliant with **A2P 10DLC** (US SMS
compliance) and **CAN-SPAM** (email compliance). If your industry has
additional requirements, tell us and we'll confirm fit.

**Q: What happens if Twilio or Resend has an outage?**
Failed sends do not block the next job. Each job runs independently. We
get alerted on errors and review within one business day. If a specific
job's send fails, we either retry automatically or document why so you
can follow up manually.

**Q: Can we add more automations later?**
Yes. The same infrastructure powers:
- Unpaid invoice nudges (3 / 7 / 14 days after invoice issued)
- Maintenance reminders (6 / 12 months after a service)
- Estimate follow-ups (when a quote is sent but not booked)
- Win-back campaigns (customers dormant for 12+ months)

Each new automation is a 1–2 day add-on once this one is live.

**Q: What if we already use GoHighLevel?**
Then keep using it — this same workflow can send through GHL instead of
Twilio/Resend if you want to. Most clients prefer the direct route once
they see the cost difference. We can build either way.

**Q: Can we see exactly what was sent to a specific customer?**
Yes. Every send creates a Note on the customer's record in ServiceTitan
with the timestamp and message type. Twilio's dashboard shows the exact
SMS body and delivery status for any number.

**Q: How quickly can a customer opt back in?**
They reply START to the same number. We re-enable them automatically.

**Q: Do you charge per message?**
No. Our management fee is flat. You pay Twilio and Resend directly for
usage at their published rates.

---

## 11. Next step

Three options to move forward:

1. **Quick yes** — Reply with "let's start" and we'll send the contract and the kickoff-call link in the same thread.
2. **15-minute call first** — Pick a time at [calendly.com/ryan-modernflowai](https://calendly.com/ryan-modernflowai) and we'll walk through it live. Bring questions.
3. **Have a question that wasn't covered?** — Reply to the email this was attached to and we'll answer directly.

Either way, the path from yes to your first automated follow-up is roughly
**three weeks**, with most of that being the Twilio compliance wait.

---

*ModernFlow AI builds done-for-you automation for service businesses on
ServiceTitan, Housecall Pro, and Jobber. We don't sell software — we
build, maintain, and own the automation so you don't have to.*

**Ryan Davis**
ModernFlow AI
ryan@modernflowai.com
[calendly.com/ryan-modernflowai](https://calendly.com/ryan-modernflowai)
