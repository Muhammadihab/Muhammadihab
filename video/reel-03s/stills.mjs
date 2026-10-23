// quick look: node stills.mjs out t1,t2,...  -> out/<t>.png (no motion blur)
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright'); const fs = require('fs'); const path = require('path');
const here = path.dirname(new URL(import.meta.url).pathname), [out, ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + here + '/' + (process.env.PAGE || 'proto.html')); await p.waitForFunction(() => window.__ready === true);
for (const t of ts.split(',')) { await p.evaluate(t => renderAt(t), +t); await p.screenshot({ path: path.join(out, t + '.png') }); }
await b.close();
