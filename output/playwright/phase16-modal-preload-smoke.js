const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3023";

async function runViewport(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByText("Phase 15 / smooth modal preloading").waitFor();
  await page.locator("canvas").waitFor();
  await page.locator(".gallery-canvas-shell").click({
    position: { x: Math.floor(viewport.width / 2), y: Math.floor(viewport.height / 2) }
  });

  await page.locator(".gallery-detail-modal").waitFor();

  const preloadLinks = page.locator("link[data-gallery-modal-preload]");
  await preloadLinks.first().waitFor({ state: "attached" });
  const preloadHrefs = await preloadLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href"))
  );

  if (preloadHrefs.length !== 2) {
    throw new Error(`${label}: expected 2 modal preload links, got ${preloadHrefs.length}`);
  }

  if (!preloadHrefs.every((href) => href && href.includes("/images/gallery/"))) {
    throw new Error(`${label}: preload links must target full-size gallery images`);
  }

  if (preloadHrefs.some((href) => href && href.includes("/thumbs/"))) {
    throw new Error(`${label}: preload links must not target thumbnail images`);
  }

  const titleBefore = await page.locator(".gallery-detail-copy h2").innerText();
  await page.getByRole("button", { name: "Next image" }).click();
  await page.waitForTimeout(150);
  const titleAfter = await page.locator(".gallery-detail-copy h2").innerText();

  if (titleBefore === titleAfter) {
    throw new Error(`${label}: Next image did not change the modal image`);
  }

  await page.keyboard.press("Escape");
  await page.locator(".gallery-detail-modal").waitFor({ state: "detached" });
  const remainingPreloadLinks = await preloadLinks.count();

  if (remainingPreloadLinks !== 0) {
    throw new Error(`${label}: modal preload links remained after close`);
  }

  if (errors.length > 0) {
    throw new Error(`${label}: console errors: ${errors.join(" | ")}`);
  }

  await page.screenshot({ path: `output/playwright/phase16-${label}-modal-preload.png` });
  await page.close();
}

(async () => {
  const browser = await chromium.launch();

  try {
    await runViewport(browser, { width: 1440, height: 980 }, "desktop");
    await runViewport(browser, { width: 390, height: 844 }, "mobile");
  } finally {
    await browser.close();
  }
})();
