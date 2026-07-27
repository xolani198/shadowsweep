import { defineConfig } from "@playwright/test";

// Keep in sync with tests/security.spec.ts. Used to sign test session cookies.
export const TEST_SESSION_SECRET = "playwright-e2e-secret-not-for-production";

export default defineConfig({
  testDir: "./tests",
  // The rate limiter, idempotency store, and audit log are in-memory and shared
  // by every request the dev server handles, so parallel workers contend over
  // them and the suite goes flaky. Run serially to keep results deterministic.
  workers: 1,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
    env: {
      ...process.env,
      SESSION_SECRET: TEST_SESSION_SECRET,
    },
  },
});
