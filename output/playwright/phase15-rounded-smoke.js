const { chromium } = require("playwright");

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3015";

async function runViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Motion gallery" }).waitFor();
  await page.getByText("Phase 14 / rounded image treatment").waitFor();
  await page.locator(".gallery-canvas-shell canvas").waitFor({ state: "visible" });

  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.mouse.wheel(240, 0);
  await page.waitForTimeout(300);
  await page.mouse.click(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
  await page.getByRole("dialog").waitFor({ state: "visible" });

  const modalRadius = await page.locator(".gallery-detail-image").evaluate((element) => {
    return window.getComputedStyle(element).borderRadius;
  });

  if (modalRadius !== "10px") {
    throw new Error(`${name}: expected modal image radius 10px, received ${modalRadius}`);
  }

  await page.screenshot({
    path: `output/playwright/phase15-${name}-rounded.png`,
    fullPage: true
  });

  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  if (consoleErrors.length > 0) {
    throw new Error(`${name}: console errors:\n${consoleErrors.join("\n")}`);
  }

  await page.close();
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });

  try {
    await runViewport(browser, "desktop", { width: 1440, height: 900 });
    await runViewport(browser, "mobile", { width: 390, height: 844, isMobile: true });
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
