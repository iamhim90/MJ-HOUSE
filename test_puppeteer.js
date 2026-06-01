const puppeteer = require('puppeteer'); 
(async () => { 
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }); 
  const page = await browser.newPage(); 
  page.on('console', msg => console.log('PAGE LOG:', msg.text())); 
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message)); 
  await page.goto('file:///' + process.cwd().replace(/\\/g, '/') + '/index.html'); 
  console.log('Loaded.'); 
  await page.waitForSelector('#calDisplay'); 
  await page.click('#calDisplay'); 
  const isOpen = await page.evaluate(() => document.getElementById('calPanel').classList.contains('open')); 
  console.log('Is calendar open?', isOpen); 
  await browser.close(); 
})();
