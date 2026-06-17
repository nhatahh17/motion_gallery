const { test, expect } = require("playwright/test");

for (const target of [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", viewport: { width: 390, height: 844 } }
]) {
  test(`category filter smoke ${target.name}`, async ({ page }) => {
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(target.viewport);

    page.setDefaultTimeout(10000);
    await page.goto("http://127.0.0.1:3112", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Phase 11 / category filters")).toBeVisible();
    await page.getByRole("button", { name: "Street" }).click();
    await expect(page.getByText("6 images visible")).toBeVisible();
    await page.getByRole("button", { name: "3D Horizon" }).click();
    const shell = page.locator(".gallery-canvas-shell");
    const box = await shell.boundingBox();
    if (!box) throw new Error("Missing gallery shell");
    await shell.click({ position: { x: box.width / 2, y: box.height / 2 } });
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "All" }).click();
    await expect(page.getByText("30 images visible")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth))
      .toBe(false);
    await page.screenshot({ path: `output/playwright/phase12-${target.name}-category-filter.png` });

    expect(errors).toEqual([]);
  });
}
