// node shoot.mjs <page.html> <out.png> — renders a 1080x1350 post at 2x, for crisp downscaling
import { createRequire } from 'module'; import { pathToFileURL } from 'url'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(path.join(here, process.argv[2])).href);
await p.waitForFunction(() => window.__ready === true); await p.waitForTimeout(400);
await p.screenshot({ path: process.argv[3] }); await b.close();
