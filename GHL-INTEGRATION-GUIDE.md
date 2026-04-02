# GoHighLevel Integration Guide — ModernFlow AI Website

**Prepared for:** ModernFlow AI  
**Date:** April 2026  

---

## Overview

Your ModernFlow AI website is now wired to send every contact form submission directly into GoHighLevel (GHL) as a new contact, trigger automated follow-up workflows, and notify you instantly. This guide walks you through every step needed to activate and extend that integration — from creating your first Inbound Webhook to setting up AI-powered follow-up sequences.

The integration uses GHL's **Inbound Webhook Workflow Trigger**, which is the most reliable, no-code-friendly method for receiving external form data into GHL. Once a visitor submits the contact form on your website, the data flows automatically: website → your server → GHL webhook → GHL contact created → automation workflow fires.

---

## Part 1: Setting Up the Contact Form Webhook

### Step 1 — Create an Inbound Webhook Workflow in GHL

1. Log in to your GoHighLevel account and navigate to **Automation → Workflows**.
2. Click **+ New Workflow** and select **Start from Scratch**.
3. Click **Add Trigger** and search for **"Inbound Webhook"**.
4. Select **Inbound Webhook** as the trigger. GHL will generate a unique webhook URL that looks like:
   ```
   https://services.leadconnectorhq.com/hooks/XXXXXXXX/webhook-trigger/YYYYYYYY
   ```
5. **Copy this URL** — you will need it in Step 2.

### Step 2 — Add the Webhook URL to Your Website

Your website is already coded to forward form submissions to this URL. You simply need to provide the URL as an environment variable:

1. In the Manus project dashboard, go to **Settings → Secrets**.
2. Add a new secret with the key `GHL_WEBHOOK_URL` and paste your copied webhook URL as the value.
3. The website server will automatically pick it up — no code changes needed.

### Step 3 — Map the Incoming Fields in GHL

After saving your workflow trigger, GHL needs to know what fields to expect. The website sends the following JSON payload:

| Field | GHL Mapping | Description |
|---|---|---|
| `firstName` | First Name | Extracted from the submitted full name |
| `lastName` | Last Name | Remainder of the full name after first word |
| `email` | Email | Contact's email address |
| `phone` | Phone | Contact's phone number (optional) |
| `customFields.businessType` | Custom Field: Business Type | Type of service business |
| `customFields.message` | Custom Field: Message | The visitor's message |
| `source` | Source | Always set to "ModernFlow AI Website" |
| `tags` | Tags | Automatically tagged as `website-contact-form` |

To map these in GHL: in your workflow, add a **"Create/Update Contact"** action immediately after the trigger. Use the field mapping panel to connect each incoming webhook field to the corresponding GHL contact field.

---

## Part 2: Automating Follow-Up After Form Submission

Once a contact is created, GHL can fire a full automation sequence. Below is the recommended workflow structure for ModernFlow AI.

### Recommended Workflow: "Website Lead — Instant Follow-Up"

```
[Trigger: Inbound Webhook]
       ↓
[Action: Create/Update Contact]
       ↓
[Action: Add Tag — "website-lead"]
       ↓
[Action: Send SMS — Instant Reply]
       ↓
[Wait: 5 minutes]
       ↓
[Action: Send Email — Welcome + Calendly Link]
       ↓
[Wait: 24 hours]
       ↓
[If/Else: Has booked a call? (check tag "call-booked")]
   → No: Send Follow-Up SMS + Email
   → Yes: End workflow / move to onboarding sequence
```

**Instant SMS Template:**
> Hi [First Name]! Thanks for reaching out to ModernFlow AI. We received your message and will be in touch shortly. Want to skip the wait? Book a free 30-min strategy call here: https://calendly.com/ryan-modernflowai/30min — Ryan, ModernFlow AI

**Welcome Email Template:**
> Subject: We got your message — here's what happens next
>
> Hi [First Name],
>
> Thanks for contacting ModernFlow AI. We help [Business Type] businesses like yours capture more leads, automate follow-ups, and grow revenue — without adding more work to your plate.
>
> I'd love to show you exactly what that looks like for your business. Book a free 30-minute strategy call here: https://calendly.com/ryan-modernflowai/30min
>
> Talk soon,
> Ryan
> ModernFlow AI

---

## Part 3: Embedding the GHL Chat Widget on Your Website

GoHighLevel provides a live chat widget that can be embedded on any external website. This gives visitors an instant way to start a conversation that flows directly into your GHL inbox.

### Step 1 — Create the Chat Widget

1. In GHL, navigate to **Sites → Chat Widgets**.
2. Click **+ New Widget** and choose your preferred type:
   - **Live Chat** — real-time messaging (requires someone online to respond)
   - **SMS Chat** — visitor sends their number and you reply via SMS (recommended for service businesses)
   - **All-in-One** — combines Live Chat, SMS, WhatsApp, and Facebook Messenger
3. Customize the widget color to match your brand (`#00C896` emerald green).
4. Set the widget position to **Bottom Right**.
5. Click **Save** and then **Get Code**.

### Step 2 — Add the Widget to Your Website

GHL provides a JavaScript snippet like this:

```html
<script src="https://widgets.leadconnectorhq.com/loader.js"
  data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
  data-widget-id="YOUR_WIDGET_ID">
</script>
```

To add this to your ModernFlow AI website:

1. Open the file `client/index.html` in your project.
2. Paste the GHL script snippet just before the closing `</body>` tag.
3. Save the file and create a new checkpoint to deploy.

> **Note:** The chat widget will automatically appear on all pages of your website as a floating button in the bottom-right corner.

---

## Part 4: Embedding the GHL Calendar (Booking Widget)

Your website currently uses Calendly for booking. If you want to consolidate everything inside GHL and avoid the Calendly subscription cost, you can replace it with GHL's built-in calendar embed.

### Step 1 — Set Up Your GHL Calendar

1. Navigate to **Calendars** in GHL.
2. Create a new calendar named "Free Strategy Call — 30 min".
3. Set availability, buffer times, and confirmation settings.
4. Connect your Google Calendar or Outlook for two-way sync.

### Step 2 — Get the Embed Code

1. Open your calendar settings and click **Embed Code**.
2. Choose **Inline Embed** or **Popup Embed**.
3. Copy the iframe code provided.

### Step 3 — Replace Calendly in the Website

Currently, the Calendly popup is triggered by the `useCalendly` hook in `client/src/hooks/useCalendly.ts`. To switch to GHL:

1. Replace the Calendly script in `client/index.html` with the GHL calendar embed script.
2. Update `useCalendly.ts` to call the GHL calendar popup function instead of `Calendly.initPopupWidget`.

> **Tip:** GHL calendars automatically create contacts and tag them as "booked" in your CRM — giving you better tracking than Calendly alone.

---

## Part 5: GoHighLevel Pipeline — Managing Your Leads

Every contact form submission creates a new contact in GHL. To track where each lead is in your sales process, set up a **Pipeline**.

### Recommended Pipeline: "ModernFlow AI Sales"

| Stage | Description | Trigger |
|---|---|---|
| **New Lead** | Just submitted the contact form | Webhook fires → contact created |
| **Contacted** | You've sent the first SMS/email | Manually move or automate |
| **Call Booked** | Prospect booked a strategy call | Calendly/GHL calendar webhook |
| **Proposal Sent** | You've sent a pricing proposal | Manual |
| **Closed — Won** | Signed up for a package | Manual |
| **Closed — Lost** | Not a fit / no response | Manual or automation |

To create this pipeline: navigate to **CRM → Pipelines → + New Pipeline** and add the stages above.

---

## Part 6: Additional GHL Features to Activate

The table below summarizes all GHL features that are relevant to ModernFlow AI's business model, with implementation priority.

| Feature | What It Does | Priority | How to Activate |
|---|---|---|---|
| **Inbound Webhook** | Receives contact form data from website | **Critical** | Part 1 of this guide |
| **Chat Widget** | Live chat / SMS chat on website | **High** | Part 3 of this guide |
| **Calendar Embed** | Replace Calendly with GHL calendar | **Medium** | Part 4 of this guide |
| **Pipeline CRM** | Track leads through sales stages | **High** | Part 5 of this guide |
| **Reputation Management** | Auto-request Google reviews after job completion | **High** | Automations → Review Request |
| **Email Marketing** | Broadcast campaigns to your contact list | **Medium** | Email → Campaigns |
| **SMS Campaigns** | Bulk SMS to segmented contact lists | **Medium** | SMS → Campaigns |
| **AI Conversation Bot** | Auto-respond to incoming chats/SMS using AI | **High** | Conversations → AI Settings |
| **Missed Call Text-Back** | Auto-SMS anyone who calls and you miss | **Critical** | Automations → Missed Call |
| **Forms Builder** | Replace website form with native GHL form | **Low** | Sites → Forms |
| **Funnel Builder** | Build landing pages inside GHL | **Low** | Sites → Funnels |
| **Reporting Dashboard** | Track leads, bookings, revenue | **Medium** | Reporting → Overview |

---

## Part 7: Missed Call Text-Back (Highest ROI Feature)

This is the single highest-ROI automation available in GHL for service businesses. When a potential customer calls your business and you don't answer, GHL automatically sends them a text message within seconds.

### Setup Instructions

1. Navigate to **Automations → Workflows → + New Workflow**.
2. Select the trigger **"Missed Call"**.
3. Add an action: **Send SMS** with the message:
   > Hi! Sorry I missed your call. I'm with a customer right now. Can I ask what you need help with? I'll get back to you ASAP. — Ryan, ModernFlow AI
4. Add a follow-up action: **Wait 1 hour**, then send another SMS if no reply:
   > Still here if you need help! Book a free 15-min call here: https://calendly.com/ryan-modernflowai/30min
5. Activate the workflow.

> This single automation typically recovers 20–40% of missed call leads that would otherwise go to a competitor.

---

## Summary Checklist

Use this checklist to track your GHL integration progress:

- [ ] Create Inbound Webhook workflow in GHL and copy the URL
- [ ] Add `GHL_WEBHOOK_URL` secret to your Manus website project
- [ ] Test the contact form and verify a new contact appears in GHL
- [ ] Set up the "Website Lead — Instant Follow-Up" automation workflow
- [ ] Create the GHL Chat Widget and embed it in the website
- [ ] Set up the Missed Call Text-Back workflow
- [ ] Create the "ModernFlow AI Sales" pipeline in GHL CRM
- [ ] Enable the AI Conversation Bot for incoming chats/SMS
- [ ] Set up Reputation Management for automated review requests
- [ ] (Optional) Replace Calendly with GHL Calendar embed

---

*For questions about this integration, contact ryan@modernflowai.com or book a call at https://calendly.com/ryan-modernflowai/30min.*
