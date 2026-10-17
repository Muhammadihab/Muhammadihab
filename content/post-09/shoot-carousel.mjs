// node shoot-carousel.mjs <page.html> <outDir> <slides> — renders each slide (#1..#n) at 2x
import { createRequire } from 'module'; import { pathToFileURL } from 'url'; import path from 'path'; import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const [page, outDir, count] = process.argv.slice(2); fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch();
for (let i = 1; i <= +count; i++) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(path.join(here, page)).href + '#' + i);
  await p.waitForFunction(() => window.__ready === true); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(outDir, `slide-${i}@2x.png`) }); await p.close();
}
await b.close();
