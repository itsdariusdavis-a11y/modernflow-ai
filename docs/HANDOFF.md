# ModernFlow AI — Session Handoff

Read this first; update it last (see "Session handoff" in CLAUDE.md). Newest entries go at the top.

## Open items
- **Default session model:** operator switched sessions to Sonnet on 2026-11-27. Escalate to Opus by hand only for strategy, hard debugging or final review. `opusplan` not adopted (plan mode is rarely used). Agent frontmatter (PR #12) covers delegated work.
- **Approvals:** `.claude/settings.json` now allows the Base44 tools without prompts. Base44's platform API (`execute_api`, which covers publishing, secrets and payments) still prompts on purpose. A wider allow-list (shell, edits, read and draft tools across connectors) was proposed but not applied; adding it is the operator's call. It only takes effect once this branch is merged to `main`.
- **Speed:** the operator prefers fewer approvals and accepts the trade-offs. Use Auto mode when it's offered. Sends, publishes, deletes and CRM writes still need a draft or approval first (see the Safety rules).

## Session log
- **2026-11-27, branch `claude/adoring-feynman-qjnq1d`.** Model-cost audit: 10 of 13 agents in `.claude/agents/` had no `model:` and silently inherited the session model (breaking the CLAUDE.md tiering rule). Set them: `scheduling-agent` haiku; `modernflow-ops` opus; all other process agents sonnet. Researched third-party auto-routers (gearbox, claude-model-router, claude-smart-model-router, claude-code-router) and rejected installing any: none can switch the main conversation's model mid-turn, they only route subagents (which the frontmatter now does), and claude-code-router needs API keys and doesn't fit subscription cloud sessions. Also rejected reverse-api-engineer and Open-Higgsfield-AI earlier this session (no concrete need; Firecrawl and the real Higgsfield are already connected). Not verified by a live run of each agent. Operator then set Sonnet as the session default. Declined CLI-Anything (wraps GUI apps, doesn't replace SaaS connectors, no named need). PR #12 merged at operator's request.
- **2026-11-22, branch `claude/tender-fermat-8kwmvj`.** Evaluated aweshell.ai and rejected it: static-only, early-stage, and it can't run the site's server-side contact form; Netlify stays the deploy path. Connected Base44 and verified it with a live call. Added Base44 allow rules. Added this handoff system. No site code changed.
