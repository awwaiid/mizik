const { test, expect, SCORES_URL, expectClean } = require("./helpers");

test("score server health and leaderboards", async ({ request }) => {
  const health = await (await request.get(`${SCORES_URL}/health`)).json();
  expect(health.ok).toBe(true);
  expect(health.scores).toBeGreaterThan(8000);

  const all = (await (await request.get(`${SCORES_URL}/leaders`)).json())
    .leaders;
  expect(all.length).toBeGreaterThan(100);
  for (let i = 1; i < all.length; i++)
    expect(all[i].score).toBeLessThanOrEqual(all[i - 1].score);

  const recent = (
    await (await request.get(`${SCORES_URL}/leaders?days=30`)).json()
  ).leaders;
  expect(recent.length).toBeLessThanOrEqual(all.length);
  const cutoff = Date.now() - 30 * 86400 * 1000;
  for (const l of recent)
    expect(Date.parse(l.createdAt)).toBeGreaterThan(cutoff);
});

test("leaderboard has one row per player and no blank names", async ({
  request
}) => {
  // Known issue: Parse-era scores include "" and whitespace-only names. The
  // server groups by upper(player_name), so each spelling of blank is its own
  // row, and "" is then renamed "anonymous", doubling the real anonymous row.
  test.fail(true, "blank player names are not folded into anonymous");
  const all = (await (await request.get(`${SCORES_URL}/leaders`)).json())
    .leaders;
  for (const l of all) expect(l.playerName.trim(), "blank name").not.toBe("");
  // the server folds case with sqlite's upper(), which is ASCII-only
  const names = all.map(l =>
    l.playerName.replace(/[a-z]/g, c => c.toUpperCase())
  );
  expect(new Set(names).size, "one row per player").toBe(names.length);
});

test("score server rejects bad posts", async ({ request }) => {
  const post = body =>
    request.post(`${SCORES_URL}/scores`, {
      headers: { "content-type": "text/plain" },
      data: body
    });
  expect((await post("not json")).status()).toBe(400);
  expect(
    (
      await post(JSON.stringify({ playerName: "x", score: -1, sequence: [] }))
    ).status()
  ).toBe(400);
  expect(
    (
      await post(
        JSON.stringify({ playerName: "x", score: 10, sequence: "nope" })
      )
    ).status()
  ).toBe(400);
  expect(
    (
      await post(JSON.stringify({ playerName: 5, score: 10, sequence: [] }))
    ).status()
  ).toBe(400);
  expect((await request.get(`${SCORES_URL}/nope`)).status()).toBe(404);
});

test("leaderboard page renders both boards from the server", async ({
  page,
  request
}) => {
  const all = (await (await request.get(`${SCORES_URL}/leaders`)).json())
    .leaders;
  await page.goto("/#/leaders");
  const boards = page.locator(".leader-board");
  await expect(boards).toHaveCount(2);
  const full = boards.nth(1).locator(".entry");
  await expect(full).toHaveCount(all.length);
  await expect(full.first().locator(".rank")).toHaveText("1.");
  await expect(full.first().locator(".playerName")).toHaveText(
    all[0].playerName
  );
  await expect(full.first().locator(".score")).toContainText(
    `${all[0].score} pts`
  );
  await expect(full.first().locator(".score")).toContainText(
    `${all[0].gameCount} games`
  );
  await expectClean(page);
});
