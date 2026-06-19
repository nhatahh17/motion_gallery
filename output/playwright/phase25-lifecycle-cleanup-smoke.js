const { chromium } = require("playwright");
const { execFileSync, spawn } = require("child_process");
const path = require("path");

const port = 3025;
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

function collectConsoleErrors(page) {
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  return consoleErrors;
}

async function runDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const consoleErrors = collectConsoleErrors(page);

  await page.goto(`${baseUrl}?photo=unknown-photo`, { waitUntil: "networkidle" });
  await page.getByText("Phase 25 / Lifecycle cleanup guard").waitFor();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  await page.getByRole("button", { name: "Street" }).click();
  await page.getByRole("button", { name: "Newest" }).click();
  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.locator(".gallery-canvas-shell").click({ position: { x: 720, y: 280 } });
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.getByRole("button", { name: "All" }).click();

  if (consoleErrors.length > 0) {
    throw new Error(`desktop: console errors: ${consoleErrors.join(" | ")}`);
  }

  await page.screenshot({
    path: path.join(cwd, "output", "playwright", "phase25-desktop-lifecycle-cleanup.png"),
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
  const consoleErrors = collectConsoleErrors(page);

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByText("Phase 25 / Lifecycle cleanup guard").waitFor();
  await page.locator(".gallery-canvas-shell").tap({ position: { x: 195, y: 280 } });
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  if (overflow) {
    throw new Error("mobile: horizontal overflow detected");
  }

  if (consoleErrors.length > 0) {
    throw new Error(`mobile: console errors: ${consoleErrors.join(" | ")}`);
  }

  await page.screenshot({
    path: path.join(cwd, "output", "playwright", "phase25-mobile-lifecycle-cleanup.png"),
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
