// node cover.mjs <out.png> [t]  — renders the reel cover from final.html
import { createRequire } from 'module'; import { pathToFileURL } from 'url'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto(pathToFileURL(path.join(here, 'final.html')).href + `?cover=1&t=${process.argv[3] || 19.6}`);
await p.waitForFunction(() => window.__shot === true); await p.waitForTimeout(300);
await p.screenshot({ path: process.argv[2] }); await b.close();
