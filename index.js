const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const writeStream = fs.createWriteStream('books.doc');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://books.toscrape.com');
    await page.screenshot({path: 'ss1.png'});

    writeStream.write('links');
    const links = await page.$$eval('.product_pod .image_container a', todasA => todasA.map(a => a.href));
    writeStream.write(`${links}`);
    console.log(links);

    //await browser.close();    
})();
