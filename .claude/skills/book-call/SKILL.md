---
name: book-call
description: Book a ModernFlow AI call (strategy/sales, kickoff, or check-in) on the calendar without double-booking. Use when the user wants to schedule a meeting, offer times, or convert a positive reply into a booked call. Args (optional): who, purpose, duration, timezone. Confirms before creating multi-person events.
---

# Book a call

Get a call on the calendar cleanly. Fast path for `scheduling-agent` /
`docs/sops/04-booking-scheduling.md`.

## Steps

1. **Confirm:** purpose, duration (strategy/sales 30m · kickoff 45m · check-in 15m),
   attendees, and **timezone** (always confirm timezone).
2. **Find times:** check the host calendar, respect business hours + 15-min buffers, and
   propose 2–3 open slots in the invitee's timezone.
3. **Create the event:** title "ModernFlow ⟂ {Company} — {Type}", agenda/goal in the
   description, attendees added, reminders at 24h + 1h. Show the invite before sending
   unless told to just book it.
4. **Hand off:** pass the booked-call context to `/meeting-recap` so the follow-up loop
   is ready.

## Guardrails

- Confirm before creating/editing/deleting any event with other people.
- Never double-book the host; respect buffers.
- Get the timezone right — it's the top cause of no-shows.
