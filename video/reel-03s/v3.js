/* =====================================================================
   «٠.٣ ثانية» · v3: مكتوب عشان محدش يقفل في النص
   هوك = الكارثة الأول (خبر تسريب) ← ترجيع ← «٤ حاجات ممكن تبوظ» مع عدّاد «١ من ٤»
   ← المشاكل من الأخف للأخطر ← جملة شد في النص ← القفلة بترجع للخبر وتشرحه ← الخريطة ← لوب.
   ===================================================================== */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, svg, draw, spring, eio, P, L, cl, rnd } = H;
const ex = x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x);
const DUR = 36.0, root = document.getElementById('root');
const div = (css, parent = root, html) => el('div', 'position:absolute;' + css, parent, html);

/* ---------- timeline ---------- */
const COLD = [0, 2.5], REW = [2.5, 3.1], PRESS = 3.7, SWEEP = 4.35, TUN0 = 4.8;
const EV = [   // lightest first, the one that ends up in the news last
  { k: 'dup', a: 5.4, b: 9.8, q: 'داس «ادفع» مرتين؟', ok: 'هيدفع مرة واحدة بس', ic: '💳', ms: 40, res: 2.0 },
  { k: 'stock', a: 10.2, b: 14.6, q: 'المنتج خلص من المخزن؟', ok: 'اتحوّل لمخزن إسكندرية', ic: '📦', ms: 90, res: 2.2 },
  { k: 'spy', a: 15.3, b: 19.7, q: 'حد بيتصنّت على الشبكة؟', ok: 'شاف حروف ملخبطة', ic: '👁️', ms: 150, res: 2.0 },
  { k: 'fake', a: 20.1, b: 25.2, q: 'حد سرق حساب العميل؟', ok: 'اترمى برّا', ic: '🪪', ms: 220, res: 3.0 },
];
const BACK = [25.2, 28.6], MAP = [28.6, 32.4], END = 32.4, LOOP = 35.2;
const VO = [[0, 2.5, 'التلت ثانية دي… ممكن تحط شركتك في الأخبار.'], [2.5, 3.6, 'تعالى نرجع لأولها.'], [3.6, 4.4, 'عميلك داس «ادفع»…'], [4.4, 5.4, '…وفي تلت ثانية، ٤ حاجات ممكن تبوظ.'],
  [5.4, 7.4, 'داس «ادفع» مرتين من التوتر؟'], [7.4, 9.8, 'هيدفع مرة واحدة بس.'],
  [10.2, 12.4, 'المنتج خلص من مخزن القاهرة؟'], [12.4, 14.6, 'الطلب اتحوّل لإسكندرية… والبيعة ما ضاعتش.'],
  [14.6, 15.3, 'والتالتة… بتوقّع شركات.'], [15.3, 17.3, 'حد بيتصنّت على الشبكة؟'], [17.3, 19.7, 'مش هيشوف غير حروف ملخبطة.'],
  [20.1, 22.6, 'والأخطر: حد سرق حساب العميل… وبيحاول يدخل بيه.'], [22.6, 25.2, 'البوابة عرفته… واترمى برّا.'],
  [25.2, 27.0, 'ودي بالظبط اللي حصل في أول الفيديو.'], [27.0, 28.6, 'الشركة دي… كانت من غير البوابة دي.'],
  [28.6, 30.6, 'والمخزن والحسابات والشحن… عرفوا كلهم.'], [30.6, 32.4, 'في تلت ثانية.'], [32.6, 35.2, 'تلت ثانية… بتفرق بين شركة في الأخبار، وشركة شغّالة.']];

/* ---------- the tunnel (real CSS 3D) ---------- */
const space = div('inset:0;perspective:900px;perspective-origin:50% 46%;background:radial-gradient(ellipse at 50% 46%,#0B2E57,#020812 70%)');
const world = div('left:540px;top:880px;width:0;height:0;transform-style:preserve-3d', space);
const rings = [...Array(34)].map((_, i) => ({ z: 300 + i * 220, e: div(`left:-560px;top:-560px;width:1120px;height:1120px;border-radius:50%;border:${i % 4 ? 3 : 7}px solid rgba(63,214,245,${i % 4 ? .26 : .55})`, world) }));
const streaks = [...Array(70)].map((_, i) => { const a = rnd(i) * Math.PI * 2, r = 380 + rnd(i * 3) * 220; return { z: rnd(i * 5) * 8000, x: Math.cos(a) * r, y: Math.sin(a) * r,
  e: el('i', `position:absolute;width:6px;height:6px;margin:-3px;border-radius:3px;background:${i % 3 ? '#9FEFFF' : '#fff'};box-shadow:0 0 12px #3FD6F5;display:block`, world) }; });
const gates = [1500, 3100, 4700, 6300].map((z, i) => { const e = div('left:-380px;top:-470px;width:760px;height:940px;transform-style:preserve-3d', world);
  const fr = div(`inset:0;border-radius:90px;border:12px solid ${C.cyan2}`, e); div('left:50%;top:-170px;transform:translateX(-50%);font-size:120px;line-height:1', e, EV[i].ic); return { z, e, fr }; });

/* ---------- screen-space actors ---------- */
const capCss = 'position:absolute;left:50%;top:1240px;padding:24px 50px 30px;border-radius:999px;font:700 64px ' + F.num + ';direction:ltr;white-space:nowrap;color:#fff';
const pk = el('div', capCss + `;transform:translateX(-50%);background:rgba(0,204,242,.16);border:4px solid ${C.cyan2};box-shadow:0 0 60px rgba(0,204,242,.6);text-shadow:0 0 20px #3FD6F5`, root);
const bad = el('div', capCss + ';background:rgba(255,69,58,.18);border:4px solid #FF453A;box-shadow:0 0 60px rgba(255,69,58,.6)', root, '{ ؟؟؟ · #48213 }');
const ghost = el('div', capCss + `;background:rgba(0,204,242,.08);border:4px dashed ${C.cyan2};opacity:.6`, root);
const eye = div('left:760px;top:560px;width:220px;height:140px', root, `<svg viewBox="-110 -70 220 140" width="220" height="140"><path d="M-100 0 Q0 -90 100 0 Q0 90 -100 0Z" fill="#fff" stroke="#FF453A" stroke-width="8"/><circle r="36" fill="#7A1010"/><circle r="14" fill="#000"/></svg>`);
const beam = div('left:0;top:0;width:0;height:0', root), bm = svg(beam, '<path d="M820 700 Q 760 1000 600 1230" fill="none" stroke="#FF453A" stroke-width="6" stroke-dasharray="18 14"/>').querySelector('path');
const peek = div(`left:560px;top:420px;padding:14px 26px;border-radius:24px;background:#fff;font:700 40px ${F.num};direction:ltr;white-space:nowrap`, root);
const whA = div(`left:120px;top:900px;padding:18px 30px;border-radius:26px;background:rgba(48,14,18,.92);border:3px solid #FF453A;color:#FFD6D3;font:700 44px ${F.ar};direction:rtl`, root, '✕ مخزن القاهرة · ٠ قطعة');
const whB = div(`right:120px;top:1050px;padding:18px 30px;border-radius:26px;background:rgba(10,40,24,.92);border:3px solid ${C.green};color:#CFF7D9;font:700 44px ${F.ar};direction:rtl`, root, '✓ مخزن إسكندرية · ١٢ قطعة');
const asv = svg(div('left:0;top:0;width:0;height:0', root), `<path id="ar" d="M330 1000 C 520 980 640 1010 780 1060" fill="none" stroke="${C.green}" stroke-width="10" stroke-linecap="round"/><path id="ah" d="M745 1030 L790 1063 L742 1092" fill="none" stroke="${C.green}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`);
const stamp = div(`left:50%;top:880px;padding:10px 46px 18px;border:10px solid #FF453A;border-radius:24px;color:#FF453A;font:700 120px ${F.ar};white-space:nowrap;background:rgba(255,255,255,.08)`, root, 'اتمنع');
const ring = div('left:540px;top:900px;width:200px;height:200px;margin:-100px;border-radius:50%;border:10px solid #FF453A', root);
const slowmo = div('inset:0;box-shadow:inset 0 0 220px 60px rgba(255,69,58,.45)', root);
const card = div(`left:70px;right:70px;top:380px;display:flex;align-items:center;gap:28px;padding:28px 40px 34px;border-radius:44px;background:rgba(5,16,32,.88);border:3px solid rgba(63,214,245,.55);direction:rtl;color:#fff;box-shadow:0 30px 70px rgba(0,0,0,.5)`);
const cIc = el('span', 'font-size:96px;line-height:1', card), cTx = el('span', `font:700 64px ${F.ar}`, card);

/* ---------- the disaster (cold open and the payoff) ---------- */
const red = div('inset:0;background:rgba(120,0,10,.38);mix-blend-mode:multiply'), lines = div('inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 3px,transparent 3px 7px)');
const news = div(`left:60px;right:60px;top:960px;border-radius:30px;overflow:hidden;background:#fff;direction:rtl;box-shadow:0 30px 80px rgba(0,0,0,.6)`, root,
  `<div style='background:#FF453A;color:#fff;font:700 42px ${F.ar};padding:14px 30px'>عاجل</div><div style='padding:26px 30px 32px;color:#111;font:700 62px/1.3 ${F.ar}'>تسريب بيانات آلاف العملاء… والشركة بتحقق</div>`);
const rew = div(`left:70px;top:390px;padding:10px 26px;border-radius:14px;background:#FF453A;color:#fff;font:700 46px ${F.ar};direction:rtl`, root);

/* ---------- the company map ---------- */
const map = div('inset:0;background:radial-gradient(ellipse at 50% 40%,#123A68,#06142A 72%)');
div('inset:0;background-image:linear-gradient(rgba(63,214,245,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(63,214,245,.07) 2px,transparent 2px);background-size:60px 60px', map);
const mph = div('left:430px;top:400px;width:220px;height:380px;border-radius:40px;background:#0B1420;padding:10px;box-sizing:border-box;box-shadow:0 0 0 3px #2A3B52 inset', map);
const mphS = div(`inset:10px;border-radius:30px;background:#F4F7FB;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font:700 34px ${F.ar};color:${C.navy};direction:rtl`, mph, `<span style="font-size:80px;color:#1FA34A">✓</span>تم الدفع`);
div(`left:440px;top:860px;width:200px;height:200px;border-radius:50%;background:${C.navy};border:8px solid ${C.cyan2};display:flex;align-items:center;justify-content:center;font:700 80px ${F.num};color:${C.cyan2};box-shadow:0 0 60px rgba(0,204,242,.6)`, map, '{ }');
const BL = [['📦', 'المخزن', 200], ['💰', 'الحسابات', 540], ['🚚', 'الشحن', 880]];
const msv = svg(map, `<path d="M540 780 V860"/>` + BL.map(([, , x]) => `<path d="M540 1060 C 540 1170 ${x} 1170 ${x} 1260"/>`).join(''));
const paths = [...msv.querySelectorAll('path')]; paths.forEach(p => { p.setAttribute('fill', 'none'); p.setAttribute('stroke', C.cyan2); p.setAttribute('stroke-width', 8); p.setAttribute('stroke-linecap', 'round'); });
const dots = paths.map(() => el('i', `position:absolute;width:34px;height:34px;margin:-17px;border-radius:50%;background:#fff;box-shadow:0 0 24px ${C.cyan2};display:block`, map));
const blds = BL.map(([ic, n, x]) => div(`left:${x - 150}px;top:1260px;width:300px;padding:30px 0;border-radius:36px;background:rgba(5,16,32,.9);border:4px solid rgba(63,214,245,.45);display:flex;flex-direction:column;align-items:center;gap:8px;color:#fff;font:700 50px ${F.ar}`, map, `<span style="font-size:96px;line-height:1">${ic}</span>${n}`));

/* ---------- the phone ---------- */
const ph = div(`left:150px;top:180px;width:780px;height:1600px;border-radius:110px;background:#0B1420;padding:26px;box-sizing:border-box;box-shadow:0 0 0 5px #2A3B52 inset,0 60px 120px rgba(0,0,0,.6);transform-origin:390px 1330px`);
const sc = div('inset:26px;border-radius:88px;overflow:hidden;background:#F4F7FB;direction:rtl', ph);
div(`left:0;right:0;top:0;padding:250px 56px 34px;background:${C.navy};color:#fff;font:700 62px ${F.ar}`, sc, 'الدفع');
div(`left:44px;right:44px;top:440px;padding:40px;border-radius:40px;background:#fff;box-shadow:0 6px 20px rgba(10,36,68,.08);color:${C.navy};font:600 46px ${F.ar}`, sc,
  `<div style="display:flex;justify-content:space-between"><span>طلب رقم</span><b style='font-family:${F.num}'>#48213</b></div><div style="height:3px;background:#E3EAF2;margin:32px 0"></div><div style="display:flex;justify-content:space-between;font-size:58px"><b>الإجمالي</b><b>٢,٤٥٠ ج.م</b></div>`);
const btn = div(`left:56px;right:56px;bottom:170px;height:210px;border-radius:56px;background:${C.cyan};color:${C.navy};display:flex;align-items:center;justify-content:center;font:700 92px ${F.ar};box-shadow:0 24px 60px rgba(0,204,242,.5)`, sc, 'ادفع');
const finger = div('left:720px;top:1500px;width:190px;height:190px;margin:-95px;border-radius:50%;background:rgba(255,255,255,.5);border:7px solid #fff;box-shadow:0 10px 40px rgba(0,0,0,.4)');
const ripple = div('left:720px;top:1500px;width:190px;height:190px;margin:-95px;border-radius:50%;border:8px solid #fff');

/* ---------- library pieces ---------- */
const lib = [];
const add = (id, at, params = {}, until) => { const E = LIB.find(e => e.id === id), d = div('inset:0;overflow:hidden'), s = E.init(d, { ...(E.params || {}), ...params }); lib.push({ E, d, s, at, until: until ?? at + E.dur }); };
add('fx-05', REW[0], {}, REW[1] + .1); add('tr-06', REW[0] - .1); add('hq-05', SWEEP); add('tr-06', BACK[0] - .2); add('tr-06', BACK[1] - .3); add('hq-09', END, { tag: 'متأمّن من جوّا' }, LOOP);

/* ---------- always on top: progress, clock, words ---------- */
const veil = div('inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.55))');
const prog = div(`left:70px;top:300px;padding:8px 22px 12px;border-radius:99px;background:rgba(5,16,32,.85);border:2px solid rgba(63,214,245,.6);color:${C.cyan2};font:700 36px ${F.ar};direction:rtl`);
const clock = div('left:0;right:0;top:120px;flex-direction:column;align-items:center;text-align:center;direction:ltr');
const cN = el('div', `font:700 128px ${F.num};color:#fff;text-shadow:0 0 40px rgba(0,204,242,.7)`, clock), cL = el('div', `font:600 38px ${F.ar};color:${C.cyan2};direction:rtl`, clock);
const capBox = div('left:0;right:0;top:1580px;display:flex;justify-content:center'), cap = el('div', `max-width:920px;padding:16px 34px 22px;border-radius:28px;background:rgba(3,10,22,.8);text-align:center;direction:rtl;font:700 60px/1.35 ${F.ar};color:#fff`, capBox);

/* ---------- camera ---------- */
const CAM = [[TUN0, -300], [5.4, 600], [9.2, 960], [9.8, 1600], [10.2, 2200], [14.0, 2560], [14.6, 3200], [15.3, 3800], [19.1, 4160], [19.7, 4800], [20.1, 5300], [24.6, 5760], [25.2, 6100], [28.6, 6250], [29.2, 6900]];
const camZ = t => { if (t < COLD[1] + .2) return L(5500, 5760, t / 2.6); if (t <= CAM[0][0]) return CAM[0][1]; let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const [a, b] = [CAM[i], CAM[i + 1]]; return L(a[1], b[1], eio(cl((t - a[0]) / (b[0] - a[0])))); };
const msAt = t => { if (t < PRESS) return 0; if (t < EV[0].a) return L(0, 6, P(t, PRESS, EV[0].a)); for (let i = 0; i < EV.length; i++) { const e = EV[i], prev = i ? EV[i - 1].ms : 6; if (t < e.b) return L(prev, e.ms, ex(P(t, e.a, e.a + e.res))); if (i < EV.length - 1 && t < EV[i + 1].a) return e.ms; } return L(220, 300, ex(P(t, MAP[0], MAP[0] + 2))); };
const show = (e, on) => { e.style.display = on ? (e === capBox || e === clock ? 'flex' : 'block') : 'none'; };
const ev = k => EV.find(e => e.k === k);

window.renderAt = t => {
  const cold = t < COLD[1], back = t >= BACK[0] && t < BACK[1], disaster = cold || (back && t > BACK[0] + .6);
  const inTun = cold || (t >= TUN0 - .2 && t < MAP[0] + .5), inMap = t >= MAP[0] && t < LOOP, loop = t >= LOOP, phone = (t >= REW[1] - .1 && t < TUN0 + .1) || loop;
  // phone
  show(ph, phone); show(finger, phone); show(ripple, phone && !loop);
  const zin = Math.pow(P(t, SWEEP - .5, TUN0 + .1), 2.2); ph.style.transform = loop ? `scale(${L(.9, 1, ex(P(t, LOOP, LOOP + .5)))})` : `scale(${L(1, 1.06, P(t, REW[1], PRESS)) * L(1, 3, zin)})`;
  const pr = P(t, PRESS - .1, PRESS + .1); btn.style.transform = `scale(${1 - .05 * Math.sin(Math.PI * pr)})`; btn.style.filter = t > PRESS && !loop ? 'brightness(1.2)' : '';
  finger.style.transform = loop ? 'translate(60px,90px)' : `translate(${L(60, 0, ex(P(t, REW[1], PRESS)))}px,${L(90, 0, ex(P(t, REW[1], PRESS)))}px) scale(${t > PRESS ? .9 : 1})`;
  finger.style.opacity = loop ? P(t, LOOP + .1, LOOP + .4) : 1 - P(t, PRESS + .5, PRESS + .9);
  const rq = P(t, PRESS, PRESS + .7); ripple.style.transform = `scale(${L(.8, 3, ex(rq))})`; ripple.style.opacity = rq > 0 && rq < 1 ? 1 - rq : 0;
  // tunnel
  show(space, inTun); const z = camZ(t);
  if (inTun) { world.style.transform = `translate(${Math.sin(t * .9) * 18}px,${Math.cos(t * .7) * 12}px) rotateZ(${Math.sin(t * .5) * 2}deg) translateZ(${z}px)`;
    const vis = (zz, e) => { const d = zz - z; e.style.display = d < -620 || d > 7000 ? 'none' : 'block'; e.style.opacity = cl(1 - (d - 1500) / 5000) * cl((d + 620) / 300); };
    rings.forEach(r => { r.e.style.transform = `translateZ(${-r.z}px)`; vis(r.z, r.e); });
    const v = Math.abs(camZ(t + .02) - z) / .02; streaks.forEach(s => { const zz = ((s.z - z) % 8000 + 8000) % 8000 + z - 400; s.e.style.transform = `translate3d(${s.x}px,${s.y}px,${-zz}px)`; s.e.style.height = Math.min(600, 6 + v * .12) + 'px'; vis(zz, s.e); });
    gates.forEach((g, i) => { g.e.style.transform = `translateZ(${-g.z}px)`; vis(g.z, g.e); if (disaster && i === 3) g.e.style.display = 'none';
      const ok = !disaster && t > EV[i].a + EV[i].res; g.fr.style.borderColor = ok ? C.green : C.cyan2; g.fr.style.boxShadow = ok ? '0 0 80px rgba(48,209,88,.8),0 0 60px rgba(48,209,88,.4) inset' : '0 0 60px rgba(0,204,242,.7),0 0 60px rgba(0,204,242,.4) inset'; }); }
  // the order capsule
  const f = Math.floor(t * 8), sp = ev('spy'), scr = !disaster && t > sp.a + sp.res; show(pk, inTun && (cold || t > TUN0 + .1));
  pk.style.transform = `translateX(-50%) scale(${cold ? 1 : spring(P(t, TUN0 + .1, TUN0 + .6), 9)})`;
  const st = ev('stock'); pk.textContent = scr ? '{ ' + [...Array(10)].map((_, i) => 'A9#xQ$7Lm2Kp@'[Math.floor(rnd(f + i * 7) * 13)]).join('') + ' }' : t > st.a + st.res && t < MAP[0] ? '{ 2,450 EGP → ALX }' : '{ 2,450 EGP · #48213 }';
  pk.style.borderColor = scr ? C.green : C.cyan2;
  // 1 · a second tap makes a duplicate order, which is cancelled
  const du = ev('dup'), on1 = t > du.a + .5 && t < du.a + 2.6; show(ghost, on1);
  if (on1) { const k = ex(P(t, du.a + .5, du.a + 1.0)), x = P(t, du.a + 1.8, du.a + 2.4), sh = t > du.a + 1.5 && t < du.a + 1.9 ? Math.sin(t * 80) * 14 : 0, gone = t > du.a + du.res - .4;
    ghost.style.transform = `translate(calc(-50% + ${L(0, 40, k) + sh}px),${L(0, -150, k)}px) scale(${1 - x * .3})`; ghost.style.opacity = .7 * (1 - x); ghost.textContent = gone ? '{ طلب مكرر · اتلغى ✕ }' : '{ 2,450 EGP · #48213 }'; ghost.style.borderColor = gone ? '#FF453A' : C.cyan2; }
  // 2 · out of stock in Cairo, rerouted to Alexandria
  const on2 = t > st.a + .5 && t < st.b; show(whA, on2); show(whB, on2 && t > st.a + 1.6); asv.style.display = on2 && t > st.a + 1.4 ? 'block' : 'none';
  if (on2) { whA.style.transform = `scale(${spring(P(t, st.a + .5, st.a + .9), 9)})`; whA.style.opacity = t > st.a + 1.6 ? .55 : 1; draw(asv.querySelector('#ar'), ex(P(t, st.a + 1.4, st.a + 1.9))); draw(asv.querySelector('#ah'), ex(P(t, st.a + 1.8, st.a + 2.0))); whB.style.transform = `scale(${spring(P(t, st.a + 1.6, st.a + 2.0), 9)})`; }
  // 3 · someone listens on the line; in the disaster they read the card
  const on3 = (t > sp.a + .5 && t < sp.b) || disaster; show(eye, on3); show(beam, on3); show(peek, on3 && (disaster || t > sp.a + 1.4));
  if (on3) { const a0 = cold ? -1 : back ? BACK[0] + .6 : sp.a + .5; eye.style.transform = `scale(${spring(P(t, a0, a0 + .5), 9)})`; draw(bm, ex(P(t, a0 + .4, a0 + 1.0)));
    peek.textContent = disaster ? 'بطاقة •••• 7730 · سارة ع.' : 'A9#xQ$7Lm2…'; peek.style.color = disaster ? '#B00' : '#666'; peek.style.direction = disaster ? 'rtl' : 'ltr'; peek.style.transform = `scale(${disaster ? 1 : spring(P(t, a0 + 1.0, a0 + 1.4), 9)})`; }
  // 4 · the impostor: slow motion, a heartbeat of red, then thrown out (in the disaster: walks straight in)
  const fk = ev('fake'), h4 = fk.a + fk.res, on4 = (t > fk.a + .5 && t < h4 + 1.2) || disaster; show(bad, on4);
  if (disaster) { const k = cold ? .6 + .4 * Math.sin(t) : eio(P(t, BACK[0] + .4, BACK[0] + 2.2)); bad.style.transform = `translate(${L(-600, -150, k)}px,${L(0, -560, k)}px) scale(${L(.8, .5, k)})`; bad.style.opacity = 1; }
  else if (on4) { const k = ex(P(t, fk.a + .5, h4 - .1)), bk = ex(P(t, h4, h4 + 1.1)); bad.style.transform = `translate(${L(-700, -200, k) - bk * 900}px,${L(0, -340, k) - bk * 200}px) rotate(${-bk * 40}deg) scale(${L(.8, .7, k)})`; bad.style.opacity = 1 - P(t, h4 + .7, h4 + 1.2); }
  const rgq = P(t, h4 - .1, h4 + .5); ring.style.transform = `scale(${L(.5, 6, ex(rgq))})`; ring.style.opacity = rgq > 0 && rgq < 1 ? 1 - rgq : 0;
  const sk = P(t, h4, h4 + .15); show(stamp, t > h4 && t < fk.b); stamp.style.transform = `translate(-50%,0) rotate(-10deg) scale(${L(2.4, 1, ex(sk))})`; stamp.style.opacity = Math.min(1, sk * 2) * (1 - P(t, fk.b - .4, fk.b));
  show(slowmo, t > fk.a + .4 && t < h4); slowmo.style.opacity = .5 + .5 * Math.pow(Math.max(0, Math.sin((t - fk.a) * Math.PI * 1.3)), 3);
  // the question at each gate, turning into the answer
  const ei = EV.findIndex(e => t >= e.a && t < e.b); show(card, ei >= 0);
  if (ei >= 0) { const e = EV[ei], k = spring(P(t, e.a, e.a + .45), 9), done = t > e.a + e.res, out = ex(P(t, e.b - .25, e.b));
    cIc.textContent = done ? '✅' : e.ic; cTx.textContent = done ? e.ok : e.q; card.style.borderColor = done ? C.green : 'rgba(63,214,245,.55)';
    card.style.opacity = Math.min(1, k * 3) * (1 - out); card.style.transform = `translateY(${(1 - k) * -60}px) scale(${L(.9, 1, k) * (done ? 1 + .05 * Math.exp(-(t - e.a - e.res) * 8) : 1)})`; }
  // the disaster screen
  [red, lines].forEach(e => show(e, disaster)); show(news, disaster); show(rew, back || (t >= REW[0] && t < REW[1] + .3));
  rew.textContent = t >= REW[0] && t < BACK[0] ? '⏪ نرجع لأولها' : '⚠ من غير البوابة دي'; rew.style.opacity = Math.floor(t * 3) % 2 ? 1 : .65;
  news.style.transform = cold ? `rotate(${-2 + Math.sin(t * 2) * .5}deg) scale(${1 + t * .02})` : `translateY(${(1 - spring(P(t, BACK[0] + 1.6, BACK[0] + 2.1), 8)) * 400}px) rotate(${-2 + Math.sin(t * 2)}deg)`;
  news.style.opacity = cold ? 1 : P(t, BACK[0] + 1.6, BACK[0] + 1.8);
  // the map
  show(map, inMap); if (inMap) { const m0 = MAP[0]; map.style.opacity = P(t, m0, m0 + .5); map.style.transform = `scale(${L(1.25, 1, ex(P(t, m0, m0 + 1.2)))})`;
    paths.forEach((p, i) => draw(p, ex(P(t, m0 + .4 + (i ? .5 : 0), m0 + 1.0 + (i ? .5 : 0)))));
    dots.forEach((d, i) => { const p = paths[i], x = P(t, m0 + .5 + (i ? .55 : 0), m0 + 1.0 + (i ? .55 : 0)), pt = p.getPointAtLength(p.getTotalLength() * eio(x)); d.style.left = pt.x + 'px'; d.style.top = pt.y + 'px'; d.style.opacity = x > 0 && x < 1 ? 1 : 0; });
    blds.forEach((b, i) => { const lit = t > m0 + 1.1 + i * .08; b.style.borderColor = lit ? C.green : 'rgba(63,214,245,.45)'; b.style.boxShadow = lit ? '0 0 60px rgba(48,209,88,.5)' : 'none'; b.style.transform = `scale(${lit ? 1 + .08 * Math.exp(-(t - m0 - 1.1 - i * .08) * 7) : 1})`; });
    mphS.style.opacity = P(t, m0 + .2, m0 + .5); map.style.filter = `opacity(${1 - P(t, END + .3, END + .7)})`; }
  // library layers
  lib.forEach(Lr => { const on = t >= Lr.at && t < Lr.until; Lr.d.style.display = on ? 'block' : 'none'; if (on) { const pre = Lr.E.dur - .35, tt = t - Lr.at; Lr.E.frame(Lr.s, Lr.until < Lr.at + Lr.E.dur ? (Lr.E.cat === 'overlay' ? tt % Lr.E.dur : Math.min(tt, pre)) : tt); } });
  // progress «١ من ٤»
  const pi = EV.findIndex(e => t >= e.a - .3 && t < e.b); show(prog, pi >= 0); if (pi >= 0) { prog.textContent = '٠١٢٣٤'[pi + 1] + ' من ٤'; prog.style.transform = `scale(${1 + .15 * Math.exp(-((t - EV[pi].a + .3) * 8))})`; }
  // clock
  show(clock, t < LOOP); const ms = msAt(t); veil.style.opacity = t > PRESS || cold ? 1 : .4;
  cN.textContent = disaster ? '?.???s' : (ms / 1000).toFixed(3) + 's'; cN.style.color = disaster ? '#FF453A' : t >= MAP[0] + 2 ? C.green : '#fff'; cN.style.opacity = disaster ? (Math.floor(t * 4) % 2 ? 1 : .55) : 1;
  cL.textContent = disaster ? 'تلت ثانية' : 'من ساعة ما داس «ادفع»';
  clock.style.transform = `scale(${1 + .07 * Math.exp(-((t - PRESS) * 8)) * (t > PRESS) + .1 * Math.exp(-((t - MAP[0] - 2) * 6)) * (t > MAP[0] + 2)})`; clock.style.opacity = 1 - P(t, END, END + .4);
  // words
  const c = VO.find(([a, b]) => t >= a && t < b); show(capBox, !!c); if (c) { cap.textContent = c[2]; const k = c[0] === 0 ? 1 : ex(P(t, c[0], c[0] + .3)); capBox.style.opacity = k; capBox.style.transform = `translateY(${(1 - k) * 30}px)`; }
};
window.META = { id: '03s-v3', dur: DUR };
document.fonts.ready.then(() => { renderAt(0); window.__ready = true; });
})();
