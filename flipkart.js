import puppeteer from "puppeteer";
import fs from "fs/promises";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.flipkart.com/search?q=shirts");

  const results = [];
  let c = 13000;
  try {
    while (c > 0) {
      await page.waitForSelector(".DOjaWF .gdgoEp ");
      const list = await page.$$(".DOjaWF .gdgoEp .cPHDOP ._75nlfW");
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
    }
    await fs.writeFile("data.json", JSON.stringify(results, null, 2), "utf8");
  } catch (error) {
    // await fs.writeFile("data.json", JSON.stringify(results, null, 2), "utf8");
  }
})();
