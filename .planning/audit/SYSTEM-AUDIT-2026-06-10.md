# System Audit — modernflow-ai

**Date:** 2026-06-10
**Auditor:** Claude (principal-level systems audit, read-only)
**Scope:** `itsdariusdavis-a11y/modernflow-ai`, branch `claude/model-ysbyad` (identical to `origin/main` at `29dc2ca`)

---

## Executive Summary

**Overall health grade: B.** This is not a knowledge vault or business operating system — it is a small, clean software repo containing two unrelated products: a dormant marketing website for the ModernFlow AI agency, and an actively-automated MLB matchup dashboard that commits data snapshots to `main` three times a day. Hygiene fundamentals are strong: the working tree is clean, a GitHub remote exists, no secrets were found on disk or anywhere in the 39-commit history, and the one automation (GitHub Actions) is verifiably running as of today. The grade is held below A by three things: the two-products-one-repo structure means a bot writes to `main` daily and has drowned the website's history (19 of 39 commits are snapshot noise); the root README has drifted from reality (it describes stats the site no longer shows and never mentions `sports/`, the most active part of the repo); and the marketing site ships fabricated testimonials and metrics, which is a real legal/trust exposure if the site is live for a real business. Top 3 risks: fabricated marketing claims, silent-failure modes in the snapshot workflow (the commit/push step swallows errors), and Manus platform coupling that makes the advertised "migrate anywhere" guides quietly lossy. Top 3 opportunities: split `sports/` into its own repo, prune the ~100KB of dead template scaffolding, and bring the README back in sync so a cold start actually works.

---

## Phase 1 — Repo Map

**Purpose:** (1) `/` (root, client/server/shared) — full-stack marketing website for ModernFlow AI, an AI-automation agency for contractors. Built with Manus AI, last functionally touched ~2026-04-02. (2) `sports/` — MLB daily matchup dashboard, added later, automated via GitHub Actions since 2026-06-04.

**Layer A (knowledge & content system): barely exists.** There is no vault, no transcripts, no content pipeline, no Claude Code config — just five markdown docs at root. This audit is weighted almost entirely toward Layer B (embedded software), with docs assessed under documentation/onboarding.

**Layer B (embedded software): two projects, one repo, one automation.**

### Top-level inventory

| Entry | Class | Status | Notes |
|---|---|---|---|
| `client/` | software | dormant (untouched since ~Apr 2026) | React 19 marketing site; 13 section components + ~53 shadcn/ui components |
| `server/` | software | dormant | Express + tRPC; contact form → GoHighLevel webhook; Manus template `_core/` |
| `shared/` | software | dormant | Tiny shared constants/types |
| `drizzle/` | config | dormant | Schema (`users` only) + one SQL file; `migrations/` dir is empty |
| `sports/` | software | **active** (automated 3×/day) | MLB dashboard: React/Vite dev app + zero-build `live/index.html` + snapshot script |
| `.github/workflows/` | config | **active** | One workflow: `deploy-sports.yml` (cron 3×/day + Pages deploy) |
| `patches/` | config | active (load-bearing) | `wouter@3.7.1.patch`, wired in `package.json` `patchedDependencies` |
| `README.md` | content | stale | Describes the website only; drifted (see findings) |
| `AI-PLATFORM-MIGRATION-GUIDE.md` | content | stale | Migration to Lovable/Bolt/v0; contains likely-dead CDN link |
| `FREE-HOSTING-GUIDE.md` | content | usable | Netlify/Vercel/Cloudflare + GHL-builder paths |
| `GHL-INTEGRATION-GUIDE.md` | content | usable | GoHighLevel webhook setup |
| `ideas.md` | archive-candidate | dead | Raw AI design-brainstorm output (contains literal `<response>`/`<probability>` tags) |
| `.gitkeep` | archive-candidate | dead | Pointless at a non-empty root |
| `package.json`, lockfile, `tsconfig*`, `vite.config.ts`, `vitest.config.ts`, `components.json`, `.prettier*`, `.gitignore` | config | active | Standard, healthy |

### Automation inventory

Exactly one automation. No launchd/cron-on-machine, no agents, no sync scripts.

| Job | Entry point | Schedule | Logs | Last evidence of running |
|---|---|---|---|---|
| MLB daily snapshot + Pages deploy | `.github/workflows/deploy-sports.yml` → `sports/scripts/build-snapshot.mjs` | cron `30 13/17/22 * * *` UTC (3×/day) + push + manual dispatch | Actions run logs only; no alerting | **Today** — commit `29dc2ca` (2026-06-10, 13:30 UTC run); snapshots daily since 2026-06-04 |

### Claude Code layer

**Nonexistent in this repo** — no `CLAUDE.md`, no `.claude/`, no `.mcp.json` (verified by find). Always-loaded context cost: zero. The `~/.claude` directory present in this session belongs to the remote-execution harness, not the repo.

### Surprises

- A bot pushes directly to `main` three times a day (`deploy-sports.yml` has `contents: write`), so `main`'s recent history is 100% snapshot commits.
- The repo's most active component (`sports/`) is invisible from the root README.
- Git history total is only 768KB after 6 days of snapshot commits — growth is real but currently modest.

---

## Phase 2 — Audit Report

### Strengths (preserve these)

- **Zero secrets, verified.** Grep for key/token/webhook patterns across the working tree **and every commit in history** found only documented placeholders (`README.md:85`, `GHL-INTEGRATION-GUIDE.md:25`). `.env` files are gitignored; `sports/.env.example` is the right pattern. **(fact)**
- **Clean git state with off-machine backup.** Working tree clean, remote on GitHub, `claude/model-ysbyad` == `origin/main`. **(fact)**
- **The snapshot workflow is thoughtfully engineered** for a solo operator: fail-soft Pages steps with explanatory comments, commit-loop guard (`[skip ci]` + path excludes at `deploy-sports.yml:27-29`), manual dispatch with a date input, and the script has per-source try/catch fallbacks (`build-snapshot.mjs:193,220`) and bounded concurrency (`POOL = 6`). **(fact)**
- **Server code degrades gracefully:** zod-validated contact endpoint that never fails the user on downstream errors (`server/routers.ts:34-81`); lazy DB connection so tooling runs without a database (`server/db.ts:8-19`). Tests exist (2 vitest files, `server/contact.submit.test.ts` with ~21 assertions). **(fact)**
- **`sports/live/index.html` zero-build design** (snapshot-first paint + live refresh + localStorage day-cache + `?api=` proxy escape hatch) is genuinely good solo-operator engineering, and `sports/README.md` documents every API endpoint used. **(fact)**

### Findings

**Severity order. Each tagged fact / judgment.**

#### F1 — Fabricated marketing content on a live-intent business site — **High (judgment, evidence cited)**
- **What:** Six testimonials with invented names/locations (`client/src/components/Results.tsx:12-38`: "Mike Thompson, San Diego", "Maria Gonzalez, Austin", …) — commit `d4d05bb` explicitly says *"realistic headshot photos … with real-sounding names"*. Stats section claims "150+ Contractors Served", "3.2x Average ROI" (`client/src/components/Stats.tsx`).
- **Why it matters:** If this site is (or goes) live for a real agency, fake testimonials and unsubstantiated performance claims are FTC-actionable in the US and destroy trust if discovered. This is the single finding most likely to hurt the business rather than the codebase.
- **Decision required from owner** — replace with real client results, clearly-labeled illustrative examples, or remove the section.

#### F2 — Two unrelated products share one repo, and a bot owns `main` — **High (fact + judgment)**
- **What:** The website and the MLB dashboard cohabit; `deploy-sports.yml` runs with `contents: write` and pushes `sports/live/today.json` to `main` 3×/day (`deploy-sports.yml:60-72`). 19 of the repo's 39 commits are `chore: daily MLB snapshot`.
- **Why it matters:** (a) `git log` is useless for the website — the last 15 commits are all snapshot noise; (b) branch protection on `main` is impossible without breaking the automation; (c) repo history grows ~325KB/day of JSON blobs indefinitely (currently 768KB total — fine today, not in a year); (d) anything that watches `main` (deploy hooks, AI-builder imports per the migration guides) re-triggers 3×/day for data-only changes.
- **Judgment:** split `sports/` into its own repo (Task plan M2).

#### F3 — Snapshot workflow can fail silently — **Medium (fact)**
- **What:** The snapshot-commit step is `continue-on-error: true` and the push failure path is swallowed: `git push … || echo "⚠️ snapshot push blocked"` (`deploy-sports.yml:60,72`). All Pages steps are also `continue-on-error`. There is no failure notification of any kind.
- **Why it matters:** If pushes start failing (token expiry, branch protection added later, permissions change), the dashboard quietly serves stale data and the Actions run stays green — the operator finds out from the product, not the system. Note the build step itself *would* fail the run if the MLB API breaks, so total blindness is limited to the commit/deploy half.

#### F4 — Root README has drifted from the code — **Medium (fact)**
- **What:** `README.md` (Site Sections #3) claims Stats shows "500+ clients, 98% retention, $2.4M revenue, 24/7 uptime"; `Stats.tsx` actually shows "< 5 min response, 3.2x ROI, 150+ contractors, 24/7". The README never mentions `sports/`, the workflow, or that `main` receives automated commits.
- **Why it matters:** A cold reader (or an AI builder importing the repo per the guides) gets a materially wrong picture: stale content claims, and a daily automation they don't know exists until it pushes over their work.

#### F5 — Manus platform coupling makes the "migrate anywhere" story quietly lossy — **Medium (fact)**
- **What:** Auth (`server/_core/oauth.ts`), storage (`server/storage.ts:8-19`, requires `BUILT_IN_FORGE_API_URL/KEY`), and owner notification (`server/_core/notification.ts`, called from `server/routers.ts:71-78`) all depend on Manus-injected env (`server/_core/env.ts`). The contact form's second delivery channel — notify-owner — catches errors and logs (`routers.ts:76-78`), so off-Manus it silently no-ops.
- **Why it matters:** All three guides sell migration to Netlify/Vercel/Lovable, but a migrated site keeps only the GHL webhook leg; if `GHL_WEBHOOK_URL` is also unset, contact submissions return `{success: true}` to the visitor and go **nowhere**. That's a lost-lead failure mode with zero visible symptom.

#### F6 — ~100KB+ of dead template scaffolding obscures the real app — **Medium (fact)**
- **What:** `client/src/pages/ComponentShowcase.tsx` (58KB, the largest source file) is imported nowhere (verified by grep). Also unused by any page: `AIChatBox.tsx`, `DashboardLayout.tsx`, `Map.tsx`, and server-side `_core/llm.ts`, `voiceTranscription.ts`, `imageGeneration.ts`, `map.ts`; ~53 shadcn/ui components exist for a one-page site that uses a handful. `axios` is a dependency used only inside template `_core/sdk.ts`.
- **Why it matters:** Calibrated for a solo operator this is Manus-template normal, but it directly undercuts the repo's stated use case — being imported into AI builders — where dead 58KB files burn context and confuse the importing model about what the app is.

#### F7 — Stale comment contradicts the workflow's actual behavior — **Low (fact)**
- **What:** `deploy-sports.yml:7-8` says *"The snapshot is baked into the Pages artifact (**not committed**), so the repo stays clean"* — directly above a step that commits `today.json` to `main` (`deploy-sports.yml:60-72`).
- **Why it matters:** The header is the first thing a future maintainer reads; it asserts the opposite of what the file does.

#### F8 — Migration guide's "recommended" path points at a session-scoped CDN link — **Low (fact, link liveness unverified)**
- **What:** `AI-PLATFORM-MIGRATION-GUIDE.md` (~line 14) recommends downloading source from `files.manuscdn.com/user_upload_by_module/session_file/…` — a Manus session-upload URL. Could not verify liveness from this sandbox, but session-file URLs typically expire.
- **Why it matters:** The guide's Option 1 likely 404s; Option "import the GitHub repo" works and should be primary.

#### F9 — Unused DB/auth stack on a static marketing site — **Low (judgment)**
- **What:** MySQL/Drizzle with a single `users` table, JWT auth, OAuth — for a site whose own guides recommend deploying as a static `dist/`. `drizzle/migrations/` is empty while `0000_optimal_gateway.sql` sits at `drizzle/` root.
- **Why it matters:** Every migration target inherits `DATABASE_URL`/`JWT_SECRET` requirements it doesn't need. Acceptable mess (template default) — flagged for the deprecation decision, not urgent work.

#### F10 — Root flotsam — **Low (fact)**
- **What:** `ideas.md` is raw AI-session output with literal `<response>`/`<probability>` markup; `.gitkeep` at a non-empty root; sports has its own `pnpm-lock.yaml` while root pins `pnpm@10.4.1` and `sports/README.md` says `npm install`; `package.json` declares MIT license but there is no `LICENSE` file.
- **Why it matters:** Pure findability/polish; each is a one-line fix.

**Healthy dimensions (one line each):** Secrets & security — clean, verified across full history. Git hygiene — clean tree, sane `.gitignore`, no build artifacts or editor state tracked, repo 2.4MB. Claude Code system — absent, nothing to audit. Knowledge lifecycle — only unbounded-growth surface is the snapshot commits (covered in F2). Dependency staleness — versions are recent (React 19, Vite 7, TS 5.9); registry-currency could not be checked from this sandbox.

**Audit tiers applied:** DEEP — `sports/` (the active project: workflow, script, live page) and `server/` (the business-carrying contact path). LIGHT — `client/` UI components (structure + dead-code only), `drizzle/`, guides (skimmed for drift/secrets).

---

## Phase 3 — Improvement Strategy

### Theme 1: One repo, two products → separate them
Most of the structural findings (F2, F3, F4-partially, F7) trace to the MLB dashboard being bolted into the website repo because that's where the session happened to be. **Target state:** `sports/` lives in its own repo with its own Actions workflow, Pages site, and history; `modernflow-ai` returns to being a quiet website repo where `main` means "the website changed." **Principle:** a repo's history should be a signal about one product.

### Theme 2: Failure visibility for the one automation
The system's only moving part can partially fail without anyone knowing (F3). **Target state:** any failed step in the snapshot workflow produces a notification (GitHub Actions failure email is free: stop `continue-on-error`-ing the commit step; let real failures fail). **Principle:** a solo operator's automations must page the operator, because nobody else will notice.

### Theme 3: Docs that match reality
F4, F7, F8 are all "the doc says X, the code does Y." **Target state:** README accurately describes both products (or, post-split, one each), the workflow header matches behavior, guides lead with the working path. **Principle:** for a repo explicitly designed to be handed to AI builders and future hosts, the README *is* the interface.

### Theme 4: Truth in the product content
F1 stands alone but is the highest business-risk item. **Target state:** every claim on the site is real, sourced, or visibly illustrative. **Principle:** the website is a legal artifact, not just code.

### Non-goals (explicitly not fixing)
- **The Manus template scaffolding beyond dead-file deletion** (F9): ripping out DB/auth/`_core` is a half-rewrite of a working template for negligible payoff while the site is dormant. Delete what's provably dead; leave the framework.
- **shadcn/ui component pruning beyond the unused top-level components:** the `ui/` folder is conventional and harmless.
- **Backfilling tests for the sports dashboard:** it's a read-only data viewer with graceful degradation; manual verification is proportionate.
- **Rewriting git history to purge snapshot commits:** history is only 768KB; a rewrite risks breaking the remote for zero practical gain. The split (Theme 1) stops the bleeding instead.

### Definition of done (measurable)
1. `git log --oneline -20` on `modernflow-ai@main` contains zero `chore: daily MLB snapshot` commits going forward.
2. The snapshot workflow has zero `continue-on-error` on steps whose failure means stale data, and a failed run produces a notification.
3. README's described content matches `Stats.tsx`/`Results.tsx` verbatim, and every top-level directory is mentioned.
4. `grep -r ComponentShowcase client/` returns nothing; repo contains no source file with zero inbound references (excluding `ui/`).
5. Site contains zero unverifiable testimonials/metrics (owner-confirmed).

---

## Phase 4 — Task Plan

### Milestone 0 — Safety net
*The tree is already clean and pushed; the safety net is small.*

| # | Task | Effort | Risk | Deps |
|---|---|---|---|---|
| 0.1 | **Reference inventory for the split.** Enumerate everything that points at `sports/` living in this repo: `.github/workflows/deploy-sports.yml` (paths, checkout, Pages), `sports/README.md` + `sports/live/README.md` (workflow paths, Pages instructions), githack URL pattern (`raw.githack.com/<owner>/modernflow-ai/main/sports/live/today.json` — consumers unknown, must be confirmed by owner), root README (currently no reference — add one or split first). Output: checklist in `.planning/`. | S | none | — |
| 0.2 | **Confirm Pages/githack consumers.** Check repo Settings → Pages status and who/what loads the live dashboard URL today, so the split doesn't 404 a bookmark. | S | none | — |

### Milestone 1 — Critical
| # | Task | Effort | Risk | Deps |
|---|---|---|---|---|
| 1.1 | **Resolve fabricated content (F1).** Owner decides per Open Questions; then edit `Results.tsx`, `Stats.tsx` (and README's section list to match). Acceptance: no unverifiable claims; README matches components. | S–M | low (content-only) | owner decision |
| 1.2 | **Make snapshot failures loud (F3).** In `deploy-sports.yml`: remove `continue-on-error` from the commit step and replace the `\|\| echo` swallow with a hard fail; keep fail-soft *only* on the Pages steps gated by `configure.outcome` (that one is intentional); rely on GitHub's failed-workflow email, or add a final `if: failure()` notify step. Acceptance: a forced push-failure run shows red and notifies. | S | low | — |

### Milestone 2 — High-leverage structure
| # | Task | Effort | Risk | Deps |
|---|---|---|---|---|
| 2.1 | **Split `sports/` into its own repo (F2).** See sketch below. **Breakage list:** `.github/workflows/deploy-sports.yml` (moves to new repo; all `sports/…` path prefixes drop), GitHub Pages URL changes (`<owner>.github.io/modernflow-ai` → `…/mlb-dashboard`), githack/raw URLs to `today.json` change owner/repo segment, `sports/README.md:24` + `sports/live/README.md` workflow-path references, root README (add pointer to new repo), scheduled-workflow default-branch requirement (new repo's `main`). | M | medium (URL consumers) | 0.1, 0.2 |
| 2.2 | **README refresh (F4).** Fix the Stats description, document the `sports/` situation (pre-split) or link the new repo (post-split), note the wouter patch, add a one-line "automation pushes to main" warning if split hasn't happened yet. Breakage: none (doc-only). | S | none | best after 2.1 |
| 2.3 | **Dead-code sweep (F6).** Delete `ComponentShowcase.tsx`, `AIChatBox.tsx`, `DashboardLayout.tsx`, `DashboardLayoutSkeleton.tsx`, `Map.tsx`; decide on server `_core` extras (llm/voice/image/map) — they're template-provided, so deleting is optional; run `pnpm check` + `pnpm test` + `pnpm build` to prove nothing referenced them. **Breakage list:** none found by grep (that's the point), but `components.json`/shadcn regeneration could re-add ui files — harmless. | S | low (verified-unreferenced) | — |

### Milestone 3 — Quality & polish
| # | Task | Effort | Risk | Deps |
|---|---|---|---|---|
| 3.1 | **Fix the workflow header comment (F7)** to say the snapshot *is* committed and why (githack serving). | S | none | skip if 2.1 rewrites the workflow anyway |
| 3.2 | **Guides cleanup (F8).** Demote/remove the manuscdn archive link; make "import from GitHub" Option 1; add a warning box about F5 (off-Manus, notify-owner is dead — set `GHL_WEBHOOK_URL` or lose leads silently). Consider logging a loud server-side error when *both* channels are unconfigured (`server/routers.ts:66-68` currently only warns for GHL). | S | none | — |
| 3.3 | **Root flotsam (F10).** Delete `ideas.md` (or move to `.planning/archive/`), delete `.gitkeep`, add `LICENSE` (MIT), fix `sports/README.md` install command to pnpm. Breakage: none — `ideas.md`/`.gitkeep` are referenced nowhere. | S | none | — |
| 3.4 | **Decide DB/auth fate (F9).** If the static-hosting path is the real plan, document that `server/` is optional; do not refactor. | S (decision only) | none | owner decision |

### Quick wins (high impact, S effort)
**1.2** (failure visibility — one YAML edit), **2.2** (README truth), **2.3** (dead-code sweep — verified safe), **3.3** (flotsam).

### Implementation sketches — top 3

**2.1 Split sports/ into its own repo.** Create `mlb-dashboard` repo. Cleanest path: `git subtree split -P sports -b sports-only` to preserve the sports-relevant history (including snapshot commits, which legitimately belong to *that* product), push to the new repo's `main`; move `deploy-sports.yml` into it, deleting every `sports/` path prefix (script call becomes `node scripts/build-snapshot.mjs`, Pages artifact path becomes `live`). Enable Pages on the new repo. Then in `modernflow-ai`: delete `sports/` + the workflow in one commit, add a README pointer. Gotchas: scheduled workflows only fire from the new repo's default branch — verify the first cron actually runs (or `workflow_dispatch` once); githack URLs embed owner/repo — anything bookmarked breaks, so keep the old `sports/live/today.json` in place for a grace period or check consumers first (Task 0.2); the snapshot bot needs `contents: write` in the new repo (default `GITHUB_TOKEN` works as it does today).

**1.2 Loud failures.** Edit `deploy-sports.yml`: drop `continue-on-error: true` from the "Commit snapshot" step; change `git push origin HEAD:main && echo ✅ || echo ⚠️` to a bare `git push origin HEAD:main` so a blocked push fails the run. Keep the Pages trio fail-soft only while Pages is unenabled — better: once Pages enablement is confirmed (0.2), remove those `continue-on-error`s too and gate on `steps.configure.outcome` alone. Optionally append a terminal step `if: failure()` that opens/comments a GitHub issue (no external service needed). Test by temporarily pointing the push at a protected ref or running with a revoked-permission token; confirm the red run emails the owner.

**2.3 Dead-code sweep.** `grep -rn "ComponentShowcase\|AIChatBox\|DashboardLayout\|from \"@/components/Map\"" client/ server/` to re-verify zero inbound references (audit already confirmed for ComponentShowcase); delete the five client files; run `pnpm check && pnpm test && pnpm build`. Gotcha: `Map.tsx` references `@types/google.maps` and `server/_core/map.ts` references env keys — if you also remove those, check `vite.config.ts` and `_core/index.ts` for imports first; the `_core` server files are imported by `_core/sdk.ts`/router wiring in some Manus templates, so verify each with grep before deleting (the audit only confirmed the *client* files are dead).

---

## Open Questions (owner decisions)

1. **Testimonials & stats (F1):** real clients exist to cite, label as illustrative, or delete the sections? This blocks 1.1 and is the highest-stakes call in the audit.
2. **Repo split (F2):** approve moving `sports/` to its own repo? If no — alternative is committing snapshots to a `data` branch instead of `main`, which fixes history noise but not the cohabitation.
3. **Who consumes the live dashboard today** (Pages URL? githack raw URL? nobody yet?) — determines how careful the split must be.
4. **Is the website still meant to go live on Manus, or is the static-host path the plan?** Decides whether F5/F9 warrant any code work or just doc warnings.
5. **Archive vs delete:** `ideas.md` (delete, or keep as design rationale in `.planning/archive/`?) and the three migration guides (still needed once a hosting decision is made, or archive two of three?).
6. **Snapshot retention:** is unbounded `today.json` history in the (new) sports repo acceptable, or should the workflow force-push a single rolling commit to a `data` branch?
