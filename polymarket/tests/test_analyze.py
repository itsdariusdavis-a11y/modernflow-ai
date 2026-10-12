import json, sys, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pmx import analyze, watch

NOW = 1_800_000_000
def pos(i, pnl, price=0.5, size=100, weeks_ago=0):
    return {"timestamp": NOW - weeks_ago * 7 * 86400 - i, "realizedPnl": pnl, "avgPrice": price,
            "totalBought": size, "slug": "nfl-x"}

class Screen(unittest.TestCase):
    def test_snapshot_flags(self):
        d = json.loads((Path(__file__).resolve().parents[1] / "data/month_leaderboard_2026-10-12.json").read_text())
        by = {r["userName"]: r for r in analyze.screen_leaderboard(d["rows"])}
        self.assertFalse(by["Papeasy"]["passes"])        # $1.09M pnl on $717 volume
        self.assertFalse(by["UpTheBlues"]["passes"])     # 1.5% roi on $131M
        self.assertFalse(by["TeamA"]["passes"])          # pnl > volume
        self.assertTrue(by["Kch-Temp"]["passes"])

class Verdict(unittest.TestCase):
    def test_consistent_passes(self):
        ps = [pos(i, 3 if i % 3 else -2, weeks_ago=i % 8) for i in range(120)]
        ok, fails = analyze.verdict(analyze.wallet_stats(ps, NOW - 90 * 86400, NOW))
        self.assertTrue(ok, fails)
    def test_lottery_winner_fails(self):
        ps = [pos(i, -1, weeks_ago=i % 8) for i in range(100)] + [pos(999, 5000)]
        ok, fails = analyze.verdict(analyze.wallet_stats(ps, NOW - 90 * 86400, NOW))
        self.assertFalse(ok); self.assertTrue(any("TOP3" in f or "CONCENTRATED" in f for f in fails))
    def test_truncated_window_fails(self):
        ps = [pos(i, 3, weeks_ago=i % 8) for i in range(120)]
        ok, fails = analyze.verdict(analyze.wallet_stats(ps, NOW - 90 * 86400, NOW), complete=False)
        self.assertFalse(ok)

class Copy(unittest.TestCase):
    T = {"timestamp": 1, "transactionHash": "0x1", "proxyWallet": "0xw", "title": "t", "outcome": "Yes",
         "asset": "a", "price": 0.60, "side": "BUY"}
    def test_fill_includes_slippage(self):
        r = watch.simulate_copy(self.T, 0.61, watch.Config())
        self.assertEqual(r["action"], "PAPER_BUY"); self.assertAlmostEqual(r["our_price"], 0.62)
    def test_skip_when_price_ran(self):
        self.assertEqual(watch.simulate_copy(self.T, 0.70, watch.Config())["action"], "SKIP")
    def test_skip_sell_and_no_price(self):
        self.assertEqual(watch.simulate_copy({**self.T, "side": "SELL"}, 0.6, watch.Config())["action"], "SKIP")
        self.assertEqual(watch.simulate_copy(self.T, None, watch.Config())["action"], "SKIP")

if __name__ == "__main__":
    unittest.main()
