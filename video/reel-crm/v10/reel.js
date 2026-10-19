/* =====================================================================
   ريل الـ CRM · v10: متركّب من مكتبة لوجيكا (العناصر المحسّنة والفايرال)
   على توقيت الصوت كلمة بكلمة. renderAt(t) بيرسم أي لحظة، والتصدير بيضيف موشن بلور.
   الحكاية: رسالة «بكام؟» بتغرق في الواتساب ← السيستم بيحوّلها لعميل ← أمان ← CTA ← لوجيكا.
   ===================================================================== */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, spring, eio, P, L, cl, rnd, WA } = H;
const ex = x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x);
const DUR = 47.4, root = document.getElementById('root');
const layer = (css = '') => el('div', 'position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:hidden;' + css, root);

/* ---------- 1) studio background (security, CTA and the end) ---------- */
const studio = layer('background:radial-gradient(ellipse at 50% 42%,#15457A,#06142A 72%)');

/* ---------- 2) world A: the WhatsApp chat where «بكام؟» sinks (0 – 19.2) ---------- */
const A = (() => {
  const w = layer('background:#0B141A'), cam = el('div', 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0', w);
  el('div', 'position:absolute;inset:-600px;background-image:radial-gradient(rgba(255,255,255,.035) 2px,transparent 2px);background-size:46px 46px', cam);
  const feed = el('div', 'position:absolute;left:0;top:0;width:1080px;height:4000px', cam);
  el('div', `position:absolute;left:0;right:0;top:0;height:170px;background:#1F2C34;display:flex;align-items:flex-end;gap:22px;padding:0 40px 26px;box-sizing:border-box;direction:rtl;color:#fff;font:700 44px ${F.ar}`, cam,
    `<span style="width:84px;height:84px;border-radius:50%;background:#2A3942;display:flex;align-items:center;justify-content:center;font-size:44px">🏬</span><span>المحل<div style="font:400 28px ${F.ar};color:#8696A0">واتساب بيزنس</div></span>`);
  el('div', `position:absolute;left:50%;top:330px;transform:translateX(-50%);padding:8px 26px;border-radius:14px;background:#182229;color:#8696A0;font:600 30px ${F.ar}`, feed, 'الخميس');
  const hero = el('div', `position:absolute;right:60px;top:420px;padding:22px 34px 18px;border-radius:34px 34px 10px 34px;background:#202C33;color:#E9EDEF;font:400 64px ${F.ar};direction:rtl;box-shadow:0 10px 30px rgba(0,0,0,.35);transform-origin:right bottom;white-space:nowrap`, feed,
    `بكام؟ <span style="font:400 28px ${F.num};color:#8696A0;margin-right:18px">3:00 PM</span><span class="tk" style="font:700 30px ${F.num};color:#8696A0;margin-right:8px"><b class="t1">✓</b><b class="t2">✓</b></span>`);
  const t1 = hero.querySelector('.t1'), t2 = hero.querySelector('.t2');
  const SP = [['جروب العيلة', 'صباح الخير يا جماعة 🌸'], ['عروض', 'خصم ٣٠٪ النهارده بس!!'], ['جروب الشغل', 'مين نازل بكره؟'], ['جروب العيلة', '📷 صورة'], ['ماما', 'كلت؟'], ['جروب الشغل', 'تمام'], ['عروض', 'آخر فرصة 🔥'], ['جروب العيلة', 'ههههههه'], ['جروب الشغل', 'الميتنج اتأجل'], ['جروب العيلة', '🎤 رسالة صوتية'], ['عروض', 'كوبون جديد'], ['جروب الشغل', 'حد شاف الإيميل؟'], ['جروب العيلة', 'كل سنة وانتو طيبين'], ['عروض', 'اطلب دلوقتي']];
  const NC = { 'جروب العيلة': '#53BDEB', 'عروض': '#FFB020', 'جروب الشغل': '#30D158', 'ماما': '#FF6B9A' };
  const spam = SP.map(([n, m], i) => el('div', `position:absolute;${i % 3 === 1 ? 'left' : 'right'}:60px;top:${640 + i * 132}px;padding:14px 30px 18px;border-radius:30px;background:#202C33;color:#E9EDEF;font:400 42px ${F.ar};direction:rtl;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,.3);transform-origin:right bottom`, feed,
    `<div style="font:700 28px ${F.ar};color:${NC[n]}">${n}</div>${m}`));
  const lost = el('div', `position:absolute;right:60px;top:560px;padding:8px 22px;border-radius:14px;background:rgba(255,69,58,.18);color:#FF6B61;font:700 32px ${F.ar}`, feed, '✕ محدش رد');
  const tint = el('div', 'position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,40,80,0),rgba(0,40,80,.75))', w);
  const clock = el('div', `position:absolute;left:60px;top:230px;padding:12px 28px;border-radius:99px;background:rgba(5,14,29,.82);color:#fff;font:700 40px ${F.ar};direction:rtl;display:flex;gap:14px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.4)`, w);
  const f = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); f.setAttribute('width', 0); f.setAttribute('height', 0); f.style.position = 'absolute'; f.innerHTML = '<filter id="ablur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="ablurb" stdDeviation="0 0"/></filter>'; w.appendChild(f);
  const KEYS = [[0, 700, 470, 1.6], [2.2, 700, 470, 1.55], [3.3, 700, 560, 1.55], [6.6, 700, 560, 1.45], [10.2, 640, 760, 1.15], [12.2, 540, 960, 1.0], [13.95, 540, 960, 1.0], [14.7, 760, 560, 1.7], [19.2, 780, 540, 2.0]];
  const camAt = t => { let i = 0; while (i < KEYS.length - 1 && t > KEYS[i + 1][0]) i++; const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)], x = b === a ? 1 : eio(P(t, a[0], b[0])); return { x: L(a[1], b[1], x), y: L(a[2], b[2], x), z: Math.exp(L(Math.log(a[3]), Math.log(b[3]), x)) }; };
  const spamAt = i => 10.45 + i * .14;
  const scrollAt = t => { let n = 0; for (let i = 0; i < SP.length; i++) n += ex(P(t, spamAt(i), spamAt(i) + .25)); const down = Math.max(0, 640 + n * 132 - 1700); return down * (1 - eio(P(t, 13.85, 14.5))); };
  function frame(t) { w.style.display = t < 19.4 ? 'block' : 'none'; if (t >= 19.4) return;
    const k = spring(P(t, 0, .35), 10); hero.style.transform = `scale(${L(.6, 1, k)})`; hero.style.opacity = Math.min(1, k * 3) * (t > 15.3 ? L(1, .45, P(t, 15.3, 15.8)) : 1);
    t1.style.opacity = t > 5.17 ? 1 : 0; t2.style.opacity = t > 5.63 ? 1 : 0; t2.style.marginRight = '-14px';
    spam.forEach((b, i) => { const x = spring(P(t, spamAt(i), spamAt(i) + .35), 10); b.style.opacity = t > spamAt(i) ? Math.min(1, x * 3) : 0; b.style.transform = `scale(${L(.6, 1, x)})`; });
    feed.style.transform = `translateY(${-scrollAt(t)}px)`; lost.style.opacity = P(t, 15.4, 15.7); lost.style.transform = `scale(${spring(P(t, 15.4, 15.8), 10) || .01})`;
    tint.style.opacity = P(t, 10.4, 12.2) * (1 - P(t, 13.85, 14.4)) + P(t, 15.3, 16.2) * .5;
    const ct = t < 6.8 ? '' : t < 9.0 ? '🕓 ٤:٠٠ م' : t < 9.87 ? '📅 الجمعة' : t < 12.3 ? '📅 السبت' : ''; clock.textContent = ct; clock.style.opacity = ct ? 1 : 0; clock.style.transform = `scale(${1 + .12 * Math.exp(-((t - (t < 9 ? 6.8 : t < 9.87 ? 9 : 9.87)) * 9))})`;
    const c = camAt(t), pc = camAt(Math.max(0, t - 1 / 30)); cam.style.transform = `translate(540px,960px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)`;
    const vx = Math.abs(c.x - pc.x) * c.z, vy = Math.abs(c.y - pc.y) * c.z, vz = Math.abs(Math.log(c.z / pc.z)) * 260, bx = cl(vx * .25 + vz * .4, 0, 14), by = cl(vy * .25 + vz * .6, 0, 14);
    f.querySelector('#ablurb').setAttribute('stdDeviation', `${(bx / c.z).toFixed(2)} ${(by / c.z).toFixed(2)}`); cam.style.filter = bx > .4 || by > .4 ? 'url(#ablur)' : ''; }
  return { frame };
})();

/* ---------- 3) library elements, each on its own layer at its own time ---------- */
const LAYERS = [];
function add(id, at, params = {}, o = {}) { const E = LIB.find(e => e.id === id), d = layer(o.css || ''), s = E.init(d, { ...(E.params || {}), ...params });
  const Lr = { E, d, s, at, end: o.until ?? at + E.dur, hold: o.until != null, map: o.map, loop: o.loop }; LAYERS.push(Lr); d.style.display = 'none'; return Lr; }
function localT(Lr, t) { if (Lr.map) return Lr.map(t); const tt = t - Lr.at; if (Lr.loop) return tt % Lr.E.dur;
  if (!Lr.hold) return tt; const pre = Lr.E.dur - .35, holdEnd = Lr.end - .35; return t < holdEnd ? Math.min(tt, pre) : Lr.E.dur - (Lr.end - t); }
const pw = keys => t => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const [a, b] = [keys[i], keys[i + 1]]; return L(a[1], b[1], cl((t - a[0]) / (b[0] - a[0]))); };

// world B: the CRM board, from the library's camera scene, re-timed to the voice
add('hq-06', 19.2, { msgs: ['لسه متاح؟', 'بكام؟', 'فين العنوان؟', 'ممكن صور تاني؟', 'حد يرد بقا 🙏', 'عاوز أحجز النهارده'], ask: 'سألت: بكام؟' },
  { until: 29.45, map: pw([[19.2, 1.15], [19.9, 1.55], [21.9, 1.88], [22.75, 2.4], [23.35, 2.65], [25.0, 2.75], [27.6, 3.45], [29.45, 3.7]]) });
const braces = add('fx-27', 29.3, {}, { until: DUR, loop: true, css: 'mix-blend-mode:screen;opacity:.55' });
add('fx-10', 10.6, {}, { until: 13.9, loop: true, css: 'opacity:.8' });
add('fx-16', 29.45, {}, { until: 32.9, loop: true });
const dim = layer('background:rgba(4,12,26,.62);pointer-events:none');
// takeovers on the spoken word
add('hq-03', .81, { text: 'بكام؟', sub: 'رسالة واحدة… بس مهمة' }, { until: 2.45 });
add('hq-03', 12.22, { text: 'يوم ٣', sub: 'ومحدش رد' }, { until: 13.85 });
add('hq-10', 14.3, { title: 'واتساب', body: 'العميل: خلاص، اتفقت مع محل تاني', body2: 'العميل: شكراً 🙏' });
add('vr-06', 16.35, { value: '48,500', label: 'جنيه راحوا لغيرك' }, { until: 19.25 });
add('ui-06', 25.35, { title: 'تذكير متابعة', body: 'كلّم هدى النهارده قبل ما تبرد' });
add('hq-03', 27.85, { text: 'اتفقنا ✓', sub: '٤٨,٥٠٠ جنيه رجعوا ليك' }, { until: 29.45 });
// security
add('ui-07', 29.5, { title: 'سجل النشاط', rows: [['م', 'محمد', 'سجّل دفعة ٣,٥٠٠', '١٠:٤٠'], ['س', 'سارة', 'قفلت صفقة', '١١:٠٢'], ['ب', 'البيّاع', 'بيحاول يصدّر ٢٤٠ عميل', '١١:٤٨', 1]] }, { until: 32.55 });
add('hq-07', 32.31, { text: 'اتمنع' }, { until: 33.6 });
add('ui-09', 33.55, { text: 'اقفل حساب البيّاع', done: 'اتقفل', y: 880 }, { until: 35.4 });
add('vr-11', 35.45, { text: 'اسرقه؟ 😏' }, { until: 36.95 });
add('hq-01', 36.75, { tag: 'السرقة اتمنعت' });
// CTA and the end
add('hq-08', 39.2, { text: 'كلّمنا على واتساب', num: '+20 122 641 2843', y: 1120 }, { until: 42.05 });
add('hq-04', 41.95, { msg: 'بكام؟', name: 'هدى س.', ask: 'سألت: بكام؟', tag: 'عميل جديد', ok: 'اتسجّل في السيستم' }, { until: 44.95 });
add('hq-09', 44.9, { tag: 'متأمّن من جوّا' }, { until: DUR + .6 });   // ends on the logo, no fade
add('hq-05', 18.75);   // the brace sweep: its middle covers the cut into the system at 19.2
const TAKE = [[.85, 2.45], [12.25, 13.85], [16.35, 19.2], [27.9, 29.4], [35.45, 36.95], [37.9, 39.3], [44.9, DUR]];

/* ---------- 4) captions: word by word, a cyan frame that moves to the word being said ---------- */
const capL = layer(''), back = el('div', 'position:absolute;left:0;right:0;bottom:0;height:640px;background:linear-gradient(180deg,rgba(3,9,20,0),rgba(3,9,20,.72) 60%)', capL), row = el('div', `position:absolute;left:40px;right:40px;top:1520px;display:flex;justify-content:center;flex-wrap:wrap;gap:6px 22px;direction:rtl;font:700 76px/1.25 ${F.ar}`, capL);
const pill = el('div', `position:absolute;border-radius:22px;background:${C.cyan};box-shadow:0 10px 34px rgba(0,204,242,.45);z-index:0`, capL);
let segI = -1, spans = [];
function caption(t) { const W = window.WORDS, i = W.findIndex(([a, b]) => t >= a - .05 && t < b + .12), hide = TAKE.some(([a, b]) => t > a && t < b);
  capL.style.opacity = hide ? 0 : 1; if (i < 0 || hide) { pill.style.opacity = 0; if (i < 0) { row.innerHTML = ''; segI = -1; } return; }
  if (i !== segI) { segI = i; row.innerHTML = ''; spans = W[i][2].map(([w]) => { const m = el('span', 'position:relative;z-index:1;display:inline-block;overflow:hidden;padding:2px 14px 12px', row); return { m, s: el('span', 'display:inline-block;color:#fff;text-shadow:0 0 2px #000,0 4px 0 rgba(0,0,0,.5),0 8px 24px rgba(0,0,0,.5)', m, w) }; }); }
  const ws = W[i][2]; let cur = 0; ws.forEach(([, at], j) => { if (t >= at - .04) cur = j; });
  spans.forEach((q, j) => { const x = ex(P(t, ws[j][1] - .06, ws[j][1] + .22)); q.s.style.transform = `translateY(${(1 - x) * 100}%)`; q.s.style.color = j === cur ? C.navy : '#fff'; q.s.style.textShadow = j === cur ? 'none' : ''; });
  const b = spans[cur].m.getBoundingClientRect(), r0 = capL.getBoundingClientRect(), sc = r0.width / 1080 || 1, k = ex(P(t, ws[cur][1] - .06, ws[cur][1] + .14));
  const tx = (b.left - r0.left) / sc, ty = (b.top - r0.top) / sc; pill.style.opacity = 1; pill.style.left = tx + 'px'; pill.style.top = (ty + 4) + 'px'; pill.style.width = b.width / sc + 'px'; pill.style.height = (b.height / sc - 8) + 'px'; pill.style.transform = `scale(${L(.85, 1, k)})`; }

/* ---------- render one moment ---------- */
window.renderAt = t => {
  A.frame(t); studio.style.display = t > 19 ? 'block' : 'none';
  LAYERS.forEach(Lr => { const on = Lr.map ? t >= Lr.at && t < Lr.end : t >= Lr.at && (Lr.hold || Lr.loop ? t < Lr.end : t < Lr.at + Lr.E.dur);
    Lr.d.style.display = on ? 'block' : 'none'; if (on) { try { Lr.E.frame(Lr.s, Math.max(0, localT(Lr, t))); } catch (e) {} } });
  let dv = 0; [[.85, 2.45], [12.25, 13.85], [16.35, 19.2], [27.9, 29.4]].forEach(([a, b]) => { dv = Math.max(dv, P(t, a, a + .2) * (1 - P(t, b - .2, b))); }); dim.style.opacity = dv;
  caption(t);
};
window.META = { id: 'crm-v10', dur: DUR, blend: 'scene' };
document.fonts.ready.then(() => { renderAt(0); window.__ready = true; });
})();
