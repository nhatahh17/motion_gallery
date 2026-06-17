const { chromium } = require("playwright");

async function run() {
  console.log("launch");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });
  const results = [];

  for (const target of [
    { name: "desktop", viewport: { width: 1440, height: 900 } },
    { name: "mobile", viewport: { width: 390, height: 844 } }
  ]) {
    const page = await browser.newPage({ viewport: target.viewport });
    console.log(`start ${target.name}`);
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    page.setDefaultTimeout(10000);
    await page.goto("http://127.0.0.1:3112", { waitUntil: "domcontentloaded" });
    console.log(`loaded ${target.name}`);
    await page.getByText("Phase 11 / category filters").waitFor({ state: "visible" });
    await page.getByRole("button", { name: "Street" }).click();
    console.log(`filtered ${target.name}`);
    await page.getByText("6 images visible").waitFor({ state: "visible" });
    await page.getByRole("button", { name: "3D Horizon" }).click();
    const shell = page.locator(".gallery-canvas-shell");
    const box = await shell.boundingBox();
    if (!box) throw new Error("Missing gallery shell");
    await shell.click({ position: { x: box.width / 2, y: box.height / 2 } });
    console.log(`clicked ${target.name}`);
    await page.getByRole("dialog").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "All" }).click();
    console.log(`restored ${target.name}`);
    await page.getByText("30 images visible").waitFor({ state: "visible" });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await page.screenshot({ path: `output/playwright/phase12-${target.name}-category-filter.png` });
    results.push({ target: target.name, errors, overflow });
    await page.close();
  }

  await browser.close();

  const failed = results.filter((result) => result.errors.length > 0 || result.overflow);
  console.log(JSON.stringify(results, null, 2));

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
