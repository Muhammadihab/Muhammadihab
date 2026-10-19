// Renders the reel to PNG sub-frames for motion blur: node render.mjs <dir> <fromFrame> <toFrame> <MB>
// frame f, sub-frame k is written as <dir>/<f*MB+k>.png; blur.sh blends them into the final picture
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright'); const fs = require('fs'); const path = require('path');
const here = path.dirname(new URL(import.meta.url).pathname), [dir, a, z, mb = '6'] = process.argv.slice(2), MB = +mb, FPS = 30; fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + here + '/reel.html'); await p.waitForFunction(() => window.__ready === true);
for (let f = +a; f < +z; f++) for (let k = 0; k < MB; k++) { const t = Math.max(0, f / FPS + (MB > 1 ? (k / (MB - 1) - .5) * .5 / FPS : 0));
  await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: path.join(dir, String(f * MB + k).padStart(6, '0') + '.png') }); }
await b.close(); console.log('done', a, z);
