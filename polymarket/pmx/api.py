"""Thin client for Polymarket's public data API. Fetcher is injectable for tests."""
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from typing import Callable

DATA = "https://data-api.polymarket.com"
CLOB = "https://clob.polymarket.com"

Fetch = Callable[[str], object]


def http_fetch(url: str, retries: int = 3) -> object:
    req = urllib.request.Request(url, headers={"User-Agent": "pmx/0.1", "Accept": "application/json"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.load(r)
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(2 ** attempt)


def _url(base: str, path: str, **params) -> str:
    q = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    return f"{base}{path}?{q}"


def leaderboard(period: str = "MONTH", order_by: str = "PNL", total: int = 100, fetch: Fetch = http_fetch) -> list[dict]:
    """period: DAY|WEEK|MONTH|ALL. NOTE: there is no 90-day period; see closed_positions()."""
    rows: list[dict] = []
    while len(rows) < total:
        page = fetch(_url(DATA, "/v1/leaderboard", timePeriod=period, orderBy=order_by,
                          limit=min(50, total - len(rows)), offset=len(rows)))
        if not page:
            break
        rows += page
    return rows[:total]


def closed_positions(user: str, since_ts: int, max_pages: int = 200, fetch: Fetch = http_fetch) -> tuple[list[dict], bool]:
    """Newest-first paging until we cross since_ts. Returns (rows, complete).
    complete=False means we hit max_pages first, so the window is truncated."""
    out: list[dict] = []
    for p in range(max_pages):
        page = fetch(_url(DATA, "/v1/closed-positions", user=user, limit=50, offset=p * 50,
                          sortBy="TIMESTAMP", sortDirection="DESC"))
        if not page:
            return out, True
        for row in page:
            if row["timestamp"] < since_ts:
                return out, True
            out.append(row)
    return out, False


def recent_trades(user: str, since_ts: int, limit: int = 100, fetch: Fetch = http_fetch) -> list[dict]:
    rows = fetch(_url(DATA, "/activity", user=user, type="TRADE", limit=limit,
                      sortBy="TIMESTAMP", sortDirection="DESC"))
    return [r for r in rows if r["timestamp"] > since_ts]


def midpoint(token_id: str, fetch: Fetch = http_fetch) -> float | None:
    """CLOB midpoint. Endpoint shape not verified against live API in the build session."""
    try:
        return float(fetch(_url(CLOB, "/midpoint", token_id=token_id))["mid"])
    except Exception:
        return None
