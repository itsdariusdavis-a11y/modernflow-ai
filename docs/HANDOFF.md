# ModernFlow AI — Session Handoff

Read this first; update it last (see "Session handoff" in CLAUDE.md). Newest entries go at the top.

## Open items
- **Approvals:** `.claude/settings.json` now allows the Base44 tools without prompts. Base44's platform API (`execute_api`, which covers publishing, secrets and payments) still prompts on purpose. A wider allow-list (shell, edits, read and draft tools across connectors) was proposed but not applied; adding it is the operator's call. It only takes effect once this branch is merged to `main`.
- **Speed:** the operator prefers fewer approvals and accepts the trade-offs. Use Auto mode when it's offered. Sends, publishes, deletes and CRM writes still need a draft or approval first (see the Safety rules).

## Session log
- **2026-11-22, branch `claude/tender-fermat-8kwmvj`.** Evaluated aweshell.ai and rejected it: static-only, early-stage, and it can't run the site's server-side contact form; Netlify stays the deploy path. Connected Base44 and verified it with a live call. Added Base44 allow rules. Added this handoff system. No site code changed.
