// Renders index.html frame-by-frame with headless Chromium.
// usage: [PAGE=file.html] node render.mjs <mode: preview|green> <outDir> [workers] [from] [to]
//        node render.mjs stills <outDir> <t1,t2,...>
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');

const here = path.dirname(new URL(import.meta.url).pathname);
const [mode = 'preview', outDir = 'frames', a3, a4, a5] = process.argv.slice(2);
const PAGE = process.env.PAGE || 'index.html';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-color-profile=srgb'] });
async function openPage(m) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(here, PAGE)).href + '?mode=' + m);
  await page.waitForFunction(() => window.__ready === true);
  return page;
}

if (mode === 'stills') {
  const page = await openPage('preview');
  for (const t of a3.split(',').map(Number)) {
    await page.evaluate(i => window.renderFrame(i), Math.round(t * 30));
    await page.screenshot({ path: path.join(outDir, `t${t.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const workers = +(a3 || 4);
const page0 = await openPage(mode);
const tl = await page0.evaluate(() => window.TIMELINE);
fs.writeFileSync(path.join(here, PAGE.replace('.html', '') + '.timeline.json'), JSON.stringify(tl, null, 1));
await page0.close();
const total = Math.round(tl.DUR * tl.FPS);
const from = +(a4 || 0), to = +(a5 || total);
let next = from, done = 0;
const t0 = Date.now();
await Promise.all(Array.from({ length: workers }, async () => {
  const page = await openPage(mode);
  while (next < to) {
    const i = next++;
    await page.evaluate(i => window.renderFrame(i), i);
    await page.screenshot({ path: path.join(outDir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 95 });
    if (++done % 90 === 0) console.log(`${mode}: ${done}/${to - from} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  await page.close();
}));
await browser.close();
console.log(`${mode}: done ${done} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
