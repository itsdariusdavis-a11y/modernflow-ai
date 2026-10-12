"""Alert + PAPER copy-trader. No real orders are ever placed here.

For each new BUY by a vetted wallet we simulate a copy: fetch the current midpoint (what we'd
actually get after detection lag), reject if price already ran past `max_drift`, otherwise
record a paper fill with pessimistic slippage. The ledger measures the thing that actually
kills copy-trading: the gap between the leader's fill and ours.
"""
from __future__ import annotations

import json
import time
from dataclasses import dataclass
from pathlib import Path

from . import api


@dataclass
class Config:
    stake_usd: float = 25.0      # fixed stake per copied trade
    max_drift: float = 0.03      # skip if price moved >3c against us since leader's fill
    slippage: float = 0.01       # extra pessimism added to our fill
    min_price: float = 0.05
    max_price: float = 0.95      # skip near-resolved tails where fees/slippage dominate


def simulate_copy(trade: dict, mid: float | None, cfg: Config) -> dict:
    base = {"ts": trade["timestamp"], "tx": trade["transactionHash"], "wallet": trade["proxyWallet"],
            "title": trade["title"], "outcome": trade["outcome"], "asset": trade["asset"],
            "leader_price": trade["price"]}
    if trade["side"] != "BUY":
        return {**base, "action": "SKIP", "reason": "leader SELL (exit signals not copied in v0)"}
    if mid is None:
        return {**base, "action": "SKIP", "reason": "no live price"}
    drift = mid - trade["price"]
    if drift > cfg.max_drift:
        return {**base, "action": "SKIP", "reason": f"drift {drift:+.3f} > {cfg.max_drift}", "mid": mid}
    fill = min(0.99, max(mid, trade["price"]) + cfg.slippage)
    if not (cfg.min_price <= fill <= cfg.max_price):
        return {**base, "action": "SKIP", "reason": f"price {fill:.2f} outside band", "mid": mid}
    return {**base, "action": "PAPER_BUY", "mid": mid, "our_price": fill,
            "shares": cfg.stake_usd / fill, "stake": cfg.stake_usd, "slip_vs_leader": fill - trade["price"]}


def run_once(wallets: list[str], since_ts: int, cfg: Config, ledger: Path, fetch=api.http_fetch) -> int:
    seen = set()
    if ledger.exists():
        seen = {json.loads(l)["tx"] for l in ledger.read_text().splitlines() if l.strip()}
    new = 0
    for w in wallets:
        for t in reversed(api.recent_trades(w, since_ts, fetch=fetch)):
            if t["transactionHash"] in seen:
                continue
            seen.add(t["transactionHash"])
            rec = simulate_copy(t, api.midpoint(t["asset"], fetch=fetch), cfg)
            with ledger.open("a") as f:
                f.write(json.dumps(rec) + "\n")
            print(f"[{rec['action']}] {w[:8]} {rec['title']} / {rec['outcome']} @ {rec['leader_price']:.2f}"
                  + (f" -> ours {rec['our_price']:.2f}" if "our_price" in rec else f" ({rec['reason']})"))
            new += 1
    return new


def loop(wallets: list[str], cfg: Config, ledger: Path, interval: int = 30) -> None:
    since = int(time.time())
    while True:
        run_once(wallets, since, cfg, ledger)
        since = int(time.time()) - interval  # overlap; ledger dedupes by tx
        time.sleep(interval)
