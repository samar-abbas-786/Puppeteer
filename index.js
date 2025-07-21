import puppeteer from "puppeteer";
import fs from "fs/promises";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  let srch = "shirts";

  // === SHOPCLUES SCRAPER ===
  //   const page = await browser.newPage();
  //   await page.goto(`https://www.shopclues.com/search?q=${srch}`, {
  //     waitUntil: "domcontentloaded",
  //     timeout: 60000,
  //   });

  //   await page.waitForSelector("#product_list");
  //   const productHandles = await page.$$("#product_list .row .column");

  //   for (const product of productHandles) {
  //     const title = await page.evaluate((el) => {
  //       const titleEl = el.querySelector("a > h2");
  //       return titleEl ? titleEl.textContent.trim() : null;
  //     }, product);

  //     if (title) console.log("[ShopClues] " + title);
  //   }

  //   // === MYNTRA SCRAPER ===
  //   const page2 = await browser.newPage();
  //   await page2.goto(`https://www.myntra.com/shirt?rawQuery=shirt`, {
  //     waitUntil: "domcontentloaded",
  //     timeout: 60000,
  //   });

  //   await page2.waitForSelector(".results-base");
  //   const productHandles2 = await page2.$$(".results-base .product-base");

  //   for (const product of productHandles2) {
  //     const title = await page2.evaluate((el) => {
  //       const titleEl = el.querySelector(".product-product");
  //       return titleEl ? titleEl.textContent.trim() : null;
  //     }, product);

  //     if (title) console.log("[Myntra] " + title);
  //   }
  const page = await browser.newPage();
  await page.goto(`https://www.flipkart.com`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.type('input[name="q"]', "Shirts");
  //   await page.locator("aria/Search").fill("Shirts");
  //   await page.locator(".devsite-result-item-link").click();
  await page.keyboard.press("Enter");

  let c = 12000;
  let d = 0;
  let i = 1;
  let p = 1;
  const results = [];
  while (true) {
    console.log(`------Scraping pagenumber ${p}---------`);
    await page.waitForSelector(".DOjaWF .gdgoEp ");
    const list = await page.$$(".DOjaWF .gdgoEp .cPHDOP ._75nlfW"); //.hCKiGj

    for (const product of list) {
      if (c <= 0) break;

      const title = await page.evaluate((el) => {
        const titleEl = el.querySelector(".hCKiGj > .syl9yP");
        const imgEl = el.querySelector("img._53J4C-");
        const priceEl = el.querySelector("div.Nx9bqj");

        const titleText = titleEl ? titleEl.textContent.trim() : "N/A";
        const imageSrc = imgEl ? imgEl.src : "N/A";
        const price = priceEl ? priceEl.textContent.trim() : "N/A";

        return { titleText, imageSrc, price };
      }, product);
      c--;
      results.push(title);
      console.log(title);

      i++;
      d++;
    }
    const buttons = await page.$$("._9QVEpD");
    await page.waitForSelector("._9QVEpD", { visible: true });

    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent.trim(), btn);

      if (text === "Next") {
        await btn.click();
        break;
      }
    }

    p++;
  }
  await fs.writeFile("data.json", JSON.stringify(results, null, 2), "utf8");

  console.log("The Count is :", d);

  // await browser.close(); // Optional
})();
