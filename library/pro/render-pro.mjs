// Renders the «pro» 3D elements to video.
// scene elements -> <id>.mp4 (full frame, their own background) · alpha elements -> <id>.webm + <id>-green.mp4
// usage: THREE_DIR=/path/to/node_modules/three node render-pro.mjs <outDir> [ids] [mb=8]
import { createRequire } from 'module'; import { execFileSync } from 'child_process'; import http from 'http'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url); const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const lib = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), three = process.env.THREE_DIR;
const [outDir = 'out', only = 'pro-01,pro-02,pro-03', mb = '8'] = process.argv.slice(2), FPS = 30;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const srv = http.createServer((q, s) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u.startsWith('/vendor/three/') ? path.join(three, u.slice(14)) : path.join(lib, u);
  fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); }).listen(0);
const port = srv.address().port, browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const id of only.split(',')) {
  const tmp = path.join(outDir, '_frames_' + id); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } }); page.on('pageerror', e => console.log(id, 'ERR', e.message));
  await page.goto(`http://localhost:${port}/pro/pro.html?id=${id}&mb=${mb}`); await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const meta = await page.evaluate(() => META), alpha = meta.blend === 'alpha', n = Math.round(meta.dur * FPS), t0 = Date.now();
  for (let i = 0; i < n; i++) { await page.evaluate(t => renderAt(t), i / FPS); await page.screenshot({ path: path.join(tmp, String(i).padStart(4, '0') + '.png'), omitBackground: alpha }); }
  await page.close(); const seq = path.join(tmp, '%04d.png'), base = path.join(outDir, id);
  if (alpha) {
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', seq, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '28', '-row-mt', '1', base + '.webm']);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=c=0x00FF00:s=1080x1920:r=${FPS}`, '-framerate', String(FPS), '-i', seq, '-filter_complex', '[0][1]overlay=shortest=1,format=yuv420p', '-c:v', 'libx264', '-crf', '16', '-movflags', '+faststart', base + '-green.mp4']);
  } else execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', seq, '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', base + '.mp4']);
  console.log(id, meta.blend, n, 'frames', Math.round((Date.now() - t0) / 1000) + 's');
}
await browser.close(); srv.close();
