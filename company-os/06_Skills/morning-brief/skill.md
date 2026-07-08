---
name: Morning Brief
description: Produces the ModernFlow AI morning operating brief from email,
calendar, pipeline, and inbox files. Read-only — it never sends, drafts, or
moves anything.
---

# Purpose

Reduce email, calendar, pipeline, and inbox noise into a decision-ready brief under 500 words.

# Required inputs

- Email from the last 18 hours
- Today's calendar (plus tomorrow morning)
- 04-operating-context.md
- Recent files in 00_Inbox
- Unresolved items in 05_Logs

# Process

1. Scan inputs and classify: needs attention before noon / meetings today / waiting on me / can wait.
2. For each strategy call on the calendar, check whether a prospect brief exists in 04_Review; flag missing prep.
3. Surface any client build approaching the 2–3 week promise or any client inside their 30-day guarantee window.
4. Identify the single action most connected to this week's main outcome.
5. Save to 03_Outputs/morning-brief-[YYYY-MM-DD].md.

# Output structure

1. Needs my attention before noon
2. Meetings today (time, purpose, prep needed, unresolved commitments)
3. Waiting for me
4. Can wait
5. One business priority
6. Questions

# Quality checks

- Under 500 words
- Newsletters and automated notices never classified as urgent
- Client-facing deadlines rank above internal work
- Anything requiring human approval is highlighted, not acted on

# Approval boundary

Never send an email or SMS.
Never create drafts in the email client.
Never move or delete files.
Never modify the calendar.
