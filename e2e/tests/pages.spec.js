const { test, expect, expectClean } = require("./helpers");

test.describe("every page loads clean", () => {
  for (const [path, marker] of [
    ["/#/", "text=Click here to play Mizik!"],
    ["/#/mizik", "#mizik .trigger-button"],
    ["/#/leaders", ".leaderBoard"],
    ["/#/synth", "#synth .trigger-button"],
    ["/#/about", ".about"]
  ]) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator(marker).first()).toBeVisible();
      await page.waitForLoadState("networkidle");
      await expectClean(page);
    });
  }
});

test("nav links reach each view", async ({ page }) => {
  await page.goto("/#/");
  await page.locator("#nav a", { hasText: "Play Mizik" }).click();
  await expect(page.locator("#mizik .game-start")).toBeVisible();
  await page.locator("#nav a", { hasText: "Leader Board" }).click();
  await expect(page.locator(".leaderBoard h2").first()).toHaveText(
    "30-Day Leader Board"
  );
  await page.locator("#nav a", { hasText: "Synth" }).click();
  await expect(page.locator("#synth .trigger-button")).toHaveCount(28);
  await expectClean(page);
});

test("mizik board has the 19 hexes", async ({ page }) => {
  await page.goto("/#/mizik");
  await expect(page.locator("#mizik .trigger-button")).toHaveCount(19);
  await expect(page.locator("#mizik .current-score")).toContainText("0");
  await expectClean(page);
});

test("synth: show all keys expands the board", async ({ page }) => {
  await page.goto("/#/synth");
  await expect(page.locator("#synth .trigger-button")).toHaveCount(28);
  await page.getByLabel("Show all keys").check();
  await expect(page.locator("#synth .trigger-button")).toHaveCount(104);
  await expectClean(page);
});
