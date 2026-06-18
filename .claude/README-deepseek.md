# Using Claude Code with DeepSeek

Claude Code can talk to DeepSeek's **Anthropic-compatible** API instead of
Anthropic's. No code changes are required — it is driven entirely by
environment variables, which are set here in `.claude/settings.json`.

## How it's wired up

- `.claude/settings.json` (committed) — non-secret config: the DeepSeek base
  URL and the model mappings.
- `.claude/settings.local.json` (gitignored) — holds your `ANTHROPIC_AUTH_TOKEN`
  (your DeepSeek API key). **This file is never committed.**

## Setup

1. Get a key from https://platform.deepseek.com/api_keys
2. Put it in `.claude/settings.local.json`:

   ```json
   {
     "env": {
       "ANTHROPIC_AUTH_TOKEN": "sk-your-real-deepseek-key"
     }
   }
   ```
3. Restart Claude Code in this project. Run `/status` to confirm the base URL
   points at `api.deepseek.com`.

## Model mapping

| Claude Code tier | DeepSeek model     |
| ---------------- | ------------------ |
| main / opus / sonnet | `deepseek-v4-pro`  |
| fast / haiku     | `deepseek-v4-flash` |

## Switching back to Anthropic

Remove or rename `.claude/settings.json` (and the local file), then restart
Claude Code. It will use Anthropic's API and your normal login again.

## Note

These env vars apply to a **local** Claude Code CLI started in this repo. They
do not change a session already running on the Claude Code web environment.
