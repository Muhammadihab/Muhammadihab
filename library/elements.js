/* =====================================================================
   مكتبة لوجيكا: موشن جرافيك، وانتقالات، وإيفكتات.
   كل عنصر بيترسم على فريم ١٠٨٠×١٩٢٠، وحركته محسوبة من الزمن t بس،
   فنفس الكود بيشتغل في صفحة المعرض وبيتصدّر فريم فريم لفيديو.
   عنصر = { id, cat, name, use, dur, blend, params, init(root,p) -> state, frame(state,t) }
   ===================================================================== */
(function () {
const C = { navy: '#0A2444', ink: '#071A33', cyan: '#00CCF2', cyan2: '#3FD6F5', orange: '#F56A39',
  white: '#F4F7FB', muted: '#AFC1D8', red: '#FF453A', green: '#30D158', wa: '#25D366' };
const F = { ar: '"IBM Plex Sans Arabic",PlexL,sans-serif', num: 'Sora,SoraL,"IBM Plex Sans Arabic",PlexL,sans-serif' };
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), P = (t, a, b) => cl((t - a) / (b - a)), L = (a, b, x) => a + (b - a) * x;
const eo = x => 1 - Math.pow(1 - x, 3), ei = x => x * x * x, eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const spring = (x, k = 9) => x <= 0 ? 0 : 1 - Math.exp(-k * x) * Math.cos(k * 1.3 * x);
const rnd = n => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const NS = 'http://www.w3.org/2000/svg';
function el(tag, css, parent, html) { const e = document.createElement(tag); if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
function svg(parent, inner, css = '') { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 1080 1920'); s.setAttribute('width', 1080); s.setAttribute('height', 1920);
  s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;' + css; s.innerHTML = inner; parent.appendChild(s); return s; }
function draw(path, p) { const len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len * (1 - p); }
// the Logika brace, as drawn in the brand book (left one; the right is mirrored)
const BRACE_L = 'M150 0 C96 0 80 24 80 80 L80 240 C80 290 64 312 34 320 C64 328 80 350 80 400 L80 560 C80 616 96 640 150 640';
const BRACE_R = 'M-150 0 C-96 0 -80 24 -80 80 L-80 240 C-80 290 -64 312 -34 320 C-64 328 -80 350 -80 400 L-80 560 C-80 616 -96 640 -150 640';
const glow = c => `drop-shadow(0 0 18px ${c})`;
const outFade = (t, dur, d = .25) => 1 - P(t, dur - d, dur);
const WA = '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 20l1.2-4.3A8 8 0 1 1 8.4 19z" fill="#fff"/><path d="M9.2 8.4c0 3.2 2.9 6.2 6.2 6.2l.9-1.5-1.9-1-1 .8c-1-.4-2.1-1.5-2.5-2.5l.8-1-1-1.9z" fill="#25D366"/></svg>';

const LIB = [];
const def = o => LIB.push(o);

/* ============================ موشن جرافيك ============================ */
def({ id: 'mg-01', cat: 'motion', name: 'قفل الأقواس', use: 'توقيع لوجيكا: أي حاجة اتأمّنت أو اتحلّت. حطه على الحاجة بعد ما السيستم يحلّها.', dur: 2.4, blend: 'alpha',
  params: { size: 1 },
  init(r, p) { const s = svg(r, `<g transform="translate(540 960) scale(${p.size})"><g id="g"><path id="l" d="${BRACE_L}" transform="translate(-260 -320)"/><path id="r" d="${BRACE_R}" transform="translate(260 -320)"/></g>
      <g id="lk" transform="translate(0 0)"><circle r="92" fill="${C.navy}" stroke="${C.cyan2}" stroke-width="7"/><rect x="-36" y="-6" width="72" height="56" rx="10" fill="#fff"/><path id="sh" d="M-22 -6 V-28 a22 22 0 0 1 44 0 V-6" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/></g>
      <circle id="ring" r="100" fill="none" stroke="${C.cyan2}" stroke-width="6"/></g>`);
    s.querySelectorAll('#l,#r').forEach(e => { e.setAttribute('fill', 'none'); e.setAttribute('stroke', C.cyan2); e.setAttribute('stroke-width', 16); e.setAttribute('stroke-linecap', 'round'); e.style.filter = glow('rgba(0,204,242,.85)'); });
    return { s, l: s.querySelector('#l'), r: s.querySelector('#r'), lk: s.querySelector('#lk'), sh: s.querySelector('#sh'), ring: s.querySelector('#ring') }; },
  frame(o, t) { const a = eio(P(t, 0, .55)); draw(o.l, a); draw(o.r, a);
    o.l.setAttribute('transform', `translate(${L(-420, -260, eo(P(t, 0, .6)))} -320)`); o.r.setAttribute('transform', `translate(${L(420, 260, eo(P(t, 0, .6)))} -320)`);
    const k = spring(P(t, .5, 1.1), 9); o.lk.setAttribute('transform', `scale(${L(.2, 1, k)})`); o.lk.style.opacity = Math.min(1, k * 3);
    o.sh.setAttribute('d', t > .95 ? 'M-22 -6 V-28 a22 22 0 0 1 44 0 V-6' : 'M-22 -6 V-40 a22 22 0 0 1 44 0 V-22');
    const q = P(t, .95, 1.5); o.ring.setAttribute('r', L(100, 330, eo(q))); o.ring.style.opacity = q > 0 && q < 1 ? (1 - q) * .9 : 0;
    o.s.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-02', cat: 'motion', name: 'إطار الأقواس', use: 'تقفل قوسين حوالين كلمة أو كارت أو موبايل عشان تقول «ده المهم». المساحة اللي في النص فاضية.', dur: 2.2, blend: 'alpha',
  params: { w: 760, h: 640 },
  init(r, p) { const s = svg(r, `<path id="l"/><path id="r"/>`); ['l', 'r'].forEach(i => { const e = s.querySelector('#' + i); e.setAttribute('d', i === 'l' ? BRACE_L : BRACE_R); e.setAttribute('fill', 'none'); e.setAttribute('stroke', C.cyan2); e.setAttribute('stroke-width', 14); e.setAttribute('stroke-linecap', 'round'); e.style.filter = glow('rgba(0,204,242,.8)'); });
    return { s, l: s.querySelector('#l'), r: s.querySelector('#r'), p }; },
  frame(o, t) { const { w, h } = o.p, sy = h / 640, a = eio(P(t, 0, .6)), sq = 1 - .06 * Math.sin(Math.PI * P(t, .55, .9));
    draw(o.l, a); draw(o.r, a);
    o.l.setAttribute('transform', `translate(${540 - w / 2 * sq - 80} ${960 - h / 2}) scale(1 ${sy})`); o.r.setAttribute('transform', `translate(${540 + w / 2 * sq + 80} ${960 - h / 2}) scale(1 ${sy})`);
    o.s.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-03', cat: 'motion', name: 'كابشن كلمة بكلمة', use: 'الكابشن الأساسي: ٢–٤ كلمات، وكل كلمة تنوّر وهي بتتقال. مكانه في المنطقة الآمنة تحت النص.', dur: 2.2, blend: 'alpha',
  params: { text: 'كل رسالة بتبقى كارت', key: 'كارت', y: 1300 },
  init(r, p) { const box = el('div', `position:absolute;left:0;right:0;top:${p.y}px;display:flex;justify-content:center;direction:rtl`, r);
    const pill = el('div', `font:700 72px ${F.ar};color:#fff;padding:18px 40px 26px;border-radius:32px;background:rgba(5,14,29,.82);box-shadow:0 20px 50px rgba(0,0,0,.35);white-space:nowrap`, box);
    const ws = p.text.split(' ').map(w => el('span', 'display:inline-block;margin:0 10px;opacity:0', pill, w));
    return { pill, ws, p }; },
  frame(o, t) { const per = .28; o.ws.forEach((w, j) => { const a = .1 + j * per, x = P(t, a, a + .22), sp = spring(x, 11);
      w.style.opacity = Math.min(1, x * 2.5); w.style.filter = `blur(${(1 - x) * 8}px)`; w.style.transform = `translateY(${(1 - sp) * 36}px) scale(${L(1.3, 1, sp)})`;
      const now = t >= a && t < a + per + .05, key = w.textContent === o.p.key; w.style.color = now || (key && t > a) ? C.cyan2 : '#fff'; });
    const op = outFade(t, this.dur, .18); o.pill.style.opacity = op; o.pill.style.transform = `translateY(${(1 - op) * -20}px)`; } });

def({ id: 'mg-04', cat: 'motion', name: 'كلمة كبيرة', use: 'كلمة واحدة تملا الشاشة في اللحظة المهمة: «بكام؟» أو «صفر» أو «اتفقنا». ٣–٥ مرات في الريل بس.', dur: 1.6, blend: 'alpha',
  params: { text: 'بكام؟', sub: 'رسالة واحدة… بس مهمة', color: '#FFFFFF' },
  init(r, p) { const w = el('div', 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;direction:rtl', r);
    const m = el('div', 'overflow:hidden;padding:0 20px', w); const b = el('div', `font:700 330px/1.15 ${F.ar};color:${p.color};white-space:nowrap;text-shadow:0 0 60px rgba(0,204,242,.35)`, m, p.text);
    const s = el('div', `font:700 64px ${F.ar};color:${C.cyan2};margin-top:10px`, w, p.sub); return { w, b, s }; },
  frame(o, t) { const x = P(t, 0, .35), sp = spring(P(t, 0, .5), 9); o.b.style.transform = `translateY(${(1 - eo(x)) * 110}%) scale(${L(1.35, 1, sp)})`;
    const s = P(t, .3, .5); o.s.style.opacity = s; o.s.style.transform = `translateY(${(1 - eo(s)) * 20}px)`;
    const out = P(t, this.dur - .2, this.dur); o.w.style.opacity = 1 - out; o.w.style.transform = `scale(${1 + out * .6})`; } });

def({ id: 'mg-05', cat: 'motion', name: 'عدّاد رقم', use: 'رقم بيعد لحد قيمته: فلوس، أو عدد رسايل، أو سطور. بيخلّي الرقم يتحس.', dur: 2.2, blend: 'alpha',
  params: { to: 48500, label: 'جنيه راحوا لغيرك', color: '#FFFFFF' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:720px;text-align:center', r);
    const n = el('div', `font:700 210px ${F.num};color:${p.color};direction:ltr;font-variant-numeric:tabular-nums;text-shadow:0 0 50px rgba(0,204,242,.5)`, w);
    const l = el('div', `font:700 66px ${F.ar};color:${C.cyan2};direction:rtl;margin-top:6px`, w, p.label); return { w, n, l, p }; },
  frame(o, t) { const x = eo(P(t, .1, 1.3)); o.n.textContent = Math.round(o.p.to * x).toLocaleString('en-US');
    const k = spring(P(t, 0, .4), 9); o.n.style.transform = `scale(${L(.6, 1, k) + (t > 1.3 && t < 1.5 ? .06 * Math.sin(P(t, 1.3, 1.5) * Math.PI) : 0)})`;
    o.l.style.opacity = P(t, .5, .75); o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-06', cat: 'motion', name: 'ختم', use: 'ختم بينزل بقوة: «اتمنع» أو «اتقفل» أو «اتدفع». حطه مع صوت ضربة.', dur: 1.8, blend: 'alpha',
  params: { text: 'اتمنع', color: '#FF453A' },
  init(r, p) { const s = el('div', `position:absolute;left:50%;top:50%;padding:14px 56px 24px;border:12px solid ${p.color};border-radius:26px;color:${p.color};font:700 170px ${F.ar};white-space:nowrap;background:rgba(255,255,255,.1)`, r, p.text);
    return { s }; },
  frame(o, t) { const k = P(t, 0, .14), sh = t > .14 && t < .4 ? (1 - P(t, .14, .4)) * 14 * Math.sin(t * 90) : 0;
    o.s.style.transform = `translate(-50%,-50%) translate(${sh}px,${-sh * .6}px) rotate(-12deg) scale(${L(2.6, 1, eo(k))})`; o.s.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur); } });

def({ id: 'mg-07', cat: 'motion', name: 'صح بيترسم', use: 'نجاح: اتفقنا، اتسلّم، اتحل. دايرة وصح بيترسموا.', dur: 1.8, blend: 'alpha',
  params: { color: '#30D158' },
  init(r, p) { const s = svg(r, `<g transform="translate(540 960)"><circle id="c" r="190" fill="none" stroke="${p.color}" stroke-width="22" stroke-linecap="round" transform="rotate(-90)"/>
      <path id="k" d="M-88 4 L-24 66 L96 -64" fill="none" stroke="${p.color}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><circle id="b" r="200" fill="none" stroke="${p.color}" stroke-width="6"/></g>`);
    s.style.filter = `drop-shadow(0 0 30px ${p.color}88)`; return { s, c: s.querySelector('#c'), k: s.querySelector('#k'), b: s.querySelector('#b'), g: s.querySelector('g') }; },
  frame(o, t) { draw(o.c, eio(P(t, 0, .45))); draw(o.k, eo(P(t, .38, .7)));
    const pop = Math.sin(Math.PI * P(t, .65, .95)) * .06; o.g.setAttribute('transform', `translate(540 960) scale(${1 + pop})`);
    const q = P(t, .7, 1.3); o.b.setAttribute('r', L(200, 420, eo(q))); o.b.style.opacity = q > 0 && q < 1 ? 1 - q : 0; o.s.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-08', cat: 'motion', name: 'إشعار واتساب', use: 'إشعار بينزل من فوق. للرسايل اللي بتتراكم، أو «عميل جديد».', dur: 2.4, blend: 'alpha',
  params: { title: 'واتساب', body: 'هدى سامي: بكام الأوضة؟', time: 'الآن', y: 140 },
  init(r, p) { const c = el('div', `position:absolute;left:60px;right:60px;top:${p.y}px;display:flex;gap:26px;align-items:center;padding:30px 34px;border-radius:44px;direction:rtl;
      background:rgba(30,36,48,.92);backdrop-filter:blur(20px);box-shadow:0 30px 70px rgba(0,0,0,.45)`, r);
    el('div', `width:96px;height:96px;border-radius:24px;background:${C.wa};flex:none;padding:16px`, c, WA);
    const tx = el('div', `flex:1;min-width:0;color:#fff;font:400 40px ${F.ar}`, c, `<div style="display:flex;justify-content:space-between;color:#AEB4BE;font-size:32px"><b style="color:#fff;font-weight:600">${p.title}</b><span>${p.time}</span></div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.body}</div>`);
    return { c }; },
  frame(o, t) { const k = spring(P(t, 0, .6), 8); o.c.style.transform = `translateY(${(1 - k) * -360}px) scale(${L(.9, 1, k)})`; o.c.style.opacity = Math.min(1, k * 2);
    const out = P(t, this.dur - .3, this.dur); if (out > 0) { o.c.style.transform = `translateY(${-eo(out) * 360}px)`; } } });

def({ id: 'mg-09', cat: 'motion', name: 'محادثة شات', use: 'رسالة جاية بعد «بيكتب…» ورد عليها. لأي حوار مع عميل.', dur: 3.0, blend: 'alpha',
  params: { a: 'بكام الأوضة؟', b: 'أهلاً يا أستاذة 👋 بـ ٤٨,٥٠٠ ج', y: 700 },
  init(r, p) { const w = el('div', `position:absolute;left:70px;right:70px;top:${p.y}px;display:flex;flex-direction:column;gap:26px;direction:rtl;font:400 52px ${F.ar}`, r);
    const typing = el('div', 'align-self:flex-start;background:#fff;border-radius:40px;padding:28px 36px;display:flex;gap:12px', w, '<i></i><i></i><i></i>');
    typing.querySelectorAll('i').forEach(i => i.style.cssText = 'width:18px;height:18px;border-radius:50%;background:#9AA4B0;display:block');
    const m1 = el('div', 'align-self:flex-start;background:#fff;color:#111B21;border-radius:40px 40px 40px 12px;padding:24px 38px;box-shadow:0 16px 40px rgba(0,0,0,.2);transform-origin:left bottom', w, p.a);
    const m2 = el('div', 'align-self:flex-end;background:#D9FDD3;color:#111B21;border-radius:40px 40px 12px 40px;padding:24px 38px;box-shadow:0 16px 40px rgba(0,0,0,.2);transform-origin:right bottom', w, p.b + ' <span style="color:#53BDEB;font-size:36px">✓✓</span>');
    return { w, typing, m1, m2 }; },
  frame(o, t) { o.typing.style.display = t < .7 ? 'flex' : 'none'; o.typing.style.opacity = P(t, 0, .15);
    [...o.typing.children].forEach((d, j) => d.style.transform = `translateY(${-10 * Math.max(0, Math.sin(t * 9 - j * .8))}px)`);
    const a = spring(P(t, .7, 1.1), 10); o.m1.style.display = t >= .7 ? 'block' : 'none'; o.m1.style.transform = `scale(${L(.5, 1, a)})`; o.m1.style.opacity = Math.min(1, a * 3);
    const b = spring(P(t, 1.4, 1.8), 10); o.m2.style.opacity = t >= 1.4 ? Math.min(1, b * 3) : 0; o.m2.style.transform = `scale(${L(.5, 1, b)})`;
    o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-10', cat: 'motion', name: 'زرار واتساب', use: 'الـ CTA في آخر الفيديو. البرتقاني ده للـ CTA بس.', dur: 2.6, blend: 'alpha',
  params: { text: 'ابعتلنا على واتساب', num: '+20 122 641 2843', y: 1150 },
  init(r, p) { const w = el('div', `position:absolute;left:0;right:0;top:${p.y}px;display:flex;flex-direction:column;align-items:center;gap:30px`, r);
    const b = el('div', `position:relative;overflow:hidden;display:flex;align-items:center;gap:22px;height:150px;padding:0 64px 0 54px;border-radius:999px;background:${C.orange};color:#fff;font:700 58px ${F.ar};direction:rtl;box-shadow:0 20px 60px rgba(245,106,57,.55);white-space:nowrap`, w);
    el('span', 'width:70px;height:70px;display:block', b, WA); el('span', '', b, p.text); const sh = el('i', 'position:absolute;top:-20px;bottom:-20px;width:140px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);transform:skewX(-20deg)', b);
    const n = el('div', `font:700 50px ${F.num};color:#fff;direction:ltr`, w, p.num); return { b, sh, n, w }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8), pulse = t > .6 ? 1 + .035 * Math.sin((t - .6) * 6) : 1; o.b.style.transform = `scale(${L(.3, 1, k) * pulse})`; o.b.style.opacity = Math.min(1, k * 2);
    o.sh.style.left = (P(t, .7, 1.4) * 1100 - 250) + 'px'; const q = P(t, .5, .8); o.n.style.opacity = q; o.n.style.transform = `translateY(${(1 - eo(q)) * 20}px)`; o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-11', cat: 'motion', name: 'شريط اسم', use: 'اسم وصفة (عميل، أو مكان، أو موظف) أول ما يظهر في الفيديو.', dur: 2.6, blend: 'alpha',
  params: { title: 'اسم الشركة هنا', sub: 'من ٦,٠٠٠ سطر في دفتر… لسيستم', y: 1380 },
  init(r, p) { const w = el('div', `position:absolute;right:60px;top:${p.y}px;direction:rtl;overflow:hidden;padding:6px 0`, r);
    const bar = el('div', `display:flex;flex-direction:column;gap:6px;padding:26px 40px 30px 60px;background:rgba(10,36,68,.92);border-radius:20px;border-right:12px solid ${C.cyan}`, w);
    const a = el('div', `font:700 60px ${F.ar};color:#fff;white-space:nowrap`, bar, p.title), b = el('div', `font:400 40px ${F.ar};color:${C.muted};white-space:nowrap`, bar, p.sub);
    return { bar, a, b, w }; },
  frame(o, t) { const x = eo(P(t, 0, .45)); o.bar.style.transform = `translateX(${(1 - x) * 110}%)`; const a = P(t, .25, .5), b = P(t, .4, .65);
    o.a.style.opacity = a; o.a.style.transform = `translateY(${(1 - eo(a)) * 18}px)`; o.b.style.opacity = b; o.b.style.transform = `translateY(${(1 - eo(b)) * 18}px)`;
    const out = P(t, this.dur - .35, this.dur); if (out > 0) o.bar.style.transform = `translateX(${eio(out) * 110}%)`; } });

def({ id: 'mg-12', cat: 'motion', name: 'كارت رقم وجراف', use: 'رقم مهم بجراف صغير بيطلع: المبيعات، أو المكالمات، أو الآجل.', dur: 2.6, blend: 'alpha',
  params: { label: 'مبيعات الشهر', to: 184500, unit: 'جنيه' },
  init(r, p) { const c = el('div', `position:absolute;left:150px;right:150px;top:640px;padding:46px 54px;border-radius:50px;direction:rtl;background:linear-gradient(160deg,rgba(23,63,108,.97),rgba(9,32,60,.97));border:3px solid rgba(0,204,242,.6);box-shadow:0 0 60px rgba(0,204,242,.3),0 50px 90px rgba(0,0,0,.5)`, r);
    el('div', `font:600 44px ${F.ar};color:${C.muted}`, c, p.label); const n = el('div', `font:700 120px ${F.num};color:#fff;direction:ltr;text-align:right;margin-top:6px`, c);
    el('div', `font:400 38px ${F.ar};color:${C.muted}`, c, p.unit); const bars = el('div', 'display:flex;gap:16px;align-items:flex-end;height:220px;margin-top:30px;direction:ltr', c);
    [38, 52, 46, 64, 58, 72, 90].forEach(() => el('i', `flex:1;border-radius:12px 12px 4px 4px;background:linear-gradient(180deg,${C.cyan2},rgba(0,204,242,.25));height:0;display:block`, bars));
    return { c, n, bars: [...bars.children], hs: [38, 52, 46, 64, 58, 72, 90], p }; },
  frame(o, t) { const k = spring(P(t, 0, .55), 8); o.c.style.transform = `translateY(${(1 - k) * 200}px) scale(${L(.8, 1, k)}) rotateX(${(1 - k) * 25}deg)`; o.c.style.opacity = Math.min(1, k * 2);
    o.n.textContent = Math.round(o.p.to * eo(P(t, .3, 1.4))).toLocaleString('en-US');
    o.bars.forEach((b, j) => b.style.height = o.hs[j] * eo(P(t, .45 + j * .07, .85 + j * .07)) + '%'); o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur); } });

def({ id: 'mg-13', cat: 'motion', name: 'دايرة وسهم بالإيد', use: 'تشاور على حاجة في الشاشة: رقم، أو زرار، أو سطر. غيّر مكانها بـ x وy.', dur: 2.2, blend: 'alpha',
  params: { x: 540, y: 900, rx: 300, ry: 130 },
  init(r, p) { let d = ''; for (let i = 0; i <= 64; i++) { const a = -Math.PI * .55 + i / 64 * Math.PI * 2.15, w = 1 + .05 * Math.sin(i * .7);
      d += (i ? 'L' : 'M') + (p.x + Math.cos(a) * p.rx * w).toFixed(1) + ' ' + (p.y + Math.sin(a) * p.ry * w).toFixed(1); }
    const ax = p.x + p.rx * .55, ay = p.y + p.ry + 260;
    const s = svg(r, `<path id="c" d="${d}" fill="none" stroke="${C.orange}" stroke-width="16" stroke-linecap="round"/>
      <path id="a" d="M${ax + 120} ${ay + 40} Q${ax + 40} ${ay - 60} ${ax - 10} ${p.y + p.ry + 40}" fill="none" stroke="${C.orange}" stroke-width="16" stroke-linecap="round"/>
      <path id="h" d="M${ax - 70} ${p.y + p.ry + 90} L${ax - 10} ${p.y + p.ry + 40} L${ax + 50} ${p.y + p.ry + 100}" fill="none" stroke="${C.orange}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`);
    return { s, c: s.querySelector('#c'), a: s.querySelector('#a'), h: s.querySelector('#h') }; },
  frame(o, t) { draw(o.c, eio(P(t, 0, .55))); draw(o.a, eo(P(t, .5, .8))); draw(o.h, eo(P(t, .75, .95))); o.s.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-14', cat: 'motion', name: 'لوجو لوجيكا', use: 'نهاية أي فيديو: اللوجو والأقواس و«متأمّن من جوّا».', dur: 2.8, blend: 'alpha',
  params: { tag: 'متأمّن من جوّا' },
  init(r, p) { const s = svg(r, `<path id="l" d="${BRACE_L}" transform="translate(140 640)"/><path id="r" d="${BRACE_R}" transform="translate(940 640)"/>`);
    s.querySelectorAll('path').forEach(e => { e.setAttribute('fill', 'none'); e.setAttribute('stroke', C.cyan2); e.setAttribute('stroke-width', 16); e.setAttribute('stroke-linecap', 'round'); e.style.filter = glow('rgba(0,204,242,.85)'); });
    const img = el('img', 'position:absolute;left:50%;top:700px;width:520px;margin-left:-260px', r); img.src = window.LOGIKA_LOGO || '';
    const tag = el('div', `position:absolute;left:0;right:0;top:1120px;text-align:center;font:700 64px ${F.ar};color:${C.cyan2};direction:rtl`, r, p.tag + ' 🔒');
    return { s, l: s.querySelector('#l'), r: s.querySelector('#r'), img, tag }; },
  frame(o, t) { const a = eio(P(t, 0, .7)); draw(o.l, a); draw(o.r, a); const k = spring(P(t, .35, .9), 9);
    o.img.style.transform = `scale(${L(.5, 1, k)})`; o.img.style.opacity = Math.min(1, k * 2); const g = P(t, .8, 1.1); o.tag.style.opacity = g; o.tag.style.transform = `translateY(${(1 - eo(g)) * 24}px)`;
    const op = outFade(t, this.dur, .3); [o.s, o.img, o.tag].forEach(e => e.style.filter = `opacity(${op})`); } });

def({ id: 'mg-15', cat: 'motion', name: 'تحذير بيتمنع', use: 'كارت أحمر «محاولة دخول» بيتقلب لـ «اتمنعت ✓». لأي مشهد أمان.', dur: 2.6, blend: 'alpha',
  params: { a: 'محاولة دخول من جهاز غريب', a2: 'بيحاول يفتح الخزنة', b: 'اتمنعت ✓', b2: 'محدش يدخل غير اللي ليه حق' },
  init(r, p) { const wrap = el('div', 'position:absolute;left:80px;right:80px;top:820px;perspective:1600px', r);
    const c = el('div', `display:flex;align-items:center;gap:30px;padding:40px 44px;border-radius:40px;direction:rtl;font:400 40px ${F.ar};transform-style:preserve-3d;box-shadow:0 30px 70px rgba(0,0,0,.4)`, wrap);
    const ic = el('div', `width:100px;height:100px;border-radius:28px;flex:none;display:flex;align-items:center;justify-content:center;font:700 58px ${F.num};color:#fff`, c);
    const tx = el('div', 'flex:1', c); const h = el('b', 'display:block;font-weight:700;font-size:50px', tx), s2 = el('div', 'margin-top:4px', tx);
    return { c, ic, h, s2, p }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9), flip = P(t, 1.0, 1.35), blocked = flip >= .5;
    o.c.style.background = blocked ? '#FFFFFF' : '#FFE9E7'; o.c.style.color = blocked ? C.navy : '#7A1010'; o.c.style.border = `4px solid ${blocked ? 'rgba(0,170,210,.6)' : 'rgba(255,69,58,.6)'}`;
    o.ic.style.background = blocked ? C.navy : C.red; o.ic.textContent = blocked ? '🔒' : '!'; o.h.textContent = blocked ? o.p.b : o.p.a; o.s2.textContent = blocked ? o.p.b2 : o.p.a2;
    const sh = !blocked && t > .45 && t < 1.0 ? Math.sin(t * 70) * 6 : 0;
    o.c.style.transform = `translateY(${(1 - k) * -200}px) translateX(${sh}px) rotateX(${Math.sin(flip * Math.PI) * 90 * (flip < .5 ? 1 : -1)}deg) scale(${blocked ? 1 + .05 * Math.sin(Math.PI * P(t, 1.35, 1.6)) : 1})`;
    o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur); } });

/* ============================== انتقالات ============================== */
// كل انتقال بيغطي الشاشة كلها في نصه: حطه بحيث نصه ييجي على القطعة.
function panel(r, css) { return el('div', 'position:absolute;' + css, r); }
def({ id: 'tr-01', cat: 'transition', name: 'سحبة يمين لشمال', use: 'نقلة سريعة لمشهد تاني. الشاشة كلها متغطية في نصها بالظبط.', dur: .8, blend: 'alpha',
  init(r) { const p = panel(r, `top:-100px;bottom:-100px;width:1700px;background:${C.navy};filter:blur(10px)`);
    const lines = [...Array(14)].map((_, i) => panel(r, `left:0;height:${6 + rnd(i) * 18}px;top:${rnd(i * 3) * 1920}px;width:${300 + rnd(i * 5) * 600}px;background:${i % 3 ? 'rgba(255,255,255,.55)' : C.cyan2};border-radius:20px;filter:blur(3px)`));
    return { p, lines }; },
  frame(o, t) { const x = eio(P(t, 0, this.dur)); o.p.style.left = L(1100, -1800, x) + 'px';
    o.lines.forEach((l, i) => { const lx = L(1300 + rnd(i * 7) * 400, -1200 - rnd(i * 9) * 300, eio(P(t, .02 * i % .2, this.dur))); l.style.transform = `translateX(${lx}px)`; }); } });

def({ id: 'tr-02', cat: 'transition', name: 'سحبة لفوق', use: 'نقلة لمشهد تاني بإحساس «اللي بعده». الشاشة متغطية في نصها.', dur: .8, blend: 'alpha',
  init(r) { const p = panel(r, `left:-100px;right:-100px;height:2800px;background:${C.navy};filter:blur(10px)`);
    const lines = [...Array(10)].map((_, i) => panel(r, `top:0;width:${6 + rnd(i) * 16}px;left:${rnd(i * 3) * 1080}px;height:${400 + rnd(i * 5) * 700}px;background:${i % 3 ? 'rgba(255,255,255,.5)' : C.cyan2};border-radius:20px;filter:blur(3px)`));
    return { p, lines }; },
  frame(o, t) { const x = eio(P(t, 0, this.dur)); o.p.style.top = L(2000, -2900, x) + 'px';
    o.lines.forEach((l, i) => l.style.transform = `translateY(${L(2200 + rnd(i) * 400, -1400, x)}px)`); } });

def({ id: 'tr-03', cat: 'transition', name: 'دايرة بتفتح', use: 'دايرة سماوي بتكبر تغطي الشاشة، وبعدين تفتح على المشهد الجاي.', dur: 1.0, blend: 'alpha',
  init(r) { const a = panel(r, `inset:0;background:${C.cyan}`); return { a }; },
  frame(o, t) { const g = eio(P(t, 0, .45)), h = eio(P(t, .5, 1));
    if (t < .5) { o.a.style.clipPath = `circle(${g * 120}% at 50% 50%)`; o.a.style.webkitMaskImage = 'none'; o.a.style.maskImage = 'none'; }
    else { o.a.style.clipPath = 'none'; const m = `radial-gradient(circle at 50% 50%, transparent ${h * 115}%, #000 ${h * 115 + .5}%)`; o.a.style.webkitMaskImage = m; o.a.style.maskImage = m; } } });

def({ id: 'tr-04', cat: 'transition', name: 'قفلة الأقواس', use: 'انتقال بتوقيع لوجيكا: نصين بيقفلوا بقوسين في النص، وبعدين يفتحوا.', dur: 1.0, blend: 'alpha',
  init(r) { const mk = side => { const p = panel(r, `top:0;bottom:0;width:560px;background:${C.navy};${side}:0`);
      const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 200 640'); s.style.cssText = `position:absolute;top:640px;${side === 'left' ? 'right:-60px' : 'left:-60px'};width:200px;height:640px;overflow:visible`;
      s.innerHTML = `<path d="${side === 'left' ? 'M60 0 C6 0 -10 24 -10 80 L-10 240 C-10 290 -26 312 -56 320 C-26 328 -10 350 -10 400 L-10 560 C-10 616 6 640 60 640' : 'M140 0 C194 0 210 24 210 80 L210 240 C210 290 226 312 256 320 C226 328 210 350 210 400 L210 560 C210 616 194 640 140 640'}" fill="none" stroke="${C.cyan2}" stroke-width="16" stroke-linecap="round" style="filter:drop-shadow(0 0 16px rgba(0,204,242,.9))"/>`;
      p.appendChild(s); return p; };
    return { l: mk('left'), r: mk('right') }; },
  frame(o, t) { const c = t < .5 ? eio(P(t, 0, .4)) : 1 - eio(P(t, .55, 1)); o.l.style.transform = `translateX(${L(-620, 0, c)}px)`; o.r.style.transform = `translateX(${L(620, 0, c)}px)`; } });

def({ id: 'tr-05', cat: 'transition', name: 'فلاش أبيض', use: 'صدمة أو تحوّل مفاجئ: من المشكلة للحل. قصير جداً.', dur: .5, blend: 'alpha',
  init(r) { return { a: panel(r, 'inset:0;background:#fff') }; },
  frame(o, t) { o.a.style.opacity = t < .07 ? P(t, 0, .07) : 1 - eo(P(t, .07, this.dur)); } });

def({ id: 'tr-06', cat: 'transition', name: 'جليتش', use: 'للأمان والاختراق بس: الشاشة بتتكسر لحظة. متستخدموش في أي حتة تانية.', dur: .6, blend: 'alpha',
  init(r) { const bars = [...Array(26)].map(() => panel(r, 'left:0;right:0;mix-blend-mode:normal')); return { bars }; },
  frame(o, t) { const f = Math.floor(t * 30), e = Math.sin(Math.PI * P(t, 0, this.dur));
    o.bars.forEach((b, i) => { const on = rnd(f * 31 + i) < e * .8; b.style.display = on ? 'block' : 'none'; if (!on) return;
      const h = 8 + rnd(f * 7 + i) * 120; b.style.top = rnd(f * 13 + i * 3) * 1920 + 'px'; b.style.height = h + 'px';
      const k = rnd(f + i * 5); b.style.background = k < .35 ? 'rgba(0,204,242,.85)' : k < .6 ? 'rgba(255,0,80,.7)' : k < .8 ? 'rgba(255,255,255,.85)' : 'rgba(7,26,51,.9)';
      b.style.transform = `translateX(${(rnd(f * 3 + i) - .5) * 300}px)`; }); } });

def({ id: 'tr-07', cat: 'transition', name: 'شرايط مايلة', use: 'تلات شرايط بألوان البراند بيعدّوا ورا بعض. نقلة بين جزئين في الفيديو.', dur: 1.0, blend: 'alpha',
  init(r) { const bars = [C.cyan, C.navy, '#FFFFFF'].map(c => panel(r, `top:-600px;bottom:-600px;width:1400px;background:${c};transform-origin:center`)); return { bars }; },
  frame(o, t) { o.bars.forEach((b, i) => { const x = eio(P(t, i * .1, .7 + i * .1)); b.style.left = '-160px'; b.style.transform = `rotate(-20deg) translateX(${L(1700, -1900, x)}px)`; }); } });

def({ id: 'tr-08', cat: 'transition', name: 'زوم سرعة', use: 'دخول جوّه حاجة بسرعة: خطوط بتطلع من النص وفلاش.', dur: .7, blend: 'alpha',
  init(r) { const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; c.style.cssText = 'position:absolute;inset:0'; r.appendChild(c); return { c, x: c.getContext('2d') }; },
  frame(o, t) { const x = o.x, e = Math.sin(Math.PI * P(t, 0, this.dur)); x.clearRect(0, 0, 1080, 1920);
    for (let i = 0; i < 90; i++) { const a = rnd(i) * Math.PI * 2, r0 = L(900, 120, eo(P(t, 0, .4))) * (.4 + rnd(i * 3)), len = 300 + rnd(i * 7) * 700;
      x.strokeStyle = i % 4 ? `rgba(255,255,255,${.7 * e})` : `rgba(63,214,245,${.8 * e})`; x.lineWidth = 3 + rnd(i * 5) * 8; x.beginPath();
      x.moveTo(540 + Math.cos(a) * r0, 960 + Math.sin(a) * r0); x.lineTo(540 + Math.cos(a) * (r0 + len), 960 + Math.sin(a) * (r0 + len)); x.stroke(); }
    const fl = Math.max(0, 1 - Math.abs(t - .35) / .12); x.fillStyle = `rgba(255,255,255,${fl})`; x.fillRect(0, 0, 1080, 1920); } });

def({ id: 'tr-09', cat: 'transition', name: 'مربعات', use: 'مربعات بتقلب ورا بعض وتغطي الشاشة. نقلة «تقنية» هادية.', dur: 1.0, blend: 'alpha',
  init(r) { const t = []; for (let y = 0; y < 16; y++) for (let x = 0; x < 9; x++) t.push(panel(r, `left:${x * 120}px;top:${y * 120}px;width:121px;height:121px;background:${C.navy}`));
    return { t }; },
  frame(o, t) { o.t.forEach((q, i) => { const x = i % 9, y = Math.floor(i / 9), d = (x + y) / 24 * .3;
      const s = t < .5 ? eo(P(t, d, d + .2)) : 1 - eo(P(t, .5 + d, .7 + d)); q.style.transform = `scale(${s})`; q.style.background = (x + y) % 7 === 0 ? C.cyan : C.navy; }); } });

def({ id: 'tr-10', cat: 'transition', name: 'شاتر', use: 'نصين بيقفلوا من فوق وتحت مع خط سماوي، ويفتحوا على المشهد الجاي.', dur: .9, blend: 'alpha',
  init(r) { const a = panel(r, `left:0;right:0;top:0;height:960px;background:${C.navy};border-bottom:6px solid ${C.cyan2}`), b = panel(r, `left:0;right:0;bottom:0;height:960px;background:${C.navy};border-top:6px solid ${C.cyan2}`);
    return { a, b }; },
  frame(o, t) { const c = t < .45 ? eio(P(t, 0, .4)) : 1 - eio(P(t, .5, .9)); o.a.style.transform = `translateY(${(1 - c) * -100}%)`; o.b.style.transform = `translateY(${(1 - c) * 100}%)`; } });

/* =============================== إيفكتات =============================== */
function canvas(r) { const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; c.style.cssText = 'position:absolute;inset:0'; r.appendChild(c); return { c, x: c.getContext('2d') }; }
def({ id: 'fx-01', cat: 'overlay', name: 'حبيبات فيلم', use: 'فوق الفيديو كله بـ Overlay، بنسبة ٢٠–٤٠٪. بتخلّي الصورة أقل «ديجيتال».', dur: 3.0, blend: 'overlay', bg: '#808080',
  init(r) { const o = canvas(r); o.img = o.x.createImageData(540, 960); o.small = document.createElement('canvas'); o.small.width = 540; o.small.height = 960; return o; },
  frame(o, t) { const f = Math.floor(t * 30), d = o.img.data; let s = f * 9973 + 1;
    for (let i = 0; i < d.length; i += 4) { s = (s * 16807) % 2147483647; const v = 128 + ((s % 1000) / 1000 - .5) * 120; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    o.small.getContext('2d').putImageData(o.img, 0, 0); o.x.drawImage(o.small, 0, 0, 1080, 1920); } });

def({ id: 'fx-02', cat: 'overlay', name: 'أطراف غامقة', use: 'فوق الفيديو كله: الأطراف بتغمق، فالعين تروح للنص.', dur: 3.0, blend: 'alpha',
  init(r) { return { v: panel(r, 'inset:0;background:radial-gradient(ellipse 75% 65% at 50% 50%,transparent 50%,rgba(0,0,0,.75) 100%)') }; },
  frame(o, t) { o.v.style.opacity = .9 + .1 * Math.sin(t * 2); } });

function leak(r, cols) { const bl = cols.map(c => panel(r, `width:1300px;height:1300px;border-radius:50%;background:radial-gradient(circle,${c},transparent 62%);filter:blur(30px)`)); return { bl }; }
def({ id: 'fx-03', cat: 'overlay', name: 'ضوء دافي', use: 'بـ Screen فوق مشهد حلو أو نهاية سعيدة. قليل.', dur: 3.0, blend: 'screen', bg: '#000',
  init(r) { return leak(r, ['rgba(255,150,70,.75)', 'rgba(255,90,60,.55)', 'rgba(255,200,120,.5)']); },
  frame(o, t) { o.bl.forEach((b, i) => { b.style.left = (-500 + 900 * ((t / 3 + i * .37) % 1.4) - 200) + 'px'; b.style.top = (200 + i * 520 + Math.sin(t * 1.5 + i) * 120) + 'px'; b.style.opacity = .6 + .4 * Math.sin(t * 2 + i * 2); }); } });

def({ id: 'fx-04', cat: 'overlay', name: 'ضوء سماوي', use: 'بـ Screen فوق شاشات السيستم. بيدّي إحساس «تكنولوجيا».', dur: 3.0, blend: 'screen', bg: '#000',
  init(r) { return leak(r, ['rgba(0,204,242,.7)', 'rgba(63,214,245,.5)', 'rgba(10,80,160,.6)']); },
  frame(o, t) { o.bl.forEach((b, i) => { b.style.left = (1000 - 900 * ((t / 3 + i * .41) % 1.4) - 200) + 'px'; b.style.top = (100 + i * 560 + Math.cos(t * 1.3 + i) * 140) + 'px'; b.style.opacity = .55 + .45 * Math.sin(t * 1.8 + i * 2); }); } });

def({ id: 'fx-05', cat: 'overlay', name: 'ترجيع VHS', use: 'رجوع بالزمن: «نرجّع اليوم ده تاني». خطوط ورمز REW.', dur: 2.0, blend: 'alpha',
  init(r) { const lines = panel(r, 'inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 2px,transparent 2px 6px)');
    const band = panel(r, 'left:0;right:0;height:120px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.4),transparent)');
    const osd = panel(r, `left:70px;top:330px;font:700 76px ${F.num};color:#fff;text-shadow:4px 0 rgba(255,0,80,.7),-4px 0 rgba(0,220,255,.7);direction:ltr`); osd.textContent = '◀◀ REW';
    return { lines, band, osd }; },
  frame(o, t) { o.band.style.top = ((t * 2100) % 2200 - 150) + 'px'; o.osd.style.opacity = Math.floor(t * 4) % 2 ? 1 : .55; } });

def({ id: 'fx-06', cat: 'overlay', name: 'خطوط جليتش', use: 'تشويش خفيف ومتقطع فوق مشهد اختراق. أهدى من انتقال الجليتش.', dur: 3.0, blend: 'alpha',
  init(r) { return { bars: [...Array(12)].map(() => panel(r, 'left:0;right:0')) }; },
  frame(o, t) { const f = Math.floor(t * 15), burst = rnd(f) > .6;
    o.bars.forEach((b, i) => { const on = burst && rnd(f * 17 + i) > .45; b.style.display = on ? 'block' : 'none'; if (!on) return;
      b.style.top = rnd(f * 5 + i) * 1920 + 'px'; b.style.height = (3 + rnd(f * 9 + i) * 26) + 'px'; b.style.background = rnd(i + f) > .5 ? 'rgba(0,204,242,.55)' : 'rgba(255,0,80,.45)';
      b.style.transform = `translateX(${(rnd(f * 3 + i) - .5) * 200}px)`; }); } });

def({ id: 'fx-07', cat: 'overlay', name: 'سبوت لايت', use: 'الشاشة بتغمق ويفضل منوّر حتة واحدة: الكارت أو الرقم اللي عاوز العين تبص عليه. غيّر x وy وr.', dur: 2.4, blend: 'alpha',
  params: { x: 540, y: 820, r: 300 },
  init(r, p) { return { s: panel(r, 'inset:0'), p }; },
  frame(o, t) { const { x, y, r } = o.p, k = eo(P(t, 0, .5)), rr = L(1400, r, k) + 8 * Math.sin(t * 3);
    o.s.style.background = `radial-gradient(circle ${rr}px at ${x}px ${y}px,transparent 0,transparent 70%,rgba(3,10,20,${.78 * k}) 100%)`; o.s.style.opacity = outFade(t, this.dur, .3); } });

def({ id: 'fx-08', cat: 'overlay', name: 'نقط ضوء', use: 'نقط ضوء سماوي بتعوم في الخلفية. للعمق ورا الموبايل أو الكلام.', dur: 4.0, blend: 'screen', bg: '#000',
  init(r) { return { b: [...Array(26)].map((_, i) => { const s = 40 + rnd(i) * 160; return { d: panel(r, `width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,rgba(63,214,245,${.25 + rnd(i * 2) * .45}),transparent 70%);filter:blur(${4 + rnd(i * 5) * 14}px)`), s, x: rnd(i * 7) * 1080, y: rnd(i * 11) * 1920, v: 30 + rnd(i * 13) * 90 }; }) }; },
  frame(o, t) { o.b.forEach((k, j) => { k.d.style.left = (k.x - k.s / 2 + Math.sin(t * .8 + j) * 30) + 'px'; k.d.style.top = (((k.y - t * k.v) % 2100 + 2100) % 2100 - 100) + 'px'; }); } });

def({ id: 'fx-09', cat: 'overlay', name: 'الشاشة بتطفي', use: 'شاشة قديمة بتطفي لخط وبعدين سواد: «الموبايل وقع» أو «البطارية خلصت».', dur: 1.0, blend: 'alpha',
  init(r) { const a = panel(r, 'left:0;right:0;top:0;height:960px;background:#000'), b = panel(r, 'left:0;right:0;bottom:0;height:960px;background:#000');
    const ln = panel(r, 'left:0;right:0;top:952px;height:16px;background:#fff;box-shadow:0 0 50px 14px rgba(255,255,255,.85)'); return { a, b, ln }; },
  frame(o, t) { const x = eo(P(t, 0, .3)); o.a.style.transform = `translateY(${(x - 1) * 100}%)`; o.b.style.transform = `translateY(${(1 - x) * 100}%)`;
    const y = P(t, .3, .6); o.ln.style.display = t > .2 && y < 1 ? 'block' : 'none'; o.ln.style.opacity = P(t, .2, .3);
    o.ln.style.transform = `scaleX(${Math.max(.01, 1 - eo(y))}) scaleY(${1 - .5 * y})`; } });

def({ id: 'fx-10', cat: 'overlay', name: 'فقاعات مية', use: 'فقاعات طالعة لفوق: «بيغرق» أو «ضاع وسط الرسايل».', dur: 4.0, blend: 'alpha',
  init(r) { return { b: [...Array(34)].map((_, i) => { const s = 10 + rnd(i) * 46; return { d: panel(r, `width:${s}px;height:${s}px;border-radius:50%;border:${Math.max(2, s / 12)}px solid rgba(220,250,255,.7);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),rgba(255,255,255,.05) 60%)`), s, x: rnd(i * 7) * 1080, ph: rnd(i * 3), v: .25 + rnd(i * 5) * .5 }; }) }; },
  frame(o, t) { o.b.forEach((k, j) => { const y = 1980 - ((t * k.v + k.ph) % 1) * 2100; k.d.style.left = (k.x + Math.sin(t * 2 + j) * 24) + 'px'; k.d.style.top = y + 'px'; }); } });

// helpers shared with elements-v2.js
window.LOGIKA_LIB = { LIB, C, F, H: { el, svg, draw, spring, eo, ei, eio, P, L, cl, rnd, AR, NS, BRACE_L, BRACE_R, glow, outFade, WA, panel, canvas } };
})();
