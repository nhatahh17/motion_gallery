const { chromium } = require("playwright");

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";

async function collectSmoke({ name, viewport, reducedMotion = "no-preference" }) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    colorScheme: "light",
    reducedMotion,
    viewport
  });
  const consoleErrors = [];
  const events = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.exposeFunction("recordGalleryAnalytics", (detail) => {
    events.push(detail);
  });
  await page.addInitScript(() => {
    window.addEventListener("motion-gallery:analytics", (event) => {
      window.recordGalleryAnalytics(event.detail);
    });
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector(".site-phase", { state: "visible" });
  const phaseLabel = await page.locator(".site-phase").innerText();

  if (!phaseLabel.toLowerCase().includes("phase 22")) {
    throw new Error(`${name}: expected Phase 22 label, got ${phaseLabel}`);
  }

  await page.waitForTimeout(500);

  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.waitForTimeout(100);

  const shell = page.locator(".gallery-canvas-shell");
  const box = await shell.boundingBox();

  if (!box) {
    throw new Error(`${name}: gallery shell missing`);
  }

  await page.mouse.move(box.x + box.width * 0.48, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.5, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(100);

  await shell.click({ position: { x: Math.round(box.width / 2), y: Math.round(box.height / 2) } });
  await page.waitForSelector(".gallery-detail-modal", { state: "visible" });
  await page.keyboard.press("Escape");
  await page.waitForSelector(".gallery-detail-modal", { state: "detached" });
  await page.waitForTimeout(200);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const names = events.map((event) => event.event);
  const required = reducedMotion === "reduce"
    ? ["gallery_loaded", "reduced_motion_enabled"]
    : ["gallery_loaded", "layout_changed", "drag_started", "drag_ended", "image_opened", "image_closed"];
  const missing = required.filter((event) => !names.includes(event));

  if (missing.length > 0) {
    throw new Error(`${name}: missing analytics events ${missing.join(", ")} from ${JSON.stringify(events)}`);
  }

  if (overflow > 1) {
    throw new Error(`${name}: horizontal overflow ${overflow}`);
  }

  if (consoleErrors.length > 0) {
    throw new Error(`${name}: console errors ${consoleErrors.join("\n")}`);
  }

  await page.screenshot({ path: `output/playwright/phase22-${name}.png`, fullPage: true });
  await browser.close();

  return { events, name, overflow, phaseLabel };
}

(async () => {
  await collectSmoke({
    name: "desktop-analytics",
    viewport: { width: 1440, height: 960 }
  });
  await collectSmoke({
    name: "mobile-analytics",
    viewport: { width: 390, height: 844 }
  });
  await collectSmoke({
    name: "desktop-reduced-motion",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 }
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
