const { chromium } = require("playwright");
const { execFileSync, spawn } = require("child_process");
const path = require("path");

const port = 3024;
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

async function runDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByText("Phase 24 / Mobile swipe-down modal close").waitFor();
  await page.getByRole("button", { name: "Newest" }).click();
  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.locator(".gallery-canvas-shell").click({ position: { x: 720, y: 280 } });
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  if (consoleErrors.length > 0) {
    throw new Error(`desktop: console errors: ${consoleErrors.join(" | ")}`);
  }

  await page.screenshot({
    path: path.join(cwd, "output", "playwright", "phase24-desktop-modal-close.png"),
    fullPage: true
  });

  await page.close();
}

async function runMobile(browser) {
  const page = await browser.newPage({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 }
  });
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByText("Phase 24 / Mobile swipe-down modal close").waitFor();
  await page.locator(".gallery-canvas-shell").tap({ position: { x: 195, y: 280 } });
  await page.getByRole("dialog").waitFor();

  const modal = page.locator(".gallery-detail-modal");
  const modalBox = await modal.boundingBox();

  if (!modalBox) {
    throw new Error("mobile: modal bounding box missing");
  }

  const x = modalBox.x + modalBox.width / 2;
  const y = modalBox.y + Math.min(120, modalBox.height / 3);
  await page.touchscreen.tap(x, y);
  await page.getByRole("dialog").waitFor();

  await modal.dispatchEvent("pointerdown", {
    bubbles: true,
    clientX: x,
    clientY: y,
    pointerType: "touch"
  });
  await modal.dispatchEvent("pointerup", {
    bubbles: true,
    clientX: x + 8,
    clientY: y + 126,
    pointerType: "touch"
  });
  await page.getByRole("dialog").waitFor({ state: "detached" });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  if (overflow) {
    throw new Error("mobile: horizontal overflow detected");
  }

  if (consoleErrors.length > 0) {
    throw new Error(`mobile: console errors: ${consoleErrors.join(" | ")}`);
  }

  await page.screenshot({
    path: path.join(cwd, "output", "playwright", "phase24-mobile-swipe-close.png"),
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
      await runDesktop(browser);
      await runMobile(browser);
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
