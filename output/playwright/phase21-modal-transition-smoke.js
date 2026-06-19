const { chromium } = require("playwright");

async function runViewport({ name, width, height, reducedMotion }) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reducedMotion ? "reduce" : "no-preference"
  });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("http://127.0.0.1:3021", { waitUntil: "networkidle" });
  await page.getByText("Phase 21 / WebGL-to-DOM transition hint").waitFor();
  await page.locator("canvas").waitFor();

  await page.locator(".gallery-canvas-shell").click({ position: { x: width / 2, y: height / 3 } });
  const modal = page.locator(".gallery-detail-modal");
  await modal.waitFor();
  const transitionEnabled = await modal.getAttribute("data-transition-enabled");
  const transition = await modal.getAttribute("data-transition");

  if (reducedMotion) {
    if (transitionEnabled !== "false") {
      throw new Error(`${name}: expected reduced motion to disable transition`);
    }
  } else {
    if (transitionEnabled !== "true") {
      throw new Error(`${name}: expected modal transition to be enabled`);
    }
    if (!["connected", "fallback"].includes(transition || "")) {
      throw new Error(`${name}: unexpected transition variant ${transition}`);
    }
  }

  if (!reducedMotion) {
    await page.getByRole("button", { name: "Next image" }).click();
    await page.getByRole("button", { name: "Close image detail" }).click();
    await modal.waitFor({ state: "detached" });
    await page.getByRole("button", { name: "3D Horizon" }).click();
  } else {
    await page.keyboard.press("Escape");
    await modal.waitFor({ state: "detached" });
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) {
    throw new Error(`${name}: horizontal overflow detected`);
  }

  await page.screenshot({ path: `output/playwright/phase21-${name}.png`, fullPage: true });
  await browser.close();

  if (consoleErrors.length > 0) {
    throw new Error(`${name}: console errors: ${consoleErrors.join("\n")}`);
  }
}

(async () => {
  await runViewport({ name: "desktop-modal-transition", width: 1280, height: 820, reducedMotion: false });
  await runViewport({ name: "desktop-reduced-motion", width: 1280, height: 820, reducedMotion: true });
  await runViewport({ name: "mobile-modal-transition", width: 390, height: 844, reducedMotion: false });
})();
