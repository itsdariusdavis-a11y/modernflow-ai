# Daily Ops System — What Gets Sent, To Whom, and Why

The accountability layer that drives ModernFlow AI toward $3,000 MRR and replacing
Darius's 9-5. Three automated Routines + GHL-sent daily emails + the Wins Dashboard.

**Wins Dashboard (bookmark this):**
https://claude.ai/code/artifact/2147862c-4a06-49ed-8127-918151726634

---

## 1. What runs automatically (live now)

| When (PT)    | What                                                                                                                       | Delivery                                                    | Why                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 6:30am daily | **Daily Directive — Darius**: reads ACTION-PLAN + WINS-LOG, picks THE ONE next step for tonight                            | Notification email to itsdariusdavis@gmail.com + phone push | One action beats a list. Evenings are scarce; ambiguity kills them.                            |
| 8:00pm daily | **Nightly Wins + Dashboard**: logs the day's wins to `docs/WINS-LOG.md`, updates the dashboard, names tomorrow's one thing | Notification email + push; dashboard refreshed              | Stacking visible wins is the anti-stall mechanism — the Apr–Jul dark period happened silently. |
| Mon 9:00am   | **Weekly Business Review**: scoreboard vs. plan, drift check, top-3 for the week                                           | Notification email + push                                   | The zoom-out that catches building-instead-of-selling before it costs a month.                 |

Why these arrive as Claude notifications: the Gmail connector is **draft-only by
design** (it cannot send), and scheduled sessions can't use it anyway. Notification
delivery is guaranteed. For emails that must SEND — yours and Ryan's daily emails
from darius@modernflowai.com — GoHighLevel is the sender (next section).

**Upgrade (2 minutes, recommended):** recreate these three Routines in the claude.ai
Routines UI to attach your Gmail/Calendar/Fireflies connectors — the weekly review
then sees real pipeline data instead of repo-only evidence.

## 2. The daily EMAILS from darius@modernflowai.com (GHL — set up once, ~15 min)

GHL sends natively from your domain on a schedule — no drafts, no Claude in the send
path, and it's the GHL-first way. The content stays adaptive because both emails
point at the dashboard's "Next 3 moves," which the nightly Routine keeps current.

**Setup, in your agency's own sub-account:**

1. Settings → Email Services → verify the sending domain (modernflowai.com) or
   connect the darius@modernflowai.com mailbox via SMTP/Google — send a test.
2. Contacts → add two contacts: Darius (itsdariusdavis@gmail.com), Ryan
   (ryan@modernflowai.com). Tag both `team-daily`.
3. Automation → Workflows → Create → paste into Workflow AI:

```
Create a workflow that runs every day at 6:30 AM on a recurring schedule.
For every contact tagged "team-daily", send them an email from
darius@modernflowai.com. Use the email template named "MFA Daily — [their
first name]" — if per-contact templates aren't possible, use an If/Else
branch on the contact's first name (Darius / Ryan) and send the matching
email action. Mark the emails high priority/importance.
```

4. Paste the two templates below as the email bodies (both are also staged as Gmail
   drafts in your inbox so you can see the rendered format).
5. Send yourself a test run before trusting the schedule.

### Template — Darius (subject: 🚨 MFA Daily: tonight's one thing)

> **Tonight's one thing is on the board:** [Wins Dashboard →
> > https://claude.ai/code/artifact/2147862c-4a06-49ed-8127-918151726634] — do move #1.
> **The standing rules:** revenue actions before building, every deal gets a next
> step with a date, log the win at 8pm even if it's small.
> **This week's targets:** 10–15 touches per evening · 3+ strategy calls booked by
> day 14 · Ron Hayes follow-through until there's a yes or a no.
> One evening at a time. $3,000 MRR is 6 founding clients away.

### Template — Ryan (subject: 🔥 MFA Daily: today's sales targets)

> Morning — today's targets for ModernFlow:
> **1. Touches:** 25–35 today (calls 9–11am + 4–6pm, SMS/DM midday). Log every one
> in the pipeline.
> **2. Follow-ups first:** anyone from yesterday's conversations gets their next
> touch before any new outreach. Ron Hayes stays warm until there's a yes or a no.
> **3. Book to the calendar:** every real conversation gets offered two time slots
> on the spot. Target: 2 calls booked this week minimum.
> **Script + offer:** founding offer, $497/mo setup waived, first 10 clients —
> scripts are in the Command Center. Reply to this email with today's numbers:
> touches / conversations / calls booked.

Why Ryan's is different: his lane is volume and booking; the email is a target sheet
with a built-in reporting loop (reply with numbers), not a strategy memo. It reads as
normal ops cadence from Darius — nothing about audits or how the system behind it works.

## 3. The Wins Dashboard — how progress gets recorded

- **Source of truth:** `docs/WINS-LOG.md` (append-only, in the repo).
- **Log a win anytime:** tell any Claude session "log a win: [what happened]" — it
  appends, commits, and refreshes the dashboard. Or just do the work in the repo:
  commits and checked ACTION-PLAN boxes are auto-detected by the 8pm Routine.
- **Ryan's numbers:** his reply-to-email numbers get logged when you (or a session)
  add them: "log Ryan's numbers: 28 touches, 4 conversations, 1 call booked."
- **Dashboard shows:** MRR progress bar to $3,000, win streak, weekly touches, calls
  booked, warm deals, next 3 moves, and the full win history. Share it with Ryan
  from the artifact's share menu if you want him seeing the same board.

## 4. Managing the system

- Pause/adjust/delete any Routine: claude.ai → Routines. (IDs are also listed by
  asking Claude to "list triggers".)
- Change the ONE-thing logic: edit `docs/ACTION-PLAN.md` — the directive always
  pulls the topmost unchecked priority.
- The system never contacts former/cancelled clients and never sends anything to
  prospects on its own — outbound to humans stays draft-first with your review.
