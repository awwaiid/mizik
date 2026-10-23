const {
  test,
  expect,
  SCORES_URL,
  LIVE_SCORES,
  expectClean
} = require("./helpers");

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

test("player names are normalized on write", async ({ request }) => {
  test.skip(LIVE_SCORES, "would write real scores to the live server");
  const post = async (playerName, score) => {
    const r = await request.post(`${SCORES_URL}/scores`, {
      headers: { "content-type": "text/plain" },
      data: JSON.stringify({ playerName, score, sequence: [1], timestamp: 1 })
    });
    expect(r.status()).toBe(201);
    return (await r.json()).id;
  };
  // each case gets a unique score so it has its own leaderboard row
  const base = 9000 + (Date.now() % 500);
  const cases = [
    ["   ", base + 1, "anonymous"],
    ["", base + 2, "anonymous"],
    ["  padded  ", base + 3, "padded"],
    ["ctrl\u0000\u001fchars\n", base + 4, "ctrlchars"],
    ["x".repeat(50), base + 5, "x".repeat(32)]
  ];
  for (const [name, score] of cases) await post(name, score);
  // the export has every score, with the cleaned name stored
  const dump = await (await request.get(`${SCORES_URL}/scores.jsonl`)).text();
  const lines = dump.trim().split("\n").map(l => JSON.parse(l));
  for (const [, score, expected] of cases) {
    const row = lines.find(l => l.score === score);
    expect(row, `row for ${JSON.stringify(expected)}`).toBeTruthy();
    expect(row.playerName).toBe(expected);
  }
  expect(lines.some(l => l.playerName === null || l.playerName === "")).toBe(
    false
  );
  // both blank posts fold into the single anonymous leaderboard row
  const { leaders } = await (
    await request.get(`${SCORES_URL}/leaders?days=1`)
  ).json();
  const anon = leaders.filter(l => l.playerName === "anonymous");
  expect(anon).toHaveLength(1);
  expect(anon[0].score).toBe(base + 2);
  expect(anon[0].gameCount).toBeGreaterThanOrEqual(2);
});

test("hostile player names render as text, not HTML", async ({
  page,
  request
}) => {
  test.skip(LIVE_SCORES, "would write real scores to the live server");
  const score = 9600 + (Date.now() % 300);
  const names = [
    `<img src=x onerror=alert(1)>`,
    "<b>bold</b><script>1</script>",
    "&lt;a&gt;&amp;&quot;'"
  ];
  // unique scores so each is its own leaderboard row, highest first
  for (let i = 0; i < names.length; i++) {
    const r = await request.post(`${SCORES_URL}/scores`, {
      headers: { "content-type": "text/plain" },
      data: JSON.stringify({
        playerName: names[i],
        score: score - i,
        sequence: [1],
        timestamp: 1
      })
    });
    expect(r.status()).toBe(201);
  }
  // the API sends it back as a JSON string, with no HTML content type anywhere
  const resp = await request.get(`${SCORES_URL}/leaders?days=1`);
  expect(resp.headers()["content-type"]).toBe("application/json");
  expect(resp.headers()["x-content-type-options"]).toBe("nosniff");
  const { leaders } = await resp.json();
  for (const n of names) expect(leaders.map(l => l.playerName)).toContain(n);

  let dialogs = 0;
  page.on("dialog", d => {
    dialogs++;
    d.dismiss();
  });
  await page.goto("/#/leaders");
  const board = page.locator(".leader-board").first();
  await expect(board.locator(".entry")).not.toHaveCount(0);
  for (const n of names) {
    const cell = board.locator(".playerName", { hasText: n.slice(0, 20) });
    await expect(cell).toHaveCount(1);
    // the name is one text node: nothing parsed as markup
    await expect(cell).toHaveText(n);
    expect(await cell.evaluate(el => el.children.length)).toBe(0);
  }
  expect(await board.locator("img[src='x'], script, b").count()).toBe(0);
  expect(dialogs).toBe(0);
  await expectClean(page);
});
