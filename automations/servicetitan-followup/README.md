# ServiceTitan → GHL Post-Job Follow-Up

Replicable n8n workflow that fires a thank-you + review request through
GoHighLevel within minutes of every completed ServiceTitan job. Built once,
cloned per client.

## Files

| File | Purpose |
|---|---|
| `workflow.json` | n8n workflow template. Import this. |
| `CLIENT-ONBOARDING.md` | Customer-facing doc — what we need from them to turn it on. |
| `README.md` | This file — internal SOP for replicating to a new client. |

## Architecture

```
ServiceTitan webhook (job-complete)
        │
        ▼
n8n workflow (this template)
  ├── OAuth token (client-credentials)
  ├── GET job          (jpm/v2/.../jobs/{id})
  ├── GET customer     (crm/v2/.../customers/{id})
  ├── Eligibility gate (jobStatus === Completed, !doNotMail)
  ├── Build GHL payload
  ├── POST to GHL Inbound Webhook  ← GHL workflow sends SMS + email
  └── POST Note back to ServiceTitan (audit trail)
```

GHL owns the actual SMS/email send. n8n is the glue + enricher.

## Per-client environment variables

Each cloned workflow reads these from n8n env (or n8n credentials, your call).
Set them per client / per n8n instance:

| Var | Source |
|---|---|
| `ST_TENANT_ID` | ServiceTitan API Application Access page |
| `ST_APP_KEY` | ServiceTitan — shown once on app approval |
| `ST_CLIENT_ID` | ServiceTitan app detail page |
| `ST_CLIENT_SECRET` | ServiceTitan — shown once on generation |
| `GHL_FOLLOWUP_WEBHOOK_URL` | GHL → Automation → Workflow → Inbound Webhook trigger |
| `CLIENT_REVIEW_LINK` | Client's Google review short link |
| `CLIENT_BUSINESS_NAME` | Used in message templates |

For production, swap the two URLs inside the `Config (per-client)` node:

- `stBaseUrl`: `https://api-integration.servicetitan.io` → `https://api.servicetitan.io`
- `stAuthUrl`: `https://auth-integration.servicetitan.io/connect/token` → `https://auth.servicetitan.io/connect/token`

## Cloning to a new client (10-minute SOP)

1. In n8n, **Import from File** → select `workflow.json`.
2. Rename: `ServiceTitan → GHL Follow-Up — <Client Name>`.
3. Set the seven env vars above for the new client.
4. **Activate** the workflow. Copy the production webhook URL.
5. In ServiceTitan: **Settings → Integrations → Webhooks → Add Subscription**:
   - Event: `Job.Completed` (or whichever the tenant uses)
   - URL: paste the n8n production webhook URL
6. In GHL: create the **Inbound Webhook** workflow with these incoming fields
   (matches the payload built by `Build GHL Payload`):
   - `firstName`, `lastName`, `email`, `phone`, `source`, `tags`
   - Custom fields: `jobId`, `jobType`, `completedAt`, `technicianName`,
     `invoiceTotal`, `reviewLink`, `businessName`
7. GHL workflow actions (recommended):
   - Wait 2 hours
   - Send SMS: `Hi {{firstName}}, thanks for choosing {{businessName}} today! If we earned 5 stars, would you mind sharing? {{reviewLink}}`
   - Wait 2 days, branch: tag `review-left` → end, else send polite email reminder
8. Test against one job in the integration tenant. Confirm:
   - Note appears on the customer in ServiceTitan
   - Contact appears in GHL with custom fields
   - SMS arrives (use your own phone for the test job)

## Adding more follow-ups later

This workflow is one "lane". The same template clones for:

- **Unpaid invoice nudge** — trigger: Schedule (daily), source: `accounting/v2/invoices` filtered by `balance > 0` and `dueDate < today-3d`.
- **Maintenance reminder** — trigger: Schedule (daily), source: jobs of type `Tune-Up` completed exactly 6 / 12 months ago.
- **Estimate follow-up** — trigger: `Estimate.Created` webhook, schedule: +2d / +5d / +10d if not converted.

Each is a separate workflow file in this folder when we build it.

## Rate limits & retries

- ServiceTitan: per-tenant, per-endpoint. The HTTP Request nodes use n8n's
  default retry (3 attempts, exponential). Increase if a client has high volume.
- OAuth token is re-fetched per run. For >1000 jobs/day add a Code node that
  caches the token in workflow static data until expiry.

## Security

- Credentials only in n8n env / credentials store. Never commit them.
- Note-write is the only write operation against ServiceTitan. Everything else
  is read.
- GHL webhook URL is treated as a secret (anyone with it can inject contacts).
