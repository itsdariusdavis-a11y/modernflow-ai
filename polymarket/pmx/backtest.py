"""Copy-trade simulation on closed positions. Pure functions.

Model: each closed position the leader exits is copied at the leader's average entry price plus
`slip`, with our stake sized as a fraction of current bankroll. A position's gross return ratio g
(realizedPnl / cost) is converted to our return as p*(1+g)/p' - 1, so a worse entry shrinks the edge.

Known limits (be suspicious of rosy output):
  * closed-positions only carries the CLOSE timestamp, so bankroll compounding is ordered by exit time
    and ignores that capital is locked between entry and exit.
  * open positions are excluded; unrealized losers are invisible.
  * no market-depth model: stakes are tiny, so we assume fills at p+slip. Real fills can be worse.
"""
from __future__ import annotations

from . import analyze


def copy_return(p: dict, slip: float) -> float | None:
    cost = p["avgPrice"] * p["totalBought"]
    if cost <= 0:
        return None
    entry = min(0.99, p["avgPrice"] + slip)
    if entry <= 0:
        return None
    return p["avgPrice"] * (1 + p["realizedPnl"] / cost) / entry - 1


def simulate(positions: list[dict], bankroll: float = 25.0, frac: float = 0.10, slip: float = 0.01,
             min_stake: float = 1.0) -> dict:
    cash, peak, max_dd, n, wins = bankroll, bankroll, 0.0, 0, 0
    for p in sorted(positions, key=lambda x: x["timestamp"]):
        r = copy_return(p, slip)
        if r is None:
            continue
        stake = max(min_stake, frac * cash)
        if stake > cash:
            if cash < min_stake:
                break  # busted
            stake = cash
        cash += stake * r
        n += 1
        wins += r > 0
        peak = max(peak, cash)
        max_dd = max(max_dd, (peak - cash) / peak)
    return {"start": bankroll, "end": cash, "ret": cash / bankroll - 1, "trades": n,
            "win_rate": wins / n if n else 0.0, "max_dd": max_dd, "busted": cash < min_stake}


def walk_forward(by_wallet: dict[str, list[dict]], now: int, train_days: int = 60, test_days: int = 30,
                 **sim_kw) -> dict:
    """Pick wallets that pass analyze.verdict on the TRAIN slice only, then copy them on the TEST slice."""
    day = 86400
    test_start, train_start = now - test_days * day, now - (train_days + test_days) * day
    picked, test_positions = [], []
    for w, ps in by_wallet.items():
        train = [p for p in ps if train_start <= p["timestamp"] < test_start]
        ok, _ = analyze.verdict(analyze.wallet_stats(train, train_start, test_start))
        if ok:
            picked.append(w)
            test_positions += [p for p in ps if p["timestamp"] >= test_start]
    return {"picked": picked, "result": simulate(test_positions, **sim_kw) if picked else None}


def slippage_grid(positions: list[dict], slips=(0.0, 0.01, 0.02, 0.03), **kw) -> dict[float, dict]:
    return {s: simulate(positions, slip=s, **kw) for s in slips}
