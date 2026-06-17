async (page) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:3111/", { waitUntil: "networkidle" });
  await page.getByText("Phase 10 / release QA").waitFor({ timeout: 10000 });
  await page.locator("canvas").first().waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.getByText("3D Horizon").first().waitFor({ timeout: 10000 });
  await page.locator(".gallery-canvas-shell").click({ position: { x: 195, y: 430 } });
  await page.getByRole("dialog").waitFor({ timeout: 10000 });
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached", timeout: 10000 });
  const metadata = await page.evaluate(() => ({
    title: document.title,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content")
  }));
  await page.screenshot({ path: "output/playwright/phase11-mobile-release.png", fullPage: true });
  return metadata;
}
