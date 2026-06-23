import { test, expect } from "@playwright/test";

// These run against a server WITHOUT Stripe keys (none in the test env), so they
// assert the graceful "not configured" behavior and the auth gates. Distinct
// x-forwarded-for values keep the per-client rate limiter from bleeding.

test.describe("stripe billing routes", () => {
  test("checkout requires authentication", async ({ request }) => {
    const res = await request.post("/api/stripe/checkout", {
      headers: { "x-forwarded-for": "10.20.0.1" },
      data: { plan: "pro", interval: "monthly" },
    });
    expect(res.status()).toBe(401);
  });

  test("checkout returns 503 when Stripe is unconfigured (authenticated)", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.20.0.2" },
      data: { mode: "demo" },
    });
    const res = await request.post("/api/stripe/checkout", {
      headers: { "x-forwarded-for": "10.20.0.2" },
      data: { plan: "pro", interval: "monthly" },
    });
    expect(res.status()).toBe(503);
  });

  test("checkout rejects invalid plans with 400", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.20.0.6" },
      data: { mode: "demo" },
    });
    const res = await request.post("/api/stripe/checkout", {
      headers: { "x-forwarded-for": "10.20.0.6" },
      data: { plan: "enterprise", interval: "monthly" },
    });
    // 400 (rejected by schema before the unconfigured check)
    expect(res.status()).toBe(400);
  });

  test("subscription status reports unconfigured for an authenticated user", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.20.0.3" },
      data: { mode: "demo" },
    });
    const res = await request.get("/api/stripe/subscription", {
      headers: { "x-forwarded-for": "10.20.0.3" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).configured).toBe(false);
  });

  test("webhook rejects requests without a valid signature", async ({ request }) => {
    const res = await request.post("/api/stripe/webhook", { data: { hello: "world" } });
    // 503 when no webhook secret is configured (test env); 400 if configured but unsigned.
    expect([400, 503]).toContain(res.status());
  });
});
