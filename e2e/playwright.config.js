// Headless Chrome integration tests for mizik.
//
// By default this serves the built ../dist and runs a throwaway copy of
// ../score-server (sqlite in .tmp/), so the whole game is exercised locally
// with no network. The browser's calls to the production score API are
// rerouted to the local server inside the tests (see tests/helpers.js).
//
//   MIZIK_URL=https://mizikgame.com          test the deployed site instead of dist
//   MIZIK_SCORES_URL=https://thelackthereof.org/mizik
//                                             use the live score server (read-only
//                                             tests only; the score-posting test skips)
const { defineConfig, devices } = require("@playwright/test");
const path = require("path");

const APP_PORT = 4173;
const SCORES_PORT = 4174;
const root = path.resolve(__dirname, "..");
const tmp = path.join(__dirname, ".tmp");

const appUrl = process.env.MIZIK_URL || `http://127.0.0.1:${APP_PORT}`;
const scoresUrl =
  process.env.MIZIK_SCORES_URL || `http://127.0.0.1:${SCORES_PORT}`;

const webServer = [];
if (!process.env.MIZIK_URL) {
  webServer.push({
    command: `python3 -m http.server ${APP_PORT} --bind 127.0.0.1 --directory ${root}/dist`,
    url: appUrl,
    reuseExistingServer: false
  });
}
if (!process.env.MIZIK_SCORES_URL) {
  webServer.push({
    command: `rm -rf ${tmp} && mkdir -p ${tmp} && SCORES_DB=${tmp}/scores.db PORT=${SCORES_PORT} python3 ${root}/score-server/server.py`,
    url: `${scoresUrl}/health`,
    reuseExistingServer: false
  });
}

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: appUrl,
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
    launchOptions: {
      args: ["--autoplay-policy=no-user-gesture-required"]
    }
  },
  metadata: { scoresUrl },
  webServer
});
