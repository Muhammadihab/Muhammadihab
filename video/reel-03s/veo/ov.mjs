import { createRequire } from 'module'; const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const F = 'file:///home/user/Muhammadihab/library/fonts/';
const css = `<style>@font-face{font-family:P;src:url(${F}ibm-plex-sans-arabic-arabic-700-normal.woff2)}@font-face{font-family:S;src:url(${F}sora-latin-700-normal.woff2)}
body{margin:0;width:1080px;height:1920px;background:transparent;position:relative;font-family:P}
.cap{position:absolute;left:60px;right:160px;top:1290px;display:flex;justify-content:center}.cap div{padding:16px 34px 22px;border-radius:28px;background:rgba(3,10,22,.72);color:#fff;font:700 66px/1.35 P;text-align:center;direction:rtl}
.clk{position:absolute;left:0;right:0;top:300px;text-align:center}.clk b{display:block;font:700 150px S;color:#fff;text-shadow:0 0 40px rgba(0,204,242,.9)}.clk span{font:700 44px P;color:#3FD6F5;direction:rtl}</style>`;
const pages = { cap1: `<div class=cap><div>التلت ثانية دي…</div></div>`, frz: `<div class=clk><b>0.000s</b><span>الزمن وقف</span></div><div class=cap><div>التلت ثانية دي…</div></div>`,
  cap2: `<div class=clk><b style="font-size:110px">0.001s</b></div><div class=cap><div>…ممكن تحط شركتك في الأخبار.</div></div>` };
const fs = require('fs'); for (const [n, h] of Object.entries(pages)) { fs.writeFileSync(process.cwd() + '/ov_' + n + '.html', '<!doctype html><meta charset=utf-8>' + css + h); await p.goto('file://' + process.cwd() + '/ov_' + n + '.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400); await p.screenshot({ path: n + '.png', omitBackground: true }); }
await b.close();
