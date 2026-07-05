# Decisions — Architectural Choices & Reasons

| # | Date | Decision | Reason |
|---|------|----------|--------|
| 1 | 2026-07-05 | Adopt B.L.A.S.T. protocol + A.N.T. 3-layer structure for all new system builds in this repo | User directive. Separates probabilistic reasoning (Navigation) from deterministic business logic (Tools) with SOPs (Architecture) as source of truth. |
| 2 | 2026-07-05 | `/.tmp/` is gitignored; all intermediate file operations route through it | Protocol rule: intermediates are ephemeral, only payloads are deliverables. Keeps repo clean. |
| 3 | 2026-07-05 | Committed `.env.example` (not `.env`) with known required vars (`GHL_WEBHOOK_URL`, `DATABASE_URL`, `JWT_SECRET`) | Credentials never enter git; `.env` already gitignored. Example file documents the contract for Phase L verification. |
| 4 | 2026-07-05 | Existing site code (`client/`, `server/`, `shared/`) left completely untouched during initialization | Surgical Changes principle — nothing was asked of the site yet; the Blueprint will define scope. |
| 5 | 2026-07-05 | CLAUDE.md schema sections initialized as explicit `PENDING` placeholders rather than guessed shapes | Data-First rule: never guess business logic or payload shape; coding is blocked until user confirms. |
