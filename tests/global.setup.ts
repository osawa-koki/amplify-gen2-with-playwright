import { chromium, FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(config.projects[0].use.baseURL!);
  await page.evaluate(() => {
    // noop
  });
  // await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}
