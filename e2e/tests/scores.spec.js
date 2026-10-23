const {
  test,
  expect,
  SCORES_URL,
  LIVE_SCORES,
  expectClean
} = require("./helpers");

// A legal 40-note chain (42 and 44 are adjacent) whose ceiling (460) clears every real score.
const CHAIN = Array.from({ length: 40 }, (_, i) => (i % 2 ? 44 : 42));

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
      data: JSON.stringify({ playerName, score, sequence: CHAIN, timestamp: 1 })
    });
    expect(r.status()).toBe(201);
    return (await r.json()).id;
  };
  // each case gets a unique score so it has its own leaderboard row
  const base = 300 + (Date.now() % 100);
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
  const lines = dump
    .trim()
    .split("\n")
    .map(l => JSON.parse(l));
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
  const score = 200 + (Date.now() % 40);
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
        sequence: CHAIN,
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

test("forged or malformed scores are rejected, never a 5xx", async ({
  request
}) => {
  test.skip(LIVE_SCORES, "would write real scores to the live server");
  const post = (data, headers = {}) =>
    request.post(`${SCORES_URL}/scores`, {
      headers: { "content-type": "text/plain", ...headers },
      data: typeof data === "string" ? data : JSON.stringify(data)
    });
  const ok = {
    playerName: "zz-audit",
    score: 3,
    sequence: [42, 44, 42],
    timestamp: 1
  };
  expect((await post(ok)).status()).toBe(201);
  const cases = [
    ["score above what the chain can earn", { ...ok, score: 8 }],
    ["score above the ceiling", { ...ok, score: 9999, sequence: [42] }],
    ["note not on the board", { ...ok, sequence: [42, 1] }],
    ["non-adjacent notes", { ...ok, sequence: [37, 63] }],
    ["boolean in sequence", { ...ok, sequence: [true] }],
    ["chain too long", { ...ok, sequence: Array(101).fill(42), score: 0 }],
    [
      "NaN timestamp",
      '{"playerName":"zz","score":0,"sequence":[],"timestamp":NaN}'
    ],
    [
      "infinite timestamp",
      '{"playerName":"zz","score":0,"sequence":[],"timestamp":Infinity}'
    ],
    ["string score", { ...ok, score: "3" }],
    ["not json", "nope"]
  ];
  for (const [label, body] of cases) {
    const r = await post(body);
    expect(r.status(), label).toBe(400);
    expect(r.headers()["content-type"], label).toBe("application/json");
  }
  // a foreign web page cannot post from the browser
  const r = await post(ok, { origin: "https://evil.example" });
  expect(r.status()).toBe(403);
  for (const origin of ["https://mizikgame.com", "http://localhost:8080"]) {
    expect((await post(ok, { origin })).status(), origin).toBe(201);
  }
  // absurd leaderboard window is clamped, not an error
  const big = await request.get(`${SCORES_URL}/leaders?days=99999999999999`);
  expect(big.status()).toBe(200);
  // bad content-length header
  const badLen = await request.post(`${SCORES_URL}/scores`, {
    headers: { "content-type": "text/plain", "content-length": "abc" },
    data: "{}"
  });
  expect([400, 413]).toContain(badLen.status());
});

test("posting is rate limited per client", async ({ request }) => {
  test.skip(LIVE_SCORES, "would write real scores to the live server");
  const body = {
    playerName: "zz-flood",
    score: 0,
    sequence: [42],
    timestamp: 1
  };
  const headers = {
    "content-type": "text/plain",
    "x-forwarded-for": "203.0.113.9"
  };
  const codes = [];
  for (let i = 0; i < 65; i++) {
    codes.push(
      (
        await request.post(`${SCORES_URL}/scores`, {
          headers,
          data: JSON.stringify(body)
        })
      ).status()
    );
  }
  expect(codes.filter(c => c === 201)).toHaveLength(60);
  expect(codes.slice(60).every(c => c === 429)).toBe(true);
  // another client is unaffected
  const other = await request.post(`${SCORES_URL}/scores`, {
    headers: { ...headers, "x-forwarded-for": "203.0.113.10" },
    data: JSON.stringify(body)
  });
  expect(other.status()).toBe(201);
});
