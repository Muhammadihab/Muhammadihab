/* =====================================================================
   «٠.٣ ثانية» · v2: كل بوابة مشكلة صغيرة السيستم بيحلها، وفي النص تويست
   (لو مكانش متعمل صح)، وفي الآخر خريطة الشركة كلها بتنوّر في نفس اللحظة.
   الكاميرا مبتقفش: بتبطّأ عند كل مشكلة وتجري بين البوابات.
   ===================================================================== */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, svg, draw, spring, eio, P, L, cl, rnd } = H;
const ex = x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x);
const DUR = 35.0, root = document.getElementById('root'), NS = 'http://www.w3.org/2000/svg';
const div = (css, parent = root, html) => el('div', 'position:absolute;' + css, parent, html);

/* ---------- timeline ---------- */
const PRESS = 1.1;
const EV = [
  { g: 0, a: 3.4, b: 8.2, q: 'حد منتحل شخصية العميل؟', ok: 'اتمنع', ic: '🪪', ms: 40, res: 2.5 },
  { g: 1, a: 8.6, b: 12.9, q: 'حد بيتصنّت على الشبكة؟', ok: 'شاف حروف ملخبطة', ic: '👁️', ms: 90, res: 2.0 },
  { g: 2, a: 17.4, b: 22.0, q: 'المنتج خلص من المخزن؟', ok: 'اتحوّل لمخزن إسكندرية', ic: '📦', ms: 150, res: 2.2 },
  { g: 3, a: 22.3, b: 26.4, q: 'داس «ادفع» مرتين؟', ok: 'هيدفع مرة واحدة', ic: '💳', ms: 220, res: 2.1 },
];
const TW = [13.0, 17.2], MAP = [26.6, 31.2], END = 31.2;
const VO = [[0, 1.1, 'عميلك داس «ادفع»…'], [1.1, 2.6, '…وفي تلت ثانية بيحصل كل ده.'],
  [3.4, 5.6, 'حد سرق باسورد العميل… وحاول يدخل معاه؟'], [5.6, 8.2, 'البوابة عرفته… واترمى برّا.'],
  [8.6, 10.6, 'حد بيتصنّت على الشبكة؟'], [10.6, 12.9, 'مش هيشوف غير حروف ملخبطة.'],
  [13.0, 15.2, 'طب لو السيستم ده مكانش متعمل صح؟'], [15.2, 17.2, 'كان دخل… وبيانات عملاءك بقت في الأخبار.'],
  [17.4, 19.6, 'المنتج خلص من مخزن القاهرة؟'], [19.6, 22.0, 'الطلب اتحوّل لإسكندرية… والبيعة ما ضاعتش.'],
  [22.3, 24.2, 'وداس «ادفع» مرتين من التوتر؟'], [24.2, 26.4, 'هيدفع مرة واحدة بس.'],
  [26.6, 29.0, 'والمخزن والحسابات والشحن… عرفوا كلهم.'], [29.0, 31.2, 'في تلت ثانية.'], [31.4, 34.6, 'لوجيكا · مواقع وتطبيقات متأمّنة من جوّا.']];

/* ---------- the tunnel (real CSS 3D) ---------- */
const space = div('inset:0;perspective:900px;perspective-origin:50% 46%;background:radial-gradient(ellipse at 50% 46%,#0B2E57,#020812 70%)');
const world = div('left:540px;top:880px;width:0;height:0;transform-style:preserve-3d', space);
const rings = [...Array(34)].map((_, i) => ({ z: 300 + i * 220, e: div(`left:-560px;top:-560px;width:1120px;height:1120px;border-radius:50%;border:${i % 4 ? 3 : 7}px solid rgba(63,214,245,${i % 4 ? .26 : .55})`, world) }));
const streaks = [...Array(70)].map((_, i) => { const a = rnd(i) * Math.PI * 2, r = 380 + rnd(i * 3) * 220; return { z: rnd(i * 5) * 8000, x: Math.cos(a) * r, y: Math.sin(a) * r,
  e: el('i', `position:absolute;width:6px;height:6px;margin:-3px;border-radius:3px;background:${i % 3 ? '#9FEFFF' : '#fff'};box-shadow:0 0 12px #3FD6F5;display:block`, world) }; });
const GZ = [1500, 3100, 4700, 6300];
const gates = GZ.map((z, i) => { const e = div('left:-380px;top:-470px;width:760px;height:940px;transform-style:preserve-3d', world);
  const fr = div(`inset:0;border-radius:90px;border:12px solid ${C.cyan2}`, e); div('left:50%;top:-170px;transform:translateX(-50%);font-size:120px;line-height:1', e, EV[i].ic); return { z, e, fr }; });

/* ---------- screen-space actors ---------- */
const cap0 = 'position:absolute;left:50%;top:1240px;padding:24px 50px 30px;border-radius:999px;font:700 64px ' + F.num + ';direction:ltr;white-space:nowrap;color:#fff';
const pk = el('div', cap0 + `;transform:translateX(-50%);background:rgba(0,204,242,.16);border:4px solid ${C.cyan2};box-shadow:0 0 60px rgba(0,204,242,.6);text-shadow:0 0 20px #3FD6F5`, root);
const bad = el('div', cap0 + ';background:rgba(255,69,58,.18);border:4px solid #FF453A;box-shadow:0 0 60px rgba(255,69,58,.6)', root, '{ ؟؟؟ · #48213 }');
const ghost = el('div', cap0 + `;background:rgba(0,204,242,.08);border:4px dashed ${C.cyan2};opacity:.6`, root, '{ 2,450 EGP · #48213 }');
const eye = div('left:760px;top:560px;width:220px;height:140px', root, `<svg viewBox="-110 -70 220 140" width="220" height="140"><path d="M-100 0 Q0 -90 100 0 Q0 90 -100 0Z" fill="#fff" stroke="#FF453A" stroke-width="8"/><circle r="36" fill="#7A1010"/><circle r="14" fill="#000"/></svg>`);
const beam = div('left:0;top:0;width:0;height:0', root); const bsvg = svg(beam, '<path id="bm" fill="none" stroke="#FF453A" stroke-width="6" stroke-dasharray="18 14"/>'); const bm = bsvg.querySelector('#bm');
const peek = div(`left:620px;top:420px;padding:14px 26px;border-radius:24px;background:#fff;color:#111;font:700 40px ${F.num};direction:ltr`, root);
const whA = div(`left:120px;top:900px;padding:18px 30px;border-radius:26px;background:rgba(48,14,18,.92);border:3px solid #FF453A;color:#FFD6D3;font:700 44px ${F.ar};direction:rtl`, root, '✕ مخزن القاهرة · ٠ قطعة');
const whB = div(`right:120px;top:1050px;padding:18px 30px;border-radius:26px;background:rgba(10,40,24,.92);border:3px solid ${C.green};color:#CFF7D9;font:700 44px ${F.ar};direction:rtl`, root, '✓ مخزن إسكندرية · ١٢ قطعة');
const arr = div('left:0;top:0;width:0;height:0', root); const asvg = svg(arr, `<path id="ar" d="M330 1000 C 520 980 640 1010 780 1060" fill="none" stroke="${C.green}" stroke-width="10" stroke-linecap="round"/><path id="ah" d="M745 1030 L790 1063 L742 1092" fill="none" stroke="${C.green}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`);
const stamp = div(`left:50%;top:880px;padding:10px 46px 18px;border:10px solid #FF453A;border-radius:24px;color:#FF453A;font:700 120px ${F.ar};white-space:nowrap;background:rgba(255,255,255,.08)`, root);
const ring = div('left:540px;top:900px;width:200px;height:200px;margin:-100px;border-radius:50%;border:10px solid #FF453A', root);
// the question at each gate, which turns into the answer
const card = div(`left:70px;right:70px;top:360px;display:flex;align-items:center;gap:28px;padding:28px 40px 34px;border-radius:44px;background:rgba(5,16,32,.88);border:3px solid rgba(63,214,245,.55);direction:rtl;color:#fff;box-shadow:0 30px 70px rgba(0,0,0,.5)`);
const cIc = el('span', 'font-size:96px;line-height:1', card), cTx = el('span', `font:700 64px ${F.ar}`, card);

/* ---------- the twist: what if it was built badly ---------- */
const tw = div('inset:0;background:rgba(120,0,10,.35);mix-blend-mode:multiply');
const twLines = div('inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 3px,transparent 3px 7px)');
const twTag = div(`left:70px;top:370px;padding:10px 26px;border-radius:14px;background:#FF453A;color:#fff;font:700 44px ${F.ar};direction:rtl`, root, '⏪ لو مكانش متعمل صح');
const news = div(`left:60px;right:60px;top:1000px;border-radius:30px;overflow:hidden;background:#fff;direction:rtl;box-shadow:0 30px 80px rgba(0,0,0,.6)`, root,
  `<div style='background:#FF453A;color:#fff;font:700 40px ${F.ar};padding:14px 30px'>عاجل</div><div style='padding:26px 30px 32px;color:#111;font:700 58px/1.3 ${F.ar}'>تسريب بيانات آلاف العملاء… والشركة بتحقق</div>`);

/* ---------- the company map at the end ---------- */
const map = div('inset:0;background:radial-gradient(ellipse at 50% 40%,#123A68,#06142A 72%)');
div('inset:0;background-image:linear-gradient(rgba(63,214,245,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(63,214,245,.07) 2px,transparent 2px);background-size:60px 60px', map);
const mph = div(`left:430px;top:330px;width:220px;height:400px;border-radius:40px;background:#0B1420;padding:10px;box-sizing:border-box;box-shadow:0 0 0 3px #2A3B52 inset`, map);
const mphS = div(`inset:10px;border-radius:30px;background:#F4F7FB;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font:700 34px ${F.ar};color:${C.navy};direction:rtl`, mph, `<span style="font-size:80px;color:#1FA34A">✓</span>تم الدفع`);
const hub = div(`left:440px;top:820px;width:200px;height:200px;border-radius:50%;background:${C.navy};border:8px solid ${C.cyan2};display:flex;align-items:center;justify-content:center;font:700 80px ${F.num};color:${C.cyan2};box-shadow:0 0 60px rgba(0,204,242,.6)`, map, '{ }');
const BL = [['📦', 'المخزن', 200], ['💰', 'الحسابات', 540], ['🚚', 'الشحن', 880]];
const msv = svg(map, `<path id="l0" d="M540 730 V820"/>` + BL.map(([, , x], i) => `<path id="l${i + 1}" d="M540 1020 C 540 1150 ${x} 1140 ${x} 1240"/>`).join(''));
msv.querySelectorAll('path').forEach(p => { p.setAttribute('fill', 'none'); p.setAttribute('stroke', C.cyan2); p.setAttribute('stroke-width', 8); p.setAttribute('stroke-linecap', 'round'); });
const dots = [0, 1, 2, 3].map(() => el('i', `position:absolute;width:34px;height:34px;margin:-17px;border-radius:50%;background:#fff;box-shadow:0 0 24px ${C.cyan2};display:block`, map));
const blds = BL.map(([ic, n, x]) => div(`left:${x - 150}px;top:1240px;width:300px;padding:30px 0;border-radius:36px;background:rgba(5,16,32,.9);border:4px solid rgba(63,214,245,.45);display:flex;flex-direction:column;align-items:center;gap:8px;color:#fff;font:700 50px ${F.ar}`, map, `<span style="font-size:96px;line-height:1">${ic}</span>${n}`));

/* ---------- the phone at the start (and again at the very end, so the reel loops) ---------- */
const ph = div(`left:150px;top:180px;width:780px;height:1600px;border-radius:110px;background:#0B1420;padding:26px;box-sizing:border-box;box-shadow:0 0 0 5px #2A3B52 inset,0 60px 120px rgba(0,0,0,.6);transform-origin:390px 1330px`);
const sc = div(`inset:26px;border-radius:88px;overflow:hidden;background:#F4F7FB;direction:rtl`, ph);
div(`left:0;right:0;top:0;padding:250px 56px 34px;background:${C.navy};color:#fff;font:700 62px ${F.ar}`, sc, 'الدفع');
div(`left:44px;right:44px;top:440px;padding:40px;border-radius:40px;background:#fff;box-shadow:0 6px 20px rgba(10,36,68,.08);color:${C.navy};font:600 46px ${F.ar}`, sc,
  `<div style="display:flex;justify-content:space-between"><span>طلب رقم</span><b style='font-family:${F.num}'>#48213</b></div><div style="height:3px;background:#E3EAF2;margin:32px 0"></div><div style="display:flex;justify-content:space-between;font-size:58px"><b>الإجمالي</b><b>٢,٤٥٠ ج.م</b></div>`);
const btn = div(`left:56px;right:56px;bottom:170px;height:210px;border-radius:56px;background:${C.cyan};color:${C.navy};display:flex;align-items:center;justify-content:center;font:700 92px ${F.ar};box-shadow:0 24px 60px rgba(0,204,242,.5)`, sc, 'ادفع');
const finger = div('left:720px;top:1500px;width:190px;height:190px;margin:-95px;border-radius:50%;background:rgba(255,255,255,.5);border:7px solid #fff;box-shadow:0 10px 40px rgba(0,0,0,.4)');
const ripple = div('left:720px;top:1500px;width:190px;height:190px;margin:-95px;border-radius:50%;border:8px solid #fff');

/* ---------- library pieces: the brace sweep into the system, and the logo end ---------- */
const lib = [];
const add = (id, at, params = {}, until) => { const E = LIB.find(e => e.id === id), d = div('inset:0;overflow:hidden'), s = E.init(d, { ...(E.params || {}), ...params }); lib.push({ E, d, s, at, until: until ?? at + E.dur }); };
add('hq-05', 2.15); add('tr-06', 12.75); add('tr-06', 17.0); add('hq-09', END, { tag: 'متأمّن من جوّا' }, 34.25);

/* ---------- the clock and the words, always on top ---------- */
const veil = div('inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.55))');
const clock = div('left:0;right:0;top:130px;flex-direction:column;align-items:center;text-align:center;direction:ltr');
const cN = el('div', `font:700 128px ${F.num};color:#fff;text-shadow:0 0 40px rgba(0,204,242,.7)`, clock), cL = el('div', `font:600 38px ${F.ar};color:${C.cyan2};direction:rtl`, clock);
const capBox = div(`left:0;right:0;top:1580px;display:flex;justify-content:center`), cap = el('div', `max-width:900px;padding:16px 34px 22px;border-radius:28px;background:rgba(3,10,22,.78);text-align:center;direction:rtl;font:700 60px/1.35 ${F.ar};color:#fff`, capBox);

/* ---------- camera: slow at each problem, a rush between gates ---------- */
const CAM = [[2.6, -300], [3.4, 600], [7.6, 960], [8.2, 1600], [8.6, 2200], [12.3, 2560], [12.9, 3200], [17.2, 3360], [17.4, 3800], [21.4, 4160], [22.0, 4800], [22.3, 5400], [25.8, 5760], [26.4, 6700]];
const camZ = t => { if (t <= CAM[0][0]) return CAM[0][1]; let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const [a, b] = [CAM[i], CAM[i + 1]]; return L(a[1], b[1], eio(cl((t - a[0]) / (b[0] - a[0])))); };
const msAt = t => { if (t < PRESS) return 0; if (t < EV[0].a) return L(0, 8, P(t, PRESS, EV[0].a)); for (let i = 0; i < EV.length; i++) { const e = EV[i], prev = i ? EV[i - 1].ms : 8; if (t < e.b) return L(prev, e.ms, ex(P(t, e.a, e.a + e.res))); if (i < EV.length - 1 && t < EV[i + 1].a) return e.ms; } return L(220, 300, ex(P(t, MAP[0], MAP[0] + 2))); };
const show = (e, on) => e.style.display = on ? (e === capBox || e === clock ? 'flex' : 'block') : 'none';

window.renderAt = t => {
  const inTun = t >= 2.55 && t < MAP[0] + .5, inMap = t >= MAP[0] && t < 34.3, loop = t >= 34.3, inTw = t >= TW[0] && t < TW[1];
  // phone: close on the button, the press, then the brace sweep takes us in; the same phone returns at the end
  show(ph, t < 2.7 || loop); show(finger, t < 2.7 || loop); show(ripple, t < 2.7);
  const zin = Math.pow(P(t, 1.7, 2.7), 2.2); ph.style.transform = loop ? `scale(${L(.9, 1, ex(P(t, 34.3, 34.8)))})` : `scale(${L(1, 1.06, P(t, 0, PRESS)) * L(1, 3, zin)})`;
  const pr = P(t, PRESS - .1, PRESS + .1); btn.style.transform = `scale(${1 - .05 * Math.sin(Math.PI * pr)})`; btn.style.filter = t > PRESS && !loop ? 'brightness(1.2)' : '';
  finger.style.transform = loop ? `translate(60px,90px)` : `translate(${L(60, 0, ex(P(t, .1, PRESS)))}px,${L(90, 0, ex(P(t, .1, PRESS)))}px) scale(${t > PRESS ? .9 : 1})`; finger.style.opacity = loop ? P(t, 34.4, 34.7) : 1 - P(t, 1.6, 2.0);
  const rq = P(t, PRESS, PRESS + .7); ripple.style.transform = `scale(${L(.8, 3, ex(rq))})`; ripple.style.opacity = rq > 0 && rq < 1 ? 1 - rq : 0;
  // tunnel
  show(space, inTun); const z = camZ(t);
  if (inTun) { world.style.transform = `translate(${Math.sin(t * .9) * 18}px,${Math.cos(t * .7) * 12}px) rotateZ(${Math.sin(t * .5) * 2}deg) translateZ(${z}px)`;
    const vis = (zz, e) => { const d = zz - z; e.style.display = d < -620 || d > 7000 ? 'none' : 'block'; e.style.opacity = cl(1 - (d - 1500) / 5000) * cl((d + 620) / 300); };
    rings.forEach(r => { r.e.style.transform = `translateZ(${-r.z}px)`; vis(r.z, r.e); });
    const v = Math.abs(camZ(t + .02) - z) / .02; streaks.forEach(s => { const zz = ((s.z - z) % 8000 + 8000) % 8000 + z - 400; s.e.style.transform = `translate3d(${s.x}px,${s.y}px,${-zz}px)`; s.e.style.height = Math.min(600, 6 + v * .12) + 'px'; vis(zz, s.e); });
    gates.forEach((g, i) => { g.e.style.transform = `translateZ(${-g.z}px)`; vis(g.z, g.e); const ok = t > EV[i].a + EV[i].res; g.e.style.display = inTw ? 'none' : g.e.style.display;
      g.fr.style.borderColor = ok ? C.green : C.cyan2; g.fr.style.boxShadow = ok ? '0 0 80px rgba(48,209,88,.8),0 0 60px rgba(48,209,88,.4) inset' : '0 0 60px rgba(0,204,242,.7),0 0 60px rgba(0,204,242,.4) inset'; }); }
  // the order capsule: plain, then scrambled after the eavesdropper
  const f = Math.floor(t * 8), scr = t > EV[1].a + EV[1].res && !inTw; show(pk, inTun && t > 2.7); pk.style.transform = `translateX(-50%) scale(${spring(P(t, 2.7, 3.2), 9)})`;
  pk.textContent = scr ? '{ ' + [...Array(10)].map((_, i) => 'A9#xQ$7Lm2Kp@'[Math.floor(rnd(f + i * 7) * 13)]).join('') + ' }' : t > EV[2].a + EV[2].res && t < 26.4 ? '{ 2,450 EGP → ALX }' : '{ 2,450 EGP · #48213 }';
  pk.style.borderColor = scr ? C.green : C.cyan2;
  // event 1: an impostor tries to slip in and is thrown out
  const e1 = EV[0], h1 = e1.a + e1.res; show(bad, (t > e1.a + .6 && t < h1 + 1.2) || (inTw && t > TW[0] + .6));
  if (!inTw) { const k = ex(P(t, e1.a + .6, h1 - .1)), back = ex(P(t, h1, h1 + 1.1)); bad.style.transform = `translate(${L(-700, -200, k) - back * 900}px,${L(0, -340, k) - back * 200}px) rotate(${-back * 40}deg) scale(${L(.8, .7, k)})`; bad.style.opacity = 1 - P(t, h1 + .7, h1 + 1.2); }
  else { const k = eio(P(t, TW[0] + .6, TW[0] + 2.4)); bad.style.transform = `translate(${L(-700, -200, k)}px,${L(0, -700, k)}px) scale(${L(.8, .4, k)})`; bad.style.opacity = 1 - P(t, TW[0] + 2.2, TW[0] + 2.5); }
  const rgq = P(t, h1 - .1, h1 + .5); ring.style.transform = `scale(${L(.5, 6, ex(rgq))})`; ring.style.opacity = rgq > 0 && rgq < 1 ? 1 - rgq : 0;
  const sk = P(t, h1, h1 + .15); show(stamp, t > h1 && t < e1.b); stamp.textContent = 'اتمنع'; stamp.style.transform = `translate(-50%,0) rotate(-10deg) scale(${L(2.4, 1, ex(sk))})`; stamp.style.opacity = Math.min(1, sk * 2) * (1 - P(t, e1.b - .4, e1.b));
  // event 2: someone listens on the line and gets nonsense (in the twist: they read everything)
  const e2 = EV[1], on2 = (t > e2.a + .5 && t < e2.b) || (inTw && t > TW[0] + 1.6 && t < TW[1] - .4); show(eye, on2); show(beam, on2); show(peek, on2 && (t > e2.a + 1.4 || inTw));
  if (on2) { const a0 = inTw ? TW[0] + 1.6 : e2.a + .5, k = spring(P(t, a0, a0 + .5), 9); eye.style.transform = `scale(${k})`; draw(bm, ex(P(t, a0 + .4, a0 + 1.0))); bm.setAttribute('d', 'M820 700 Q 760 1000 600 1230');
    peek.textContent = inTw ? '«2,450 EGP · بطاقة •••• 7730»' : '«A9#xQ$7Lm2…»'; peek.style.color = inTw ? '#B00' : '#666'; peek.style.transform = `scale(${spring(P(t, a0 + 1.0, a0 + 1.4), 9)})`; }
  // event 3: out of stock in Cairo, rerouted to Alexandria
  const e3 = EV[2], on3 = t > e3.a + .5 && t < e3.b; show(whA, on3); show(whB, on3 && t > e3.a + 1.6); show(arr, on3 && t > e3.a + 1.4);
  if (on3) { const k = spring(P(t, e3.a + .5, e3.a + .9), 9); whA.style.transform = `scale(${k})`; whA.style.opacity = t > e3.a + 1.6 ? .55 : 1; draw(asvg.querySelector('#ar'), ex(P(t, e3.a + 1.4, e3.a + 1.9))); draw(asvg.querySelector('#ah'), ex(P(t, e3.a + 1.8, e3.a + 2.0))); whB.style.transform = `scale(${spring(P(t, e3.a + 1.6, e3.a + 2.0), 9)})`; }
  // event 4: a second tap makes a duplicate order, which is cancelled
  const e4 = EV[3], on4 = t > e4.a + .5 && t < e4.a + 2.6; show(ghost, on4);
  if (on4) { const k = ex(P(t, e4.a + .5, e4.a + 1.0)), x = P(t, e4.a + 1.8, e4.a + 2.4), sh = t > e4.a + 1.6 && t < e4.a + 1.9 ? Math.sin(t * 80) * 14 : 0;
    ghost.style.transform = `translate(calc(-50% + ${L(0, 40, k) + sh}px),${L(0, -150, k)}px) scale(${1 - x * .3})`; ghost.style.opacity = .7 * (1 - x); ghost.textContent = t > e4.a + 1.6 ? '{ طلب مكرر · اتلغى ✕ }' : '{ 2,450 EGP · #48213 }'; ghost.style.borderColor = t > e4.a + 1.6 ? '#FF453A' : C.cyan2; }
  // the question card, turning into the answer
  const ei = EV.findIndex(e => t >= e.a && t < e.b); show(card, ei >= 0);
  if (ei >= 0) { const e = EV[ei], k = spring(P(t, e.a, e.a + .45), 9), done = t > e.a + e.res, out = ex(P(t, e.b - .25, e.b));
    cIc.textContent = done ? '✅' : e.ic; cTx.textContent = done ? e.ok : e.q; card.style.borderColor = done ? C.green : 'rgba(63,214,245,.55)';
    card.style.opacity = Math.min(1, k * 3) * (1 - out); card.style.transform = `translateY(${(1 - k) * -60}px) scale(${L(.9, 1, k) * (done ? 1 + .05 * Math.exp(-(t - e.a - e.res) * 8) : 1)})`; }
  // the twist
  [tw, twLines, twTag].forEach(e => show(e, inTw)); twTag.style.opacity = Math.floor(t * 3) % 2 ? 1 : .6; show(news, inTw && t > TW[0] + 2.4);
  news.style.transform = `translateY(${(1 - spring(P(t, TW[0] + 2.4, TW[0] + 2.9), 8)) * 400}px) rotate(${-2 + Math.sin(t * 2)}deg)`;
  // the map
  show(map, inMap); if (inMap) { const m0 = MAP[0], o = P(t, m0, m0 + .5); map.style.opacity = o; map.style.transform = `scale(${L(1.25, 1, ex(P(t, m0, m0 + 1.2)))})`;
    const paths = [...msv.querySelectorAll('path')]; paths.forEach((p, i) => draw(p, ex(P(t, m0 + .4 + (i ? .5 : 0), m0 + 1.0 + (i ? .5 : 0)))));
    dots.forEach((d, i) => { const p = paths[i], x = P(t, m0 + .5 + (i ? .55 : 0), m0 + 1.0 + (i ? .55 : 0)), pt = p.getPointAtLength(p.getTotalLength() * eio(x)); d.style.left = pt.x + 'px'; d.style.top = pt.y + 'px'; d.style.opacity = x > 0 && x < 1 ? 1 : 0; });
    blds.forEach((b, i) => { const lit = t > m0 + 1.1 + i * .08; b.style.borderColor = lit ? C.green : 'rgba(63,214,245,.45)'; b.style.boxShadow = lit ? '0 0 60px rgba(48,209,88,.5)' : 'none'; b.style.transform = `scale(${lit ? 1 + .08 * Math.exp(-(t - m0 - 1.1 - i * .08) * 7) : 1})`; });
    mphS.style.opacity = P(t, m0 + .2, m0 + .5); map.style.filter = `opacity(${1 - P(t, END + .3, END + .7)})`; }
  // library layers
  lib.forEach(Lr => { const on = t >= Lr.at && t < Lr.until; Lr.d.style.display = on ? 'block' : 'none'; if (on) { const pre = Lr.E.dur - .35, tt = t - Lr.at; Lr.E.frame(Lr.s, Lr.until < Lr.at + Lr.E.dur ? Math.min(tt, pre) : tt); } });
  // clock
  show(clock, t < 34.3); const ms = msAt(t); veil.style.opacity = t > PRESS ? 1 : .4;
  cN.textContent = inTw ? '?.???s' : (ms / 1000).toFixed(3) + 's'; cN.style.color = inTw ? '#FF453A' : t >= MAP[0] + 2 ? C.green : '#fff'; cL.textContent = t < PRESS ? 'تلت ثانية… بيحصل فيها كل ده' : 'من ساعة ما داس «ادفع»';
  clock.style.transform = `scale(${1 + .07 * Math.exp(-((t - PRESS) * 8)) * (t > PRESS) + .1 * Math.exp(-((t - MAP[0] - 2) * 6)) * (t > MAP[0] + 2)})`; clock.style.opacity = 1 - P(t, END, END + .4);
  // words
  const c = VO.find(([a, b]) => t >= a && t < b); show(capBox, !!c); if (c) { cap.textContent = c[2]; const k = ex(P(t, c[0], c[0] + .3)); capBox.style.opacity = k; capBox.style.transform = `translateY(${(1 - k) * 30}px)`; }
};
window.META = { id: '03s-v2', dur: DUR };
document.fonts.ready.then(() => { renderAt(0); window.__ready = true; });
})();
