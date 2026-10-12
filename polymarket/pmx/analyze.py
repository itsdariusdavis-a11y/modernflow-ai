"""Wallet screening and 90-day performance stats. Pure functions, no I/O."""
from __future__ import annotations

import statistics
from collections import defaultdict

WEEK = 7 * 86400


def screen_leaderboard(rows: list[dict]) -> list[dict]:
    """Cheap first-pass triage using only leaderboard fields (pnl, vol, name).
    Rejects wallets whose headline PnL can't be a repeatable, copyable skill."""
    out = []
    for r in rows:
        pnl, vol = r["pnl"], r["vol"]
        roi = pnl / vol if vol else float("inf")
        flags = []
        if vol < pnl:  # earned more than the total dollars traded
            flags.append("PNL_GT_VOLUME: one-shot/insider-style or resolution payout, not repeatable")
        elif vol < 50_000:
            flags.append("TINY_SAMPLE")
        if vol > 20e6 and roi < 0.03:
            flags.append("MM_OR_ARB_LIKE: <3% edge on huge volume; depends on speed/rebates, not copyable")
        if r["userName"][:2] == "0x" and "-" in r["userName"]:
            flags.append("BURNER_NAME: auto-generated, likely fresh/rotated wallet")
        out.append({**r, "roi": roi, "flags": flags, "passes": not flags})
    return out


def wallet_stats(positions: list[dict], since_ts: int, now_ts: int) -> dict:
    """Stats over closed positions inside the window. `cost` = avgPrice * totalBought."""
    ps = [p for p in positions if p["timestamp"] >= since_ts]
    if not ps:
        return {"n": 0}
    pnls = [p["realizedPnl"] for p in ps]
    cost = sum(p["avgPrice"] * p["totalBought"] for p in ps)
    total = sum(pnls)
    wins = [x for x in pnls if x > 0]
    weekly: dict[int, float] = defaultdict(float)
    for p in ps:
        weekly[(now_ts - p["timestamp"]) // WEEK] += p["realizedPnl"]
    nweeks = max(weekly) + 1 if weekly else 0
    pos_weeks = sum(1 for v in weekly.values() if v > 0)
    sizes = [p["avgPrice"] * p["totalBought"] for p in ps]
    cats = defaultdict(float)
    for p in ps:
        cats[p.get("slug", "").split("-")[0] or "?"] += p["avgPrice"] * p["totalBought"]
    top = max(pnls)
    return {
        "n": len(ps),
        "pnl": total,
        "cost": cost,
        "roi": total / cost if cost else 0.0,
        "win_rate": len(wins) / len(ps),
        "top_win_share": (top / total) if total > 0 else None,
        "pnl_ex_top3": total - sum(sorted(pnls)[-3:]),
        "avg_entry": statistics.fmean(p["avgPrice"] for p in ps),
        "favorite_grind_share": sum(1 for p in ps if p["avgPrice"] >= 0.90) / len(ps),
        "median_size": statistics.median(sizes),
        "weeks_covered": nweeks,
        "pos_week_ratio": pos_weeks / nweeks if nweeks else 0.0,
        "top_categories": sorted(cats.items(), key=lambda kv: -kv[1])[:3],
    }


def verdict(s: dict, complete: bool = True) -> tuple[bool, list[str]]:
    """Copy-worthiness gate. Every failed rule is returned so the report can show why."""
    if s["n"] == 0:
        return False, ["NO_CLOSED_POSITIONS_IN_WINDOW"]
    fails = []
    if not complete:
        fails.append("WINDOW_TRUNCATED: hit page cap, stats cover a partial window")
    if s["n"] < 50:
        fails.append(f"SAMPLE<50 ({s['n']})")
    if s["pnl"] <= 0:
        fails.append("NEGATIVE_90D_PNL")
    if s["pnl_ex_top3"] <= 0:
        fails.append("PNL_DEPENDS_ON_TOP3_WINS")
    if s["top_win_share"] is not None and s["top_win_share"] > 0.4:
        fails.append(f"CONCENTRATED: best win = {s['top_win_share']:.0%} of PnL")
    if s["roi"] < 0.02:
        fails.append(f"ROI<2% ({s['roi']:.1%}): spread-sized edge, dies to copy slippage")
    if s["pos_week_ratio"] < 0.6:
        fails.append(f"INCONSISTENT: {s['pos_week_ratio']:.0%} of weeks profitable")
    if s["favorite_grind_share"] > 0.6:
        fails.append("FAVORITE_GRINDER: mostly >=90c entries, blow-up tail risk")
    return not fails, fails
