// Records the guided walkthrough of index.html: a visible cursor, captions, and every request showing up in the console.
// usage: node record.mjs <framesDir> <out.mp4>
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');

const here = path.dirname(new URL(import.meta.url).pathname);
const [framesDir, out] = process.argv.slice(2);
fs.rmSync(framesDir, { recursive: true, force: true });
fs.mkdirSync(framesDir, { recursive: true });

// same skeleton the artifact host wraps the page in
const page_html = path.join(framesDir, 'page.html');
fs.writeFileSync(page_html, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<base href="file://${here}/"><style>:root{color-scheme:light}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style></head><body>
${fs.readFileSync(path.join(here, 'index.html'), 'utf8')}</body></html>`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 }, deviceScaleFactor: 1920 / 1680, colorScheme: 'light' });
await page.goto('file://' + page_html);
await page.waitForTimeout(500);

// overlay: cursor, click ripple, caption, spotlight
await page.addStyleTag({ content: `
#rcCur{position:fixed;left:0;top:0;width:26px;height:26px;z-index:9999;pointer-events:none;transition:transform .05s linear}
#rcCur svg{width:26px;height:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))}
.rcRip{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:3px solid #F56A39;z-index:9998;pointer-events:none;animation:rcR .5s ease-out forwards}
@keyframes rcR{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}
#rcCap{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:9997;max-width:min(980px,92vw);direction:rtl;text-align:center;
  font:700 23px/1.55 "IBM Plex Sans Arabic",PlexL,sans-serif;color:#fff;background:rgba(5,14,29,.9);padding:14px 26px;border-radius:16px;
  box-shadow:0 18px 50px rgba(0,0,0,.35);transition:opacity .25s;opacity:0}
#rcCap b{color:#3FD6F5}
#rcCap small{display:block;font-weight:500;font-size:17px;color:#BFD0E6}
.rcSpot{position:fixed;z-index:9996;pointer-events:none;border:3px solid #F56A39;border-radius:12px;box-shadow:0 0 0 4px rgba(245,106,57,.25);transition:opacity .3s}` });
await page.evaluate(() => {
  const c = document.createElement('div'); c.id = 'rcCur';
  c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#fff" stroke="#0A2444" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  const cap = document.createElement('div'); cap.id = 'rcCap'; document.body.appendChild(cap);
  const mv = e => { c.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 2}px)`; };
  addEventListener('mousemove', mv, true); addEventListener('dragover', mv, true); addEventListener('drag', e => e.clientX && mv(e), true);
  addEventListener('mousedown', e => { const r = document.createElement('div'); r.className = 'rcRip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 600); }, true);
});

// screencast: real-time frames with timestamps
const cdp = await page.context().newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  const f = path.join(framesDir, `f${String(frames.length).padStart(5, '0')}.jpg`);
  fs.writeFileSync(f, Buffer.from(data, 'base64'));
  frames.push([f, metadata.timestamp]);
  try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch {}
});

let mx = 840, my = 520;
const wait = ms => page.waitForTimeout(ms);
async function moveTo(sel, opt = {}) {
  const el = typeof sel === 'string' ? page.locator(sel).first() : sel;
  await el.scrollIntoViewIfNeeded();
  const b = await el.boundingBox();
  const x = b.x + b.width * (opt.fx ?? .5), y = b.y + b.height * (opt.fy ?? .5);
  const steps = Math.max(12, Math.round(Math.hypot(x - mx, y - my) / 22));
  await page.mouse.move(x, y, { steps }); mx = x; my = y;
  return { x, y };
}
async function click(sel, opt) { await moveTo(sel, opt); await wait(220); await page.mouse.down(); await wait(70); await page.mouse.up(); await wait(450); }
async function type(sel, text) { await click(sel); await page.keyboard.type(text, { delay: 70 }); await wait(300); }
async function drag(src, dst) {
  await moveTo(src); await wait(250); await page.mouse.down();
  const b = await page.locator(dst).first().boundingBox();
  const x = b.x + b.width / 2, y = b.y + 90;
  await page.mouse.move(mx + 8, my + 8, { steps: 3 });
  await page.mouse.move(x, y, { steps: 40 }); mx = x; my = y;
  await wait(300); await page.mouse.up(); await wait(600);
}
async function say(html, ms) {
  await page.evaluate(h => { const c = document.getElementById('rcCap'); c.style.opacity = 0; setTimeout(() => { c.innerHTML = h; c.style.opacity = 1; }, 180); }, html);
  await wait(ms);
}
async function spot(sel, ms = 2200) {
  const b = await page.locator(sel).first().boundingBox();
  await page.evaluate(([b, ms]) => { const s = document.createElement('div'); s.className = 'rcSpot';
    Object.assign(s.style, { left: b.x - 6 + 'px', top: b.y - 6 + 'px', width: b.width + 12 + 'px', height: b.height + 12 + 'px' });
    document.body.appendChild(s); setTimeout(() => { s.style.opacity = 0; setTimeout(() => s.remove(), 400); }, ms); }, [b, ms]);
}
const nav = v => click(`nav.rail button[data-v="${v}"]`);
const asUser = async v => { await click('#who'); await page.selectOption('#who', v); await wait(700); };
const conTab = t => click(`.tabs button[data-ct="${t}"]`);

await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1920, maxHeight: 1200, everyNthFrame: 1 });
await page.mouse.move(mx, my);

// ---------------- the walkthrough ----------------
await say('ده CRM صغير لمعرض أثاث وهمي اسمه <b>«أوضة»</b><small>على اليمين السيستم، وعلى الشمال لوحة «إزاي شغال» بتوريك اللي بيحصل من جوّا</small>', 5200);
await spot('main .kpis', 3000);
await say('داخلين كـ <b>كريم</b> صاحب المعرض<small>«النهارده» بتجمعله المبيعات، والآجل، واللي لازم يتكلّموا النهارده</small>', 4600);
await spot('aside.con .cb .req', 3200);
await say('الشاشة دي بعتت طلبين للسيرفر: <b>/deals</b> و <b>/followups</b><small>والسيرفر رجّعلها كل الصفوف، لأن كريم مالك</small>', 4800);

await nav('customers');
await say('البحث بالعربي<small>هكتب «هدي» من غير «ى»</small>', 2200);
await type('#q', 'هدي'); await wait(700);
await say('لقاها: <b>هدى سامي</b><small>السيستم بيوحّد الحروف: أ وإ وا، وى وي، وة وه</small>', 3800);
await click('#q'); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await wait(500);

await click('#addC');
await say('عميل جديد بعت «بكام؟» على فيسبوك', 1800);
await type('#cn', 'مروان خالد');
await type('#cp', '0100 000 0101');
await page.selectOption('#cs', 'فيسبوك'); await wait(300);
await page.selectOption('#co', 'm2'); await wait(300);
await click('#cForm button[type=submit]'); await wait(400);
await say('الرقم ده <b>متسجّل قبل كده</b> باسم هدى عند منى<small>عشان كده الموبايل بيتخزن بصيغة واحدة: محدش يسجّل نفس العميل مرتين</small>', 5000);
await click('#cp'); await page.keyboard.press('Control+A'); await page.keyboard.type('01000000111', { delay: 60 }); await wait(300);
await click('#cForm button[type=submit]'); await wait(700);
await say('اتسجّل في أول مرحلة: <b>«جديد»</b><small>واتعمل باسم سامح، لأن كريم اختاره</small>', 3600);

await say('مسار البيع: اسحب الكارت من مرحلة للتانية', 1800);
await drag('.dcard[data-deal="d11"]', '.col[data-stage="asking"]');
await say('مروان دلوقتي <b>«بيسأل»</b><small>وكل حركة بتتسجّل في تاريخ العميل</small>', 3200);
await drag('.dcard[data-deal="d10"]', '.col[data-stage="won"]');
await say('حسام اترفض نقله لـ <b>«اتفقنا»</b><small>قاعدة شغل: متقفلش صفقة من غير ما تكتب اتباع إيه وبكام</small>', 5000);
await drag('.dcard[data-deal="d1"]', '.col[data-stage="won"]');
await say('هدى عندها أوضة نوم في الطلب، فاتقفلت <b>«اتفقنا»</b> ✓', 3400);

await click('.dcard[data-deal="d1"]'); await wait(500);
await say('كارت العميل: كل حاجة عن هدى في مكان واحد<small>اتباع إيه، ودفعت كام، والباقي، والمتابعات، وكل اللي حصل معاها</small>', 4800);
await type('#pay', '20000');
await click('#addPay'); await wait(400);
await spot('.drawer .tot >> nth=2', 2600);
await say('دفعت ٢٠ ألف، والباقي <b>٢٨,٥٠٠ آجل</b><small>وده هيظهر في «النهارده» وفي التقارير لوحده</small>', 4200);
await type('#fuN', 'فكّرها بباقي الحساب');
await click('#addFu'); await wait(500);
await say('ومتابعة بكرة الساعة ٥<small>السيستم هيفكّر منى بيها</small>', 3200);
await click('.drawer [data-close]'); await wait(400);

await nav('products');
await say('كريم هيغلّي سعر أوضة النوم', 2000);
await click('#pr-p1'); await page.keyboard.press('Control+A'); await page.keyboard.type('51000', { delay: 80 }); await wait(300);
await click('[data-save-price="p1"]'); await wait(500);
await say('السعر بقى ٥١,٠٠٠<small>طب أوردر هدى اللي اتقفل بـ ٤٨,٥٠٠؟</small>', 3200);
await nav('pipeline');
await click('.dcard[data-deal="d1"]'); await wait(600);
await spot('.drawer table.t', 3600);
await say('فضل <b>٤٨,٥٠٠</b> زي ما هو<small>السعر بيتنسخ وقت البيع. الأوردرات القديمة متتغيّرش لما السعر يتغيّر</small>', 5200);
await click('.drawer [data-close]'); await wait(300);

await nav('reports');
await say('التقارير بتتحسب من نفس الجداول<small>مين باع، واتباع إيه، والعملاء جايين منين، والآجل</small>', 5000);

await say('دلوقتي هندخل كـ <b>سامح</b>، بيّاع', 2200);
await asUser('m2');
await nav('today');
await say('سامح شايف عملاءه بس<small>نفس الشاشة ونفس الطلب، بس السيرفر رجّع صفوف أقل</small>', 4200);
await spot('aside.con .cb .req', 3400);
await say('<b>/deals</b> رجّعت ٦ من ١١<small>دي RLS: القاعدة جوّه قاعدة البيانات نفسها، مش في الشاشة</small>', 5000);
await conTab('tables');
await page.selectOption('#ctab', 'deals'); await wait(500);
await spot('aside.con .ctw', 3800);
await say('ده عرض المطوّر لجدول deals<small>الصفوف الباهتة موجودة في قاعدة البيانات، بس عمرها ما بتتبعت لموبايل سامح</small>', 5400);
await conTab('reqs');

await nav('customers');
await say('وأرقام العملاء متخبّية<small>عشان محدش ياخد صورة من القايمة ويمشي</small>', 3600);
await click('[data-open="d4"]'); await wait(500);
await click('#reveal'); await wait(500);
await say('لما يحتاج الرقم يضغط «اظهر الرقم»<small>ويتسجّل إن سامح شاف رقم طارق، الساعة كام</small>', 4400);
await click('.drawer [data-close]'); await wait(300);

await nav('steal');
await say('<b>جرّب تسرقني</b>: كل زرار طلب حقيقي للسيرفر', 2800);
for (let i = 0; i < 5; i++) { await click(`[data-steal="${i}"]`); await wait(i === 0 ? 1600 : 900); }
await say('اتمنع ٥ من ٥<small>تصدير العملاء، تغيير السعر، نقل عميل منى، ومسح السجل: كله اترفض من السيرفر</small>', 5200);
await conTab('rules');
await say('ودي القواعد نفسها<small>مكتوبة جوّه قاعدة البيانات، فحتى لو حد عدّل التطبيق، القاعدة شغالة</small>', 5000);
await conTab('reqs');

await asUser('m1');
await nav('audit');
await say('وكريم بيشوف كل ده في <b>«مين عمل إيه»</b><small>كل محاولة سامح، بالدقيقة. والسجل ده محدش يقدر يمسحه</small>', 5600);
await say('ده نفس اللي هيتعمل للعميل<small>نفس الجداول ونفس القواعد، بس على Supabase وموقع وتطبيق موبايل</small>', 5000);
await page.evaluate(() => document.getElementById('rcCap').style.opacity = 0);
await wait(800);

await cdp.send('Page.stopScreencast');
await browser.close();

// variable-rate frames → 30 fps
const end = frames.at(-1)[1] + 1;
const list = frames.map(([f, t], i) => `file '${f}'\nduration ${((frames[i + 1]?.[1] ?? end) - t).toFixed(4)}`).join('\n') + `\nfile '${frames.at(-1)[0]}'\n`;
fs.writeFileSync(path.join(framesDir, 'list.txt'), list);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(framesDir, 'list.txt'),
  '-vf', 'fps=30,scale=1920:1200:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart', out]);
console.log(out, frames.length, 'frames', (end - frames[0][1]).toFixed(1) + 's');
