"""python -m pmx.cli {screen|analyze|watch}  (run from polymarket/)"""
from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from . import analyze, api, watch

DAY = 86400


def fmt_report(rows: list[dict]) -> str:
    L = ["| wallet | name | 90d PnL | ROI | n | win% | wk+ | verdict |", "|---|---|---|---|---|---|---|---|"]
    for r in rows:
        s = r["stats"]
        if s["n"] == 0:
            L.append(f"| `{r['wallet'][:10]}` | {r['name']} | – | – | 0 | – | – | {'; '.join(r['fails'])} |")
            continue
        L.append(f"| `{r['wallet'][:10]}` | {r['name']} | ${s['pnl']:,.0f} | {s['roi']:.1%} | {s['n']} | "
                 f"{s['win_rate']:.0%} | {s['pos_week_ratio']:.0%} | "
                 f"{'**PASS**' if r['ok'] else '; '.join(r['fails'])} |")
    return "\n".join(L)


def main() -> None:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("screen", help="leaderboard triage (1 request per 50 wallets)")
    s.add_argument("--period", default="MONTH"); s.add_argument("--top", type=int, default=100)
    a = sub.add_parser("analyze", help="90-day closed-position analysis of screened wallets")
    a.add_argument("--period", default="MONTH"); a.add_argument("--top", type=int, default=100)
    a.add_argument("--days", type=int, default=90); a.add_argument("--max-pages", type=int, default=200)
    a.add_argument("--out", default="data/report.md")
    w = sub.add_parser("watch", help="PAPER copy-trade vetted wallets (never places real orders)")
    w.add_argument("--wallets", default="data/vetted.json"); w.add_argument("--ledger", default="data/paper_ledger.jsonl")
    w.add_argument("--interval", type=int, default=30)
    args = ap.parse_args()

    if args.cmd == "watch":
        wallets = json.loads(Path(args.wallets).read_text())
        watch.loop(wallets, watch.Config(), Path(args.ledger), args.interval)
        return

    lb = analyze.screen_leaderboard(api.leaderboard(args.period, "PNL", args.top))
    if args.cmd == "screen":
        for r in lb:
            print(f"{'OK  ' if r['passes'] else 'DROP'} {r['userName'][:24]:24} pnl=${r['pnl']:>11,.0f} vol=${r['vol']:>13,.0f} "
                  f"roi={r['roi']:.1%} {'; '.join(r['flags'])}")
        return

    now = int(time.time()); since = now - args.days * DAY
    rows = []
    for r in lb:
        if not r["passes"]:
            rows.append({"wallet": r["proxyWallet"], "name": r["userName"][:18], "stats": {"n": 0}, "ok": False,
                         "fails": ["SCREENED_OUT: " + r["flags"][0].split(":")[0]]})
            continue
        pos, complete = api.closed_positions(r["proxyWallet"], since, args.max_pages)
        st = analyze.wallet_stats(pos, since, now)
        ok, fails = analyze.verdict(st, complete)
        rows.append({"wallet": r["proxyWallet"], "name": r["userName"][:18], "stats": st, "ok": ok, "fails": fails})
        print(r["userName"][:20], "PASS" if ok else fails)
    Path(args.out).write_text(fmt_report(rows) + "\n")
    Path("data/vetted.json").write_text(json.dumps([x["wallet"] for x in rows if x["ok"]], indent=1))
    print(f"wrote {args.out}; vetted: {sum(x['ok'] for x in rows)}/{len(rows)}")


if __name__ == "__main__":
    main()
