#!/usr/bin/env python3
"""mizik high-score service: one sqlite table, create + leaderboards.

  server.py                        serve on $PORT (8080), database at $SCORES_DB
  server.py import < scores.jsonl  insert scores from JSON Lines (own format or mongoexport)
  server.py export > scores.jsonl  every score as JSON Lines, oldest first
  server.py delete ID [ID...]      remove scores by id (the only way to delete; no HTTP path)

On first start with an empty database it seeds from $SCORES_SEED (data/scores.jsonl).
"""
import collections
import json
import math
import os
import secrets
import sqlite3
import sys
import threading
import time
import unicodedata
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DB = os.environ.get("SCORES_DB", "/data/scores.db")
SEED = os.environ.get("SCORES_SEED", os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "scores.jsonl"))
PORT = int(os.environ.get("PORT", "8080"))
MAX_BODY, MAX_NAME, MAX_SCORE, MAX_SEQ, MAX_DAYS = 8192, 32, 10000, 100, 36500
ANON = "anonymous"
# Browser posts must come from the game (or a local dev build). Non-browser clients send no Origin.
ORIGINS = os.environ.get("SCORES_ORIGINS", "https://mizikgame.com").split()
# Posts per client IP per minute. A classroom behind one NAT posts in bursts (24/min seen), so generous.
POST_RATE = int(os.environ.get("SCORES_POST_RATE", "60"))

# The board in src/views/Mizik.vue: a hex grid of MIDI notes. A chain is a walk on it,
# each note adjacent to the previous one, and the score for a chain is bounded by
# how often each note recurs (a repeated note is worth its remaining count each press).
LAYOUT = [[0, 59, 61, 63, 0], [52, 54, 56, 58], [45, 47, 49, 51, 53], [40, 42, 44, 46], [0, 37, 39, 41, 0]]
ADJACENT = {
    37: {39, 40, 42}, 39: {37, 41, 42, 44}, 40: {37, 42, 45, 47}, 41: {39, 44, 46},
    42: {37, 39, 40, 44, 47, 49}, 44: {39, 41, 42, 46, 49, 51}, 45: {40, 47, 52}, 46: {41, 44, 51, 53},
    47: {40, 42, 45, 49, 52, 54}, 49: {42, 44, 47, 51, 54, 56}, 51: {44, 46, 49, 53, 56, 58}, 52: {45, 47, 54, 59},
    53: {46, 51, 58}, 54: {47, 49, 52, 56, 59, 61}, 56: {49, 51, 54, 58, 61, 63}, 58: {51, 53, 56, 63},
    59: {52, 54, 61}, 61: {54, 56, 59, 63}, 63: {56, 58, 61},
}
assert set(ADJACENT) == {n for row in LAYOUT for n in row if n}


def max_score(seq):
    """Highest score a chain can earn: each note's k presses are worth k, k-1, ... 1,
    plus one per note of slack for the client's occasional extra count (seen in 5 of 8,127 real games)."""
    return sum(k * (k + 1) // 2 for k in collections.Counter(seq).values()) + len(seq)


def valid_walk(seq):
    return all(n in ADJACENT for n in seq) and all(b in ADJACENT[a] for a, b in zip(seq, seq[1:]))


class RateLimit:
    """Sliding one-minute window per key, in memory; good enough for one process."""

    def __init__(self, per_minute):
        self.per_minute, self.hits, self.lock = per_minute, collections.defaultdict(collections.deque), threading.Lock()

    def allow(self, key):
        now = time.monotonic()
        with self.lock:
            q = self.hits[key]
            while q and now - q[0] > 60:
                q.popleft()
            if len(q) >= self.per_minute:
                return False
            q.append(now)
            if len(self.hits) > 10000:
                self.hits.clear()
            return True


POSTS = RateLimit(POST_RATE)


def reject_constant(c):
    raise ValueError(c)  # NaN / Infinity are not JSON

SCHEMA = """
CREATE TABLE IF NOT EXISTS scores (
  id TEXT PRIMARY KEY,
  player_name TEXT,
  score INTEGER NOT NULL,
  sequence TEXT NOT NULL,
  timestamp INTEGER,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS scores_created ON scores(created_at);
"""

# One row per player (case-insensitive): best score, how many games, when the best was set.
LEADERS = """
SELECT player_name, score, created_at, games FROM (
  SELECT player_name, score, created_at,
         COUNT(*) OVER (PARTITION BY upper(player_name)) AS games,
         ROW_NUMBER() OVER (PARTITION BY upper(player_name) ORDER BY score DESC, created_at) AS rn
  FROM scores WHERE created_at > ?
) WHERE rn = 1 ORDER BY score DESC, created_at
"""


def db():
    conn = sqlite3.connect(DB, timeout=10)
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def iso(t):
    return t.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + "%03dZ" % (t.microsecond // 1000)


def clean_name(name):
    """Names are stored as plain text, never HTML: control characters dropped,
    whitespace trimmed, cut at MAX_NAME; blank becomes "anonymous"."""
    if not isinstance(name, str):
        return ANON
    name = "".join(c for c in name if unicodedata.category(c) != "Cc")
    return name.strip()[:MAX_NAME].strip() or ANON


def row_from(r):
    """Accept our own export format or a mongoexport of Parse's GameScore."""
    rid = r.get("id") or r.get("_id")
    if isinstance(rid, dict):
        rid = rid.get("$oid")
    created = r.get("createdAt") or (r.get("_created_at") or {}).get("$date")
    created = iso(datetime.fromisoformat(created.replace("Z", "+00:00")))
    ts = r.get("timestamp")
    return (rid, clean_name(r.get("playerName")), int(r["score"]), json.dumps(r.get("sequence") or []),
            None if ts is None else int(ts), created)


def import_lines(lines):
    rows = [row_from(json.loads(l)) for l in lines if l.strip()]
    with db() as conn:
        before = conn.execute("SELECT count(*) FROM scores").fetchone()[0]
        conn.executemany("INSERT OR IGNORE INTO scores VALUES (?,?,?,?,?,?)", rows)
        after = conn.execute("SELECT count(*) FROM scores").fetchone()[0]
    return after - before


def export_lines(out):
    with db() as conn:
        for rid, name, score, seq, ts, created in conn.execute(
                "SELECT * FROM scores ORDER BY created_at, id"):
            out.write(json.dumps({"id": rid, "playerName": name, "score": score,
                                  "sequence": json.loads(seq), "timestamp": ts,
                                  "createdAt": created}) + "\n")


def init():
    os.makedirs(os.path.dirname(os.path.abspath(DB)), exist_ok=True)
    with db() as conn:
        conn.executescript(SCHEMA)
        dirty = [(clean_name(name), rid) for rid, name in conn.execute("SELECT id, player_name FROM scores")
                 if clean_name(name) != name]
        if dirty:
            conn.executemany("UPDATE scores SET player_name = ? WHERE id = ?", dirty)
            print("cleaned %d player names (blank -> %s, whitespace trimmed)" % (len(dirty), ANON), flush=True)
        n = conn.execute("SELECT count(*) FROM scores").fetchone()[0]
    if n == 0 and os.path.exists(SEED):
        with open(SEED) as f:
            print("seeded %d scores from %s" % (import_lines(f), SEED), flush=True)


def validate(body):
    if not isinstance(body, dict):
        return None, "expected an object"
    name = body.get("playerName", "")
    score = body.get("score")
    seq = body.get("sequence", [])
    ts = body.get("timestamp")
    if not isinstance(name, str):
        return None, "playerName must be a string"
    if isinstance(score, bool) or not isinstance(score, int) or not 0 <= score <= MAX_SCORE:
        return None, "score must be an integer 0..%d" % MAX_SCORE
    if not isinstance(seq, list) or len(seq) > MAX_SEQ or not all(
            isinstance(n, int) and not isinstance(n, bool) for n in seq):
        return None, "sequence must be a list of up to %d integers" % MAX_SEQ
    if not valid_walk(seq):
        return None, "sequence must be a chain of adjacent notes on the board"
    if score > max_score(seq):
        return None, "score is higher than that chain can earn (%d)" % max_score(seq)
    if ts is not None and (isinstance(ts, bool) or not isinstance(ts, (int, float)) or not math.isfinite(ts)
                           or not 0 <= ts < 1e14):
        return None, "timestamp must be a number of milliseconds"
    return (secrets.token_hex(8), clean_name(name), score, json.dumps(seq),
            None if ts is None else int(ts), iso(datetime.now(timezone.utc))), None


class Handler(BaseHTTPRequestHandler):
    server_version = "mizik-scores/1"

    def log_message(self, fmt, *args):
        who = self.headers.get("X-Forwarded-For", self.address_string())
        sys.stdout.write("%s %s %s\n" % (iso(datetime.now(timezone.utc)), who, fmt % args))
        sys.stdout.flush()

    def send(self, code, body, ctype="application/json"):
        if not isinstance(body, bytes):
            body = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def route(self):
        u = urlparse(self.path)
        path = u.path[6:] if u.path.startswith("/mizik/") else u.path
        return path.rstrip("/") or "/", parse_qs(u.query)

    def client(self):
        return (self.headers.get("X-Forwarded-For") or self.address_string()).split(",")[0].strip()

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except Exception as e:  # never drop the connection (a 502 upstream) on bad input
            self.log_message("500 %s: %s", type(e).__name__, e)
            self.close_connection = True
            try:
                self.send(500, {"error": "internal error"})
            except Exception:
                pass

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path, q = self.route()
        if path == "/health":
            with db() as conn:
                n = conn.execute("SELECT count(*) FROM scores").fetchone()[0]
            return self.send(200, {"ok": True, "scores": n})
        if path == "/leaders":
            days = q.get("days", [""])[0]
            since = iso(datetime.now(timezone.utc) - timedelta(days=min(int(days), MAX_DAYS))) if days.isdigit() else ""
            with db() as conn:
                rows = conn.execute(LEADERS, (since,)).fetchall()
            return self.send(200, {"leaders": [
                {"playerName": name, "score": score, "gameCount": games, "createdAt": created}
                for name, score, created, games in rows]})
        if path == "/scores.jsonl":
            import io
            buf = io.StringIO()
            export_lines(buf)
            return self.send(200, buf.getvalue().encode(), "application/x-ndjson")
        self.send(404, {"error": "not found"})

    def do_POST(self):
        path, _ = self.route()
        if path != "/scores":
            return self.send(404, {"error": "not found"})
        origin = self.headers.get("Origin")
        if origin and origin not in ORIGINS and not origin.startswith(("http://localhost:", "http://127.0.0.1:")):
            return self.send(403, {"error": "scores are posted from the game only"})
        if not POSTS.allow(self.client()):
            return self.send(429, {"error": "too many scores; wait a minute"})
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if not 0 < length <= MAX_BODY:
            return self.send(413, {"error": "body must be 1..%d bytes" % MAX_BODY})
        try:
            body = json.loads(self.rfile.read(length), parse_constant=reject_constant)
        except ValueError:
            return self.send(400, {"error": "invalid json"})
        row, err = validate(body)
        if err:
            self.log_message("rejected %s", err)
            return self.send(400, {"error": err})
        with db() as conn:
            conn.execute("INSERT INTO scores VALUES (?,?,?,?,?,?)", row)
        self.send(201, {"id": row[0], "createdAt": row[5]})


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "serve"
    if cmd == "import":
        with db() as conn:
            conn.executescript(SCHEMA)
        print("imported %d new scores" % import_lines(sys.stdin), file=sys.stderr)
    elif cmd == "export":
        export_lines(sys.stdout)
    elif cmd == "delete":
        with db() as conn:
            n = conn.executemany("DELETE FROM scores WHERE id = ?", [(i,) for i in sys.argv[2:]]).rowcount
        print("deleted %d scores" % n, file=sys.stderr)
    else:
        init()
        httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
        httpd.daemon_threads = True
        print("mizik-scores listening on %d, db %s" % (PORT, DB), flush=True)
        httpd.serve_forever()
