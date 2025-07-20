import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  let srch = "shirts";

  // === SHOPCLUES SCRAPER ===
  const page = await browser.newPage();
  await page.goto(`https://www.shopclues.com/search?q=${srch}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForSelector("#product_list");
  const productHandles = await page.$$("#product_list .row .column");

  for (const product of productHandles) {
    const title = await page.evaluate((el) => {
      const titleEl = el.querySelector("a > h2");
      return titleEl ? titleEl.textContent.trim() : null;
    }, product);

    if (title) console.log("[ShopClues] " + title);
  }

  // === MYNTRA SCRAPER ===
  const page2 = await browser.newPage();
  await page2.goto(`https://www.myntra.com/shirt?rawQuery=shirt`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page2.waitForSelector(".results-base");
  const productHandles2 = await page2.$$(".results-base .product-base");

  for (const product of productHandles2) {
    const title = await page2.evaluate((el) => {
      const titleEl = el.querySelector(".product-product");
      return titleEl ? titleEl.textContent.trim() : null;
    }, product);

    if (title) console.log("[Myntra] " + title);
  }

  // await browser.close(); // Optional
})();
