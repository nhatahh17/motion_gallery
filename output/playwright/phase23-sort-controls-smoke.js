const { chromium } = require("playwright");
const { execFileSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const port = 3023;
const baseUrl = `http://127.0.0.1:${port}`;
const cwd = path.resolve(__dirname, "../..");

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer() {
  const deadline = Date.now() + 30000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until Next.js is ready.
    }

    await wait(500);
  }

  throw new Error("Timed out waiting for production server");
}

async function runViewport(browser, viewportName, viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  const analyticsEvents = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.addInitScript(() => {
    window.__galleryAnalyticsEvents = [];
    window.addEventListener("motion-gallery:analytics", (event) => {
      window.__galleryAnalyticsEvents.push(event.detail);
    });
  });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByText("Phase 23 / Gallery sort controls").waitFor();
  await page.locator(".gallery-canvas-shell").waitFor();
  await page.locator("canvas").waitFor({ state: "attached" });
  await page.getByRole("button", { name: "Newest" }).click();
  await page.getByRole("button", { name: "Location" }).click();
  await page.getByRole("button", { name: "Daily" }).click();
  await page.getByRole("button", { name: "Category" }).click();
  await page.waitForTimeout(300);

  const firstDebugTitle = await page.locator(".debug-title").first().textContent();

  if (!firstDebugTitle || !/Morning Glass|Pale Corner|Window Table|Glass Study|Tall Morning|Portrait Glass|Still Cafe|Interior Light|Quiet Frame|Window Glow/.test(firstDebugTitle)) {
    throw new Error(`${viewportName}: category filter and sort did not keep Daily images first`);
  }

  await page.locator(".gallery-canvas-shell").click({ position: { x: viewport.width / 2, y: viewport.height / 3 } });
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  if (overflow) {
    throw new Error(`${viewportName}: horizontal overflow detected`);
  }

  analyticsEvents.push(
    ...(await page.evaluate(() => (window.__galleryAnalyticsEvents ?? []).map((event) => event.event)))
  );

  if (!analyticsEvents.includes("sort_changed")) {
    throw new Error(`${viewportName}: sort_changed analytics event was not emitted`);
  }

  if (consoleErrors.length > 0) {
    throw new Error(`${viewportName}: console errors: ${consoleErrors.join(" | ")}`);
  }

  await page.screenshot({
    path: path.join(cwd, "output", "playwright", `phase23-${viewportName}-sort-controls.png`),
    fullPage: true
  });

  await page.close();
}

(async () => {
  const server = spawn("npm.cmd", ["run", "start", "--", "-p", String(port), "-H", "127.0.0.1"], {
    cwd,
    shell: true,
    stdio: "ignore",
    windowsHide: true
  });

  try {
    await waitForServer();
    const browser = await chromium.launch();

    try {
      await runViewport(browser, "desktop", { width: 1440, height: 960 });
      await runViewport(browser, "mobile", { width: 390, height: 844 });
    } finally {
      await browser.close();
    }
  } finally {
    if (server.pid) {
      try {
        execFileSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
      } catch {
        server.kill();
      }
    }
  }
})();
