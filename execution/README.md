# /execution/ — Layer T (Tools)

Deterministic scripts: atomic, testable, single-purpose.

- Credentials come from `.env` (never hardcoded, never committed).
- All intermediate file I/O routes through `/.tmp/`.
- Every script ships with a verify step (test or one-line check command).

⛔ **No logic may be written here until the Blueprint in CLAUDE.md is approved**
(Protocol 0 halt). First scripts will be the Phase L connectivity probes.
