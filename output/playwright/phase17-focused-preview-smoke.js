const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3024";

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
  await page.getByText("Phase 16 / focused metadata preview").waitFor();
  await page.locator("canvas").waitFor();

  const shell = page.locator(".gallery-canvas-shell");
  const preview = page.locator(".gallery-focus-preview");
  await preview.waitFor();
  const previewBefore = await preview.innerText();

  for (let index = 0; index < 4; index += 1) {
    await shell.dispatchEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaX: 0,
      deltaY: 900
    });
  }
  await page.waitForTimeout(500);
  const previewAfter = await preview.innerText();

  if (previewBefore === previewAfter) {
    throw new Error(`${label}: focused metadata preview did not change after wheel input`);
  }

  await shell.click({
    position: { x: Math.floor(viewport.width / 2), y: Math.floor(viewport.height / 2) }
  });
  await page.locator(".gallery-detail-modal").waitFor();
  const previewDuringModal = await preview.count();

  if (previewDuringModal !== 0) {
    throw new Error(`${label}: focused metadata preview remained visible while modal was open`);
  }

  await page.keyboard.press("Escape");
  await page.locator(".gallery-detail-modal").waitFor({ state: "detached" });
  await preview.waitFor();

  if (errors.length > 0) {
    throw new Error(`${label}: console errors: ${errors.join(" | ")}`);
  }

  await page.screenshot({ path: `output/playwright/phase17-${label}-focused-preview.png` });
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
