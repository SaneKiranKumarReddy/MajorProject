import { Page } from "@playwright/test";

export class HomePage {
  constructor(private page: Page, private baseUrl: string) {}

  async open() {
    await this.page.goto(this.baseUrl);
    await this.page.waitForLoadState("domcontentloaded");
  }
}