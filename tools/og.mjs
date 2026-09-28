// Renders the hero at 1200x630 for the Open Graph image.
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(process.argv[2] || 'http://localhost:4500/', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: '.lift-nav{display:none!important}.lobby{min-height:630px!important}.skyline{height:250px!important}' });
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
await p.screenshot({ path: 'site/assets/og-image.png' });
await b.close();
