import { test, expect } from "@playwright/test";
import config from "../testData/MajorProject.config.json" assert { type: "json" };

import { HomePage } from "../pages/HomePage";
import { CabsPage } from "../pages/CabsPage";
import { HotelsPage } from "../pages/HotelsPage";
import { GiftCardPage } from "../pages/GiftCardPage";

test("EasyMyTrip - data-driven (POM)", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  

  // Instantiate pages with relevant config sections
  const home = new HomePage(page, config.baseUrl);
  const cabs = new CabsPage(page, config.cabs);
  const hotels = new HotelsPage(page, config.hotels);
  const gift = new GiftCardPage(page, config.giftcard);

  // Home
  await home.open();

  // Cabs
  await cabs.openTab();
  await cabs.chooseTripType();
  await cabs.fillRoute();
  await cabs.pickDateAndTime();
  await cabs.search();
  await cabs.selectVehicleType();

  const prices = await cabs.collectPrices();
  const lowest = Math.min(...prices);
  console.log("All cab prices:", prices);
  console.log("Lowest cab price:", lowest);
  expect(prices.length).toBeGreaterThan(0);

  // Hotels
  await hotels.openTab();
  await hotels.chooseCity();
  await hotels.openPaxPanel();
  await hotels.maximizeAdults();
  await hotels.addRoomsUntilLimit();
  await hotels.closePaxPanel();

  // Gift Card
  await gift.openFromMenu();
  await gift.chooseCard();
  await gift.fillDetailsAndPay();
});






















// test("Major Project Hackathon", async ({ browser })=>{
//     const context = await browser.newContext();
//     const page = await browser.newPage();

//     await page.goto("https://justdial.com");
//     await page.waitForLoadState('domcontentloaded',{timeout:3000});

    
//     await closeLogin(page);
//     await closePopup(page);

//     await search(page);
//     await ratings(page);
//     await firstFivePrinting(page);
// });

// async function firstFivePrinting(page:Page) {
//     const resultContainer = page.locator('.results_listing_container');
//     console.log("Total services = " , await resultContainer.count());

// }
// async function ratings(page: Page) {
//     const ratingsButton = page.getByRole('button',{name:'Ratings'});
//     await ratingsButton.waitFor();
//     await page.waitForLoadState('domcontentloaded');
//     await ratingsButton.click();
//     await page.getByText('4.0+').click();
// }

// async function search(page :Page) {
//     const locationSearch = page.getByPlaceholder('Select Location');
//     await locationSearch.waitFor();
//     await locationSearch.click();
//     await page.waitForLoadState('domcontentloaded');
//     console.log("Searching for chennai...");
//     await locationSearch.type('Chennai',{delay:150});
//     const options = page.locator("#sugcont");
//     //await options.waitFor();
//    // const optionsCount = await page.getByRole('option').count();
//     console.log("Clicking chennai from the options...");
//    // await page.getByRole('option', { name: 'Chennai' }).locator('a').first().click();
//     await page.waitForLoadState('domcontentloaded');
//     // for(let i = 0; i < optionsCount ; i++) {
//     //     const text = await page.getByRole('option').nth(i).textContent();
//     //     if(text?.toLowerCase() ==='chennai') {
//     //         await page.getByRole('option').nth(i).click();
//     //     }
//     // }
//     console.log("Clicked chennai successfully.");

//     const search = page.getByPlaceholder('Search');
//     await search.click();
//     console.log("Searching for Car Washing Services...");
//     await search.pressSequentially('Car Washing Services',{delay:150});
//     console.log("Clicking on Car Washing Services...");
//     await page.getByRole('option', { name: 'Car Washing Services Category' }).locator('a').click();
//     await page.waitForLoadState('domcontentloaded');
//     console.log("Clicking Car Washing Services.");

// }
 
// async function closeLogin(page: Page){

//     if(await page.getByRole('button', { name: 'May be later' }).isVisible()) {
//         console.log("Login Pop-up has appeared.");
//         console.log("Closing the Login Pop-up...");
//        await page.getByRole('button', { name: 'May be later' }).click();
//         console.log("Closed the Login pop-up successfully.");
//     }
    
// }


// async function closePopup(page:Page) {
//     if(await page.locator("span[aria-label='Close Banner']").isVisible()) {
//         console.log("pop-up has appeared.");
//         console.log("closing the pop-up..");
//         const popUp = page.locator("span[aria-label='Close Banner']");
//         await popUp.click();
//         console.log("Pop-up closed successfully.");
//     }
// }

/*
test('test', async ({ page }) => {
  await page.goto('https://www.justdial.com/');
  await page.getByRole('button', { name: 'May be later' }).click();
  await page.getByRole('button', { name: 'Close Banner' }).click();
  await page.getByRole('combobox', { name: 'Select Location' }).click();
  await page.getByRole('combobox', { name: 'Select Location' }).fill('che');
  await page.getByRole('option', { name: 'Detect Location' }).locator('a').click();
  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search' }).fill('car washing services');
  await page.getByRole('option', { name: 'Car Washing Services Category' }).locator('a').click();
});
*/