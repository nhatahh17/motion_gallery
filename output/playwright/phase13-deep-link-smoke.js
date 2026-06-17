const { chromium } = require("playwright");

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3013";

async function runViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(`${baseURL}/?photo=photo-002`, { waitUntil: "networkidle" });
  await page.getByRole("dialog").waitFor({ state: "visible" });
  await page.getByRole("heading", { name: "Morning Glass" }).waitFor();

  await page.getByRole("button", { name: "Next image" }).click();
  await page.waitForURL(/photo=photo-003/);

  await page.getByRole("button", { name: "Close image detail" }).click();
  await page.waitForURL((url) => !url.searchParams.has("photo"));

  await page.goto(`${baseURL}/?photo=missing-photo`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Motion gallery" }).waitFor();
  const dialogCount = await page.getByRole("dialog").count();
  if (dialogCount !== 0) {
    throw new Error(`${name}: unknown photo id opened a modal`);
  }

  await page.screenshot({
    path: `output/playwright/phase13-${name}-deep-link.png`,
    fullPage: true
  });

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
