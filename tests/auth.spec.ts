import { test, expect } from "@playwright/test";

// Each test uses a distinct x-forwarded-for so the per-client rate limiter
// buckets don't bleed across tests running in parallel.

test.describe("auth: demo sign-in", () => {
  test("issues an HttpOnly session cookie that unlocks the offboard API", async ({ request }) => {
    const login = await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.10.0.1" },
      data: { mode: "demo" },
    });
    expect(login.status()).toBe(200);

    const setCookie = login.headers()["set-cookie"] || "";
    expect(setCookie).toContain("ss_session=");
    expect(setCookie.toLowerCase()).toContain("httponly");
    expect(setCookie.toLowerCase()).toContain("samesite=lax");

    // The request context now carries the session — offboard should succeed.
    const off = await request.post("/api/offboard", {
      headers: { "x-forwarded-for": "10.10.0.1" },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(off.status()).toBe(200);
    expect((await off.json()).ok).toBe(true);
  });

  test("rejects cross-origin login with 403", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.10.0.5", Origin: "https://evil.example.com" },
      data: { mode: "demo" },
    });
    expect(res.status()).toBe(403);
  });
});

test.describe("auth: logout", () => {
  test("expires the session cookie", async ({ request }) => {
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.10.0.2" },
      data: { mode: "demo" },
    });
    const res = await request.post("/api/auth/logout", {
      headers: { "x-forwarded-for": "10.10.0.2" },
    });
    expect(res.status()).toBe(200);
    const setCookie = (res.headers()["set-cookie"] || "").toLowerCase();
    expect(setCookie).toContain("ss_session=");
    expect(setCookie).toMatch(/max-age=0|expires=/);
  });
});

test.describe("auth: rate limiting", () => {
  test("throttles repeated failed login attempts with 429", async ({ request }) => {
    let saw429 = false;
    for (let i = 0; i < 15; i++) {
      const res = await request.post("/api/auth/login", {
        headers: { "x-forwarded-for": "10.10.0.99" },
        data: { email: "nobody@example.com", password: "wrong-password" },
      });
      if (res.status() === 429) {
        saw429 = true;
        break;
      }
    }
    expect(saw429).toBe(true);
  });
});

test.describe("dashboard access", () => {
  test("renders the dashboard (demo session auto-issued by middleware)", async ({ page }) => {
    const res = await page.goto("/dashboard");
    expect(res?.status()).toBe(200);
    await expect(page.getByText("Command Dashboard")).toBeVisible();
  });
});
