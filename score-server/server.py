#!/usr/bin/env python3
"""mizik high-score service: one sqlite table, create + leaderboards.

  server.py                        serve on $PORT (8080), database at $SCORES_DB
  server.py import < scores.jsonl  insert scores from JSON Lines (own format or mongoexport)
  server.py export > scores.jsonl  every score as JSON Lines, oldest first

On first start with an empty database it seeds from $SCORES_SEED (data/scores.jsonl).
"""
import json
import os
import secrets
import sqlite3
import sys
import unicodedata
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DB = os.environ.get("SCORES_DB", "/data/scores.db")
SEED = os.environ.get("SCORES_SEED", os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "scores.jsonl"))
PORT = int(os.environ.get("PORT", "8080"))
MAX_BODY, MAX_NAME, MAX_SCORE, MAX_SEQ = 8192, 32, 10000, 200
ANON = "anonymous"

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
    if not isinstance(seq, list) or len(seq) > MAX_SEQ or not all(isinstance(n, int) for n in seq):
        return None, "sequence must be a list of up to %d integers" % MAX_SEQ
    if ts is not None and not isinstance(ts, (int, float)):
        return None, "timestamp must be a number"
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
            since = iso(datetime.now(timezone.utc) - timedelta(days=int(days))) if days.isdigit() else ""
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
        length = int(self.headers.get("Content-Length") or 0)
        if not 0 < length <= MAX_BODY:
            return self.send(413, {"error": "body must be 1..%d bytes" % MAX_BODY})
        try:
            body = json.loads(self.rfile.read(length))
        except ValueError:
            return self.send(400, {"error": "invalid json"})
        row, err = validate(body)
        if err:
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
    else:
        init()
        httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
        httpd.daemon_threads = True
        print("mizik-scores listening on %d, db %s" % (PORT, DB), flush=True)
        httpd.serve_forever()
