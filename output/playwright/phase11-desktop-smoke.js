async (page) => {
  await page.getByText("Phase 10 / release QA").waitFor({ timeout: 10000 });
  await page.locator("canvas").first().waitFor({ state: "visible", timeout: 10000 });
  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.getByText("3D Horizon").first().waitFor({ timeout: 10000 });
  await page.locator(".gallery-canvas-shell").dispatchEvent("click");
  await page.getByRole("dialog").waitFor({ timeout: 10000 });
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached", timeout: 10000 });
  const metadata = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content")
  }));
  await page.screenshot({ path: "output/playwright/phase11-desktop-release.png", fullPage: true });
  return metadata;
}
