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
const FPS = 30, tmp = path.join(outDir, '_frames'), MB = Math.max(1, +(process.env.MB || 1)); // MB>1: renders MB sub-frames per frame and blends them (motion blur, 180° shutter)
const browser = await chromium.launch();
const probe = await browser.newPage(); await probe.goto('file://' + here + '/stage.html?id=mg-01');
const ids = (await probe.evaluate(() => LOGIKA_LIB.LIB.map(e => [e.id, e.cat]))).filter(([id]) => !only || only.split(',').includes(id));
await probe.close();
// PARAMS='{"to":72000}' renders the listed elements with those words/numbers (a request line from the gallery)
const P = process.env.PARAMS ? '&p=' + encodeURIComponent(process.env.PARAMS) : '';
const sub = { hq: 'hq', viral: 'viral', motion: 'motion', ui: 'ui', transition: 'transitions', overlay: 'overlays' };
for (const [id, cat] of ids) {
  const dir = path.join(outDir, sub[cat]); fs.mkdirSync(dir, { recursive: true }); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + here + '/stage.html?id=' + id + P); await page.waitForFunction(() => window.__ready === true);
  const meta = await page.evaluate(() => META); const alpha = meta.blend === 'alpha';
  if (!alpha) await page.goto('file://' + here + '/stage.html?id=' + id + P + '&bg=' + encodeURIComponent(meta.bg || '#000')), await page.waitForFunction(() => window.__ready === true);
  const n = Math.round(meta.dur * FPS);
  for (let i = 0; i < n * MB; i++) { const f = Math.floor(i / MB), k = i % MB, t = Math.max(0, f / FPS + (MB > 1 ? (k / (MB - 1) - .5) * .5 / FPS : 0));
    await page.evaluate(t => renderAt(t), t); await page.screenshot({ path: path.join(tmp, String(i).padStart(5, '0') + '.png'), omitBackground: alpha }); }
  await page.close();
  let seq = path.join(tmp, '%05d.png'); const base = path.join(dir, id);
  if (MB > 1) { const bl = path.join(tmp, 'b'); fs.mkdirSync(bl); execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS * MB), '-i', seq, '-vf', `format=rgba,tmix=frames=${MB},select=eq(mod(n\\,${MB})\\,${MB - 1})`, '-fps_mode', 'passthrough', path.join(bl, '%04d.png')]); seq = path.join(bl, '%04d.png'); }
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
