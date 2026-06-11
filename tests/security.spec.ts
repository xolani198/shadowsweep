import { createHmac } from "crypto";
import { test, expect } from "@playwright/test";

// Must match the SESSION_SECRET the Playwright webServer starts the dev server with.
const TEST_SESSION_SECRET = "playwright-e2e-secret-not-for-production";

function signedSessionCookie(): string {
  const payload = Buffer.from(
    JSON.stringify({ userId: "usr-e2e", orgId: "org-acme" })
  ).toString("base64url");
  const signature = createHmac("sha256", TEST_SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `ss_session=${payload}.${signature}`;
}

test.describe("HTTP security headers", () => {
  test("are present on every response", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test.describe("offboard API authorization & validation", () => {
  test("rejects unauthenticated requests with 401", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      data: { employeeId: "emp-001" },
    });
    expect(res.status()).toBe(401);
  });

  test("rejects tampered session cookies with 401", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: "ss_session=eyJmYWtlIjp0cnVlfQ.forged-signature" },
      data: { employeeId: "emp-001" },
    });
    expect(res.status()).toBe(401);
  });

  test("rejects malformed payloads with 400 for valid sessions", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie() },
      data: { employeeId: "../../etc/passwd" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid request");
  });

  test("rejects unknown fields with 400 (strict schema)", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie() },
      data: { employeeId: "emp-001", isAdmin: true },
    });
    expect(res.status()).toBe(400);
  });

  test("processes valid authenticated requests", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie() },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.employeeId).toBe("emp-001");
    expect(body.revokedApps).toContain("Figma");
    expect(body.auditLogId).toBeTruthy();
  });
});
