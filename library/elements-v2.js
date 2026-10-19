/* =====================================================================
   مكتبة لوجيكا · الإضافة التانية: موشن جرافيك، وشاشات سيستم (UI Kit)،
   وانتقالات، وإيفكتات. نفس القواعد بتاعة elements.js: كل حاجة محسوبة من t بس.
   ===================================================================== */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, svg, draw, spring, eo, ei, eio, P, L, cl, rnd, AR, NS, BRACE_L, glow, outFade, WA, panel, canvas } = H;
const def = o => LIB.push(o);
const LOCK = c => `<svg viewBox="0 0 24 24" width="1em" height="1em" style="vertical-align:-.12em"><rect x="5" y="10" width="14" height="11" rx="3" fill="${c}"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="${c}" stroke-width="2.6"/></svg>`;
const pop = (e, k, dy = 60, s0 = .8) => { e.style.opacity = Math.min(1, k * 2); e.style.transform = `translateY(${(1 - k) * dy}px) scale(${L(s0, 1, k)})`; };

/* ============================ موشن جرافيك ============================ */
def({ id: 'mg-16', cat: 'motion', name: 'قايمة بتتعلّم', use: '٣ حاجات بتتعلّم صح ورا بعض: مميزات السيستم، أو خطوات اتعملت.', dur: 2.8, blend: 'alpha',
  params: { items: ['كل عميل في مكانه', 'السيستم بيفكّرك', 'الأسعار متأمّنة'], y: 760 },
  init(r, p) { const w = el('div', `position:absolute;left:110px;right:110px;top:${p.y}px;display:flex;flex-direction:column;gap:34px;direction:rtl`, r);
    const rows = p.items.map(tx => { const row = el('div', `display:flex;align-items:center;gap:30px;padding:30px 36px;border-radius:30px;background:rgba(10,36,68,.92);border:2px solid rgba(0,204,242,.35);font:700 54px ${F.ar};color:#fff;box-shadow:0 20px 50px rgba(0,0,0,.35)`, w);
      const b = el('div', `width:84px;height:84px;flex:none;border-radius:24px;border:5px solid ${C.cyan2};box-sizing:border-box;position:relative`, row);
      const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 84 84'); s.style.cssText = 'position:absolute;left:-5px;top:-5px;width:84px;height:84px;overflow:visible';
      s.innerHTML = `<path d="M22 44 L37 59 L64 28" fill="none" stroke="${C.navy}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`; b.appendChild(s);
      el('span', '', row, tx); return { row, b, k: s.querySelector('path') }; });
    return { w, rows }; },
  frame(o, t) { o.rows.forEach((q, j) => { const a = .1 + j * .55, k = spring(P(t, a, a + .5), 9); q.row.style.opacity = Math.min(1, k * 2); q.row.style.transform = `translateX(${(1 - k) * 160}px)`;
      const c = P(t, a + .3, a + .55); q.b.style.background = c > 0 ? C.cyan2 : 'transparent'; draw(q.k, eo(c)); q.b.style.transform = `scale(${1 + .15 * Math.sin(Math.PI * c)})`; });
    o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-17', cat: 'motion', name: 'رقم بيتشطب', use: 'القديم بيتشطب بالأحمر ويطلع الجديد مكانه. الأرقام هنا مثال: حط أرقام العميل الحقيقية.', dur: 2.4, blend: 'alpha',
  params: { label: 'تقفيل اليوم', from: '٦ ساعات', to: '١٠ دقايق' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:680px;display:flex;flex-direction:column;align-items:center;gap:16px;direction:rtl', r);
    const lb = el('div', `font:600 52px ${F.ar};color:${C.muted}`, w, p.label);
    const a = el('div', `position:relative;font:700 130px ${F.ar};color:#fff;white-space:nowrap`, w, p.from);
    const line = el('i', `position:absolute;left:-24px;right:-24px;top:52%;height:16px;border-radius:8px;background:${C.red};transform-origin:right center;display:block;box-shadow:0 0 24px rgba(255,69,58,.7)`, a);
    const b = el('div', `font:700 170px ${F.ar};color:${C.cyan2};white-space:nowrap;text-shadow:0 0 50px rgba(0,204,242,.5)`, w, p.to);
    return { w, lb, a, line, b }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9); pop(o.a, k, 0, .7); o.lb.style.opacity = P(t, 0, .3);
    const s = eio(P(t, .55, .85)); o.line.style.transform = `rotate(-4deg) scaleX(${s})`; o.a.style.color = s > .9 ? 'rgba(255,255,255,.45)' : '#fff';
    const b = spring(P(t, .95, 1.45), 9); o.b.style.opacity = t < .95 ? 0 : Math.min(1, b * 2); o.b.style.transform = `translateY(${(1 - b) * 60}px) scale(${L(.6, 1, b)})`;
    o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-18', cat: 'motion', name: 'رسايل بتتراكم', use: 'إشعارات بتنزل فوق بعض بسرعة لحد ما الشاشة تتملي، وعداد أحمر. «الرسايل كتير ومحدش ملاحق».', dur: 3.0, blend: 'alpha',
  params: { msgs: ['بكام؟', 'لسه متاح؟', 'فين العنوان؟', 'ممكن صور تاني؟', 'حد يرد بقا 🙏', 'بكام التوصيل؟', 'عاوز أحجز', 'الو؟'], badge: '٩٩+' },
  init(r, p) { const cards = p.msgs.map((m, i) => { const c = el('div', `position:absolute;left:60px;right:60px;top:0;display:flex;gap:24px;align-items:center;padding:26px 30px;border-radius:40px;direction:rtl;background:rgba(30,36,48,.95);box-shadow:0 24px 60px rgba(0,0,0,.45);color:#fff;font:400 40px ${F.ar};transform-origin:center top`, r);
      el('div', `width:84px;height:84px;border-radius:22px;background:${C.wa};flex:none;padding:14px;box-sizing:border-box`, c, WA);
      el('div', 'flex:1;min-width:0', c, `<div style="display:flex;justify-content:space-between;color:#AEB4BE;font-size:30px"><b style="color:#fff;font-weight:600">عميل ${AR(i + 1)}</b><span>الآن</span></div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m}</div>`); return c; });
    const bd = el('div', `position:absolute;left:50%;top:1150px;height:170px;padding:0 50px;transform:translateX(-50%);border-radius:90px;background:${C.red};color:#fff;font:700 96px ${F.ar};display:flex;align-items:center;justify-content:center;box-shadow:0 10px 50px rgba(255,69,58,.6);z-index:20;white-space:nowrap`, r, p.badge);
    return { cards, bd }; },
  frame(o, t) { const gap = .26, n = o.cards.length, at = i => .05 + i * gap;
    o.cards.forEach((c, i) => { const k = spring(P(t, at(i), at(i) + .5), 8); let after = 0; for (let j = i + 1; j < n; j++) after += eo(P(t, at(j), at(j) + .35));
      c.style.zIndex = 1 + i; c.style.opacity = t < at(i) ? 0 : Math.min(1, k * 2) * cl(5.5 - after);
      c.style.transform = `translateY(${(1 - k) * -300 + 120 + after * 170}px) scale(${L(.9, 1, k) - after * .025})`; });
    const b = spring(P(t, at(n) - .1, at(n) + .3), 10); o.bd.style.opacity = t > at(n) - .1 ? 1 : 0; o.bd.style.transform = `translateX(-50%) scale(${b})`;
    const op = outFade(t, this.dur); [...o.cards, o.bd].forEach(c => c.style.filter = `opacity(${op})`); } });

def({ id: 'mg-19', cat: 'motion', name: 'شريط تحميل', use: '«بيتحفظ…» لحد ١٠٠٪، وبعدين «اتحفظ ✓» بالأخضر. لأي حاجة السيستم بيعملها لوحده.', dur: 2.6, blend: 'alpha',
  params: { a: 'بيتحفظ…', b: 'اتحفظ ✓', y: 880 },
  init(r, p) { const w = el('div', `position:absolute;left:140px;right:140px;top:${p.y}px;direction:rtl;padding:40px 46px;border-radius:40px;background:rgba(10,36,68,.94);border:2px solid rgba(0,204,242,.4);box-shadow:0 30px 70px rgba(0,0,0,.45)`, r);
    const top = el('div', `display:flex;justify-content:space-between;align-items:baseline;font:700 52px ${F.ar};color:#fff`, w); const lb = el('span', '', top, p.a), pc = el('span', `font:700 52px ${F.num};color:${C.cyan2};direction:ltr`, top);
    const tr = el('div', 'margin-top:26px;height:30px;border-radius:15px;background:rgba(255,255,255,.12);overflow:hidden', w); const fill = el('div', 'height:100%;width:0;border-radius:15px', tr);
    return { w, lb, pc, fill, p }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9); o.w.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    const x = P(t, .3, 1.6), v = x < .6 ? eo(x / .6) * .7 : .7 + .3 * eio((x - .6) / .4), done = t > 1.65; o.fill.style.width = v * 100 + '%';
    o.pc.textContent = Math.round(v * 100) + '%'; o.lb.textContent = done ? o.p.b : o.p.a; o.lb.style.color = done ? C.green : '#fff'; o.pc.style.color = done ? C.green : C.cyan2;
    o.fill.style.background = done ? C.green : `linear-gradient(270deg,${C.cyan2},${C.cyan})`;
    o.w.style.transform = `scale(${L(.85, 1, k) + .04 * Math.sin(Math.PI * P(t, 1.65, 1.9))})`; } });

def({ id: 'mg-20', cat: 'motion', name: 'كلام بيتكتب', use: 'جملة بتتكتب حرف حرف ومعاها مؤشر بيرمش: سؤال الهوك، أو «إنت كمان كده؟».', dur: 2.6, blend: 'alpha',
  params: { text: 'إنت كمان بتقفل اليوم\nمن دفتر؟', y: 820 },
  init(r, p) { const w = el('div', `position:absolute;left:80px;right:80px;top:${p.y}px;text-align:center;direction:rtl;font:700 96px/1.35 ${F.ar};color:#fff;white-space:pre-line;text-shadow:0 6px 30px rgba(0,0,0,.5)`, r);
    const tx = el('span', '', w), cur = el('i', `display:inline-block;width:9px;height:100px;margin-right:8px;vertical-align:-16px;background:${C.cyan2}`, w); return { w, tx, cur, ch: [...p.text] }; },
  frame(o, t) { const n = o.ch.length, k = Math.floor(cl(P(t, .1, 1.6)) * n); o.tx.textContent = o.ch.slice(0, k).join('');
    o.cur.style.opacity = k < n || Math.floor(t * 3) % 2 === 0 ? 1 : 0; o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-21', cat: 'motion', name: 'ماركر ورا الكلمة', use: 'ماركر سماوي بيتمسح ورا الكلمة المهمة في الجملة. أهدى من الكلمة الكبيرة، وينفع أكتر من مرة.', dur: 2.2, blend: 'alpha',
  params: { pre: 'العميل ده', key: 'كان بتاعك', y: 880 },
  init(r, p) { const w = el('div', `position:absolute;left:60px;right:60px;top:${p.y}px;text-align:center;direction:rtl;font:700 100px/1.4 ${F.ar};color:#fff;isolation:isolate;text-shadow:0 4px 24px rgba(0,0,0,.35)`, r);
    el('span', '', w, p.pre + ' '); const k = el('span', 'position:relative;display:inline-block;padding:0 16px', w);
    const m = el('i', `position:absolute;left:0;right:0;bottom:14px;height:54%;background:${C.cyan};border-radius:12px;transform-origin:right center;display:block;z-index:-1`, k);
    const kt = el('span', 'position:relative', k, p.key); return { w, m, kt }; },
  frame(o, t) { const x = P(t, 0, .35); o.w.style.opacity = Math.min(1, x * 2) * outFade(t, this.dur); o.w.style.transform = `translateY(${(1 - eo(x)) * 30}px)`;
    const s = eio(P(t, .45, .85)); o.m.style.transform = `skewX(-8deg) scaleX(${s})`; o.kt.style.color = s > .5 ? C.navy : '#fff'; o.kt.style.textShadow = s > .5 ? 'none' : ''; } });

def({ id: 'mg-22', cat: 'motion', name: 'قبل وبعد', use: 'عمودين: «قبل» بالأحمر و«بعد» بالسماوي، والسطور بتطلع واحد واحد. أوضح طريقة تشرح الفرق.', dur: 3.0, blend: 'alpha',
  params: { a: 'قبل', b: 'بعد', rows: [['دفتر وورق', 'سيستم واحد'], ['٦ ساعات', '١٠ دقايق'], ['مين أخد كام؟', 'كله متسجّل']] },
  init(r, p) { const w = el('div', 'position:absolute;left:60px;right:60px;top:620px;display:grid;grid-template-columns:1fr 1fr;gap:24px;direction:rtl', r);
    const head = (tx, c) => el('div', `text-align:center;font:700 64px ${F.ar};color:#fff;padding:20px;border-radius:28px;background:${c}`, w, tx);
    const hs = [head(p.a, 'rgba(255,69,58,.92)'), head(p.b, 'rgba(0,170,210,.95)')];
    const cells = p.rows.map(([x, y]) => [el('div', `display:flex;align-items:center;gap:16px;padding:26px 28px;border-radius:24px;background:rgba(48,14,18,.9);color:#FFD6D3;font:600 44px ${F.ar}`, w, `<b style="color:${C.red}">✕</b>${x}`),
      el('div', `display:flex;align-items:center;gap:16px;padding:26px 28px;border-radius:24px;background:rgba(10,36,68,.94);color:#fff;font:600 44px ${F.ar}`, w, `<b style="color:${C.cyan2}">✓</b>${y}`)]);
    return { w, hs, cells }; },
  frame(o, t) { o.hs.forEach((h, i) => { const k = spring(P(t, i * .12, i * .12 + .45), 9); h.style.opacity = Math.min(1, k * 2); h.style.transform = `translateY(${(1 - k) * -80}px)`; });
    o.cells.forEach(([a, b], j) => { const ta = .45 + j * .45, ka = spring(P(t, ta, ta + .4), 9), kb = spring(P(t, ta + .18, ta + .58), 9);
      a.style.opacity = Math.min(1, ka * 2); a.style.transform = `translateX(${(1 - ka) * 80}px)`; b.style.opacity = Math.min(1, kb * 2); b.style.transform = `translateX(${(1 - kb) * -80}px)`; });
    o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-23', cat: 'motion', name: 'ساعة بتلف', use: 'العقارب بتلف بسرعة لحد ساعة معيّنة: «١١:٤٨ بالليل ولسه بيقفل الحسابات».', dur: 2.4, blend: 'alpha',
  params: { h: 11, m: 48, label: '١١:٤٨ بالليل' },
  init(r, p) { const ticks = [...Array(12)].map((_, i) => `<line x1="0" y1="-195" x2="0" y2="${i % 3 ? -175 : -160}" stroke="${i % 3 ? C.muted : '#fff'}" stroke-width="${i % 3 ? 6 : 11}" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('');
    const s = svg(r, `<g id="g"><circle r="235" fill="rgba(10,36,68,.95)" stroke="${C.cyan2}" stroke-width="12"/>${ticks}
      <line id="hh" x1="0" y1="20" x2="0" y2="-110" stroke="#fff" stroke-width="18" stroke-linecap="round"/><line id="mm" x1="0" y1="26" x2="0" y2="-165" stroke="${C.cyan2}" stroke-width="11" stroke-linecap="round"/><circle r="16" fill="#fff"/></g>`);
    s.querySelector('#g').style.filter = 'drop-shadow(0 30px 60px rgba(0,0,0,.45))';
    const lb = el('div', `position:absolute;left:0;right:0;top:1150px;text-align:center;font:700 84px ${F.ar};color:#fff;direction:rtl;text-shadow:0 4px 24px rgba(0,0,0,.5)`, r, p.label);
    return { s, g: s.querySelector('#g'), hh: s.querySelector('#hh'), mm: s.querySelector('#mm'), lb, p }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9); o.g.setAttribute('transform', `translate(540 860) scale(${L(.5, 1, k)})`);
    const end = o.p.h * 60 + o.p.m, mins = L(end - 1440, end, eo(P(t, .2, 1.5))); o.mm.setAttribute('transform', `rotate(${mins * 6})`); o.hh.setAttribute('transform', `rotate(${mins * .5})`);
    const q = P(t, 1.4, 1.7), op = outFade(t, this.dur); o.lb.style.opacity = q * op; o.lb.style.transform = `translateY(${(1 - eo(q)) * 24}px)`; o.s.style.opacity = Math.min(1, k * 2) * op; } });

def({ id: 'mg-24', cat: 'motion', name: 'بطارية بتخلص', use: 'بطارية بتنزل لـ ٣٪ وتنوّر أحمر: «وكل الشغل على موبايل واحد».', dur: 2.4, blend: 'alpha',
  params: { to: 3 },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:760px;display:flex;flex-direction:column;align-items:center;gap:40px', r);
    const b = el('div', 'position:relative;width:500px;height:240px;border:16px solid #fff;border-radius:56px;box-sizing:border-box;padding:16px;direction:ltr', w);
    const tip = el('i', 'position:absolute;right:-50px;top:60px;width:30px;height:88px;border-radius:0 14px 14px 0;background:#fff;display:block', b);
    const f = el('div', 'height:100%;border-radius:28px', b), n = el('div', `font:700 130px ${F.num};direction:ltr`, w); return { w, b, tip, f, n, p }; },
  frame(o, t) { const k = spring(P(t, 0, .4), 9), v = L(86, o.p.to, eio(P(t, .3, 1.5))), low = v < 20, blink = t > 1.5 && Math.floor(t * 4) % 2 === 0;
    o.f.style.width = v + '%'; o.f.style.background = v > 50 ? C.green : v > 20 ? '#FFD60A' : C.red; const edge = low && blink ? C.red : '#fff';
    o.b.style.borderColor = edge; o.tip.style.background = edge; o.n.textContent = Math.round(v) + '%'; o.n.style.color = low ? C.red : '#fff';
    o.w.style.transform = `scale(${L(.6, 1, k)})`; o.w.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur); } });

def({ id: 'mg-25', cat: 'motion', name: 'رياكشنز طايرة', use: 'إيموجي بتطلع وتطير لفوق: لحظة فرحة، أو «العميل مبسوط». غيّر الإيموجي من set.', dur: 2.6, blend: 'alpha',
  params: { set: ['❤️', '👍', '🔥', '👏', '😍'], x: 540, y: 1560 },
  init(r, p) { return { p, e: [...Array(22)].map((_, i) => ({ d: el('div', `position:absolute;left:0;top:0;font-size:${70 + rnd(i * 3) * 70}px;line-height:1`, r, p.set[i % p.set.length]), a: i * .075, vx: (rnd(i * 7) - .5) * 520, sw: 20 + rnd(i * 5) * 40 })) }; },
  frame(o, t) { o.e.forEach((q, i) => { const x = P(t, q.a, q.a + 1.4), k = spring(P(t, q.a, q.a + .35), 10);
    q.d.style.opacity = x <= 0 || x >= 1 ? 0 : Math.min(1, x * 6) * (1 - P(x, .7, 1));
    q.d.style.transform = `translate(${o.p.x - 50 + q.vx * eo(x) + Math.sin(x * 9 + i) * q.sw}px,${o.p.y - eo(x) * 1150}px) scale(${L(.2, 1, k)}) rotate(${(rnd(i) - .5) * 40 * x}deg)`; }); } });

def({ id: 'mg-26', cat: 'motion', name: 'تلات خطوات', use: '١ ← ٢ ← ٣ وخط بيوصّلهم: «ابعتلنا، نفهم شغلك، تستلم السيستم». لآخر الفيديو قبل الـ CTA.', dur: 3.0, blend: 'alpha',
  params: { steps: ['ابعتلنا', 'نفهم شغلك', 'تستلم السيستم'], y: 720 },
  init(r, p) { const w = el('div', `position:absolute;left:120px;right:120px;top:${p.y}px;direction:rtl`, r);
    const ln = el('div', `position:absolute;right:66px;top:70px;width:8px;height:0;background:${C.cyan2};border-radius:4px;box-shadow:0 0 20px rgba(0,204,242,.8)`, w);
    const it = p.steps.map((s, i) => { const row = el('div', `position:relative;display:flex;align-items:center;gap:40px;height:140px;margin-bottom:${i < p.steps.length - 1 ? 80 : 0}px`, w);
      const n = el('div', `width:140px;height:140px;flex:none;border-radius:50%;border:8px solid ${C.cyan2};box-sizing:border-box;display:flex;align-items:center;justify-content:center;font:700 66px ${F.num}`, row, String(i + 1));
      const tx = el('div', `font:700 66px ${F.ar};color:#fff;text-shadow:0 4px 24px rgba(0,0,0,.5);white-space:nowrap`, row, s); return { n, tx }; });
    return { w, ln, it, h: (p.steps.length - 1) * 220 }; },
  frame(o, t) { o.it.forEach((q, i) => { const a = .1 + i * .7, k = spring(P(t, a, a + .45), 9), on = t > a + .3; q.n.style.transform = `scale(${k})`;
      q.n.style.background = on ? C.cyan : C.navy; q.n.style.color = on ? C.navy : '#fff'; const x = P(t, a + .15, a + .5); q.tx.style.opacity = x; q.tx.style.transform = `translateX(${(1 - eo(x)) * -50}px)`; });
    o.ln.style.height = o.h * eio(P(t, .4, .1 + (o.it.length - 1) * .7)) + 'px'; o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'mg-27', cat: 'motion', name: 'ستيكر', use: 'ستيكر بيتلزق بلفّة: «جديد» أو «تجربة» أو «ببلاش». حطه في ركن كارت أو جنب الموبايل.', dur: 2.2, blend: 'alpha',
  params: { text: 'جديد', x: 790, y: 560 },
  init(r, p) { const pts = [...Array(32)].map((_, i) => { const a = i / 32 * Math.PI * 2, rr = i % 2 ? 150 : 176; return (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }).join(' ');
    const s = svg(r, `<g id="g"><polygon points="${pts}" fill="${C.cyan}" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><text y="28" text-anchor="middle" font-family='${F.ar}' font-weight="700" font-size="${p.text.length > 5 ? 60 : 84}" fill="${C.navy}">${p.text}</text></g>`);
    s.style.filter = 'drop-shadow(0 18px 30px rgba(0,0,0,.4))'; return { s, g: s.querySelector('#g'), p }; },
  frame(o, t) { const k = spring(P(t, 0, .55), 8), rot = L(-200, -12, eo(P(t, 0, .5))) + Math.sin(t * 2) * 3 * P(t, .6, 1);
    o.g.setAttribute('transform', `translate(${o.p.x} ${o.p.y}) rotate(${rot}) scale(${L(2.4, 1, k)})`); o.s.style.opacity = P(t, 0, .1) * outFade(t, this.dur); } });

def({ id: 'mg-28', cat: 'motion', name: 'كونفيتي', use: 'احتفال بألوان لوجيكا من الركنين: صفقة اتقفلت، أو مشروع اتسلّم. مرة واحدة في الريل.', dur: 2.8, blend: 'alpha',
  init(r) { const cv = canvas(r); cv.p = [...Array(150)].map((_, i) => ({ a: -Math.PI / 2 + (rnd(i) - .5) * 1.4, v: 900 + rnd(i * 3) * 1400, w: 14 + rnd(i * 5) * 18, h: 8 + rnd(i * 7) * 14,
    c: [C.cyan, C.cyan2, '#FFFFFF', '#1E5FA8', '#FFD60A'][i % 5], sp: (rnd(i * 11) - .5) * 20, side: i % 2 })); return cv; },
  frame(o, t) { const x = o.x, op = outFade(t, this.dur, .5); x.clearRect(0, 0, 1080, 1920);
    o.p.forEach((q, i) => { const tt = Math.max(0, t - .02 * (i % 10)); if (tt <= 0) return; const ox = q.side ? 60 : 1020, a = q.side ? q.a + .45 : q.a - .45, dr = (1 - Math.exp(-2.2 * tt)) / 2.2;
      const px = ox + Math.cos(a) * q.v * dr + Math.sin(tt * 6 + i) * 20, py = 1560 + Math.sin(a) * q.v * dr + 380 * tt * tt;
      x.save(); x.translate(px, py); x.rotate(q.sp * tt); x.scale(1, Math.cos(tt * 8 + i)); x.globalAlpha = op; x.fillStyle = q.c; x.fillRect(-q.w / 2, -q.h / 2, q.w, q.h); x.restore(); }); } });

def({ id: 'mg-29', cat: 'motion', name: 'خط بيطلع', use: 'جراف خطي بيترسم لفوق ونقطة بتنوّر في الآخر: نمو، أو تحسّن، أو «الشهر ده أحسن».', dur: 2.6, blend: 'alpha',
  params: { label: 'المتابعات اللي اتقفلت', pts: [30, 42, 38, 55, 52, 70, 92] },
  init(r, p) { const W = 840, Hh = 520, x0 = 120, y0 = 1300, pts = p.pts.map((v, i) => [x0 + i * W / (p.pts.length - 1), y0 - v / 100 * Hh]);
    const d = pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(0) + ' ' + q[1].toFixed(0)).join(' ');
    const s = svg(r, `<defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#00CCF2" stop-opacity=".45"/><stop offset="1" stop-color="#00CCF2" stop-opacity="0"/></linearGradient><clipPath id="cp"><rect id="cr" x="${x0}" y="0" width="0" height="1920"/></clipPath></defs>
      ${[0, 1, 2, 3].map(i => `<line x1="${x0}" x2="${x0 + W}" y1="${y0 - i * Hh / 3}" y2="${y0 - i * Hh / 3}" stroke="rgba(255,255,255,.16)" stroke-width="3"/>`).join('')}
      <path d="${d} L${x0 + W} ${y0} L${x0} ${y0} Z" fill="url(#gr)" clip-path="url(#cp)"/>
      <path id="ln" d="${d}" fill="none" stroke="${C.cyan2}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><circle id="rg" r="22" fill="none" stroke="${C.cyan2}" stroke-width="5"/><circle id="dt" r="22" fill="#fff" stroke="${C.cyan2}" stroke-width="10"/>`);
    s.querySelector('#ln').style.filter = glow('rgba(0,204,242,.7)');
    const lb = el('div', `position:absolute;left:0;right:0;top:620px;text-align:center;direction:rtl;font:700 62px ${F.ar};color:#fff;text-shadow:0 4px 24px rgba(0,0,0,.5)`, r, p.label);
    return { s, ln: s.querySelector('#ln'), cr: s.querySelector('#cr'), dt: s.querySelector('#dt'), rg: s.querySelector('#rg'), lb, x0 }; },
  frame(o, t) { const x = eio(P(t, .2, 1.5)); draw(o.ln, x); const pt = o.ln.getPointAtLength(o.ln.getTotalLength() * x);
    o.cr.setAttribute('width', Math.max(0, pt.x - o.x0)); [o.dt, o.rg].forEach(c => { c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); }); o.dt.style.opacity = t > .2 ? 1 : 0;
    const q = P(t, 1.5, 2.1); o.rg.setAttribute('r', L(22, 110, eo(q))); o.rg.style.opacity = q > 0 && q < 1 ? 1 - q : 0;
    const op = outFade(t, this.dur); o.s.style.opacity = op; o.lb.style.opacity = P(t, 0, .3) * op; } });

def({ id: 'mg-30', cat: 'motion', name: 'عنوان فصل', use: 'كارت بين أجزاء الفيديو: «١ · المشكلة» و«٢ · الحل». بيقسّم الفيديو الطويل ويريّح العين.', dur: 2.2, blend: 'alpha',
  params: { n: '١', title: 'المشكلة' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:800px;display:flex;align-items:center;justify-content:center;gap:40px;direction:rtl', r);
    const n = el('div', `font:700 230px/1 ${F.ar};color:${C.cyan2};text-shadow:0 0 50px rgba(0,204,242,.5)`, w, p.n);
    const ln = el('i', 'width:10px;height:220px;border-radius:5px;background:#fff;display:block', w);
    const m = el('div', 'overflow:hidden;padding:10px 0', w), tx = el('div', `font:700 130px ${F.ar};color:#fff;white-space:nowrap`, m, p.title); return { w, n, ln, tx }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 9); o.n.style.transform = `translateY(${(1 - k) * -120}px)`; o.n.style.opacity = Math.min(1, k * 2); o.ln.style.transform = `scaleY(${eo(P(t, .15, .45))})`;
    o.tx.style.transform = `translateX(${(1 - eo(P(t, .3, .7))) * 110}%)`; const out = P(t, this.dur - .3, this.dur); o.w.style.opacity = 1 - out; o.w.style.transform = `translateY(${-out * 60}px)`; } });

/* ======================= شاشات سيستم (UI Kit) ======================= */
function phone(parent, w = 540) { const h = w * 2.05, f = el('div', `position:absolute;width:${w}px;height:${h}px;border-radius:${w * .15}px;background:#0B1420;padding:${w * .035}px;box-sizing:border-box;box-shadow:0 0 0 4px #2A3B52 inset,0 60px 120px rgba(0,0,0,.55)`, parent);
  const sc = el('div', `position:relative;width:100%;height:100%;border-radius:${w * .12}px;overflow:hidden;background:#F4F7FB;direction:rtl`, f);
  el('i', `position:absolute;left:50%;top:${w * .035 + 16}px;width:${w * .28}px;height:${w * .075}px;margin-left:-${w * .14}px;border-radius:99px;background:#000;display:block;z-index:3`, f); return { f, sc }; }
function crmList(sc) { // generic demo screen in Logika's app style (made-up names)
  el('div', `background:${C.navy};color:#fff;padding:96px 30px 26px;font:700 40px ${F.ar};display:flex;justify-content:space-between`, sc, `العملاء<span style="font:700 32px ${F.num};color:${C.cyan2}">24</span>`);
  return [['أحمد م.', 'متابعة النهارده', '#E69500'], ['سارة ع.', 'اتفقنا ✓', '#1FA34A'], ['محمود ك.', 'عرض سعر', '#0090C0'], ['منى ر.', 'جديد', '#0090C0'], ['كريم س.', 'اتفقنا ✓', '#1FA34A'], ['ياسمين ف.', 'متابعة بكره', '#E69500'], ['عمر ح.', 'جديد', '#0090C0']]
    .map(([n, s, c]) => el('div', `display:flex;align-items:center;gap:18px;padding:22px 26px;border-bottom:2px solid #E3EAF2;font:600 30px ${F.ar};color:${C.navy}`, sc,
      `<i style="width:64px;height:64px;flex:none;border-radius:50%;background:#DDE8F3;display:flex;align-items:center;justify-content:center;font-style:normal">${n[0]}</i><span style="flex:1">${n}</span><b style="font-size:24px;padding:6px 14px;border-radius:99px;background:${c}1F;color:${c}">${s}</b>`)); }
function cursor(r) { const c = el('div', 'position:absolute;left:0;top:0;width:90px;height:90px;z-index:30;filter:drop-shadow(0 8px 14px rgba(0,0,0,.45))', r,
    '<svg viewBox="0 0 24 24" width="90" height="90"><path d="M5 2.5l13.5 12.2-6.1.6 3.6 7.1-2.8 1.4-3.6-7.2L5 21z" fill="#fff" stroke="#0A2444" stroke-width="1.4" stroke-linejoin="round"/></svg>');
  const rip = el('i', `position:absolute;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:6px solid ${C.cyan2};box-sizing:border-box;display:block;z-index:29;opacity:0`, r); return { c, rip }; }
function moveCursor(cu, x, y, click, op = 1) { cu.c.style.transform = `translate(${x - 19}px,${y - 9}px) scale(${click > 0 && click < 1 ? 1 - .15 * Math.sin(Math.PI * click) : 1})`; cu.c.style.opacity = op;
  const q = cl(click); cu.rip.style.transform = `translate(${x}px,${y}px) scale(${L(.5, 3.2, eo(q))})`; cu.rip.style.opacity = q > 0 && q < 1 ? (1 - q) * op : 0; }
const card = (w, css = '') => el('div', `border-radius:40px;direction:rtl;box-shadow:0 40px 90px rgba(0,0,0,.5);${css}`, w);

def({ id: 'ui-01', cat: 'ui', name: 'موبايل بيلف', use: 'موبايل بيدخل ويلف في 3D وعليه شاشة سيستم. ابعتلي صورة شاشة من أي مشروع وأحطها مكان الشاشة دي.', dur: 3.0, blend: 'alpha',
  init(r) { const st = el('div', 'position:absolute;inset:0;perspective:2200px', r), ph = phone(st, 540); ph.f.style.left = '270px'; ph.f.style.top = '407px';
    const rows = crmList(ph.sc), sh = el('div', 'position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.4),transparent 38%);z-index:4', ph.sc); return { ph, rows, sh }; },
  frame(o, t) { const k = spring(P(t, 0, .8), 6), ry = L(-55, -16, k) + 12 * eio(P(t, .9, 2.7));
    o.ph.f.style.transform = `translateY(${(1 - k) * 900}px) rotateY(${ry}deg) rotateX(${L(25, 6, k)}deg) rotateZ(${L(-8, 0, k)}deg)`;
    o.rows.forEach((q, i) => { const x = P(t, .5 + i * .09, .8 + i * .09); q.style.opacity = x; q.style.transform = `translateX(${(1 - eo(x)) * 60}px)`; });
    o.sh.style.opacity = .5 + .5 * Math.sin(t * 1.2); o.ph.f.style.opacity = outFade(t, this.dur); } });

def({ id: 'ui-02', cat: 'ui', name: 'متصفح بيفتح', use: 'نافذة متصفح بتفتح، والرابط بيتكتب، والصفحة بتحمّل بأرقامها. لأي سيستم ويب أو لوحة تحكم.', dur: 3.0, blend: 'alpha',
  params: { url: 'crm-demo.logika.dev' },
  init(r, p) { const w = el('div', 'position:absolute;left:50px;right:50px;top:500px;height:900px;border-radius:30px;overflow:hidden;background:#F4F7FB;box-shadow:0 60px 120px rgba(0,0,0,.55)', r);
    const bar = el('div', 'height:96px;background:#E3EAF2;display:flex;align-items:center;gap:16px;padding:0 26px;direction:ltr', w); ['#FF5F57', '#FEBC2E', '#28C840'].forEach(c => el('i', `width:24px;height:24px;border-radius:50%;background:${c};display:block`, bar));
    const u = el('div', `flex:1;margin-left:20px;height:58px;border-radius:29px;background:#fff;display:flex;align-items:center;gap:12px;padding:0 26px;font:600 30px ${F.num};color:#41546E`, bar, `<span style="font-size:28px;display:flex">${LOCK('#1FA34A')}</span>`);
    const ut = el('span', '', u), ld = el('div', `height:6px;background:${C.cyan};width:0`, w), pg = el('div', 'padding:30px;direction:rtl;display:flex;flex-direction:column;gap:24px', w);
    el('div', `font:700 46px ${F.ar};color:${C.navy}`, pg, 'لوحة التحكم');
    const tl = el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:20px', pg);
    const tiles = [['عملاء جدد', '38'], ['متابعات', '12'], ['اتقفلت', '9']].map(([a, b]) => el('div', 'background:#fff;border-radius:22px;padding:24px;box-shadow:0 6px 20px rgba(10,36,68,.08)', tl, `<div style="font:600 26px ${F.ar};color:#6A7E98">${a}</div><div style="font:700 64px ${F.num};color:${C.navy}">${b}</div>`));
    const ch = el('div', 'background:#fff;border-radius:22px;padding:26px;height:360px;display:flex;align-items:flex-end;gap:18px;direction:ltr;box-sizing:border-box;box-shadow:0 6px 20px rgba(10,36,68,.08)', pg);
    const hs = [40, 55, 48, 70, 62, 80, 95, 72], bars = hs.map(() => el('i', `flex:1;height:0;border-radius:10px 10px 4px 4px;background:linear-gradient(180deg,${C.cyan2},${C.cyan});display:block`, ch));
    return { w, ut, ld, pg, tiles, bars, hs, p }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.w.style.transform = `scale(${L(.7, 1, k)})`; o.w.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    const u = o.p.url, n = Math.floor(cl(P(t, .35, 1.1)) * u.length); o.ut.textContent = u.slice(0, n) + (t < 1.2 && Math.floor(t * 4) % 2 ? '|' : '');
    const lp = P(t, 1.15, 1.6); o.ld.style.width = lp * 100 + '%'; o.ld.style.opacity = lp < 1 ? 1 : 0; o.pg.style.opacity = P(t, 1.3, 1.5);
    o.tiles.forEach((q, i) => pop(q, spring(P(t, 1.4 + i * .1, 1.8 + i * .1), 9), 40, 1)); o.bars.forEach((b, i) => b.style.height = o.hs[i] * eo(P(t, 1.6 + i * .06, 2.1 + i * .06)) + '%'); } });

def({ id: 'ui-03', cat: 'ui', name: 'دونت تقسيم', use: 'دايرة بتتقسم لنسب: العملاء جايين منين، أو الفلوس راحت فين. غيّر الأسماء والنسب.', dur: 2.8, blend: 'alpha',
  params: { title: 'العملاء جايين منين', parts: [['واتساب', 46, '#00CCF2'], ['فيسبوك', 28, '#5B8CFF'], ['ترشيحات', 18, '#30D158'], ['تاني', 8, '#AFC1D8']] },
  init(r, p) { const c = card(r, `position:absolute;left:110px;right:110px;top:460px;padding:46px;background:linear-gradient(160deg,rgba(23,63,108,.97),rgba(9,32,60,.97));border:3px solid rgba(0,204,242,.5)`);
    el('div', `font:700 50px ${F.ar};color:#fff;text-align:center`, c, p.title); const R = 190, Cf = 2 * Math.PI * R;
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-250 -250 500 500'); s.style.cssText = 'display:block;width:500px;height:500px;margin:20px auto 10px;overflow:visible'; c.appendChild(s);
    let acc = 0; s.innerHTML = `<circle r="${R}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="70"/>` + p.parts.map(([n, v, col]) => { const g = `<circle r="${R}" fill="none" stroke="${col}" stroke-width="70" data-v="${v}" transform="rotate(${-90 + acc * 3.6})"/>`; acc += v; return g; }).join('') +
      `<text id="tc" y="34" text-anchor="middle" font-family='${F.num}' font-weight="700" font-size="100" fill="#fff"></text>`;
    const lg = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:16px 30px;margin-top:10px', c);
    const items = p.parts.map(([n, v, col]) => el('div', `display:flex;align-items:center;gap:14px;font:600 38px ${F.ar};color:#fff`, lg, `<i style="width:28px;height:28px;border-radius:8px;background:${col};display:block"></i><span style="flex:1">${n}</span><b style="font-family:${F.num}">${v}%</b>`));
    return { c, segs: [...s.querySelectorAll('circle[data-v]')], Cf, tc: s.querySelector('#tc'), items, p }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `translateY(${(1 - k) * 160}px) scale(${L(.85, 1, k)})`; o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    o.segs.forEach((g, i) => { const len = o.Cf * g.dataset.v / 100 * eio(P(t, .35 + i * .22, .75 + i * .22)); g.setAttribute('stroke-dasharray', `${Math.max(0, len - 6)} ${o.Cf}`); });
    o.tc.textContent = Math.round(o.p.parts[0][1] * eo(P(t, .35, 1))) + '%'; o.items.forEach((q, i) => q.style.opacity = P(t, .5 + i * .22, .8 + i * .22)); } });

def({ id: 'ui-04', cat: 'ui', name: 'كارت بيتسحب في المسار', use: '٣ أعمدة (جديد · بنتفاوض · اتقفل) والماوس بيسحب كارت عميل لحد «اتقفل». قلب أي ريل CRM.', dur: 3.4, blend: 'alpha',
  params: { cols: ['جديد', 'بنتفاوض', 'اتقفل'], card: 'أحمد م.', sub: 'شقة ٣ أوض' },
  init(r, p) { const w = el('div', 'position:absolute;left:40px;right:40px;top:560px;height:820px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;direction:rtl', r);
    p.cols.forEach((n, i) => { const c = el('div', 'background:rgba(244,247,251,.97);border-radius:30px;padding:24px 18px;display:flex;flex-direction:column;gap:18px;box-shadow:0 30px 60px rgba(0,0,0,.35)', w);
      el('div', `font:700 36px ${F.ar};color:${C.navy};display:flex;justify-content:space-between;align-items:center;height:50px`, c, `${n}<i style="width:22px;height:22px;border-radius:50%;display:block;background:${['#00CCF2', '#FFB020', '#30D158'][i]}"></i>`);
      [...Array(i === 2 ? 1 : 2)].forEach((_, j) => el('div', 'height:120px;border-radius:20px;background:#fff;box-shadow:0 4px 14px rgba(10,36,68,.08);padding:20px;box-sizing:border-box', c,
        `<div style="height:22px;width:${60 + rnd(i * 3 + j) * 30}%;border-radius:11px;background:#DDE6F0"></div><div style="height:18px;width:${40 + rnd(i * 5 + j) * 30}%;border-radius:9px;background:#EBF0F6;margin-top:16px"></div>`)); });
    const cd = el('div', `position:absolute;left:0;top:0;width:300px;height:150px;border-radius:22px;background:#fff;border:4px solid ${C.cyan};box-sizing:border-box;padding:20px 24px;direction:rtl;box-shadow:0 30px 60px rgba(10,36,68,.35);z-index:3`, r,
      `<div style="font:700 36px ${F.ar};color:${C.navy}">${p.card}</div><div style="font:400 28px ${F.ar};color:#6A7E98">${p.sub}</div>`);
    return { w, cd, cu: cursor(r) }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8), op = outFade(t, this.dur); o.w.style.opacity = Math.min(1, k * 2) * op; o.w.style.transform = `translateY(${(1 - k) * 120}px)`;
    const ax = 730, ay = 932, bx = 50, by = 794, lift = P(t, 1.0, 1.2), mv = eio(P(t, 1.2, 2.2)), drop = P(t, 2.2, 2.4), held = lift - drop;
    const cx = L(ax, bx, mv), cy = L(ay, by, mv) - 50 * Math.sin(Math.PI * mv) + (1 - k) * 120;
    o.cd.style.transform = `translate(${cx}px,${cy}px) rotate(${-4 * held}deg) scale(${1 + .06 * held + .05 * Math.sin(Math.PI * P(t, 2.35, 2.6))})`; o.cd.style.opacity = P(t, .3, .5) * op;
    o.cd.style.borderColor = t > 2.35 ? C.green : C.cyan; const ap = eo(P(t, .5, .95));
    moveCursor(o.cu, t < 1 ? L(940, cx + 210, ap) : cx + 210, t < 1 ? L(1650, cy + 80, ap) : cy + 80, P(t, .95, 1.25), P(t, .45, .6) * (1 - P(t, 2.5, 2.8))); } });

def({ id: 'ui-05', cat: 'ui', name: 'فاتورة بتتعمل', use: 'فاتورة بتتملي سطر سطر، والإجمالي بيعد، وبعدين ختم «اتدفعت». لأي سيستم مبيعات أو ERP.', dur: 3.2, blend: 'alpha',
  params: { no: '#1048', lines: [['تركيب تكييف', 1, 3500], ['قطعة غيار', 2, 850], ['زيارة صيانة', 1, 400]], stamp: 'اتدفعت' },
  init(r, p) { const c = card(r, `position:absolute;left:120px;right:120px;top:440px;padding:50px 50px 44px;border-radius:30px;background:#fff;color:${C.navy};font:400 38px ${F.ar}`);
    el('div', 'display:flex;justify-content:space-between;align-items:center;padding-bottom:26px;border-bottom:4px solid #E3EAF2', c, `<b style="font-size:56px">فاتورة</b><span style="font:700 36px ${F.num};color:#6A7E98">${p.no}</span>`);
    const rows = p.lines.map(([n, q, pr]) => el('div', 'display:flex;justify-content:space-between;padding:26px 0;border-bottom:2px dashed #DCE4EE', c, `<span>${n} <span style="color:#6A7E98;font-family:${F.num}">×${q}</span></span><b style="font-family:${F.num}">${(q * pr).toLocaleString('en-US')}</b>`));
    const tot = el('div', `display:flex;justify-content:space-between;align-items:baseline;padding-top:34px;font:700 46px ${F.ar}`, c, '<span>الإجمالي</span>'), tn = el('b', `font:700 80px ${F.num}`, tot);
    const st = el('div', `position:absolute;left:50px;bottom:170px;padding:8px 40px 18px;border:9px solid #1FA34A;border-radius:20px;color:#1FA34A;font:700 92px ${F.ar};white-space:nowrap;background:rgba(255,255,255,.7)`, c, p.stamp);
    return { c, rows, tn, st, sum: p.lines.reduce((a, [, q, pr]) => a + q * pr, 0) }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `translateY(${(1 - k) * 300}px) rotate(${(1 - k) * -6}deg)`; o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    o.rows.forEach((q, i) => { const x = P(t, .45 + i * .3, .7 + i * .3); q.style.opacity = x; q.style.transform = `translateX(${(1 - eo(x)) * -40}px)`; });
    o.tn.textContent = Math.round(o.sum * eo(P(t, 1.3, 2))).toLocaleString('en-US');
    const s = P(t, 2.1, 2.25), sh = t > 2.25 && t < 2.5 ? (1 - P(t, 2.25, 2.5)) * 10 * Math.sin(t * 90) : 0; o.st.style.opacity = t < 2.1 ? 0 : Math.min(1, s * 2); o.st.style.transform = `translateX(${sh}px) rotate(-12deg) scale(${L(2.4, 1, eo(s))})`; } });

def({ id: 'ui-06', cat: 'ui', name: 'إشعار من السيستم', use: 'إشعار من سيستم لوجيكا: «٣ عملاء محتاجين تكلّمهم النهارده». السيستم هو اللي بيفكّرك، مش إنت.', dur: 2.6, blend: 'alpha',
  params: { title: 'تذكير متابعة', body: '٣ عملاء محتاجين تكلّمهم النهارده', y: 160 },
  init(r, p) { const c = el('div', `position:absolute;left:60px;right:60px;top:${p.y}px;display:flex;gap:26px;align-items:center;padding:30px 34px;border-radius:44px;direction:rtl;background:rgba(244,247,251,.97);box-shadow:0 30px 70px rgba(0,0,0,.4);border:3px solid rgba(0,204,242,.55)`, r);
    const ic = el('div', `width:100px;height:100px;border-radius:26px;background:${C.navy};flex:none;display:flex;align-items:center;justify-content:center;font:700 50px ${F.num};color:${C.cyan2};direction:ltr`, c, '{ }');
    el('div', `flex:1;min-width:0;font:400 40px ${F.ar};color:${C.navy}`, c, `<div style="display:flex;justify-content:space-between;color:#6A7E98;font-size:30px"><b style="color:${C.navy};font-weight:700">${p.title}</b><span>الآن</span></div><div>${p.body}</div>`);
    return { c, ic }; },
  frame(o, t) { const k = spring(P(t, 0, .6), 8), out = P(t, this.dur - .3, this.dur); o.c.style.transform = `translateY(${(1 - k) * -360 - eo(out) * 380}px) scale(${L(.9, 1, k)})`; o.c.style.opacity = Math.min(1, k * 2);
    o.ic.style.transform = `rotate(${Math.sin(t * 22) * 10 * P(t, .4, .5) * (1 - P(t, .5, 1.1))}deg)`; } });

def({ id: 'ui-07', cat: 'ui', name: 'سجل مين عمل إيه', use: 'سطور بتنزل: مين غيّر إيه وإمتى، ومحاولة مسح بتتمنع. لمشاهد الأمان: «كل حاجة متسجّلة».', dur: 3.0, blend: 'alpha',
  params: { title: 'سجل النشاط', rows: [['م', 'محمد', 'عدّل سعر أوضة ٢٠٤', '١٠:١٢'], ['س', 'سارة', 'سجّلت دفعة ٣,٥٠٠', '١٠:٤٠'], ['ك', 'كريم', 'حاول يمسح فاتورة', '١١:٠٥', 1], ['ن', 'نهى', 'قفلت اليوم', '١١:٤٨']] },
  init(r, p) { const c = card(r, `position:absolute;left:70px;right:70px;top:560px;padding:36px;background:rgba(10,36,68,.96);border:2px solid rgba(0,204,242,.4)`);
    el('div', `font:700 46px ${F.ar};color:#fff;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center`, c, `${p.title}<span style="color:${C.cyan2};font-size:40px;display:flex">${LOCK(C.cyan2)}</span>`);
    const rows = p.rows.map(([i, n, a, tm, bad]) => el('div', `display:flex;align-items:center;gap:22px;padding:22px 0;border-top:2px solid rgba(255,255,255,.08);font:400 36px ${F.ar};color:#DCE6F2`, c,
      `<i style="width:72px;height:72px;flex:none;border-radius:50%;background:${bad ? C.red : C.cyan};color:${C.navy};display:flex;align-items:center;justify-content:center;font:700 34px ${F.ar};font-style:normal">${i}</i><span style="flex:1"><b style="color:#fff">${n}</b> ${a}${bad ? ` <b style="color:${C.red}">· اتمنع</b>` : ''}</span><span style="color:${C.muted};font-size:30px">${tm}</span>`));
    return { c, rows }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `scale(${L(.85, 1, k)})`; o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    o.rows.forEach((q, i) => { const x = spring(P(t, .4 + i * .35, .8 + i * .35), 9); q.style.opacity = Math.min(1, x * 2); q.style.transform = `translateY(${(1 - x) * -40}px)`; }); } });

def({ id: 'ui-08', cat: 'ui', name: 'ماوس بيدوس', use: 'ماوس بيتحرك ويدوس بموجة سماوي. حطه فوق أي فيديو شاشة، وغيّر x وy لمكان الزرار.', dur: 2.0, blend: 'alpha',
  params: { x: 540, y: 1100 },
  init(r, p) { return { cu: cursor(r), p }; },
  frame(o, t) { const x = eio(P(t, 0, .8)); moveCursor(o.cu, L(o.p.x + 380, o.p.x, x) - Math.sin(x * Math.PI) * 60, L(o.p.y + 520, o.p.y, x), P(t, .85, 1.35), P(t, 0, .15) * outFade(t, this.dur)); } });

def({ id: 'ui-09', cat: 'ui', name: 'زرار بيحمّل', use: 'الماوس بيدوس الزرار، يلف تحميل، ويقلب صح أخضر: «اتبعت» أو «اتحفظ» أو «اتدفع».', dur: 2.4, blend: 'alpha',
  params: { text: 'ابعت العرض', done: 'اتبعت', y: 900 },
  init(r, p) { const w = el('div', `position:absolute;left:0;right:0;top:${p.y}px;display:flex;justify-content:center`, r);
    const b = el('div', `position:relative;height:160px;width:640px;border-radius:80px;color:${C.navy};font:700 60px ${F.ar};display:flex;align-items:center;justify-content:center;direction:rtl;box-shadow:0 24px 60px rgba(0,204,242,.45);overflow:hidden`, w);
    const tx = el('span', 'white-space:nowrap', b, p.text), sp = el('i', `position:absolute;left:50%;top:50%;width:80px;height:80px;margin:-40px 0 0 -40px;border-radius:50%;border:10px solid rgba(10,36,68,.25);border-top-color:${C.navy};box-sizing:border-box;display:block`, b);
    const ok = el('span', 'white-space:nowrap;position:absolute;color:#fff', b, '✓ ' + p.done); return { w, b, tx, sp, ok, cu: cursor(r), p }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9), op = outFade(t, this.dur); o.w.style.opacity = Math.min(1, k * 2) * op;
    const press = P(t, .6, .8), dn = P(t, 1.6, 1.9); o.b.style.width = (t < .8 ? 640 : t < 1.6 ? L(640, 160, eo(P(t, .8, 1))) : L(160, 560, eo(dn))) + 'px';
    o.b.style.transform = `scale(${L(.6, 1, k) * (1 - .06 * Math.sin(Math.PI * press))})`; o.b.style.background = t > 1.6 ? C.green : C.cyan;
    o.tx.style.opacity = 1 - P(t, .8, .9); o.sp.style.opacity = t > .85 && t < 1.6 ? 1 : 0; o.sp.style.transform = `rotate(${t * 720}deg)`; o.ok.style.opacity = dn; o.ok.style.transform = `scale(${L(.5, 1, spring(dn, 10))})`;
    const cy = o.p.y + 80, m = eo(P(t, .1, .6)); moveCursor(o.cu, L(880, 640, m), L(cy + 320, cy + 20, m), P(t, .6, 1), (t < 1.1 ? P(t, .1, .25) : 1 - P(t, 1.1, 1.3)) * op); } });

def({ id: 'ui-10', cat: 'ui', name: 'بحث بيلاقي', use: 'كلمة بتتكتب في خانة البحث والنتايج بتتصفّى لحد ما يفضل اللي بتدوّر عليه: «أي عميل في ثانية».', dur: 3.0, blend: 'alpha',
  params: { q: 'سارة', rows: ['أحمد م. · شقة ٣ أوض', 'سارة ع. · فيلا', 'محمود ك. · محل تجاري', 'سارة ن. · مكتب إداري', 'منى ر. · شاليه'] },
  init(r, p) { const c = card(r, `position:absolute;left:80px;right:80px;top:520px;padding:34px;background:rgba(244,247,251,.98)`);
    const f = el('div', `display:flex;align-items:center;gap:18px;height:110px;padding:0 30px;border-radius:30px;background:#fff;border:4px solid ${C.cyan};font:600 46px ${F.ar};color:${C.navy}`, c,
      `<svg viewBox="0 0 24 24" width="50" height="50"><circle cx="10" cy="10" r="6.5" fill="none" stroke="${C.navy}" stroke-width="2.6"/><path d="M15 15l5 5" stroke="${C.navy}" stroke-width="2.6" stroke-linecap="round"/></svg>`);
    const q = el('span', '', f), ls = el('div', 'margin-top:20px', c);
    const rows = p.rows.map(x => el('div', `overflow:hidden;height:112px;font:600 40px/64px ${F.ar};color:${C.navy}`, ls, `<div style="padding:24px 16px;border-bottom:2px solid #E3EAF2;border-radius:16px">${x}</div>`));
    return { c, q, rows, p }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `translateY(${(1 - k) * 200}px)`; o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    const s = [...o.p.q], n = Math.floor(cl(P(t, .6, 1.3)) * s.length); o.q.textContent = s.slice(0, n).join('') + (Math.floor(t * 3) % 2 ? '|' : '');
    const x = eio(P(t, 1.35, 1.75)); o.rows.forEach(rw => { const hit = rw.textContent.includes(o.p.q), h = hit ? 1 : 1 - x; rw.style.height = h * 112 + 'px'; rw.style.opacity = h;
      rw.firstChild.style.background = hit && t > 1.8 ? 'rgba(0,204,242,.16)' : 'transparent'; }); } });

def({ id: 'ui-11', cat: 'ui', name: 'كود دخول', use: '٤ أرقام بتتكتب في خانات الكود، والقفل بيفتح بالأخضر. دخول آمن لمشهد الأمان.', dur: 2.6, blend: 'alpha',
  params: { code: '4821', label: 'اكتب الكود اللي وصلك' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:660px;display:flex;flex-direction:column;align-items:center;gap:44px;direction:rtl', r);
    const lk = el('div', `width:180px;height:180px;border-radius:50%;border:8px solid ${C.cyan2};display:flex;align-items:center;justify-content:center;box-sizing:border-box`, w);
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '-40 -50 80 100'); s.setAttribute('width', 90); s.setAttribute('height', 112); lk.appendChild(s);
    s.innerHTML = '<rect x="-30" y="-6" width="60" height="46" rx="9" fill="#fff"/><path id="sh" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>';
    el('div', `font:600 48px ${F.ar};color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.5)`, w, p.label);
    const row = el('div', 'display:flex;gap:26px;direction:ltr', w), bx = [...p.code].map(() => el('div', `width:150px;height:180px;border-radius:30px;background:rgba(10,36,68,.94);border:4px solid;display:flex;align-items:center;justify-content:center;font:700 100px ${F.num};color:#fff;box-sizing:border-box`, row));
    return { w, lk, sh: s.querySelector('#sh'), bx, p }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9); o.w.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur); o.w.style.transform = `translateY(${(1 - k) * 80}px)`;
    const ds = [...o.p.code], ok = t > 1.55; o.bx.forEach((b, i) => { const a = .5 + i * .22, on = t >= a; b.textContent = on ? ds[i] : ''; b.style.borderColor = ok ? C.green : on ? C.cyan2 : 'rgba(255,255,255,.25)'; b.style.transform = `scale(${on ? 1 + .12 * Math.sin(Math.PI * P(t, a, a + .15)) : 1})`; });
    const op = eo(P(t, 1.55, 1.8)); o.sh.setAttribute('d', `M-18 -6 V-24 a18 18 0 0 1 36 0 V${L(-6, -22, op)}`); o.sh.setAttribute('transform', `translate(0 ${-14 * op})`);
    o.lk.style.background = ok ? C.green : C.navy; o.lk.style.borderColor = ok ? C.green : C.cyan2; o.lk.style.transform = `scale(${1 + .1 * Math.sin(Math.PI * P(t, 1.55, 1.8))})`; } });

def({ id: 'ui-12', cat: 'ui', name: 'جدول بيتملي', use: 'جدول بيتملي صف صف بحالة ملوّنة لكل سطر: مخزن، أو حجوزات، أو حسابات. «كل حاجة في مكانها».', dur: 2.8, blend: 'alpha',
  params: { head: ['الصنف', 'الكمية', 'الحالة'], rows: [['فلتر مية', '120', 'متاح'], ['كمبروسر', '8', 'قليل'], ['ريموت', '64', 'متاح'], ['خرطوم', '0', 'خلص'], ['مروحة', '35', 'متاح']] },
  init(r, p) { const c = card(r, `position:absolute;left:60px;right:60px;top:580px;border-radius:30px;overflow:hidden;background:#fff;font:600 38px ${F.ar};color:${C.navy}`);
    const g = 'display:grid;grid-template-columns:2fr 1fr 1.2fr;align-items:center;padding:0 34px;height:110px';
    el('div', g + `;background:${C.navy};color:#fff;font-weight:700`, c, p.head.map(h => `<span>${h}</span>`).join(''));
    const st = { متاح: ['#1FA34A', '#E6F9EC'], قليل: ['#C27A00', '#FFF3D6'], خلص: ['#D92D20', '#FFE6E4'] };
    const rows = p.rows.map(([a, b, s], i) => { const [fg, bg] = st[s] || st['متاح']; const e = el('div', g + ';border-top:2px solid #E3EAF2', c, `<span>${a}</span><span style="font-family:${F.num}">${b}</span><span><b style="padding:6px 20px;border-radius:99px;background:${bg};color:${fg};font-size:32px">${s}</b></span>`);
      e.dataset.bg = i % 2 ? '#F7FAFD' : '#FFFFFF'; return e; });
    return { c, rows }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `scale(${L(.85, 1, k)})`; o.c.style.opacity = Math.min(1, k * 2) * outFade(t, this.dur);
    o.rows.forEach((q, i) => { const x = P(t, .4 + i * .22, .7 + i * .22); q.style.opacity = x; q.style.transform = `translateX(${(1 - eo(x)) * 60}px)`; q.style.background = x > 0 && x < 1 ? '#DDF7FD' : q.dataset.bg; }); } });

/* ============================== انتقالات ============================== */
// زي الأولانيين: الشاشة كلها متغطية في نص الانتقال بالظبط.
def({ id: 'tr-11', cat: 'transition', name: 'سحبة لتحت', use: 'عكس السحبة لفوق: رجوع لمشهد قبله، أو نزول لتفصيلة.', dur: .8, blend: 'alpha',
  init(r) { const p = panel(r, `left:-100px;right:-100px;height:2800px;background:${C.navy};filter:blur(10px)`);
    const lines = [...Array(10)].map((_, i) => panel(r, `top:0;width:${6 + rnd(i + 40) * 16}px;left:${rnd(i * 3 + 40) * 1080}px;height:${400 + rnd(i * 5 + 40) * 700}px;background:${i % 3 ? 'rgba(255,255,255,.5)' : C.cyan2};border-radius:20px;filter:blur(3px)`)); return { p, lines }; },
  frame(o, t) { const x = eio(P(t, 0, this.dur)); o.p.style.top = L(-2900, 2000, x) + 'px'; o.lines.forEach((l, i) => l.style.transform = `translateY(${L(-1400 - rnd(i) * 400, 2200, x)}px)`); } });

def({ id: 'tr-12', cat: 'transition', name: 'سحبة شمال ليمين', use: 'عكس tr-01: للرجوع، أو عشان تنوّع الاتجاه في نفس الريل.', dur: .8, blend: 'alpha',
  init(r) { const p = panel(r, `top:-100px;bottom:-100px;width:1700px;background:${C.navy};filter:blur(10px)`);
    const lines = [...Array(14)].map((_, i) => panel(r, `left:0;height:${6 + rnd(i + 60) * 18}px;top:${rnd(i * 3 + 60) * 1920}px;width:${300 + rnd(i * 5 + 60) * 600}px;background:${i % 3 ? 'rgba(255,255,255,.55)' : C.cyan2};border-radius:20px;filter:blur(3px)`)); return { p, lines }; },
  frame(o, t) { const x = eio(P(t, 0, this.dur)); o.p.style.left = L(-1800, 1100, x) + 'px'; o.lines.forEach((l, i) => l.style.transform = `translateX(${L(-1200 - rnd(i * 9) * 300, 1300 + rnd(i * 7) * 400, x)}px)`); } });

def({ id: 'tr-13', cat: 'transition', name: 'دواير ورا بعض', use: 'تلات دواير (سماوي وأبيض وكحلي) بتكبر ورا بعض من النص، وبتفتح بنفس الترتيب.', dur: 1.1, blend: 'alpha',
  init(r) { return { c: [C.cyan, '#FFFFFF', C.navy].map(c => panel(r, `inset:0;background:${c}`)) }; },
  frame(o, t) { o.c.forEach((e, i) => { const g = eio(P(t, i * .08, .38 + i * .08)), h = eio(P(t, .55 + i * .08, .85 + i * .08)), m = `radial-gradient(circle at 50% 50%, transparent ${h * 120}%, #000 ${h * 120 + .5}%)`;
    e.style.clipPath = `circle(${g * 120}% at 50% 50%)`; e.style.webkitMaskImage = h > 0 ? m : 'none'; e.style.maskImage = h > 0 ? m : 'none'; }); } });

def({ id: 'tr-14', cat: 'transition', name: 'معيّن', use: 'معيّن كحلي بحرف سماوي بيكبر من النص، وبيصغر تاني على المشهد الجاي. نقلة نضيفة.', dur: .9, blend: 'alpha',
  init(r) { const b = panel(r, `left:50%;top:50%;width:2400px;height:2400px;margin:-1200px 0 0 -1200px;background:${C.cyan2}`), a = panel(r, `left:50%;top:50%;width:2400px;height:2400px;margin:-1200px 0 0 -1200px;background:${C.navy}`); return { a, b }; },
  frame(o, t) { const c = t < .5 ? eio(P(t, 0, .45)) : 1 - eio(P(t, .5, .9)); o.b.style.transform = `rotate(45deg) scale(${Math.min(1, c * 1.06)})`; o.a.style.transform = `rotate(45deg) scale(${c})`; } });

def({ id: 'tr-15', cat: 'transition', name: 'شرايط أفقية', use: '١٢ شريط بيقفلوا ورا بعض زي الشيش، وبيفتحوا. نقلة بين جزئين.', dur: .9, blend: 'alpha',
  init(r) { return { s: [...Array(12)].map((_, i) => panel(r, `left:0;right:0;top:${i * 160}px;height:161px;background:${i % 4 === 1 ? C.cyan : C.navy}`)) }; },
  frame(o, t) { o.s.forEach((e, i) => { const d = i * .018, c = t < .45 ? eo(P(t, d, .25 + d)) : 1 - eio(P(t, .5 + d, .7 + d)); e.style.transform = `scaleY(${c})`; e.style.transformOrigin = t < .45 ? 'top' : 'bottom'; }); } });

def({ id: 'tr-16', cat: 'transition', name: 'عواميد بتنزل', use: '٦ عواميد بتنزل من فوق ورا بعض وتكمل لتحت. نقلة فيها طاقة.', dur: 1.0, blend: 'alpha',
  init(r) { return { s: [...Array(6)].map((_, i) => panel(r, `top:0;left:${i * 180}px;width:181px;height:1920px;background:${i % 3 === 1 ? C.cyan : C.navy}`)) }; },
  frame(o, t) { o.s.forEach((e, i) => { const d = (i % 2 ? i : 5 - i) * .03, y = t < .5 ? L(-100, 0, eio(P(t, d, .4 + d))) : L(0, 100, eio(P(t, .5 + d, .9 + d))); e.style.transform = `translateY(${y}%)`; }); } });

def({ id: 'tr-17', cat: 'transition', name: 'فقاعة شات بتكبر', use: 'فقاعة رسالة بتكبر من تحت لحد ما تملا الشاشة، وبتختفي على المشهد الجاي. من الشات للسيستم.', dur: 1.0, blend: 'alpha',
  init(r) { const s = svg(r, `<g id="g"><path d="M-70 -60 h140 a40 40 0 0 1 40 40 v60 a40 40 0 0 1 -40 40 h-90 l-40 34 v-34 h-10 a40 40 0 0 1 -40 -40 v-60 a40 40 0 0 1 40 -40z" fill="#FFFFFF"/><g id="d">${[-40, 0, 40].map(x => `<circle cx="${x}" cy="10" r="11" fill="${C.navy}"/>`).join('')}</g></g>`); return { s, g: s.querySelector('#g'), d: s.querySelector('#d') }; },
  frame(o, t) { const g = eio(P(t, 0, .48)), sc = L(.6, 28, g * g), tx = L(800, 540, g), ty = L(1550, 900, g); o.g.setAttribute('transform', `translate(${tx} ${ty}) scale(${sc})`);
    o.d.style.opacity = 1 - P(t, .15, .3); [...o.d.children].forEach((c, i) => c.setAttribute('cy', 10 - 8 * Math.max(0, Math.sin(t * 20 - i)))); o.s.style.opacity = t < .5 ? P(t, 0, .06) : 1 - eo(P(t, .5, 1)); } });

def({ id: 'tr-18', cat: 'transition', name: 'مسحة القوس', use: 'لوح كحلي حرفه قوس لوجيكا السماوي بيمسح الشاشة. توقيعنا في الانتقالات.', dur: 1.0, blend: 'alpha',
  init(r) { const d = BRACE_L.replace(/-?\d+(\.\d+)?/g, n => +n * 3), s = svg(r, `<g id="g"><path d="${d} L2700 1920 L2700 0 Z" fill="${C.navy}"/><path d="${d}" fill="none" stroke="${C.cyan2}" stroke-width="28" stroke-linecap="round" style="filter:drop-shadow(0 0 24px rgba(0,204,242,.9))"/></g>`); return { g: s.querySelector('#g') }; },
  frame(o, t) { o.g.setAttribute('transform', `translate(${L(1000, -3100, eio(P(t, 0, this.dur)))} 0)`); } });

def({ id: 'tr-19', cat: 'transition', name: 'بقعة حبر', use: 'بقعة سماوي ليها حواف بتتموّج بتكبر وتغطي، وبعدين بتتفتح من جوّه. أنعم من الدايرة.', dur: 1.1, blend: 'alpha',
  init(r) { return canvas(r); },
  frame(o, t) { const x = o.x, blob = (R, ph) => { x.beginPath(); for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2, rr = R * (1 + .09 * Math.sin(a * 5 + ph) + .05 * Math.sin(a * 3 - ph * 1.7)); x[i ? 'lineTo' : 'moveTo'](540 + Math.cos(a) * rr, 960 + Math.sin(a) * rr); } x.closePath(); };
    x.clearRect(0, 0, 1080, 1920); const g = eio(P(t, 0, .48)), h = eio(P(t, .52, 1)); if (g <= 0) return;
    x.fillStyle = C.navy; blob(g * 1350, t * 6); x.fill(); x.fillStyle = C.cyan; blob(g * 1250, t * 6 + 1); x.fill(); x.fillStyle = C.navy; blob(Math.max(0, g * 1250 - 120), t * 6 + 2); x.fill();
    if (h > 0) { x.globalCompositeOperation = 'destination-out'; blob(h * 1400, t * 6 + 3); x.fill(); x.globalCompositeOperation = 'source-over'; } } });

def({ id: 'tr-20', cat: 'transition', name: 'لفّة', use: 'لوح كحلي بيلف من الشمال حوالين ركن الشاشة ويطلع من تحت. نقلة فيها حركة.', dur: .9, blend: 'alpha',
  init(r) { return { p: panel(r, `left:0;top:-780px;width:2700px;height:2700px;background:${C.navy};border-left:14px solid ${C.cyan2};border-bottom:14px solid ${C.cyan2};box-sizing:border-box;transform-origin:0 100%`) }; },
  frame(o, t) { o.p.style.transform = `rotate(${t < .5 ? L(-90, 0, eio(P(t, 0, .45))) : L(0, 90, eio(P(t, .5, .9)))}deg)`; } });

def({ id: 'tr-21', cat: 'transition', name: 'تحلّل بكسل', use: 'مربعات صغيرة بتظهر عشوائي لحد ما تغطي، وتختفي عشوائي. إحساس «ديجيتال» هادي.', dur: 1.0, blend: 'alpha',
  init(r) { return canvas(r); },
  frame(o, t) { const x = o.x; x.clearRect(0, 0, 1080, 1920); const a = P(t, 0, .45), b = P(t, .55, 1);
    for (let j = 0; j < 32; j++) for (let i = 0; i < 18; i++) { const n = rnd(i * 31 + j * 7.3), m = rnd(i * 13.1 + j * 17); if (n > a * 1.05 || (b > 0 && m < b * 1.05)) continue; x.fillStyle = rnd(i + j * 40) < .1 ? C.cyan : C.navy; x.fillRect(i * 60, j * 60, 61, 61); } } });

def({ id: 'tr-22', cat: 'transition', name: 'لمعة نور', use: 'شريط نور أبيض مايل بيعدّي ويبيّض الشاشة لحظة. أهدى من الفلاش وأشيك.', dur: .8, blend: 'alpha',
  init(r) { return { b: panel(r, 'top:-600px;bottom:-600px;left:-1400px;width:1400px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.95) 40%,#fff 50%,rgba(255,255,255,.95) 60%,transparent);transform-origin:center'), f: panel(r, 'inset:0;background:#fff') }; },
  frame(o, t) { o.b.style.transform = `rotate(20deg) translateX(${L(-200, 2900, eio(P(t, 0, this.dur)))}px)`; o.f.style.opacity = Math.max(0, 1 - Math.abs(t - .4) / .14); } });

def({ id: 'tr-23', cat: 'transition', name: 'نفق مربعات', use: 'مربعات بتطلع من النص ورا بعض بألوان البراند وبعدين فتحة بتكبر. «جوّه السيستم».', dur: 1.1, blend: 'alpha',
  init(r) { return canvas(r); },
  frame(o, t) { const x = o.x, rr = (s, c) => { x.beginPath(); x.roundRect(540 - s * .5625, 960 - s, s * 1.125, s * 2, s * .12); x.fillStyle = c; x.fill(); }; x.clearRect(0, 0, 1080, 1920);
    [C.cyan, '#FFFFFF', C.cyan2, C.navy].forEach((c, i) => { const g = ei(P(t, i * .07, .3 + i * .07)); if (g > 0) rr(g * 1200, c); });
    const h = eio(P(t, .55, 1)); if (h > 0) { x.globalCompositeOperation = 'destination-out'; rr(h * 1250, '#000'); x.globalCompositeOperation = 'source-over'; x.strokeStyle = C.cyan2; x.lineWidth = 16; x.beginPath(); const s = h * 1250; x.roundRect(540 - s * .5625, 960 - s, s * 1.125, s * 2, s * .12); x.stroke(); } } });

def({ id: 'tr-24', cat: 'transition', name: 'خط مسح', use: 'خط سماوي بيمسح من فوق لتحت وورّاه كحلي، وبعدين يمسح تاني ويكشف المشهد الجاي. «السيستم بيعمل سكان».', dur: 1.2, blend: 'alpha',
  init(r) { return { p: panel(r, `left:0;right:0;top:0;height:0;background:${C.navy}`), l: panel(r, `left:0;right:0;height:12px;margin-top:-6px;background:${C.cyan2};box-shadow:0 0 40px 12px rgba(0,204,242,.7)`) }; },
  frame(o, t) { const a = eio(P(t, 0, .5)), b = eio(P(t, .55, 1.2)), y = t < .53 ? a * 1920 : b * 1920; o.l.style.top = y + 'px'; o.l.style.opacity = (t < .53 ? a < 1 : b > 0 && b < 1) ? 1 : 0;
    if (t < .53) { o.p.style.top = '0'; o.p.style.height = y + 'px'; } else { o.p.style.top = y + 'px'; o.p.style.height = (1920 - y) + 'px'; } } });

def({ id: 'tr-25', cat: 'transition', name: 'قلبة كارت', use: 'لوح كحلي بيتقلب في 3D قدامك ويقلب تاني على المشهد الجاي. زي ما تقلب صفحة.', dur: .9, blend: 'alpha',
  init(r) { const st = el('div', 'position:absolute;inset:0;perspective:1400px', r); return { p: el('div', `position:absolute;left:-60px;right:-60px;top:-60px;bottom:-60px;background:linear-gradient(135deg,#123760,${C.navy});border:12px solid ${C.cyan2};transform-origin:center`, st) }; },
  frame(o, t) { const a = t < .5 ? L(-90, 0, eo(P(t, 0, .45))) : L(0, 90, ei(P(t, .5, .9))); o.p.style.transform = `rotateY(${a}deg) scale(${1.1 - Math.abs(a) / 900})`; o.p.style.visibility = Math.abs(a) > 89.5 ? 'hidden' : 'visible'; } });

def({ id: 'tr-26', cat: 'transition', name: 'شرايط متداخلة', use: '٥ شرايط عريضة بتدخل من الجنبين بالتبادل وتتقابل، وتخرج تاني. إيقاع سريع.', dur: .9, blend: 'alpha',
  init(r) { return { s: [...Array(5)].map((_, i) => panel(r, `left:0;width:1080px;top:${i * 384}px;height:385px;background:${i === 2 ? C.cyan : C.navy}`)) }; },
  frame(o, t) { o.s.forEach((e, i) => { const sd = i % 2 ? 1 : -1, d = i * .03, x = t < .45 ? L(sd * 110, 0, eio(P(t, d, .3 + d))) : L(0, -sd * 110, eio(P(t, .5 + d, .85))); e.style.transform = `translateX(${x}%)`; }); } });

def({ id: 'tr-27', cat: 'transition', name: 'شاشة تحميل', use: 'كحلي بيغطي وفي نصه { } وشريط تحميل بيتملي، وبعدين يفتح. «السيستم بيشتغل» بين المشكلة والحل.', dur: 1.4, blend: 'alpha',
  init(r) { const b = panel(r, `inset:0;background:${C.navy}`), w = el('div', 'position:absolute;left:0;right:0;top:840px;display:flex;flex-direction:column;align-items:center;gap:50px', b);
    const lg = el('div', `font:700 150px ${F.num};color:${C.cyan2};direction:ltr;text-shadow:0 0 40px rgba(0,204,242,.7)`, w, '{ }');
    const tr = el('div', 'width:520px;height:18px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;direction:ltr', w), f = el('div', `height:100%;width:0;background:${C.cyan2};border-radius:9px`, tr); return { b, lg, f, w }; },
  frame(o, t) { o.b.style.opacity = t < .5 ? P(t, 0, .2) : 1 - P(t, 1.1, 1.4); o.f.style.width = eio(P(t, .25, 1.0)) * 100 + '%'; o.lg.style.transform = `scale(${L(.8, 1, spring(P(t, .1, .5), 9))})`;
    o.w.style.transform = `scale(${1 + P(t, 1.0, 1.2) * .3})`; o.w.style.opacity = 1 - P(t, 1.0, 1.15); } });

def({ id: 'tr-28', cat: 'transition', name: 'كود بيمطر', use: 'عواميد حروف كود بتنزل وورّاها كحلي لحد ما تغطي، وبعدين تكمل لتحت. لشركة سوفتوير.', dur: 1.2, blend: 'alpha',
  init(r) { const o = canvas(r); o.cols = [...Array(18)].map((_, i) => ({ d: rnd(i * 3) * .18, s: .8 + rnd(i * 7) * .4 })); return o; },
  frame(o, t) { const x = o.x, G = '{}<>/=;01()[]'; x.clearRect(0, 0, 1080, 1920); x.font = `700 44px ${F.num}`; x.textAlign = 'center';
    o.cols.forEach((c, i) => { const a = P(t, c.d, c.d + .33), b = P(t, .62 + c.d * .5, 1.07 + c.d * .5 * c.s), top = b * 2100, bot = ei(a) * 2100; if (bot <= top) return;
      x.fillStyle = C.navy; x.fillRect(i * 60, top, 61, bot - top); for (let k = 0; k < 7; k++) { const y = bot - k * 52; if (y < top) break; x.fillStyle = k ? `rgba(63,214,245,${.9 - k * .12})` : '#fff'; x.fillText(G[Math.floor(rnd(i * 50 + k + Math.floor(t * 20)) * G.length)], i * 60 + 30, y); }
      if (b > 0) { x.fillStyle = C.cyan2; x.fillRect(i * 60, top - 4, 61, 6); } }); } });

def({ id: 'tr-29', cat: 'transition', name: 'أربع زوايا', use: '٤ ألواح بتطير من الزوايا وتتقابل في النص، وترجع تاني. نقلة قوية لمشهد مهم.', dur: .9, blend: 'alpha',
  init(r) { return { q: [[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => panel(r, `left:${a * 540}px;top:${b * 960}px;width:541px;height:961px;background:${i === 1 || i === 2 ? C.navy : '#0E3260'};box-shadow:inset 0 0 0 6px ${C.cyan2}`)), d: [[-1, -1], [1, -1], [-1, 1], [1, 1]] }; },
  frame(o, t) { const c = t < .5 ? eio(P(t, 0, .42)) : 1 - eio(P(t, .55, .9)); o.q.forEach((e, i) => e.style.transform = `translate(${o.d[i][0] * (1 - c) * 110}%,${o.d[i][1] * (1 - c) * 110}%)`); } });

def({ id: 'tr-30', cat: 'transition', name: 'موجة', use: 'مية كحلي بحرف سماوي بتطلع من تحت لحد ما تغطي، وتكمل لفوق. حلوة بعد «بيغرق في الرسايل».', dur: 1.2, blend: 'alpha',
  init(r) { return canvas(r); },
  frame(o, t) { const x = o.x, wave = (y0, ph, up) => { x.beginPath(); x.moveTo(0, up ? 1920 : -10); for (let i = 0; i <= 54; i++) { const X = i * 20; x.lineTo(X, y0 + Math.sin(X / 140 + ph) * 40 + Math.sin(X / 63 - ph * 1.3) * 18); } x.lineTo(1080, up ? 1920 : -10); x.closePath(); };
    x.clearRect(0, 0, 1080, 1920); const a = eio(P(t, 0, .56)), b = eio(P(t, .62, 1.2));
    if (t < .61) { wave(L(2000, -120, a) + 60, t * 9, true); x.fillStyle = C.cyan; x.fill(); wave(L(2000, -120, a) + 100, t * 9 + 1, true); x.fillStyle = C.navy; x.fill(); }
    else { wave(L(1980, -120, b) - 60, t * 9, false); x.fillStyle = C.cyan; x.fill(); wave(L(1980, -120, b) - 100, t * 9 + 1, false); x.fillStyle = C.navy; x.fill(); } } });

/* =============================== إيفكتات =============================== */
def({ id: 'fx-11', cat: 'overlay', name: 'خطوط شاشة قديمة', use: 'خطوط أفقية رفيعة ورعشة نور خفيفة: فلاشباك، أو «كاميرا مراقبة».', dur: 3.0, blend: 'alpha',
  init(r) { return { a: panel(r, 'inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 3px,transparent 3px 7px)'), b: panel(r, 'left:0;right:0;height:260px;background:linear-gradient(180deg,transparent,rgba(255,255,255,.07),transparent)'), f: panel(r, 'inset:0;background:#fff') }; },
  frame(o, t) { o.b.style.top = ((t / 3) * 2300 - 260) + 'px'; o.f.style.opacity = .02 + .03 * rnd(Math.floor(t * 24)); } });

def({ id: 'fx-12', cat: 'overlay', name: 'لمعة عدسة', use: 'نور قوي بيعدّي وحلقات عدسة وراه. بـ Screen فوق لحظة «اللوجو» أو «الحل».', dur: 3.0, blend: 'screen', bg: '#000',
  init(r) { const src = panel(r, 'width:900px;height:900px;margin:-450px 0 0 -450px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95),rgba(120,220,255,.5) 12%,rgba(0,150,255,.12) 35%,transparent 60%)');
    const st = panel(r, 'width:2200px;height:30px;margin:-15px 0 0 -1100px;background:radial-gradient(ellipse at center,rgba(170,235,255,.85),transparent 70%);filter:blur(4px)');
    const gh = [.4, .7, 1.2, 1.5].map((k, i) => ({ k, d: panel(r, `width:${[180, 90, 260, 60][i]}px;height:${[180, 90, 260, 60][i]}px;margin:-${[90, 45, 130, 30][i]}px 0 0 -${[90, 45, 130, 30][i]}px;border-radius:50%;background:radial-gradient(circle,transparent 40%,${['rgba(0,204,242,.35)', 'rgba(255,170,90,.35)', 'rgba(63,214,245,.25)', 'rgba(255,255,255,.4)'][i]} 70%,transparent 72%)`) })); return { src, st, gh }; },
  frame(o, t) { const x = L(150, 930, eio(P(t, 0, 3))), y = 520 + Math.sin(t) * 40; o.src.style.left = o.st.style.left = x + 'px'; o.src.style.top = o.st.style.top = y + 'px';
    o.gh.forEach(g => { g.d.style.left = (540 + (540 - x) * g.k) + 'px'; g.d.style.top = (960 + (960 - y) * g.k * .9) + 'px'; }); const f = .8 + .2 * Math.sin(t * 5); o.src.style.opacity = f; } });

def({ id: 'fx-13', cat: 'overlay', name: 'غبار في النور', use: 'حبيبات صغيرة بتعوم ببطء. بـ Screen فوق لقطة حقيقية تديها جو سينما.', dur: 4.0, blend: 'screen', bg: '#000',
  init(r) { const o = canvas(r); o.p = [...Array(160)].map((_, i) => ({ x: rnd(i) * 1080, y: rnd(i * 2) * 1920, s: 1 + rnd(i * 3) * 4, v: 10 + rnd(i * 4) * 40, ph: rnd(i * 5) * 6 })); return o; },
  frame(o, t) { const x = o.x; x.clearRect(0, 0, 1080, 1920); o.p.forEach((q, i) => { const tw = .35 + .65 * Math.max(0, Math.sin(t * 1.5 + q.ph)); x.fillStyle = `rgba(255,245,225,${.8 * tw})`; x.beginPath();
    x.arc((q.x + Math.sin(t * .6 + q.ph) * 40 + 1080) % 1080, (q.y - t * q.v + 1920) % 1920, q.s, 0, 7); x.fill(); }); } });

def({ id: 'fx-14', cat: 'overlay', name: 'شبكة تقنية', use: 'أرضية شبكة سماوي بتتحرك لقدام. بـ Screen ورا العناوين أو الموبايل: إحساس «سيستم».', dur: 2.0, blend: 'screen', bg: '#000',
  init(r) { return canvas(r); },
  frame(o, t) { const x = o.x, hz = 1020; x.clearRect(0, 0, 1080, 1920); x.lineWidth = 3;
    for (let i = -12; i <= 12; i++) { x.strokeStyle = 'rgba(0,204,242,.55)'; x.beginPath(); x.moveTo(540 + i * 30, hz); x.lineTo(540 + i * 360, 1920); x.stroke(); }
    for (let k = 0; k < 14; k++) { const z = ((k + t / 2 * 2) % 14) / 14, y = hz + Math.pow(z, 2.4) * 900; x.strokeStyle = `rgba(63,214,245,${.15 + z * .7})`; x.beginPath(); x.moveTo(0, y); x.lineTo(1080, y); x.stroke(); }
    const g = x.createLinearGradient(0, hz - 200, 0, hz + 160); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.55, 'rgba(0,204,242,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, hz - 200, 1080, 360); } });

def({ id: 'fx-15', cat: 'overlay', name: 'كود بيجري', use: 'سطور كود باهتة بتطلع لفوق. بـ Screen كخلفية ورا الكلام في فيديو تقني.', dur: 4.0, blend: 'screen', bg: '#000',
  init(r) { const W = ['const', 'user', 'await', 'role', 'if', 'return', 'auth', 'lead', '=>', '{', '}', 'save()', 'lock', 'rls', 'select', 'where', 'id', 'true'];
    const lines = [...Array(46)].map((_, i) => { let s = '  '.repeat(Math.floor(rnd(i * 3) * 4)); for (let k = 0; k < 2 + rnd(i * 5) * 5; k++) s += W[Math.floor(rnd(i * 11 + k) * W.length)] + ' '; return s; });
    const b = panel(r, `left:60px;right:60px;top:0;font:600 34px/56px ${F.num};direction:ltr;white-space:pre;color:rgba(63,214,245,.55)`); b.innerHTML = lines.concat(lines).map((l, i) => i % 7 === 3 ? `<span style="color:rgba(255,255,255,.7)">${l}</span>` : l).join('\n'); return { b }; },
  frame(o, t) { o.b.style.transform = `translateY(${-(t / 4) * 46 * 56}px)`; } });

def({ id: 'fx-16', cat: 'overlay', name: 'إنذار أحمر', use: 'أطراف الشاشة بتنبض أحمر: اختراق، أو خطر، أو «الفلوس بتضيع». للأمان بس.', dur: 2.0, blend: 'alpha',
  init(r) { return { v: panel(r, 'inset:0;background:radial-gradient(ellipse 70% 60% at 50% 50%,transparent 45%,rgba(255,30,30,.85) 100%)'), b: panel(r, 'inset:0;box-shadow:inset 0 0 0 14px rgba(255,69,58,.9)') }; },
  frame(o, t) { const p = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2)), 2); o.v.style.opacity = .25 + .75 * p; o.b.style.opacity = p; } });

def({ id: 'fx-17', cat: 'overlay', name: 'كاميرا REC', use: 'زوايا كاميرا ونقطة REC بترمش وتايم كود. يخلّي أي لقطة شكلها «متصوّرة دلوقتي».', dur: 3.0, blend: 'alpha',
  init(r) { svg(r, [[70, 160, 1, 1], [1010, 160, -1, 1], [70, 1760, 1, -1], [1010, 1760, -1, -1]].map(([x, y, a, b]) => `<path d="M${x} ${y + b * 110} V${y} H${x + a * 110}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`).join(''));
    const rec = panel(r, `left:110px;top:200px;display:flex;align-items:center;gap:16px;font:700 44px ${F.num};color:#fff;direction:ltr`); const dot = el('i', `width:32px;height:32px;border-radius:50%;background:${C.red};display:block`, rec); el('span', '', rec, 'REC');
    const tc = panel(r, `right:110px;top:200px;font:600 40px ${F.num};color:#fff;direction:ltr`); return { dot, tc }; },
  frame(o, t) { o.dot.style.opacity = Math.floor(t * 2) % 2 ? .2 : 1; const f = Math.floor(t * 30) % 30, s = Math.floor(t) + 12; o.tc.textContent = `00:00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`; } });

def({ id: 'fx-18', cat: 'overlay', name: 'موجة صدمة', use: 'حلقة نور بتتمدد من نقطة: لحظة تأثير، أو ختم بينزل، أو رقم بيظهر. غيّر x وy.', dur: 1.2, blend: 'alpha',
  params: { x: 540, y: 960 },
  init(r, p) { return { p, rs: [0, 1, 2].map(i => panel(r, `left:${p.x}px;top:${p.y}px;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;border:${[24, 10, 4][i]}px solid ${i === 1 ? '#fff' : C.cyan2};box-sizing:border-box;filter:blur(${[3, 1, 0][i]}px)`)), f: panel(r, `left:${p.x - 300}px;top:${p.y - 300}px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.8),transparent 60%)`) }; },
  frame(o, t) { o.rs.forEach((e, i) => { const q = eo(P(t, i * .08, .8 + i * .08)); e.style.transform = `scale(${L(.2, 9, q)})`; e.style.opacity = q > 0 && q < 1 ? 1 - q : 0; }); o.f.style.opacity = 1 - eo(P(t, 0, .35)); } });

def({ id: 'fx-19', cat: 'overlay', name: 'مطر', use: 'خطوط مطر مايلة. لحظة حزن أو ضغط: «اليوم باظ».', dur: 3.0, blend: 'alpha',
  init(r) { const o = canvas(r); o.d = [...Array(220)].map((_, i) => ({ x: rnd(i) * 1300, y: rnd(i * 2) * 1920, l: 40 + rnd(i * 3) * 80, v: 1800 + rnd(i * 4) * 1400, a: .15 + rnd(i * 5) * .35 })); return o; },
  frame(o, t) { const x = o.x; x.clearRect(0, 0, 1080, 1920); x.lineWidth = 3; x.lineCap = 'round'; o.d.forEach(q => { const y = (q.y + t * q.v) % 2100 - 100, X = q.x - y * .18; x.strokeStyle = `rgba(210,230,255,${q.a})`; x.beginPath(); x.moveTo(X, y); x.lineTo(X - q.l * .18, y + q.l); x.stroke(); }); } });

def({ id: 'fx-20', cat: 'overlay', name: 'شرار', use: 'شرار سماوي بيطير من تحت لفوق. بـ Screen للحظة قوية، أو نهاية فيها طاقة.', dur: 3.0, blend: 'screen', bg: '#000',
  init(r) { const o = canvas(r); o.p = [...Array(90)].map((_, i) => ({ x: rnd(i) * 1080, ph: rnd(i * 2), v: .4 + rnd(i * 3) * .6, s: 2 + rnd(i * 4) * 5, w: (rnd(i * 5) - .5) * 160 })); return o; },
  frame(o, t) { const x = o.x; x.clearRect(0, 0, 1080, 1920); o.p.forEach((q, i) => { const k = (t * q.v / 1.5 + q.ph) % 1, y = 1980 - k * 2100, X = q.x + Math.sin(k * 8 + i) * 30 + q.w * k, a = Math.sin(Math.PI * k);
    x.fillStyle = i % 4 ? `rgba(63,214,245,${a})` : `rgba(255,255,255,${a})`; x.shadowColor = 'rgba(0,204,242,1)'; x.shadowBlur = 16; x.beginPath(); x.arc(X, y, q.s, 0, 7); x.fill(); }); x.shadowBlur = 0; } });

def({ id: 'fx-21', cat: 'overlay', name: 'تشويش تلفزيون', use: 'تشويش أبيض وأسود بيملا الشاشة. بـ Screen، نص ثانية بس: «الإشارة قطعت» أو قبل كشف.', dur: 1.0, blend: 'screen', bg: '#000',
  init(r) { const o = canvas(r); o.img = o.x.createImageData(270, 480); o.sm = document.createElement('canvas'); o.sm.width = 270; o.sm.height = 480; return o; },
  frame(o, t) { const d = o.img.data; let s = Math.floor(t * 30) * 7919 + 3; for (let i = 0; i < d.length; i += 4) { s = (s * 16807) % 2147483647; const v = (s % 256) * .85; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    o.sm.getContext('2d').putImageData(o.img, 0, 0); o.x.imageSmoothingEnabled = false; o.x.drawImage(o.sm, 0, 0, 1080, 1920); o.x.fillStyle = 'rgba(0,0,0,.35)'; o.x.fillRect(0, (t * 3000) % 1920, 1080, 140); } });

def({ id: 'fx-22', cat: 'overlay', name: 'ملمس ورق', use: 'ملمس ورق ثابت بـ Overlay بنسبة ٢٠–٣٠٪. لمشاهد «الدفتر» والورق القديم.', dur: 2.0, blend: 'overlay', bg: '#808080',
  init(r) { const o = canvas(r), x = o.x; x.fillStyle = '#808080'; x.fillRect(0, 0, 1080, 1920);
    for (let i = 0; i < 9000; i++) { const v = 100 + rnd(i) * 56; x.fillStyle = `rgba(${v},${v},${v},.35)`; x.fillRect(rnd(i * 2) * 1080, rnd(i * 3) * 1920, 1 + rnd(i * 4) * 3, 1 + rnd(i * 5) * 3); }
    x.lineWidth = 1.5; for (let i = 0; i < 700; i++) { const X = rnd(i * 7) * 1080, Y = rnd(i * 8) * 1920, a = rnd(i * 9) * 6.3, l = 10 + rnd(i * 10) * 40, v = rnd(i * 11) > .5 ? 160 : 96; x.strokeStyle = `rgba(${v},${v},${v},.4)`; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + Math.cos(a) * l, Y + Math.sin(a) * l); x.stroke(); }
    const g = x.createRadialGradient(540, 960, 300, 540, 960, 1300); g.addColorStop(0, 'rgba(128,128,128,0)'); g.addColorStop(1, 'rgba(70,70,70,.6)'); x.fillStyle = g; x.fillRect(0, 0, 1080, 1920); return o; },
  frame() {} });

def({ id: 'fx-23', cat: 'overlay', name: 'أشعة نور', use: 'أشعة نور نازلة من فوق بتتحرك ببطء. بـ Screen فوق لحظة الحل أو اللوجو.', dur: 4.0, blend: 'screen', bg: '#000',
  init(r) { return { rays: [...Array(9)].map((_, i) => panel(r, `left:${180 + i * 85}px;top:-200px;width:${50 + rnd(i) * 110}px;height:2200px;background:linear-gradient(180deg,rgba(170,235,255,.55),rgba(0,204,242,.12) 60%,transparent);transform-origin:50% 0;filter:blur(14px)`)) }; },
  frame(o, t) { o.rays.forEach((e, i) => { e.style.transform = `rotate(${(4 - i) * 7 + Math.sin(t * .8 + i) * 3}deg)`; e.style.opacity = .4 + .6 * Math.max(0, Math.sin(t * 1.2 + i * 1.7)); }); } });

def({ id: 'fx-24', cat: 'overlay', name: 'شريط عاجل', use: 'شريط أخبار تحت بيجري فيه كلام: «عاجل · ...». لهوك بنبرة خبر، أو تنبيه مهم.', dur: 4.0, blend: 'alpha',
  params: { tag: 'عاجل', text: 'اكتب الخبر هنا · سطر تاني لو محتاج · ' },
  init(r, p) { const b = panel(r, `left:0;right:0;top:1500px;height:120px;background:rgba(10,36,68,.95);border-top:6px solid ${C.cyan};overflow:hidden;direction:rtl`);
    const tx = el('div', `position:absolute;top:0;height:120px;line-height:116px;right:0;white-space:nowrap;font:600 50px ${F.ar};color:#fff`, b, p.text.repeat(4));
    el('div', `position:absolute;right:0;top:0;height:120px;padding:0 44px;line-height:116px;background:${C.red};color:#fff;font:700 54px ${F.ar};z-index:2`, b, p.tag); return { b, tx }; },
  frame(o, t) { o.b.style.transform = `translateY(${(1 - eo(P(t, 0, .35))) * 140}px)`; o.tx.style.transform = `translateX(${300 + t * 260}px)`; } });

def({ id: 'fx-25', cat: 'overlay', name: 'هالة نبض', use: 'هالة سماوي بتنبض حوالين نقطة: موبايل، أو زرار، أو رقم. بـ Screen. غيّر x وy.', dur: 2.0, blend: 'screen', bg: '#000',
  params: { x: 540, y: 960, r: 360 },
  init(r, p) { return { p, g: panel(r, `left:${p.x - p.r * 1.6}px;top:${p.y - p.r * 1.6}px;width:${p.r * 3.2}px;height:${p.r * 3.2}px;border-radius:50%;background:radial-gradient(circle,rgba(0,204,242,.55) 20%,rgba(0,204,242,.15) 45%,transparent 65%)`),
    rs: [0, 1].map(() => panel(r, `left:${p.x - p.r}px;top:${p.y - p.r}px;width:${p.r * 2}px;height:${p.r * 2}px;border-radius:50%;border:8px solid rgba(63,214,245,.9);box-sizing:border-box;filter:blur(2px)`)) }; },
  frame(o, t) { o.g.style.opacity = .6 + .4 * Math.sin(t * Math.PI); o.g.style.transform = `scale(${1 + .06 * Math.sin(t * Math.PI)})`;
    o.rs.forEach((e, i) => { const q = ((t + i) % 2) / 2; e.style.transform = `scale(${L(.6, 1.6, eo(q))})`; e.style.opacity = 1 - q; }); } });

def({ id: 'fx-26', cat: 'overlay', name: 'دخان', use: 'دخان رمادي هادي بيتحرك ببطء. بـ Screen لجو غامض في الهوك، أو ورا كلمة كبيرة.', dur: 5.0, blend: 'screen', bg: '#000',
  init(r) { return { b: [...Array(10)].map((_, i) => ({ d: panel(r, `width:${700 + rnd(i) * 600}px;height:${500 + rnd(i * 2) * 500}px;border-radius:50%;background:radial-gradient(ellipse,rgba(200,215,235,${.18 + rnd(i * 3) * .17}),transparent 65%);filter:blur(40px)`), x: rnd(i * 4) * 1080 - 400, y: rnd(i * 5) * 1920 - 300, v: (rnd(i * 6) - .5) * 60 })) }; },
  frame(o, t) { o.b.forEach((q, i) => { q.d.style.transform = `translate(${q.x + t * q.v + Math.sin(t * .4 + i) * 60}px,${q.y - t * 25 + Math.cos(t * .3 + i) * 40}px) rotate(${t * 4 * (i % 2 ? 1 : -1)}deg)`; }); } });

def({ id: 'fx-27', cat: 'overlay', name: 'أقواس بتعوم', use: 'أقواس لوجيكا { } بتعوم بهدوء بأحجام مختلفة. بـ Screen كخلفية بتاعتنا بدل النقط العادية.', dur: 5.0, blend: 'screen', bg: '#000',
  init(r) { return { b: [...Array(18)].map((_, i) => { const s = 60 + rnd(i) * 200; return { d: panel(r, `font:700 ${s}px ${F.num};color:rgba(63,214,245,${.15 + rnd(i * 2) * .4});direction:ltr;filter:blur(${rnd(i * 3) * 5}px);text-shadow:0 0 30px rgba(0,204,242,.6)`), s, x: rnd(i * 4) * 1000, y: rnd(i * 5) * 1920, v: 20 + rnd(i * 6) * 50, ph: rnd(i * 7) * 6 }; }).map((q, i) => (q.d.textContent = i % 3 ? (i % 2 ? '{' : '}') : '{ }', q)) }; },
  frame(o, t) { o.b.forEach(q => { q.d.style.transform = `translate(${q.x + Math.sin(t * .7 + q.ph) * 30}px,${((q.y - t * q.v) % 2200 + 2200) % 2200 - 250}px) rotate(${Math.sin(t * .5 + q.ph) * 10}deg)`; }); } });

def({ id: 'fx-28', cat: 'overlay', name: 'إطار لوجيكا', use: 'إطار ثابت بأقواس في الزوايا و«لوجيكا» تحت. حطه على الفيديو كله: الريل يبان بتاعنا من أول ثانية.', dur: 3.0, blend: 'alpha',
  init(r) { const s = svg(r, [[60, 140, 1, 1], [1020, 140, -1, 1], [60, 1780, 1, -1], [1020, 1780, -1, -1]].map(([x, y, a, b]) => `<path d="M${x + a * 70} ${y} Q${x} ${y} ${x} ${y + b * 70} V${y + b * 150}" fill="none" stroke="${C.cyan2}" stroke-width="7" stroke-linecap="round" opacity=".85"/>`).join(''));
    const tg = panel(r, `left:0;right:0;top:1800px;text-align:center;font:700 34px ${F.num};color:rgba(255,255,255,.75);letter-spacing:6px;direction:ltr`); tg.innerHTML = `<span style="color:${C.cyan2}">{</span> LOGIKA <span style="color:${C.cyan2}">}</span>`; return { s, tg }; },
  frame(o, t) { o.s.style.opacity = .85 + .15 * Math.sin(t * 2); } });

def({ id: 'fx-29', cat: 'overlay', name: 'رادار', use: 'رادار بيلف ويلقط نقط. بـ Screen لمشهد «السيستم بيراقب» أو «محدش يعدّي من غير ما يتشاف».', dur: 3.0, blend: 'screen', bg: '#000',
  init(r) { const o = canvas(r); o.dots = [...Array(7)].map((_, i) => ({ a: rnd(i) * Math.PI * 2, d: 120 + rnd(i * 2) * 300 })); return o; },
  frame(o, t) { const x = o.x, cx = 540, cy = 960, R = 440, a = t / 3 * Math.PI * 2 * 1.5; x.clearRect(0, 0, 1080, 1920); x.strokeStyle = 'rgba(0,204,242,.45)'; x.lineWidth = 3;
    [1, .66, .33].forEach(k => { x.beginPath(); x.arc(cx, cy, R * k, 0, 7); x.stroke(); }); x.beginPath(); x.moveTo(cx - R, cy); x.lineTo(cx + R, cy); x.moveTo(cx, cy - R); x.lineTo(cx, cy + R); x.stroke();
    for (let k = 0; k < 40; k++) { x.fillStyle = `rgba(0,204,242,${.35 * (1 - k / 40)})`; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R, a - (k + 1) * .02, a - k * .02); x.closePath(); x.fill(); }
    o.dots.forEach(q => { const age = ((a - q.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2), al = Math.max(0, 1 - age * 2.2); x.fillStyle = `rgba(255,255,255,${al})`; x.shadowColor = '#3FD6F5'; x.shadowBlur = 20; x.beginPath(); x.arc(cx + Math.cos(q.a) * q.d, cy + Math.sin(q.a) * q.d, 12, 0, 7); x.fill(); x.shadowBlur = 0; }); } });

def({ id: 'fx-30', cat: 'overlay', name: 'ضوء شباك', use: 'ضوء شمس داخل من شيش بيتحرك ببطء. بـ Screen فوق لقطة مكتب أو محل: صباح ويوم جديد.', dur: 4.0, blend: 'screen', bg: '#000',
  init(r) { const w = panel(r, 'left:-300px;top:200px;width:1700px;height:1500px;transform-origin:center;filter:blur(22px)'); [...Array(6)].forEach((_, i) => el('div', `position:absolute;left:0;right:0;top:${i * 230}px;height:120px;background:linear-gradient(90deg,transparent,rgba(255,215,160,.55) 30%,rgba(255,235,200,.7) 50%,rgba(255,215,160,.55) 70%,transparent)`, w)); return { w }; },
  frame(o, t) { o.w.style.transform = `rotate(-28deg) skewX(-18deg) translate(${Math.sin(t / 4 * Math.PI * 2) * 40}px,${t * 20}px)`; o.w.style.opacity = .8 + .2 * Math.sin(t * 1.3); } });
})();
