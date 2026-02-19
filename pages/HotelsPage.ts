import { Page } from "@playwright/test";

type HotelsConfig = {
  tabName: string;
  city: string;
  selectors: {
    cityOpen: string;
    cityInputAria: string;
    firstSuggestion: string;
    paxPanel: string;
    adultsPlus: string;
    guestCount: string;
    addRoomButton: string;
    roomBlock: string;
    exitRoomPanel: string;
  };
  clickDelaysMs: {
    adultsIncrement: number;
    addRoom: number;
  };
};

export class HotelsPage {
  constructor(private page: Page, private h: HotelsConfig) {}

  async openTab() {
    await this.page.getByRole("link", { name: this.h.tabName }).click();
  }

  async chooseCity() {
    await this.page.locator(this.h.selectors.cityOpen).click();
    await this.page
      .getByRole("textbox", { name: this.h.selectors.cityInputAria })
      .pressSequentially(this.h.city, { delay: 150 });
    await this.page.locator(this.h.selectors.firstSuggestion).first().click();
  }

  async openPaxPanel() {
    await this.page.locator(this.h.selectors.paxPanel).click();
  }

  async maximizeAdults() {
    const plusBtn = this.page.locator(this.h.selectors.adultsPlus);
    const countText = this.page.locator(this.h.selectors.guestCount);

    const adultsList: number[] = [];
    let previous = Number(await countText.textContent());
    let clicks = 0;

    while (true) {
      await plusBtn.click();
      await this.page.waitForTimeout(this.h.clickDelaysMs.adultsIncrement);
      const current = Number(await countText.textContent());
      adultsList.push(previous);
      if (current === previous) break;
      clicks++;
      previous = current;
    }

    console.log("Max adults allowed =", previous);
    console.log("Total clicks performed =", clicks);
    console.log("List for the numbers of adults: ", adultsList);
  }

  async addRoomsUntilLimit() {
    const addRooms = this.page.locator(this.h.selectors.addRoomButton);
    const addRoomsBlock = this.page.locator(this.h.selectors.roomBlock);
    let countOfRooms = await addRoomsBlock.count();
    let prev = countOfRooms;
    let clicksForRooms = 0;

    while (await addRooms.isVisible()) {
      await addRooms.click();
      await this.page.waitForTimeout(this.h.clickDelaysMs.addRoom);
      countOfRooms = await addRoomsBlock.count();
      if (countOfRooms === prev) break;
      prev = countOfRooms;
      clicksForRooms++;
    }

    console.log("Total Clicks for add Rooms:", clicksForRooms);
    console.log("Total rooms added:", countOfRooms);
  }

  async closePaxPanel() {
    await this.page.locator(this.h.selectors.exitRoomPanel).click();
  }
}
