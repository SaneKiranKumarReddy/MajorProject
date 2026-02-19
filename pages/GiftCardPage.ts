import { Page,expect } from "@playwright/test";
import { escapeRegExp } from "../utils/text";

type GiftCardConfig = {
  openMoreMenuText: string;
  entryLinkName: string;
  cardImageAlt: string;
  amountInputAria: string;
  amount: string;
  quantityValue: string;
  dateOptionText: string;
  senderNameAria: string;
  senderName: string;
  senderEmailAria: string;
  senderEmail: string;
  senderMobileAria: string;
  senderMobile: string;
  receiverSameAsCheckboxAria: string;
  termsSecondCheckboxIndex: number;
  payNowText: string;
  errorSelector:string;
};

export class GiftCardPage {
  constructor(private page: Page, private g: GiftCardConfig) {}

  async openFromMenu() {
    await this.page
      .locator("a")
      .filter({ hasText: new RegExp(`^${escapeRegExp(this.g.openMoreMenuText)}$`) })
      .click();
    await this.page.getByRole("link", { name: this.g.entryLinkName }).click();
  }

  async chooseCard() {
    await this.page.getByRole("img", { name: this.g.cardImageAlt }).click();
  }

  async fillDetailsAndPay() {
    await this.page.getByRole("textbox", { name: this.g.amountInputAria }).click();
    await this.page.getByRole("textbox").first().pressSequentially(this.g.amount, { delay: 150 });

    await this.page.getByRole("combobox").selectOption(this.g.quantityValue);
    await this.page.getByText(this.g.dateOptionText).click();

    await this.page.getByRole("textbox", { name: this.g.senderNameAria }).click();
    await this.page.getByRole("textbox").nth(1).pressSequentially(this.g.senderName, { delay: 150 });

    await this.page.getByRole("textbox", { name: this.g.senderEmailAria }).click();
    await this.page.locator("#txtEmailId").fill(this.g.senderEmail);

    await this.page.getByRole("textbox", { name: this.g.senderMobileAria }).click();
    await this.page.getByRole("textbox").nth(3).pressSequentially(this.g.senderMobile, { delay: 150 });

    await this.page.getByRole("checkbox", { name: this.g.receiverSameAsCheckboxAria }).check();
    await this.page.getByRole("checkbox").nth(this.g.termsSecondCheckboxIndex).check();

    await this.page.getByText(this.g.payNowText).click();

    // Wait for the error to appear and print it
    const emailError = this.page.locator(this.g.errorSelector).filter({ hasText: /.+/ });
    await expect(emailError).toHaveText(/.+/,{ timeout: 5000 });
    const msg = (await emailError.textContent())?.trim() ?? "";
    console.log("Email error message:", msg);
  }
}