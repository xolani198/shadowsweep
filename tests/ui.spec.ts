import { test, expect } from "@playwright/test";

// Interactive shell coverage. These run in a real browser context, which
// (unlike a hidden/throttled preview pane) actually advances CSS transitions.

test.describe("mobile navigation drawer", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens from the hamburger and closes again", async ({ page }) => {
    await page.goto("/dashboard");

    const drawer = page.locator("aside");
    // Off-canvas to start, so it must not be reachable.
    await expect(drawer).not.toBeInViewport();

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(drawer).toBeInViewport();
    await expect(drawer.getByRole("link", { name: "Discovery" })).toBeVisible();

    // The scrim closes it again.
    await page.locator("div.fixed.inset-0.z-40").click();
    await expect(drawer).not.toBeInViewport();
  });

  test("navigating from the drawer closes it", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.locator("aside")).toBeInViewport();

    await page.locator("aside").getByRole("link", { name: "Employees" }).click();
    await expect(page).toHaveURL(/\/dashboard\/employees/);
    await expect(page.locator("aside")).not.toBeInViewport();
  });

  test("the page does not scroll sideways on a small screen", async ({ page }) => {
    await page.goto("/dashboard");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    );
    expect(overflow).toBe(true);
  });
});

test.describe("command palette", () => {
  test("opens with the keyboard, filters, and navigates", async ({ page }) => {
    await page.goto("/dashboard");

    await page.keyboard.press("ControlOrMeta+k");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();

    await palette.getByPlaceholder(/Search pages/i).fill("disco");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/dashboard\/discovery/);
    await expect(palette).toBeHidden();
  });

  test("closes with Escape", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("ControlOrMeta+k");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();
  });
});

test.describe("theme", () => {
  test("toggles between light and dark and persists", async ({ page }) => {
    await page.goto("/dashboard");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle theme" }).first();
    await expect(toggle).toBeVisible();

    // The bootstrap script applies the theme before paint, so the class is
    // already correct here and nothing is written to storage until a toggle.
    const wasDark = await html.evaluate((el) => el.classList.contains("dark"));

    await toggle.click();
    await expect.poll(() => html.evaluate((el) => el.classList.contains("dark"))).toBe(!wasDark);

    // The choice survives a reload.
    await page.reload();
    await expect.poll(() => html.evaluate((el) => el.classList.contains("dark"))).toBe(!wasDark);
  });
});
