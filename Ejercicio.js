
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const writeStream = fs.createWriteStream('Conga.pptx');
const GIFEncoder = require('gif-encoder');
const encoder = new GIFEncoder(800, 600);
const getPixels = require('get-pixels');
const workDir = './temp/';
let file = require('fs').createWriteStream('Dittoooooo.gif');



if (!fs.existsSync(workDir)) {
    fs.mkdirSync(workDir);
  };

  // Crea los parámetros del gif
  encoder.setFrameRate(50);
  encoder.pipe(file);
  encoder.setQuality(10);
  encoder.setDelay(100);
  encoder.writeHeader(); 
  encoder.setRepeat(0);

  
  function addToGif(images, counter = 0) {
    getPixels(images[counter], function (err, pixels) {

      encoder.addFrame(pixels.data);
      encoder.read();
      if (counter === images.length - 1) {
        encoder.finish();
        cleanUp(images, function (err) {
          if (err) {
            console.log(err);
          } else {
            fs.rmdirSync(workDir);
            console.log('Gif created!');
            process.exit(0);
          }
        });

      } else {
        addToGif(images, ++counter);
      }
    });
  };

  
  function cleanUp(listOfPNGs, callback) {
    let i = listOfPNGs.length;
    listOfPNGs.forEach(function (filepath) {
      fs.unlink(filepath, function (err) {
        i--;
        if (err) {
          callback(err);
          return;
        } else if (i <= 0) {
          callback(null);
        }
      });
    });
  };

(async () =>{
    
    //primero se abre el navegador "chromium"
    const browser = await puppeteer.launch({headless: false});
    //se abre una nueva página
    //const page = await browser.newPage();
    //se redirige al sitio deseado
    /*await page.goto('https://www.reddit.com');
    //toma una captura de pantalla
    await page.screenshot({path: 'reddit.png'});*/



    //abre el navegador en modo incógnito
    const context = await browser.createIncognitoBrowserContext();

    //abre una nueva pestaña
    const page = await context.newPage();
    await page.goto('https://matias.ma/nsfw/');


    
    writeStream.write('Conga!');

    await new Promise(r => setTimeout(r, 4000));
    /*/Sirve para hacer click en un botón, además de escribir su contenido
    para especificar*/
    const [button] = await page.$x("//button[contains(., 'Trust me')]");
    if (button) { //Si existe un botón con los datos especificados 
    await button.click();//hará click

    for (let i = 0; i < 60; i++) {
        await page.screenshot({ path: workDir + i + ".png" });
      }
      let listOfPNGs = fs.readdirSync(workDir)
      .map(a => a.substr(0, a.length - 4) + '')
      .sort(function (a, b) { return a - b })
      .map(a => workDir + a.substr(0, a.length) + '.png');
  
    addToGif(listOfPNGs);      

    await page.reload('https://matias.ma/nsfw/');
}

    await browser.close();
})();