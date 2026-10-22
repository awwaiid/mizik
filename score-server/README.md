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
request", so no preflight. Scores are append-only; there is no update or delete.

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
