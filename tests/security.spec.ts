import { createHmac } from "crypto";
import { test, expect } from "@playwright/test";

// Must match the SESSION_SECRET the Playwright webServer starts the dev server with.
const TEST_SESSION_SECRET = "playwright-e2e-secret-not-for-production";

function signedSessionCookie(overrides: Record<string, unknown> = {}): string {
  const payload = Buffer.from(
    JSON.stringify({ userId: "usr-e2e", orgId: "org-acme", role: "admin", ...overrides })
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

  test("rejects expired session cookies with 401", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie({ exp: Math.floor(Date.now() / 1000) - 10 }) },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(res.status()).toBe(401);
  });

  test("rejects cross-origin requests with 403", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie(), Origin: "https://evil.example.com" },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(res.status()).toBe(403);
  });

  test("rejects the viewer role with 403 (RBAC)", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie({ role: "viewer" }) },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(res.status()).toBe(403);
  });

  test("treats a missing role as viewer and rejects with 403 (least privilege)", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie({ role: undefined }) },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(res.status()).toBe(403);
  });

  test("dry run previews impact without revoking", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie() },
      data: { employeeId: "emp-001", scope: "shadow", dryRun: true },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.dryRun).toBe(true);
    expect(Array.isArray(body.wouldRevoke)).toBe(true);
    expect(body.appCount).toBeGreaterThan(0);
    // A preview never reports executed revocations.
    expect(body.revokedApps).toBeUndefined();
  });

  test("idempotency key makes a retry safe (no double execution)", async ({ request }) => {
    const key = `e2e-idem-${Date.now()}`;
    const first = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie(), "Idempotency-Key": key },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    const firstBody = await first.json();
    const second = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie(), "Idempotency-Key": key },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(second.headers()["idempotent-replay"]).toBe("true");
    const secondBody = await second.json();
    expect(secondBody.auditLogId).toBe(firstBody.auditLogId);
  });

  test("rejects a malformed Idempotency-Key with 400", async ({ request }) => {
    const res = await request.post("/api/offboard", {
      headers: { Cookie: signedSessionCookie(), "Idempotency-Key": "short" },
      data: { employeeId: "emp-001", scope: "shadow" },
    });
    expect(res.status()).toBe(400);
  });
});

test.describe("offboard undo", () => {
  test("rejects unauthenticated requests with 401", async ({ request }) => {
    const res = await request.post("/api/offboard/undo", { data: { employeeId: "emp-001" } });
    expect(res.status()).toBe(401);
  });

  test("rejects the viewer role with 403", async ({ request }) => {
    const res = await request.post("/api/offboard/undo", {
      headers: { Cookie: signedSessionCookie({ role: "viewer" }) },
      data: { employeeId: "emp-001" },
    });
    expect(res.status()).toBe(403);
  });

  test("an admin can undo", async ({ request }) => {
    const res = await request.post("/api/offboard/undo", {
      headers: { Cookie: signedSessionCookie() },
      data: { employeeId: "emp-001" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});
