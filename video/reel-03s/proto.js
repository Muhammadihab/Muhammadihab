/* =====================================================================
   «٠.٣ ثانية» · نموذج أول ١٤ ثانية
   لقطة واحدة من غير قطع: إيد بتدوس «ادفع» ← الزمن بيقف ← الكاميرا بتدخل جوّه الزرار
   ← نفق بيانات فيه محطات (هوية، تشفير، مخزن) والعدّاد فوق بيحسب الملّي ثانية.
   كل الأشكال CSS 3D حقيقي (perspective)، والتصدير بيضيف موشن بلور.
   ===================================================================== */
(function () {
const { C, F, H } = window.LOGIKA_LIB;
const { el, spring, eio, P, L, cl, rnd } = H;
const ex = x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x);
const DUR = 14.0, root = document.getElementById('root');
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

/* ---------- the tunnel: a real 3D space the camera flies through ---------- */
const space = el('div', 'position:absolute;inset:0;perspective:900px;perspective-origin:50% 46%;background:radial-gradient(ellipse at 50% 46%,#0B2E57,#020812 70%)', root);
const world = el('div', 'position:absolute;left:540px;top:880px;width:0;height:0;transform-style:preserve-3d', space);
const rings = [...Array(30)].map((_, i) => ({ z: 300 + i * 260, e: el('div', `position:absolute;left:-560px;top:-560px;width:1120px;height:1120px;border-radius:50%;border:${i % 4 ? 3 : 7}px solid rgba(63,214,245,${i % 4 ? .28 : .6});box-shadow:0 0 40px rgba(0,204,242,${i % 4 ? .08 : .3}) inset`, world) }));
const streaks = [...Array(70)].map((_, i) => { const a = rnd(i) * Math.PI * 2, r = 380 + rnd(i * 3) * 220; return { z: rnd(i * 5) * 8000, x: Math.cos(a) * r, y: Math.sin(a) * r, l: 120 + rnd(i * 7) * 300,
  e: el('i', `position:absolute;width:6px;height:6px;margin:-3px;border-radius:3px;background:${i % 3 ? '#9FEFFF' : '#fff'};box-shadow:0 0 12px #3FD6F5;display:block`, world) }; });
// stations: a gate the packet passes through, with what is being checked
const ST = [
  { z: 1500, n: '١', t: 'مين إنت؟', s: 'التأكد إن ده العميل فعلاً', ic: '🪪', ms: 40 },
  { z: 3100, n: '٢', t: 'تشفير', s: 'محدش يقدر يقرا البيانات في السكة', ic: '🔐', ms: 90 },
  { z: 4700, n: '٣', t: 'المخزن', s: 'المنتج موجود؟ قبل ما ياخد فلوسه', ic: '📦', ms: 150 },
  { z: 6300, n: '٤', t: 'الدفع', s: 'فيه حاجة مش طبيعية؟ يتوقف', ic: '🛡️', ms: 220 },
];
ST.forEach(s => { s.e = el('div', 'position:absolute;left:-380px;top:-470px;width:760px;height:940px;transform-style:preserve-3d', world);
  s.gate = el('div', `position:absolute;inset:0;border-radius:90px;border:12px solid ${C.cyan2};box-shadow:0 0 60px rgba(0,204,242,.7),0 0 60px rgba(0,204,242,.4) inset`, s.e);
  el('div', 'position:absolute;left:50%;top:-170px;transform:translateX(-50%);font-size:120px;line-height:1', s.e, s.ic);
  s.ok = el('div', `position:absolute;left:50%;top:50%;width:220px;height:220px;margin:-110px;border-radius:50%;background:${C.green};display:flex;align-items:center;justify-content:center;font:700 130px ${F.num};color:#fff;box-shadow:0 0 80px rgba(48,209,88,.8)`, s.e, '✓'); });

/* ---------- the packet travelling with us, the clock above ---------- */
const pk = el('div', `position:absolute;left:50%;top:1240px;transform:translateX(-50%);padding:24px 50px 30px;border-radius:999px;background:rgba(0,204,242,.16);border:4px solid ${C.cyan2};color:#fff;font:700 70px ${F.num};direction:ltr;white-space:nowrap;box-shadow:0 0 60px rgba(0,204,242,.6);text-shadow:0 0 20px #3FD6F5`, root);
const clock = el('div', `position:absolute;left:0;right:0;top:150px;text-align:center;direction:ltr`, root);
const cN = el('div', `font:700 120px ${F.num};color:#fff;letter-spacing:2px;text-shadow:0 0 40px rgba(0,204,242,.7)`, clock), cL = el('div', `font:600 38px ${F.ar};color:${C.cyan2};direction:rtl`, clock, 'من ساعة ما داس «ادفع»');

/* ---------- the phone and the finger (first 3 seconds) ---------- */
const ph = el('div', `position:absolute;left:250px;top:330px;width:580px;height:1190px;border-radius:84px;background:#0B1420;padding:20px;box-sizing:border-box;box-shadow:0 0 0 4px #2A3B52 inset,0 60px 120px rgba(0,0,0,.6);transform-origin:290px 1000px`, root);
const sc = el('div', `position:relative;width:100%;height:100%;border-radius:66px;overflow:hidden;background:#F4F7FB;direction:rtl;font-family:${F.ar}`, ph);
el('div', `padding:90px 40px 30px;background:${C.navy};color:#fff;font:700 46px ${F.ar}`, sc, 'الدفع');
el('div', `margin:30px;padding:30px;border-radius:30px;background:#fff;box-shadow:0 6px 20px rgba(10,36,68,.08);color:${C.navy};font:600 34px ${F.ar}`, sc,
  `<div style="display:flex;justify-content:space-between"><span>طلب رقم</span><b style='font-family:${F.num}'>#48213</b></div><div style="display:flex;justify-content:space-between;margin-top:20px"><span>٣ منتجات</span><span></span></div><div style="height:2px;background:#E3EAF2;margin:24px 0"></div><div style="display:flex;justify-content:space-between;font-size:44px"><b>الإجمالي</b><b>٢,٤٥٠ ج.م</b></div>`);
const btn = el('div', `position:absolute;left:40px;right:40px;bottom:120px;height:150px;border-radius:40px;background:${C.cyan};color:${C.navy};display:flex;align-items:center;justify-content:center;font:700 64px ${F.ar};box-shadow:0 20px 50px rgba(0,204,242,.5)`, sc, 'ادفع');
const touch = el('div', 'position:absolute;width:150px;height:150px;margin:-75px;border-radius:50%;background:rgba(255,255,255,.55);border:6px solid #fff;left:540px;top:1310px', root);
const flash = el('div', `position:absolute;inset:0;background:${C.cyan}`, root);
const veil = el('div', 'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.6))', root);

/* ---------- the station title, big on screen while the camera waits at the gate ---------- */
const title = el('div', `position:absolute;left:70px;right:70px;top:360px;display:flex;align-items:center;gap:30px;padding:30px 44px 36px;border-radius:44px;background:rgba(5,16,32,.86);border:3px solid rgba(63,214,245,.55);direction:rtl;color:#fff;box-shadow:0 30px 70px rgba(0,0,0,.5)`, root);
const tIc = el('span', 'font-size:110px;line-height:1', title), tTx = el('span', '', title);
const HOLD = [[4.2, 6.3], [7.2, 9.3], [10.1, 12.1]];

/* ---------- the voice lines, for now as captions ---------- */
const VO = [[0, 1.6, 'في اللحظة اللي عميلك بيدوس فيها «ادفع»…'], [1.6, 3.1, '…بيحصل كل ده في تلت ثانية.'], [4.2, 6.2, 'الأول: السيستم بيتأكد إنه عميلك فعلاً.'],
  [7.4, 9.2, 'بياناته بتتشفّر… محدش يقدر يقراها.'], [10.3, 12.1, 'المنتج موجود؟ قبل ما ياخد فلوسه.'], [12.2, 14, '…وده لسه نص الرحلة.']];
const cap = el('div', `position:absolute;left:60px;right:60px;top:1560px;text-align:center;direction:rtl;font:700 64px/1.35 ${F.ar};color:#fff;text-shadow:0 0 2px #000,0 4px 0 rgba(0,0,0,.5),0 8px 30px rgba(0,0,0,.6)`, root);

/* ---------- camera: holds at each gate while it is explained, then rushes to the next ---------- */
const CAM = [[3.0, -600], [4.3, 900], [6.2, 1050], [7.3, 2500], [9.2, 2650], [10.2, 4100], [12.0, 4250], [14.0, 6000]];
const camZ = t => { let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const [a, b] = [CAM[i], CAM[i + 1]]; return L(a[1], b[1], eio(cl((t - a[0]) / (b[0] - a[0])))); };
const msAt = z => { const pts = [[-600, 0], ...ST.map(s => [s.z, s.ms])]; for (let i = 0; i < pts.length - 1; i++) if (z <= pts[i + 1][0]) return L(pts[i][1], pts[i + 1][1], cl((z - pts[i][0]) / (pts[i + 1][0] - pts[i][0]))); return 220 + (z - 6300) * .05; };

window.renderAt = t => {
  // 0–3 s: the press, time stops, the camera goes into the button
  const press = P(t, 1.05, 1.25), dive = Math.pow(P(t, 1.9, 3.0), 2.6), inT = t >= 2.75;
  ph.style.display = inT ? 'none' : 'block'; ph.style.transform = `scale(${L(1, 26, dive)}) translateY(${(1 - spring(P(t, 0, .6), 8)) * 300}px)`;
  btn.style.transform = `scale(${1 - .05 * Math.sin(Math.PI * press)})`; btn.style.filter = t > 1.2 ? 'brightness(1.25)' : '';
  touch.style.opacity = t < .5 ? 0 : t < 1.3 ? P(t, .5, .8) : 1 - P(t, 1.3, 1.7); touch.style.transform = `translate(${L(140, 0, ex(P(t, .4, 1.05)))}px,${L(260, 0, ex(P(t, .4, 1.05)))}px) scale(${t > 1.05 ? L(1, 1.8, P(t, 1.05, 1.6)) : 1})`;
  flash.style.opacity = P(t, 2.55, 2.75) * (1 - P(t, 2.8, 3.25));
  space.style.display = t > 2.7 ? 'block' : 'none';
  // the tunnel
  const z = camZ(t), sway = Math.sin(t * .9) * 18; world.style.transform = `translate(${sway}px,${Math.cos(t * .7) * 12}px) rotateZ(${Math.sin(t * .5) * 2}deg) translateZ(${z}px)`;
  const vis = (zz, e) => { const d = zz - z; e.style.display = d < -620 || d > 7000 ? 'none' : 'block'; e.style.opacity = cl(1 - (d - 1500) / 5000) * cl((d + 620) / 300); };
  rings.forEach(r => { r.e.style.transform = `translateZ(${-r.z}px)`; vis(r.z, r.e); });
  const v = Math.abs(camZ(t + .02) - z) / .02; streaks.forEach(s => { const zz = ((s.z - z) % 8000 + 8000) % 8000 + z - 400; s.e.style.transform = `translate3d(${s.x}px,${s.y}px,${-zz}px)`; s.e.style.height = Math.min(600, 6 + v * .12) + 'px'; s.e.style.width = '6px'; vis(zz, s.e); });
  ST.forEach(s => { s.e.style.transform = `translateZ(${-s.z}px)`; vis(s.z, s.e); const passed = z > s.z - 520, k = spring(P(z, s.z - 520, s.z - 380), 10);
    s.gate.style.borderColor = passed ? C.green : C.cyan2; s.gate.style.boxShadow = passed ? '0 0 80px rgba(48,209,88,.8),0 0 60px rgba(48,209,88,.4) inset' : '0 0 60px rgba(0,204,242,.7),0 0 60px rgba(0,204,242,.4) inset';
    s.ok.style.opacity = passed ? 1 : 0; s.ok.style.transform = `scale(${k})`; });
  // the packet: plain money, then scrambled after the encryption gate
  const enc = z > ST[1].z - 520, f = Math.floor(t * 20); pk.style.display = t > 2.9 ? 'block' : 'none'; pk.style.transform = `translateX(-50%) scale(${spring(P(t, 2.9, 3.4), 9)})`;
  pk.textContent = enc ? '{ ' + [...Array(10)].map((_, i) => 'A9#xQ$7Lm2Kp@'[Math.floor(rnd(f + i * 7) * 13)]).join('') + ' }' : '{ 2,450 EGP · #48213 }';
  pk.style.borderColor = enc ? C.green : C.cyan2;
  // the clock
  const ms = t < 1.2 ? 0 : t < 2.9 ? 0 : msAt(z); clock.style.opacity = P(t, 1.2, 1.5); cN.textContent = (ms / 1000).toFixed(3) + 's'; clock.style.transform = `scale(${1 + .06 * Math.exp(-((t - 1.2) * 8)) * (t > 1.2)})`;
  veil.style.opacity = t > 1.2 ? 1 : 0;
  // the title card of the gate we are waiting at
  const hi = HOLD.findIndex(([a, b]) => t >= a && t < b + .25); if (hi >= 0) { const sx = ST[hi], [a, b] = HOLD[hi], k = spring(P(t, a, a + .45), 9), out = ex(P(t, b, b + .25));
    tIc.textContent = sx.ic; tTx.innerHTML = `<b style='display:block;font:700 76px ${F.ar}'>${sx.n} · ${sx.t}</b><span style='font:400 42px ${F.ar};color:${C.muted}'>${sx.s}</span>`;
    title.style.opacity = Math.min(1, k * 3) * (1 - out); title.style.transform = `translateY(${(1 - k) * -60 - out * 40}px) scale(${L(.9, 1, k)})`; } else title.style.opacity = 0;
  // captions
  const c = VO.find(([a, b]) => t >= a && t < b); cap.textContent = c ? c[2] : ''; const k = c ? ex(P(t, c[0], c[0] + .3)) : 0; cap.style.opacity = k; cap.style.transform = `translateY(${(1 - k) * 30}px)`;
};
window.META = { id: '03s-proto', dur: DUR };
document.fonts.ready.then(() => { renderAt(0); window.__ready = true; });
})();
