# mizik score server

High scores for [mizikgame.com](https://mizikgame.com), served from
`https://thelackthereof.org/mizik/`. One sqlite table, no dependencies beyond
Python 3.12's standard library. Replaced the Parse Server + MongoDB backend in
October 2026.

## API

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/health` | `{"ok": true, "scores": N}` |
| `GET` | `/leaders?days=30` | `{"leaders": [{playerName, score, gameCount, createdAt}, …]}`, best score per player (case-insensitive), highest first. Omit `days` for all time. |
| `GET` | `/scores.jsonl` | every score as JSON Lines, oldest first (this is the backup) |
| `POST` | `/scores` | body `{"playerName", "score", "sequence", "timestamp"}` → `201 {"id", "createdAt"}` |

Post with `Content-Type: text/plain` from the browser: it is a CORS "simple
request", so no preflight. Scores are append-only over HTTP; `server.py delete ID…`
(run inside the container) is the only way to remove one.

A post is rejected with `400` unless it is plausible as a game: every note is on
the board, consecutive notes are adjacent hexes, the chain is at most 100 notes,
and the score is no more than the chain can earn (each note's k presses are worth
k, k-1, … 1, plus one per note of slack for a client quirk). The sequence is still
client-generated, so a determined forger can post a legal chain with a matching
score; the check removes impossible rows, not fake ones. Browser posts whose
`Origin` is not the game (`$SCORES_ORIGINS`, default `https://mizikgame.com`, plus
localhost) get `403`; more than `$SCORES_POST_RATE` (60) posts a minute from one
client IP get `429`.

Player names are stored as plain text: control characters dropped, whitespace
trimmed, cut at 32 characters, and a blank name becomes `anonymous`. The same
cleaning runs over existing rows at startup, so an old database is folded on
the first boot of a new version. Responses are JSON only (`nosniff`), and the
client renders names with Vue text interpolation, so a name is never HTML.

## Data

`data/scores.jsonl` is the committed copy of every score. The container seeds
its database from it on first start, and a weekly job re-exports the live
database back into it, so `git log data/scores.jsonl` is the backup history.

```
python3 server.py import < data/scores.jsonl   # load (also accepts a mongoexport of Parse's GameScore)
python3 server.py export > data/scores.jsonl   # dump
SCORES_DB=/tmp/scores.db PORT=8080 python3 server.py   # run locally
```

## Deploy

In the thelackthereof.org compose file:

```yaml
  mizik-scores:
    build: ./projects/js/mizik/score-server
    restart: unless-stopped
    volumes:
      - 'mizik_scores:/data'
```

and in the nginx proxy:

```
    location /mizik/ {
      proxy_pass http://mizik-scores:8080/;
      proxy_set_header X-Forwarded-For $remote_addr;
    }
```
