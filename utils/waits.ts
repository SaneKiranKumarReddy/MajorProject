import { Page } from "@playwright/test";

export async function waitForDom(page: Page) {
  await page.waitForLoadState("domcontentloaded");
}