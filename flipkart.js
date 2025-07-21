import puppeteer from "puppeteer";
import fs from "fs/promises";
import { log } from "console";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.flipkart.com/search?q=pants", {
    waitUntil: "networkidle2",
  });

  const results = [];
  let c = 1000;

  try {
    while (c > 0) {
      await page.waitForSelector(".DOjaWF .gdgoEp");

      const products = await page.$$(".DOjaWF .gdgoEp .cPHDOP ._75nlfW");

      for (const product of products) {
        if (c <= 0) break;

        const data = await page.evaluate((el) => {
          const titleEl = el.querySelector(".hCKiGj > .syl9yP");
          const imgEl = el.querySelector("img._53J4C-");
          const priceEl = el.querySelector("div.Nx9bqj");

          return {
            title: titleEl?.textContent.trim() || "N/A",
            imageSrc: imgEl?.src || "N/A",
            price: priceEl?.textContent.trim() || "N/A",
          };
        }, product);

        results.push(data);
        console.log(data);
        c--;
      }
      await page.waitForSelector("._9QVEpD", { visible: true });
      const buttons = await page.$$("._9QVEpD");

      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.textContent.trim(), btn);

        if (text === "Next") {
          await page.waitForNetworkIdle({ idleTime: 500 });
          await btn.click();
          //   page.waitForNavigation({ waitUntil: "networkidle2" });
        }
      }
    }

    await fs.writeFile("data.json", JSON.stringify(results, null, 2), "utf8");
    log("length", results.length);
    console.log("✅ Data successfully saved to data.json");
  } catch (error) {
    console.error("❌ Error occurred:", error.message);
    await fs.writeFile("data.json", JSON.stringify(results, null, 2), "utf8");
    log("length", results.length);
  } finally {
    await browser.close();
    log("length", results.length);
  }
})();
