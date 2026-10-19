// Exports every library element to video files.
// alpha elements  -> <id>.webm (VP9 with transparency) + <id>-green.mp4 (green screen, for CapCut on the phone)
// blend elements  -> <id>.mp4 on black (Screen) or mid-gray (Overlay); set that blend mode in the editor
// usage: node render.mjs <outDir> [id,id,...]
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const here = path.dirname(new URL(import.meta.url).pathname);
const [outDir = 'out', only] = process.argv.slice(2);
const FPS = 30, tmp = path.join(outDir, '_frames');
const browser = await chromium.launch();
const probe = await browser.newPage(); await probe.goto('file://' + here + '/stage.html?id=mg-01');
const ids = (await probe.evaluate(() => LOGIKA_LIB.LIB.map(e => [e.id, e.cat]))).filter(([id]) => !only || only.split(',').includes(id));
await probe.close();
const sub = { motion: 'motion', transition: 'transitions', overlay: 'overlays' };
for (const [id, cat] of ids) {
  const dir = path.join(outDir, sub[cat]); fs.mkdirSync(dir, { recursive: true }); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + here + '/stage.html?id=' + id); await page.waitForFunction(() => window.__ready === true);
  const meta = await page.evaluate(() => META); const alpha = meta.blend === 'alpha';
  if (!alpha) await page.goto('file://' + here + '/stage.html?id=' + id + '&bg=' + encodeURIComponent(meta.bg || '#000')), await page.waitForFunction(() => window.__ready === true);
  const n = Math.round(meta.dur * FPS);
  for (let i = 0; i < n; i++) { await page.evaluate(t => renderAt(t), i / FPS); await page.screenshot({ path: path.join(tmp, String(i).padStart(4, '0') + '.png'), omitBackground: alpha }); }
  await page.close();
  const seq = path.join(tmp, '%04d.png'), base = path.join(dir, id);
  if (alpha) {
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', seq, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '32', '-row-mt', '1', base + '.webm']);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `color=c=0x00FF00:s=1080x1920:r=${FPS}`, '-framerate', String(FPS), '-i', seq,
      '-filter_complex', '[0][1]overlay=shortest=1,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', base + '-green.mp4']);
  } else {
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', seq, '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', base + '.mp4']);
  }
  console.log(id, meta.blend, n, 'frames');
}
fs.rmSync(tmp, { recursive: true, force: true });
await browser.close();
