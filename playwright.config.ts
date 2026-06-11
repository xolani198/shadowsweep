import { defineConfig } from "@playwright/test";

// Keep in sync with tests/security.spec.ts — used to sign test session cookies.
export const TEST_SESSION_SECRET = "playwright-e2e-secret-not-for-production";

export default defineConfig({
  testDir: "./tests",
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
