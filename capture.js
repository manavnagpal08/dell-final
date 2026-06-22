const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const urls = [
  { name: 'login', url: 'http://localhost:3002/login' },
  { name: 'dashboard', url: 'http://localhost:3002/dashboard' },
  { name: 'analytics', url: 'http://localhost:3002/analytics' },
  { name: 'map', url: 'http://localhost:3002/map' },
  { name: 'test', url: 'http://localhost:3002/test' }
];

const docsDir = path.join(__dirname, 'docs');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const { name, url } of urls) {
    console.log(`Navigating to ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait an extra 2 seconds for any animations to finish
      await new Promise(r => setTimeout(r, 2000));
      const outputPath = path.join(docsDir, `${name}.png`);
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`Saved screenshot: ${outputPath}`);
    } catch (e) {
      console.error(`Failed to capture ${name}:`, e.message);
    }
  }

  await browser.close();
  console.log('Finished capturing screenshots.');
})();
