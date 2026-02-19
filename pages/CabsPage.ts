import { Page, expect } from "@playwright/test";
import { parsePricesFromList } from "../utils/price";

type CabConfig = {
  tabName: string;
  tripType: string;
  from: string;
  to: string;
  dayOfMonth: number;
  time: { hourLabel: string; ampm: string; minuteLabel: string };
  vehicleTypeClick: string;
  selectors: {
    menuRoot: string;
    fromInput: string;
    toInput: string;
    dateInputAria: string;
    searchButton: string;
    listPriceContainer: string;
  };
};

export class CabsPage {
  constructor(private page: Page, private c: CabConfig) {}

  async openTab() {
    await this.page
      .locator(this.c.selectors.menuRoot)
      .getByRole("link", { name: this.c.tabName })
      .click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async chooseTripType() {
    await this.page.getByText(this.c.tripType, { exact: true }).click();
  }

  async fillRoute() {
    await this.page.locator(this.c.selectors.fromInput).click();
    await this.page.getByRole("textbox", { name: "From" }).pressSequentially(this.c.from);
    await this.page.getByText(this.c.from, { exact: true }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator(this.c.selectors.toInput).click();
    await this.page.getByRole("textbox", { name: "To" }).pressSequentially(this.c.to, { delay: 150 });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByText(this.c.to).click();
  }

  async pickDateAndTime() {
    await this.page.getByRole("textbox", { name: this.c.selectors.dateInputAria }).click();
    await this.page.getByRole("link", { name: String(this.c.dayOfMonth) }).click();

    await this.page.locator("#hr").getByText(this.c.time.hourLabel).click();
    await this.page.locator("#ap").getByText(this.c.time.ampm, { exact: true }).click();
    await this.page.locator("#min").getByText(this.c.time.minuteLabel).click();
    await this.page.locator("#timepicker").getByText("Done").click();
  }

  async search() {
    await this.page.locator(this.c.selectors.searchButton).getByText("SEARCH").click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async selectVehicleType() {
    await this.page.getByText(this.c.vehicleTypeClick).first().click();
  }

  async collectPrices(): Promise<number[]> {
    const priceEls = this.page.locator(this.c.selectors.listPriceContainer);
    const prices = await parsePricesFromList(priceEls);
    expect(prices.length, "No cab prices were found").toBeGreaterThan(0);
    return prices;
  }
}
