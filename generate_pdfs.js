const puppeteer = require('puppeteer');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

async function main() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('Navigating to Map Dashboard...');
    try {
        await page.goto('http://localhost:3000/map', { waitUntil: 'networkidle2', timeout: 30000 });
        // Wait a bit for animations to settle
        await new Promise(resolve => setTimeout(resolve, 3000));
        await page.screenshot({ path: 'map_screenshot.png' });
        console.log('Screenshot saved as map_screenshot.png');
    } catch (e) {
        console.log('Could not load localhost:3000/map - make sure Next.js is running.');
        console.error(e);
    }

    await browser.close();

    console.log('Updating USER_GUIDE.md with image...');
    let userGuide = fs.readFileSync('USER_GUIDE.md', 'utf-8');
    
    if (!userGuide.includes('![Map Overview]')) {
        userGuide = userGuide.replace(
            '## 📍 1. Understanding the Map Overview',
            '## 📍 1. Understanding the Map Overview\n\n![Map Overview](./map_screenshot.png)\n'
        );
        fs.writeFileSync('USER_GUIDE.md', userGuide);
    }

    console.log('Generating PDFs...');
    try {
        execSync('npx md-to-pdf USER_GUIDE.md', { stdio: 'inherit' });
        execSync('npx md-to-pdf TECHNICAL_DOCS.md', { stdio: 'inherit' });
        console.log('Successfully generated USER_GUIDE.pdf and TECHNICAL_DOCS.pdf');
    } catch (e) {
        console.error('Error generating PDF', e);
    }
}

main().catch(console.error);
