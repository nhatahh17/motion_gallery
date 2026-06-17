const { chromium } = require("playwright");

const baseUrl = process.env.GALLERY_URL || "http://127.0.0.1:3023";

async function waitForCanvas(page) {
  const canvas = page.locator("canvas").first();
  await canvas.waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(900);
  return canvas;
}

async function runDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const canvas = await waitForCanvas(page);
  const before = await canvas.screenshot();
  await page.mouse.move(1260, 210);
  await page.waitForTimeout(700);
  const after = await canvas.screenshot();

  if (Buffer.compare(before, after) === 0) {
    throw new Error("Desktop canvas did not change after pointer parallax movement.");
  }

  await page.getByRole("button", { name: "3D Horizon" }).click();
  await page.waitForTimeout(500);
  await page.mouse.click(720, 480);
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 5000 });
  await page.keyboard.press("Escape");
  await expectHidden(page.getByRole("dialog"));
  await page.screenshot({ path: "output/playwright/phase20-desktop-camera-parallax.png", fullPage: true });
  await page.close();

  return errors;
}

async function runMobile(browser) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await waitForCanvas(page);
  await page.touchscreen.tap(195, 430);
  await page.getByRole("dialog").waitFor({ state: "visible", timeout: 5000 });
  await page.keyboard.press("Escape");
  await expectHidden(page.getByRole("dialog"));

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) {
    throw new Error("Mobile page has horizontal overflow.");
  }

  await page.screenshot({ path: "output/playwright/phase20-mobile-camera-parallax.png", fullPage: true });
  await page.close();

  return errors;
}

async function expectHidden(locator) {
  await locator.waitFor({ state: "hidden", timeout: 5000 });
}

(async () => {
  const browser = await chromium.launch();
  try {
    const errors = [...(await runDesktop(browser)), ...(await runMobile(browser))];
    if (errors.length > 0) {
      throw new Error(`Console errors found:\n${errors.join("\n")}`);
    }
    console.log("phase20 camera parallax smoke passed with 0 console errors");
  } finally {
    await browser.close();
  }
})();
