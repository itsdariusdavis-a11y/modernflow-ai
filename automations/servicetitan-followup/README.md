# ServiceTitan Post-Job Follow-Up (v2 — direct Twilio + Resend)

Two replicable n8n workflows that send a thank-you SMS + email + Google review
request after every completed ServiceTitan job. No GoHighLevel — sends go
directly through Twilio (SMS) and Resend (email). ServiceTitan stays the CRM.

## Files

| File | Purpose |
|---|---|
| `workflow.json` | **Outbound** workflow — ServiceTitan job → SMS + email + Note |
| `inbound-workflow.json` | **Inbound** workflow — Twilio STOP / replies → ServiceTitan opt-out + owner alert |
| `CLIENT-ONBOARDING.md` | Customer-facing doc — what we need from them |
| `README.md` | This file — internal SOP |

## Architecture

```
                  ServiceTitan Job.Completed webhook
                              │
                              ▼
        ┌─────── outbound workflow (workflow.json) ───────┐
        │  OAuth → GET job → GET customer → eligibility   │
        │  → wait 2h → build SMS+email → Twilio + Resend  │
        │  → log Note to ServiceTitan                     │
        └─────────────────────────────────────────────────┘
                              │
        ┌──── Customer replies / STOPs ──────┐
        │    Twilio webhook → n8n            │
        │                                    ▼
        │   ┌── inbound workflow (inbound-workflow.json) ──┐
        │   │ Parse → find customer → if STOP: PATCH       │
        │   │ doNotMail; else: log note + email owner      │
        │   └──────────────────────────────────────────────┘
        ▼
   doNotMail = true blocks future sends
```

ServiceTitan is the only CRM. Twilio is the only SMS gateway. Resend is the only
email sender.

## Live workflow IDs in Darius' n8n

| Workflow | ID |
|---|---|
| Outbound (post-job follow-up) | `qtonx2yZJDiW5q0N` |
| Inbound (STOP + replies) | `Vtf1U0rlRbi6DNi2` |

## Per-client environment variables

Both workflows read from these. Set per n8n instance / per client.

### ServiceTitan (4)
| Var | Where to get it |
|---|---|
| `ST_TENANT_ID` | ServiceTitan → API Application Access page |
| `ST_APP_KEY` | Shown once on app approval |
| `ST_CLIENT_ID` | App detail page |
| `ST_CLIENT_SECRET` | Shown once on generation |

### Twilio (set as n8n credentials, not env vars)
Create credential in n8n: **Credentials → New → Twilio API**. The outbound
workflow's "Send SMS (Twilio)" node binds to it. You also need:
| Var | Value |
|---|---|
| `TWILIO_FROM_NUMBER` | The E.164 number purchased in Twilio, e.g. `+16025551234` |

### Resend (3)
| Var | Where to get it |
|---|---|
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `service@apexhvac.com` |
| `OWNER_NOTIFY_EMAIL` | Where customer replies are forwarded |

### Business config (2)
| Var | Example |
|---|---|
| `CLIENT_BUSINESS_NAME` | `Apex HVAC` |
| `CLIENT_REVIEW_LINK` | `https://g.page/r/CXxxxxxxxx/review` |

## Sandbox → Production swap

Inside both workflows' **Config** node, swap two URLs when going live:

| Value | Sandbox | Production |
|---|---|---|
| `stBaseUrl` | `https://api-integration.servicetitan.io` | `https://api.servicetitan.io` |
| `stAuthUrl` | `https://auth-integration.servicetitan.io/connect/token` | `https://auth.servicetitan.io/connect/token` |

## Cloning to a new client (10-minute SOP)

1. In n8n, **Import from File** → import `workflow.json`. Rename to include client name.
2. **Import from File** → import `inbound-workflow.json`. Rename to include client name.
3. Set the 9 env vars above for this client.
4. In n8n, create the Twilio credential (Account SID + Auth Token).
5. Bind the Twilio credential to the outbound workflow's "Send SMS (Twilio)" node.
6. Activate both workflows. Copy the two production webhook URLs.
7. **ServiceTitan** → Settings → Integrations → Webhooks → Add Subscription:
   - Event: `Job.Completed`
   - URL: outbound webhook URL
8. **Twilio Console** → Phone Numbers → your number → "A MESSAGE COMES IN":
   - URL: inbound webhook URL
   - Method: HTTP POST
9. Test by completing one real job in sandbox. Confirm:
   - SMS arrives on your phone
   - Email arrives in inbox
   - Note appears on the customer in ServiceTitan
10. Reply STOP from your phone. Confirm:
    - Customer's `doNotMail` flag is set to true in ServiceTitan
    - A new Note is pinned to their record

## A2P 10DLC (US compliance — required, plan around it)

Twilio requires business brand + campaign registration before US carriers will
deliver high-volume A2P SMS. Submit at **Twilio Console → Trust Hub** for each
client. Approval takes **1–3 weeks**. The whole project blocks on this — kick
it off on Day 0.

Pre-registered messages (about 200/day per number) still send while waiting,
but at lower throughput and with deliverability warnings.

## Adding more follow-ups later

Same template, different trigger. Each is a new workflow file in this folder:

- **Unpaid invoice nudge** — Schedule trigger (daily). Source: `accounting/v2/invoices` filtered by `balance > 0` and `dueDate < today-3d`.
- **Maintenance reminder** — Schedule trigger (daily). Source: jobs of type `Tune-Up` completed exactly 6 / 12 months ago.
- **Estimate follow-up** — `Estimate.Created` webhook, then schedule +2d / +5d / +10d if not converted.

## Security

- Credentials live in n8n env / credentials store only. Never commit them.
- Write operations against ServiceTitan are limited to:
  1. POST customer notes (audit trail)
  2. PATCH customer doNotMail (opt-out handling)
- Twilio and Resend API keys live in env vars; rotate quarterly.
- Each client gets their own Twilio number + Resend domain — no cross-client mixing.
