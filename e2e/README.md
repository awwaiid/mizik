# mizik e2e

Headless Chrome integration tests ([Playwright](https://playwright.dev)) for
the game and the score server. They serve the built `../dist`, start a
throwaway copy of `../score-server` on a temporary sqlite database seeded from
`data/scores.jsonl`, and drive the game in a real browser: every route must
load with no console errors, page errors or failed requests; a game is played
through the hex buttons by reading the chain out of the Vue instance; a score
is saved and checked on the leaderboard and in the API.

```bash
# from the repo root, build first (what the tests load)
NODE_OPTIONS=--openssl-legacy-provider npx vue-cli-service build

cd e2e
npm install
npx playwright install chromium   # once
npm test                          # ~30s
npm run report                    # html report with traces of any failure
```

Needs Node 18+ (`.tool-versions` here says 24) and `python3` for the two
local servers.

## Against the deployed site

```bash
MIZIK_URL=https://mizikgame.com \
MIZIK_SCORES_URL=https://thelackthereof.org/mizik npm test
```

With the live score server the test that saves a score is skipped.

## Known issues

Two tests are marked `test.fail` so the suite stays green while documenting
them; they flip to failures the day the bug is fixed, which is the reminder to
drop the annotation:

- `game over focuses the name input` — `Mizik.vue` focuses the name input on
  `$nextTick` inside the mousedown that ended the game, and the mousedown's
  default action moves focus straight back to the body.
- `leaderboard has one row per player and no blank names` — Parse-era scores
  include `""` and whitespace-only names; the server groups by
  `upper(player_name)`, so each blank spelling is its own leaderboard row, and
  `""` is renamed `anonymous`, doubling the real `anonymous` row.

## Layout

| File | What |
| --- | --- |
| `playwright.config.js` | servers, browser flags, `MIZIK_URL` / `MIZIK_SCORES_URL` |
| `tests/helpers.js` | error collection, analytics stub, score-API reroute, board helpers |
| `tests/pages.spec.js` | every route loads clean, nav, board sizes |
| `tests/game.spec.js` | start, play rounds, wrong note, save score, start over |
| `tests/scores.spec.js` | score server API and the leaderboard page |
