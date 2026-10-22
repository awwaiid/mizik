const {
  test,
  expect,
  LIVE_SCORES,
  SCORES_URL,
  expectClean,
  mizikState,
  chainOf,
  boardButton,
  playRound,
  BOARD
} = require("./helpers");

test("start game plays a one-note chain", async ({ page }) => {
  await page.goto("/#/mizik");
  await expect(page.locator("#mizik .game-start")).toBeVisible();
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.locator("#mizik .game-start")).toBeHidden();
  await chainOf(page, 1);
  const s = await mizikState(page);
  expect(s.gameStarted).toBe(true);
  expect(BOARD).toContain(s.current[0]);
  // the played note is counted on its hex
  await expect(boardButton(page, s.current[0]).locator("span")).toHaveText("1");
  await expectClean(page);
});

test("repeating the chain scores; a wrong note ends the game", async ({
  page
}) => {
  await page.goto("/#/mizik");
  await page.getByRole("button", { name: "Start Game" }).click();

  for (let round = 1; round <= 3; round++) {
    await playRound(page, round);
    await expect
      .poll(async () => (await mizikState(page)).score)
      .toBeGreaterThanOrEqual(round);
    await expect(page.locator("#mizik .game-over")).toBeHidden();
  }
  const { score } = await mizikState(page);
  await expect(page.locator("#mizik .current-score")).toContainText(
    String(score)
  );

  // chain grows to 4, play it wrong on the first note
  const current = await chainOf(page, 4);
  const wrong = BOARD.find(n => n !== current[0]);
  await boardButton(page, wrong).click();
  await expect(page.locator("#mizik .game-over")).toBeVisible();
  await expect(page.locator("#mizik .game-over")).toContainText(
    `Your score: ${score} pts`
  );
  await expectClean(page);
});

test("game over focuses the name input", async ({ page }) => {
  // Known issue: gameOver() focuses the input on $nextTick, inside the mousedown
  // that ended the game; the mousedown's default action then moves focus back
  // to the body. Flip this to a plain test once Mizik.vue defers the focus.
  test.fail(true, "name input loses focus right after gameOver() focuses it");
  await page.goto("/#/mizik");
  await page.getByRole("button", { name: "Start Game" }).click();
  const current = await chainOf(page, 1);
  await boardButton(
    page,
    BOARD.find(n => n !== current[0])
  ).click();
  await expect(page.locator("#mizik .game-over")).toBeVisible();
  await expect(page.locator("#mizik .score-name")).toBeFocused();
});

test("saving a score posts it and it shows on the leaderboard", async ({
  page,
  request
}) => {
  test.skip(LIVE_SCORES, "would write a real score to the live server");
  const name = `e2e-${Date.now().toString(36)}`;
  await page.goto("/#/mizik");
  await page.getByRole("button", { name: "Start Game" }).click();
  await playRound(page, 1);
  await playRound(page, 2);
  const current = await chainOf(page, 3);
  const { score } = await mizikState(page);
  expect(score).toBeGreaterThan(0);
  await boardButton(
    page,
    BOARD.find(n => n !== current[0])
  ).click();
  await expect(page.locator("#mizik .game-over")).toBeVisible();

  const posted = page.waitForRequest(
    r => r.method() === "POST" && r.url().endsWith("/scores")
  );
  await page.locator("#mizik .score-name").fill(name);
  await page.getByRole("button", { name: "Save Score" }).click();
  const body = JSON.parse((await posted).postData());
  expect(body).toMatchObject({ playerName: name, score, sequence: current });
  expect(typeof body.timestamp).toBe("number");

  // game restarts after saving
  await expect(page.locator("#mizik .game-over")).toBeHidden();
  await chainOf(page, 1);

  // server has it, both via the API and on the leaders page
  await expect
    .poll(async () => {
      const { leaders } = await (
        await request.get(`${SCORES_URL}/leaders?days=1`)
      ).json();
      return leaders.find(l => l.playerName === name);
    })
    .toMatchObject({ score, gameCount: 1 });
  await page.goto("/#/leaders");
  const row = page
    .locator(".leader-board")
    .first()
    .locator(".entry", { hasText: name });
  await expect(row).toHaveCount(1);
  await expect(row.locator(".score")).toContainText(`${score} pts`);
  await expectClean(page);
});

test("start over without saving resets the board", async ({ page }) => {
  await page.goto("/#/mizik");
  await page.getByRole("button", { name: "Start Game" }).click();
  const current = await chainOf(page, 1);
  await boardButton(
    page,
    BOARD.find(n => n !== current[0])
  ).click();
  await expect(page.locator("#mizik .game-over")).toBeVisible();
  await page.getByRole("button", { name: "Start Over Without Saving" }).click();
  await expect(page.locator("#mizik .game-over")).toBeHidden();
  await chainOf(page, 1);
  expect((await mizikState(page)).score).toBe(0);
  await expectClean(page);
});
