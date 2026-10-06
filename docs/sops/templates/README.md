# SOP templates

## reply-label-log.csv

Header + synthetic example rows only. **Do not commit real replies, names, emails, or
phone numbers** (CLAUDE.md PII rule). Keep the live log in a private Google Sheet/Drive
copy of this file, with excerpts redacted of identifying details.

Why it exists: we can't judge any reply classifier — Claude, a small LLM, keyword rules,
or a vendor API like Jev — without human-corrected labels. Target: 100+ labelled rows
before running any comparison (`docs/references/jev-system-one/README.md`). Review the
`corrected` column monthly; a high correction rate means fix the rubric before adding tools.
