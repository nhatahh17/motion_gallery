const { chromium } = require("playwright");
const { createHash } = require("node:crypto");
const { mkdirSync } = require("node:fs");

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = "output/playwright";

function hash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function waitForReady(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByText("Phase 18").waitFor({ timeout: 15000 });
  await page.locator("canvas").waitFor({ timeout: 15000 });
  await page.waitForTimeout(900);
}

async function smokeViewport(browser, name, viewport) {
  const consoleErrors = [];
  const page = await browser.newPage({ viewport });
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await waitForReady(page);

  const shell = page.locator(".gallery-canvas-shell");
  const box = await shell.boundingBox();
  if (!box) {
    throw new Error(`${name}: gallery shell missing`);
  }

  const beforeDrag = await shell.screenshot();
  await page.mouse.move(box.x + box.width * 0.68, box.y + box.height * 0.55);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.55, { steps: 12 });
  await page.waitForTimeout(180);
  const duringDrag = await shell.screenshot();
  await page.mouse.up();
  await page.waitForTimeout(450);

  if (hash(beforeDrag) === hash(duringDrag)) {
    throw new Error(`${name}: drag did not change gallery rendering`);
  }

  await page.getByRole("button", { name: "3D Horizon" }).click();
  await expectPressed(page, "3D Horizon");
  await shell.click({ position: { x: Math.floor(box.width / 2), y: Math.floor(box.height / 2) } });
  await page.getByRole("dialog").waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1
  );
  if (hasHorizontalOverflow) {
    throw new Error(`${name}: horizontal overflow detected`);
  }

  if (consoleErrors.length > 0) {
    throw new Error(`${name}: console errors: ${consoleErrors.join(" | ")}`);
  }

  await page.screenshot({ path: `${outputDir}/phase19-${name}-drag-expansion.png`, fullPage: true });
  await page.close();
}

async function expectPressed(page, name) {
  const pressed = await page.getByRole("button", { name }).getAttribute("aria-pressed");
  if (pressed !== "true") {
    throw new Error(`${name}: expected aria-pressed true, got ${pressed}`);
  }
}

(async () => {
  mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch();
  try {
    await smokeViewport(browser, "desktop", { width: 1440, height: 980 });
    await smokeViewport(browser, "mobile", { width: 390, height: 844, isMobile: true });
  } finally {
    await browser.close();
  }
})();
