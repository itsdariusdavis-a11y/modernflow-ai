# Claude Code plugins & marketplaces

What third-party Claude Code extensions are installed for this repo, why, and how to
manage them. Installation lives in `.claude/settings.json` (`extraKnownMarketplaces` +
`enabledPlugins`), so every session that opens this repo — local CLI, desktop, or
Claude Code on the web — picks them up automatically after a one-time trust prompt.

Curated July 2026 from a web + GitHub sweep of the most popular Claude Code
repositories (star counts approximate at time of research).

## Installed and enabled

| Plugin            | Marketplace (repo)                                                                             | Why                                                                                                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `superpowers`     | `superpowers-marketplace` ([obra/superpowers](https://github.com/obra/superpowers), ~94k ⭐)   | The most popular community skills library: TDD, systematic debugging, planning, and collaboration skills that load on demand. Complements our Karpathy-derived working principles in CLAUDE.md. |
| `document-skills` | `anthropic-agent-skills` ([anthropics/skills](https://github.com/anthropics/skills), official) | Anthropic's official Excel/Word/PowerPoint/PDF creation skills — directly useful for proposals, reports, and client deliverables.                                                               |
| `example-skills`  | `anthropic-agent-skills` (same)                                                                | Official skill-creator, MCP-builder, and webapp-testing skills. This repo's operating layer is built on skills, so skill-creator earns its keep.                                                |

## Registered for browsing (nothing enabled by default)

| Marketplace             | Repo                                                            | What's in it                                                                                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claude-code-workflows` | [wshobson/agents](https://github.com/wshobson/agents) (~20k ⭐) | 92 small, modular plugins (TDD workflows, git/PR workflows, security scanning, backend/frontend dev, incident response…). Enable individual ones with `/plugin` → browse `claude-code-workflows`, or add `"<plugin>@claude-code-workflows": true` to `enabledPlugins`. |

Anthropic's official plugin directory ([anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official),
255 plugins including Apollo, Atlassian, AWS, Canva…) is built into Claude Code —
browse it with `/plugin` without any setup here.

## Evaluated and deliberately skipped

- **affaan-m/everything-claude-code** (~100k ⭐) — 67 agents + 278 skills in one
  monolithic plugin. Too heavy: floods context, and its agents don't fit our
  delegation-tiering rules below.
- **VoltAgent/awesome-claude-code-subagents**, **rohitg00/awesome-claude-code-toolkit** —
  large third-party agent packs. Their agents ship without explicit `model:`
  declarations, which violates our rule that every agent declares a model (agents
  default to `inherit` and silently bill at the top-level model's rate). Cherry-pick
  individual agents into `.claude/agents/` with a `model:` line if ever needed.
- **hesreallyhim/awesome-claude-code** (~28k ⭐) — curated directory, not installable.
  Good place to shop for future additions.
- **davila7/claude-code-templates** (aitmpl.com) — installs via its own `npx` CLI
  rather than the plugin system; redundant with the marketplaces above.

## Ground rules

- Plugin **skills** load on demand and are low-risk. Plugin **agents** are subject to
  the delegation policy in CLAUDE.md — don't enable large agent packs wholesale.
- Adding a plugin = supply-chain trust. Before enabling anything new, skim its hooks
  and commands (hooks execute shell commands automatically).
- To disable something, flip its `enabledPlugins` entry to `false` or delete the line.
