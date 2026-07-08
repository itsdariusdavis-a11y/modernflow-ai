---
name: client-onboarding
description: Run the ModernFlow AI new-client onboarding checklist end to end. Use when a deal closes or the user says "onboard [client]" / "set up the new client." Args (optional): client name and tier (Starter/Growth/Elite). Produces tasks, drafts client-facing messages, and provisions tier-appropriate automations.
---

# Client onboarding

Take a Closed Won deal to live and delivering. Fast path for `crm-onboarding-agent` /
`docs/sops/03-crm-onboarding.md`.

## Steps

1. **Confirm** client name and **paid tier** (provision only what they bought).
2. **Welcome:** draft welcome email + send the intake form (business info, service area,
   hours, current tools, review profiles, branding). Hand kickoff-call timing to `/book-call`.
3. **Provision in GoHighLevel** by tier:
   - All tiers: speed-to-lead (instant text/email + missed-call text-back), online
     booking + reminders, review-request automation.
   - Growth/Elite: nurture sequences, reporting dashboard. Elite: reactivation campaign.
4. **Connect:** phone number, Google Business Profile, calendar, website form.
5. **Test:** push a test lead through every automation before go-live.
6. **Go-live + train:** short training video, confirm first results, set check-in cadence.

Output the checklist as tracked tasks with owners and due dates, and update the CRM stage
to Onboarding → Live.

## Guardrails

- Draft all client-facing messages for approval before sending.
- Match automations to the paid tier — don't give away higher-tier features.
- Verify each automation with a test before telling the client it's live.
- Don't bulk-edit or delete CRM records without confirmation.
