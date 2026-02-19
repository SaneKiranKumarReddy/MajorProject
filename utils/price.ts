import { Locator } from "@playwright/test";

export async function parsePricesFromList(listLocator: Locator): Promise<number[]> {
  const n = await listLocator.count();
  const prices: number[] = [];

  for (let i = 0; i < n; i++) {
    const raw = (await listLocator.nth(i).innerText())?.trim() ?? "";
    const m = raw.match(/₹\s*([\d,]+)/) || raw.match(/([\d,]+)/);
    if (!m) continue;
    const value = Number(m[1].replace(/,/g, ""));
    if (!Number.isNaN(value)) prices.push(value);
  }

  return prices;
}
