import { createHmac } from "crypto";
import { test, expect } from "@playwright/test";

const TEST_SESSION_SECRET = "playwright-e2e-secret-not-for-production";

function signedCookie(role: "admin" | "viewer"): string {
  const payload = Buffer.from(
    JSON.stringify({ userId: "usr-e2e", orgId: "org-acme", role })
  ).toString("base64url");
  const sig = createHmac("sha256", TEST_SESSION_SECRET).update(payload).digest("base64url");
  return `ss_session=${payload}.${sig}`;
}

test.describe("audit log", () => {
  test("requires authentication", async ({ request }) => {
    const res = await request.get("/api/audit");
    expect(res.status()).toBe(401);
  });

  test("forbids the viewer role", async ({ request }) => {
    const res = await request.get("/api/audit", { headers: { Cookie: signedCookie("viewer") } });
    expect(res.status()).toBe(403);
  });

  test("records sign-in and exposes it to admins", async ({ request }) => {
    // A demo sign-in writes a login audit entry; the resulting admin session
    // can read the trail back.
    await request.post("/api/auth/login", {
      headers: { "x-forwarded-for": "10.30.0.1" },
      data: { mode: "demo" },
    });
    const res = await request.get("/api/audit");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.entries)).toBe(true);
    expect(body.entries.some((e: { action: string }) => e.action === "login")).toBe(true);
  });
});
