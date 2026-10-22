const { test: base, expect } = require("@playwright/test");

// What the shipped client calls; tests reroute it to SCORES_URL.
const PROD_SCORES = "https://thelackthereof.org/mizik";
const SCORES_URL = process.env.MIZIK_SCORES_URL || "http://127.0.0.1:4174";
const LIVE_SCORES = SCORES_URL.replace(/\/$/, "") === PROD_SCORES;

// Notes in DOM order on the Mizik board: the layout in src/views/Mizik.vue
// flattened, zeros (gaps) dropped.
const BOARD = [
  59,
  61,
  63,
  52,
  54,
  56,
  58,
  45,
  47,
  49,
  51,
  53,
  40,
  42,
  44,
  46,
  37,
  39,
  41
];

const test = base.extend({
  // Every test gets: console/page errors + failed requests collected, analytics
  // stubbed out, and score API calls rerouted to the server under test.
  page: async ({ page }, use) => {
    // serviceWorkers is "block" in the config so page.route sees every request;
    // hide the API too, or register-service-worker logs an error on the stub.
    await page.addInitScript(() => delete Navigator.prototype.serviceWorker);
    const errors = [];
    page.on("pageerror", e => errors.push(`pageerror: ${e.message}`));
    page.on("console", m => {
      if (m.type() === "error") errors.push(`console.error: ${m.text()}`);
    });
    page.on("requestfailed", r => {
      if (r.failure() && r.failure().errorText !== "net::ERR_ABORTED") {
        errors.push(`requestfailed: ${r.url()} ${r.failure().errorText}`);
      }
    });
    await page.route(/googletagmanager\.com|google-analytics\.com/, route =>
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: ""
      })
    );
    if (!LIVE_SCORES) {
      await page.route(
        url => url.href.startsWith(PROD_SCORES),
        async route => {
          const req = route.request();
          const url = req.url().replace(PROD_SCORES, SCORES_URL);
          const resp = await page.request.fetch(url, {
            method: req.method(),
            headers: { "content-type": req.headers()["content-type"] || "" },
            data: req.postData() || undefined
          });
          await route.fulfill({ response: resp });
        }
      );
    }
    page.errors = errors;
    await use(page);
  }
});

async function expectClean(page) {
  expect(page.errors, "browser errors during the test").toEqual([]);
}

// Vue 2 hangs the component instance off its root element.
function mizikState(page) {
  return page.evaluate(() => {
    const vm = document.querySelector("#mizik").__vue__;
    return {
      current: vm.current.slice(),
      playing: vm.currentPlaying.length,
      score: vm.score,
      winning: vm.winning,
      gameStarted: vm.gameStarted
    };
  });
}

async function waitForPlayback(page) {
  await expect
    .poll(async () => (await mizikState(page)).playing, { timeout: 15000 })
    .toBe(0);
  // last note's trigger animation (0.2s) plus a little
  await page.waitForTimeout(400);
}

function boardButton(page, note) {
  const i = BOARD.indexOf(note);
  if (i < 0) throw new Error(`note ${note} is not on the board`);
  return page.locator("#mizik .trigger-button").nth(i);
}

// Wait for the chain to reach `length` notes and finish playing.
async function chainOf(page, length) {
  await expect
    .poll(async () => (await mizikState(page)).current.length, {
      timeout: 15000
    })
    .toBe(length);
  await waitForPlayback(page);
  return (await mizikState(page)).current;
}

// Repeat the current chain back correctly. Returns the chain played.
async function playRound(page, length) {
  const current = await chainOf(page, length);
  for (const note of current) {
    await boardButton(page, note).click();
    await page.waitForTimeout(250);
  }
  return current;
}

module.exports = {
  test,
  expect,
  BOARD,
  SCORES_URL,
  LIVE_SCORES,
  expectClean,
  mizikState,
  waitForPlayback,
  chainOf,
  boardButton,
  playRound
};
