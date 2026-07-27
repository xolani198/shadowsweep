import { test, expect } from "@playwright/test";

// Billing is switched off by default (NEXT_PUBLIC_BILLING_ENABLED is unset), so
// these assert that no payment surface can be reached and nothing is gated on a
// subscription. The Stripe integration itself stays in the codebase and is
// covered again once billing is enabled. Distinct x-forwarded-for values keep
// the per-client rate limiter from bleeding between tests.

test.describe("billing disabled (free product)", () => {
  test("checkout is unreachable", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.20.0.2" },
      data: { mode: "demo" },
    });
    const res = await request.post("/api/stripe/checkout", {
      headers: { "x-forwarded-for": "10.20.0.2" },
      data: { plan: "pro", interval: "monthly" },
    });
    expect(res.status()).toBe(404);
  });

  test("customer portal is unreachable", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.20.0.4" },
      data: { mode: "demo" },
    });
    const res = await request.post("/api/stripe/portal", {
      headers: { "x-forwarded-for": "10.20.0.4" },
    });
    expect(res.status()).toBe(404);
  });

  test("webhook is unreachable", async ({ request }) => {
    const res = await request.post("/api/stripe/webhook", { data: { hello: "world" } });
    expect(res.status()).toBe(404);
  });

  test("subscription status reports a free plan", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.20.0.3" },
      data: { mode: "demo" },
    });
    const res = await request.get("/api/stripe/subscription", {
      headers: { "x-forwarded-for": "10.20.0.3" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.billingEnabled).toBe(false);
    expect(body.status).toBe("free");
  });

  test("subscription status still requires authentication", async ({ request }) => {
    const res = await request.get("/api/stripe/subscription");
    expect(res.status()).toBe(401);
  });

  test("the billing page shows the free plan and no checkout", async ({ page }) => {
    await page.goto("/dashboard/billing");
    // "Free plan" also appears in the sidebar footer, so scope to the page body.
    await expect(page.getByRole("main").getByText("Free plan")).toBeVisible();
    await expect(page.getByRole("button", { name: /Start free trial|Switch to this plan/i })).toHaveCount(0);
  });

  test("no pricing or billing navigation is exposed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Pricing" })).toHaveCount(0);
    await expect(page.getByText("Free while we are in beta")).toBeVisible();

    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: "Billing" })).toHaveCount(0);
  });
});
