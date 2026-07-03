# CLAUDE.md

Marketing site + backend for ModernFlow AI (AI automation agency for service
businesses). React 19 + TypeScript + Tailwind CSS 4 frontend, Express + tRPC
backend, Drizzle ORM on MySQL. Package manager is **pnpm**.

## Commands

```bash
pnpm dev        # dev server (tsx watch server/_core/index.ts)
pnpm check      # typecheck (tsc --noEmit)
pnpm test       # vitest run
pnpm build      # vite build + esbuild server bundle
pnpm format     # prettier --write .
pnpm db:push    # drizzle-kit generate && migrate
```

## Layout

- `client/src/` — frontend: `pages/`, `components/` (shadcn/ui under
  `components/ui`), `hooks/`, `contexts/`. Import alias `@/` → `client/src`.
- `server/` — `routers.ts` is the tRPC app router; `server/_core/` is plumbing
  (trpc setup, env, cookies/auth, notifications, LLM helpers). Contact form
  forwards to a GoHighLevel webhook (`GHL_WEBHOOK_URL`).
- `shared/` — cross-cutting types/constants. Import alias `@shared/`.
- `drizzle/` — schema + migrations.
- `sports/`, `baby-walking-tracker/` — independent sub-apps with their own
  package.json; changes there don't touch the main site and vice versa.

## Delegation policy (orchestrator/worker tiering)

This repo defines a tiered subagent fleet in `.claude/agents/`. The intent
(after the Fable 5 orchestrator playbook): the top-level session makes the
decisions that compound — decomposition, dispatch, judging returned work,
synthesis — and bounded work goes to cheaper workers. A worker mistake is local
and cheap to retry; an orchestration mistake multiplies across every worker.

- **scout** (haiku) — read-only search/summarization. Use for "where is X /
  how does Y work" questions where only the conclusion is needed.
- **implementer** (sonnet) — well-specified, self-contained coding tasks with
  acceptance criteria stated in the prompt. Give it the plan; don't ask it to
  make design decisions.
- **verifier** (haiku) — runs `pnpm check` / `pnpm test` / `pnpm build` and
  reports raw results; it never fixes.

Guidelines for the orchestrating session:

- Keep planning, architectural choices, schema changes, conflict resolution,
  and final review at the top level. Delegate bounded slices, not judgment.
- Every agent in `.claude/agents/` must declare an explicit `model:` —
  subagents default to `inherit`, which silently bills workers at the
  top-level model's rate. Keep that rule when adding agents.
- Verify worker output against the original requirements you still hold in
  context; don't take "done" on faith — the verifier exists to make that
  cheap.
- Prompts to workers should be self-contained: goal, files in scope,
  acceptance criteria, and what to do when blocked (report back, don't
  improvise).
