import puppeteer from "puppeteer";

export async function getWeibo(): Promise<void> {
  console.time("launch");
  const browser = await puppeteer.launch();
  console.timeEnd("launch");
  const page = await browser.newPage();

  const userId = "1560906700";
  const weiboId = "Oz6CX1S6q";

  await page.goto(`https://weibo.com/${userId}/${weiboId}`);
  console.log("page loaded");

  await page.setViewport({ width: 1080, height: 1024 });
  console.log("viewport set");

  const showResponse = await page.waitForResponse(
    `https://weibo.com/ajax/statuses/show?id=${weiboId}&locale=zh-CN`
  );
  console.log("showResponse loaded");

  const showData = await showResponse.json();
  const textRaw = showData.text_raw;
  console.log(textRaw);

  const longTextResponse = await page.waitForResponse(
    `https://weibo.com/ajax/statuses/longtext?id=${weiboId}`
  );
  console.log("longTextResponse loaded");

  const longTextData = await longTextResponse.json();
  const longTextContent = longTextData.data.longTextContent;
  console.log(longTextContent);

  await browser.close();
}
