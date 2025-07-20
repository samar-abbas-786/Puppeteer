const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch(); // launch browser
  const page = await browser.newPage(); // open new tab
  await page.goto("https://web.whatsapp.com/"); // go to website
  await page.click('span[title="💖FAMILY💖💖GROUP💖"]');
//   await page.type('div[class="lexical-rich-text-input"]', "How are you");
  //   await page.click('sapn[data-icon="wds-ic-send-filled"]');
  //title="💖FAMILY💖💖GROUP💖"

  //   await page.screenshot({ path: "example.png" }); // take screenshot

  await browser.close(); // close browser
})();
