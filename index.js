import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  const page = await browser.newPage();
  await page.goto(
    "http://shopclues.com/search?q=shoes&sc_z=&z=1&count=10&user_id=&user_segment=default",
    {
      waitUntil: "networkidle2",
    }
  );

  // Wait for the product list container to appear
  await page.waitForSelector("#product_list");

  // Select all individual product cards inside the list
  const productHandles = await page.$$("#product_list .row .column");

  for (const product of productHandles) {
    const title = await page.evaluate((el) => {
      const titleEl = el.querySelector("a > h2");
      return titleEl ? titleEl.textContent.trim() : null;
    }, product);

    if (title) console.log(title);
  }

  // await browser.close();
})();
