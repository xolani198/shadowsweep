import { test, expect } from "@playwright/test";

test("revoke all access flow for emp-001 (Marcus Chen)", async ({ page }) => {
  await page.goto("/dashboard/employee/emp-001");

  // The CTA opens a confirmation modal, not an immediate destruction.
  await page.getByRole("button", { name: /Revoke All Access/i }).click();

  const dialog = page.getByRole("dialog", { name: /Revoke all shadow IT access/i });
  await expect(dialog).toBeVisible();

  // The confirm button stays disabled until the exact employee name is typed.
  const confirmBtn = dialog.getByRole("button", { name: /Revoke access/i });
  await expect(confirmBtn).toBeDisabled();

  await dialog.locator("#confirm-phrase").fill("Marcus Chen");
  await expect(confirmBtn).toBeEnabled();
  await confirmBtn.click();

  // The animation runs, then the success state replaces the CTA block.
  await expect(page.getByText("All shadow IT access revoked successfully")).toBeVisible({
    timeout: 12000,
  });

  await expect(page.getByText("Compliance Deletion Email Template")).toBeVisible();
  await expect(page.locator("pre").filter({ hasText: "Marcus Chen" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy template/i })).toBeVisible();
});
