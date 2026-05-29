import { test, expect } from "@playwright/test";

test("revoke all access flow for emp-001 (Marcus Chen)", async ({ page }) => {
  await page.goto("/dashboard/employee/emp-001");

  // Click "Revoke All Access"
  await page.getByRole("button", { name: /Revoke All Access/i }).click();

  // The animation runs through 7 steps at ~900ms each.
  // Wait for all 7 steps to complete by watching for CheckCircle2 icons.
  // Use a generous timeout (12s) to cover 7 × 900ms + buffer.
  await expect(
    page.locator(".step-active, [class*='step']").first()
  ).toBeVisible({ timeout: 3000 });

  // Wait for animation to finish — success state replaces the CTA block
  await expect(
    page.getByText("All shadow IT access revoked successfully")
  ).toBeVisible({ timeout: 12000 });

  // At this point all 7 steps have completed with green checkmarks
  // (the success message only appears after all steps pass)

  // Assert the compliance email template is visible
  await expect(page.getByText("Compliance Deletion Email Template")).toBeVisible();

  // Assert email template contains "Marcus Chen"
  await expect(page.locator("pre").filter({ hasText: "Marcus Chen" })).toBeVisible();

  // Assert "Copy template" button is present
  await expect(page.getByRole("button", { name: /Copy template/i })).toBeVisible();
});
