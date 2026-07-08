# ServiceTitan Follow-Up Automation — What We Need From You

**Prepared by:** ModernFlow AI
**For:** [CLIENT NAME]

---

## What you're getting

Every time a ServiceTitan job is marked complete, your customer gets a personalized
thank-you text and email — with a one-tap link to leave a Google review.

- Fires automatically. No one on your team has to remember to follow up.
- Honors opt-outs (STOP replies stop messages instantly).
- Replies from customers get routed to your inbox so you can respond personally.
- Every send is logged back into the customer's record in ServiceTitan.

We've already built and tested everything against a sandbox ServiceTitan tenant.
To go live we only need your credentials.

---

## What we need from you

We collect everything in **one secure 1Password share** (please don't email
or text these). Here's the full list:

### Block 1 — ServiceTitan API (request from ServiceTitan)

You'll request these from ServiceTitan's developer portal. We'll walk you
through it on a 15-minute call.

1. Log in to ServiceTitan as an **Owner** or **Admin**.
2. Go to **Settings → Integrations → API Application Access**.
3. Approve our app (we'll provide the developer ID).
4. Approve these permissions:
   - Customers — Read + Write *(write is only used to mark `doNotMail` on opt-outs)*
   - Jobs — Read
   - Invoices — Read
   - Customer Notes — Write *(audit trail for every send)*
   - Webhook Subscriptions — Read + Write

Once approved, send us these **four values**:

| Value | What it is |
|---|---|
| **Tenant ID** | Numeric ID at the top of the API Access page |
| **App Key** | Shown once when the app is approved |
| **Client ID** | On the app detail page |
| **Client Secret** | Shown once when generated |

> If anyone loses the App Key or Client Secret, ServiceTitan can regenerate
> them but the old ones become invalid. Save them in 1Password the first time.

### Block 2 — Business basics (you supply)

| Value | Example |
|---|---|
| **Business name** (as it appears in messages) | `Apex HVAC` |
| **Google review link** | `https://g.page/r/CXxxxxxxxxxxxxxx/review` |
| **Owner notification email** (where replies go) | `owner@apexhvac.com` |
| **Sending email address** | `service@apexhvac.com` *(domain must be one you control)* |
| **Time zone** | `America/Phoenix` |
| **Send window** | default 8am–7pm local |

### Block 3 — Channels (we set up, you cover the accounts)

You'll create two accounts. They take ~10 minutes each and we'll do them with
you on the same call.

#### Twilio (for SMS — what replaces GoHighLevel)
1. Sign up at **twilio.com** (free trial available).
2. Buy one local number ($1.15/mo) matching your area code.
3. Submit **A2P 10DLC registration** (US legal requirement for business SMS):
   - Brand registration: ~$4 one-time
   - Campaign registration: ~$10 + ~$2/mo
   - Approval takes **1–3 weeks** — this is the main timeline driver
4. Send us:
   - **Account SID**
   - **Auth Token**
   - The phone number you purchased

#### Resend (for email)
1. Sign up at **resend.com** (free tier covers 3,000 emails/mo).
2. Add your sending domain (e.g. `apexhvac.com`).
3. Add the 3 DNS records Resend gives you (SPF, DKIM, DMARC) to your domain
   host. Your web/domain person can do this in 5 minutes.
4. Send us:
   - **Resend API key**
   - The verified sending email address (e.g. `service@apexhvac.com`)

---

## Cost summary

| Item | Cost |
|---|---|
| Twilio phone number | $1.15/mo |
| Twilio SMS | $0.0083 per message (~$8 per 1,000 sends) |
| Twilio 10DLC | $4 one-time + ~$2/mo |
| Resend | Free up to 3,000 emails/mo, $20/mo for 50,000 |
| ServiceTitan API access | Included with your existing ServiceTitan plan |
| ModernFlow setup + management | [SEE PROPOSAL] |

For a typical service business doing 200 completed jobs/month: **under $30/mo
in usage costs**.

---

## Timeline

| Day | What happens |
|---|---|
| **Day 0** | You submit Twilio 10DLC registration + ServiceTitan API request |
| **Day 0** | Resend domain verification |
| **Day 0–2** | We point the workflow at your sandbox and run a test job |
| **Day 7–21** | Twilio approves 10DLC (this is the gate) |
| **Day after approval** | We move to your production ServiceTitan tenant and enable on all jobs |
| **Week 1 live** | First weekly report |

The whole thing is **mostly waiting on Twilio**. Your active work is roughly
**45 minutes** spread across the calls.

---

## Security & data handling

- Credentials live only as encrypted environment variables on our automation
  host. Never in source code, never in chat.
- We are **read-only** on ServiceTitan except for two things:
  1. Writing a Note on each customer when we send (audit trail).
  2. Setting `doNotMail = true` when a customer replies STOP.
- You can revoke our API access at any time from **Settings → Integrations →
  API Application Access** in ServiceTitan — takes effect in seconds.
- Twilio and Resend are your accounts. You own them. We just have API keys
  with scoped permissions.

---

## What happens if something breaks

- Every run is logged. Failed sends never block the next job.
- We get alerted on errors and review them within one business day.
- You get a weekly report: jobs processed, messages sent, review-link
  clicks, opt-outs.

---

## FAQ

**Q: Why no GoHighLevel?**
Cheaper, simpler, and ServiceTitan is already your CRM. GHL would be a
fourth platform to manage. The direct stack does the same work for less.

**Q: Will it send to customers who said not to be contacted?**
No. We check `doNotMail` on every ServiceTitan customer before sending. STOP
replies update that flag automatically.

**Q: Can a tech turn off the follow-up for a specific job?**
Yes — they tag the job with `no-followup` in ServiceTitan and the automation
skips it. We can wire any tag you already use.

**Q: Can we add more follow-ups later (unpaid invoices, maintenance reminders)?**
Yes. Each new follow-up is a 1–2 day add-on once this one is live.

---

## Next step

Reply with a 15-minute slot for the creds-handoff call, or send everything
above via 1Password share and we'll take it from there.

— Ryan, ModernFlow AI
