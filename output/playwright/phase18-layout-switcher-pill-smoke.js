const { chromium } = require("playwright");

async function runViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForSelector(".layout-switcher-pill");
  await page.waitForSelector("canvas");

  const phaseLabel = await page.locator(".site-phase").textContent();
  if (!phaseLabel || !phaseLabel.includes("Phase 17")) {
    throw new Error(`${name}: expected Phase 17 label, received ${phaseLabel}`);
  }

  const initial = await page.locator(".layout-switcher-pill").evaluate((node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return { transform: style.transform, width: rect.width };
  });

  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.waitForTimeout(350);

  const afterHorizon = await page.locator(".layout-switcher-pill").evaluate((node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return { transform: style.transform, width: rect.width };
  });

  if (initial.width <= 0 || afterHorizon.width <= 0) {
    throw new Error(`${name}: active pill has no visible width`);
  }

  if (initial.transform === afterHorizon.transform) {
    throw new Error(`${name}: active pill transform did not change after layout switch`);
  }

  await page.locator(".gallery-canvas-shell").click({ position: { x: viewport.width / 2, y: 260 } });
  await page.waitForSelector(".gallery-detail-modal");
  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.waitForSelector(".gallery-detail-modal", { state: "detached" });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) {
    throw new Error(`${name}: horizontal overflow ${overflow}`);
  }

  if (consoleErrors.length > 0) {
    throw new Error(`${name}: console errors: ${consoleErrors.join("\n")}`);
  }

  await page.screenshot({ path: `output/playwright/phase18-${name}-layout-pill.png`, fullPage: true });
  await page.close();
}

async function main() {
  const browser = await chromium.launch();
  try {
    await runViewport(browser, "desktop", { width: 1440, height: 960 });
    await runViewport(browser, "mobile", { width: 390, height: 844 });
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
