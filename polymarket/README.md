# pmx — Polymarket wallet analysis + paper copy-trader

Stdlib-only Python. **Never places real orders.** Run from this directory.

```bash
python3 -I -m unittest discover -s tests     # 7 tests
python3 -m pmx.cli screen --top 100          # leaderboard triage
python3 -m pmx.cli analyze --top 100         # 90-day closed-position analysis -> data/report.md, data/vetted.json
python3 -m pmx.cli watch                     # paper-copy vetted wallets -> data/paper_ledger.jsonl
```

## What is verified vs not
- **Verified live (2026-10-12):** `/v1/leaderboard`, `/v1/closed-positions`, `/activity?type=TRADE` response shapes.
- **Verified by tests on fixtures only:** screening, verdict gate, paper-fill logic.
- **NOT verified:** `analyze` and `watch` end-to-end (the build sandbox blocks polymarket hosts; run from your machine),
  and the CLOB `/midpoint` response shape.
- The leaderboard has no 90-day period (DAY/WEEK/MONTH/ALL). `analyze` rebuilds 90 days from closed positions.
  Positions still open are excluded, so unrealized losers are invisible: a known bias that flatters every wallet.

## Pipeline
1. `screen`: drop wallets whose headline PnL can't be copied (PnL > volume, tiny sample, <3% ROI on >$20M volume = market-maker/arb, burner names).
2. `analyze`: per-wallet 90d stats and a hard gate (n>=50, PnL survives removing top 3 wins, best win <40% of PnL, ROI>=2%, >=60% profitable weeks, not a >=90c favorite grinder, window not truncated).
3. `watch`: for each new BUY by a vetted wallet, fetch current price, skip if it ran >3c, else record a paper fill (+1c slippage). The ledger's `slip_vs_leader` is the real test of whether a copy edge survives latency.

## Snapshot findings (MONTH leaderboard top 50, data/month_leaderboard_2026-10-12.json)
Triage drops 14 of 50 before looking at a single trade: 4 with PnL >= volume (e.g. Papeasy $1.09M on $717 traded), 6 market-maker/arb-style (UpTheBlues $2.0M on $131M = 1.5%), 3 burner-named. 36 survive triage only; none are vetted until `analyze` runs.

## Going live: deliberately not built
No order-signing code exists here. Add it only after the paper ledger shows >=200 simulated copies with positive net PnL after slippage across >=4 weeks.
polymarket.com blocks US users; do not route around the geoblock. Use official `py-clob-client`, a dedicated low-balance wallet, hard daily loss cap, and a kill switch.
