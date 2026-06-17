const { chromium } = require("playwright");

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3014";

async function getShellTransform(page) {
  return page.locator(".gallery-canvas-shell").evaluate((element) => {
    const canvas = element.querySelector("canvas");
    return {
      html: element.innerHTML.length,
      pixels: canvas ? `${canvas.width}x${canvas.height}` : "missing"
    };
  });
}

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
  await page.locator(".gallery-canvas-shell canvas").waitFor({ state: "visible" });

  const before = await page.screenshot({ fullPage: true });
  await page.locator(".gallery-canvas-shell").hover();
  await page.mouse.wheel(0, 720);
  await page.waitForTimeout(500);
  const after = await page.screenshot({
    path: `output/playwright/phase14-${name}-wheel.png`,
    fullPage: true
  });

  if (Buffer.compare(before, after) === 0) {
    throw new Error(`${name}: wheel input did not change the rendered page`);
  }

  const shell = await getShellTransform(page);
  if (shell.pixels === "missing" || shell.html <= 0) {
    throw new Error(`${name}: gallery shell was not rendered after wheel input`);
  }

  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.mouse.wheel(300, 0);
  await page.waitForTimeout(300);
  await page.mouse.click(Math.floor(viewport.width / 2), Math.floor(viewport.height / 2));
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Close image detail" }).click();

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
