/* =====================================================================
   مكتبة لوجيكا · فايرال: الحاجات اللي بتتكرر في الريلز اللي بتضرب
   (شريط «استنى للآخر»، رد على تعليق، POV، عدّ تنازلي، أرقام بتلف، استفتاء…)
   بنفس حِرفة hq: منحنيات expo، واستعداد وارتداد، وموشن بلور في التصدير.
   ===================================================================== */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, svg, draw, spring, eo, eio, P, L, cl, rnd, outFade } = H;
const def = o => LIB.push(Object.assign({ cat: 'viral', blend: 'alpha' }, o));
const ex = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const exio = x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
const back = (x, s = 1.7) => x <= 0 ? 0 : 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const pop = (e, k, base = '') => { e.style.opacity = Math.min(1, k * 3); e.style.transform = `${base} scale(${k})`; };
const OUT = '0 0 2px #000,0 0 2px #000,0 4px 0 rgba(0,0,0,.55),0 8px 24px rgba(0,0,0,.45)';   // the thick caption outline reels use
const NS = 'http://www.w3.org/2000/svg';
const cursorSvg = '<svg viewBox="0 0 24 24" width="90" height="90"><path d="M5 2.5l13.5 12.2-6.1.6 3.6 7.1-2.8 1.4-3.6-7.2L5 21z" fill="#fff" stroke="#0A2444" stroke-width="1.4" stroke-linejoin="round"/></svg>';

def({ id: 'vr-01', name: 'شريط «استنى للآخر»', use: 'شريط تقدّم فوق الفيديو كله بيتملي لحد الآخر، ومكتوب عليه «استنى للآخر». بيخلّي الناس تكمّل الفيديو. مدّه على طول الريل.', dur: 6.0,
  params: { text: 'استنى للآخر 👀' },
  init(r, p) { const w = el('div', 'position:absolute;left:70px;right:70px;top:120px;direction:rtl', r);
    const lb = el('div', `display:inline-block;margin-bottom:16px;padding:8px 26px 12px;border-radius:99px;background:rgba(5,14,29,.75);font:700 40px ${F.ar};color:#fff`, w, p.text);
    const tr = el('div', 'position:relative;height:18px;border-radius:9px;background:rgba(255,255,255,.22);overflow:visible', w);
    const f = el('div', `position:absolute;right:0;top:0;bottom:0;border-radius:9px;background:linear-gradient(270deg,${C.cyan},${C.cyan2});box-shadow:0 0 20px rgba(0,204,242,.8)`, tr);
    const dot = el('i', 'position:absolute;top:50%;width:34px;height:34px;margin:-17px -17px 0 0;border-radius:50%;background:#fff;box-shadow:0 0 0 8px rgba(63,214,245,.35),0 0 24px #3FD6F5;display:block', tr);
    return { w, lb, f, dot }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 9); o.w.style.transform = `translateY(${(1 - k) * -220}px)`; o.w.style.opacity = Math.min(1, k * 2);
    const v = P(t, .3, this.dur - .1) * 100; o.f.style.width = v + '%'; o.dot.style.right = v + '%'; o.dot.style.transform = `scale(${1 + .15 * Math.sin(t * 8)})`; o.lb.style.transform = `rotate(${Math.sin(t * 3) * 1.5}deg)`; } });

def({ id: 'vr-02', name: 'رد على تعليق', use: 'ستيكر «رد على تعليق» زي تيك توك وريلز: ابدأ بيه الفيديو وإنت بترد على سؤال حقيقي. أكتر فورمات بيجيب تفاعل.', dur: 2.6,
  params: { handle: '@اسم_الحساب', text: 'طب ده بكام؟ 🤔' },
  init(r, p) { const c = el('div', `position:absolute;left:130px;right:130px;top:380px;padding:30px 36px 34px;border-radius:34px;background:#fff;direction:rtl;box-shadow:0 30px 70px rgba(0,0,0,.45);transform-origin:right top`, r);
    el('div', `display:flex;align-items:center;gap:16px;font:600 32px ${F.ar};color:#7A8699`, c, `<i style="width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,${C.cyan2},#5B8CFF);display:block"></i>رد على تعليق ${p.handle}`);
    el('div', `margin-top:14px;font:700 58px ${F.ar};color:#111827`, c, p.text); return { c }; },
  frame(o, t) { const k = spring(P(t, 0, .55), 8), out = exio(P(t, this.dur - .3, this.dur)); o.c.style.opacity = Math.min(1, k * 3) * (1 - out);
    o.c.style.transform = `rotate(${L(-14, -3, k) + Math.sin(t * 2) * .6}deg) scale(${L(.3, 1, k) * (1 - out * .2)}) translateY(${Math.sin(t * 1.8) * 6}px)`; } });

def({ id: 'vr-03', name: 'احفظ البوست', use: 'أيقونة «حفظ» بتتملي بنطّة وسهم بيشاور على زرار الحفظ: «احفظه عشان ترجعله». للبوستات المفيدة.', dur: 2.6,
  params: { text: 'احفظ البوست عشان ترجعله' },
  init(r, p) { const s = svg(r, `<g id="bm" transform="translate(540 820)"><path id="bp" d="M-70 -95 h140 a14 14 0 0 1 14 14 v185 l-84 -58 l-84 58 v-185 a14 14 0 0 1 14 -14z" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/></g>
      <path id="ar" d="M640 1180 C 820 1240 900 1380 880 1560" fill="none" stroke="${C.cyan2}" stroke-width="14" stroke-linecap="round"/><path id="ah" d="M830 1520 L880 1580 L930 1515" fill="none" stroke="${C.cyan2}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`);
    const tx = el('div', `position:absolute;left:60px;right:60px;top:1010px;text-align:center;direction:rtl;font:700 68px ${F.ar};color:#fff;text-shadow:${OUT}`, r, p.text);
    return { s, bm: s.querySelector('#bm'), bp: s.querySelector('#bp'), ar: s.querySelector('#ar'), ah: s.querySelector('#ah'), tx }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 9), f = P(t, .75, .9), b = t > .8 ? 1 + .25 * Math.exp(-(t - .8) * 9) * Math.cos((t - .8) * 30) : 1;
    o.bm.setAttribute('transform', `translate(540 820) scale(${L(.2, 1, k) * b})`); o.bp.setAttribute('fill', f > .5 ? C.cyan2 : 'none'); o.bp.setAttribute('stroke', f > .5 ? C.cyan2 : '#fff');
    const x = ex(P(t, .3, .7)); o.tx.style.opacity = x; o.tx.style.transform = `translateY(${(1 - x) * 40}px)`; draw(o.ar, ex(P(t, 1.0, 1.5))); draw(o.ah, ex(P(t, 1.4, 1.6)));
    o.s.style.transform = `translate(${Math.sin(t * 6) * 4 * P(t, 1.6, 1.8)}px,${Math.sin(t * 6) * 6 * P(t, 1.6, 1.8)}px)`; const op = outFade(t, this.dur); o.s.style.opacity = op; o.tx.style.filter = `opacity(${op})`; } });

def({ id: 'vr-04', name: 'POV', use: '«POV:» وتحته الموقف بيتكتب. أشهر فاتحة ريلز: بتحط المشاهد في المشهد من أول ثانية.', dur: 3.0,
  params: { text: 'إنت صاحب شغل\nوالموبايل فصل شحن 🪫' },
  init(r, p) { const w = el('div', 'position:absolute;left:80px;right:80px;top:300px;direction:rtl', r);
    const tag = el('div', `display:inline-block;padding:6px 30px 14px;border-radius:22px;background:${C.cyan};color:${C.navy};font:700 84px ${F.num};direction:ltr`, w, 'POV:');
    const tx = el('div', `margin-top:26px;font:700 80px/1.35 ${F.ar};color:#fff;white-space:pre-line;text-shadow:${OUT}`, w); const cur = el('i', `display:inline-block;width:8px;height:84px;margin-right:6px;vertical-align:-12px;background:${C.cyan2}`, w);
    return { w, tag, tx, cur, ch: [...p.text] }; },
  frame(o, t) { const k = spring(P(t, 0, .4), 10); o.tag.style.transform = `scale(${k}) rotate(${(1 - k) * -12}deg)`; o.tag.style.opacity = Math.min(1, k * 3);
    const n = Math.floor(cl(P(t, .35, 1.8)) * o.ch.length); o.tx.textContent = o.ch.slice(0, n).join(''); o.tx.appendChild(o.cur); o.cur.style.opacity = n < o.ch.length || Math.floor(t * 3) % 2 ? 1 : 0;
    o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'vr-05', name: 'عدّ تنازلي ٣ ٢ ١', use: '٣، ٢، ١ بدايرة بتخلص مع كل رقم. قبل الكشف أو قبل «شوف الفرق».', dur: 3.1,
  init(r) { const s = svg(r, `<g transform="translate(540 900)"><circle r="300" fill="rgba(5,14,29,.6)"/><circle id="rg" r="300" fill="none" stroke="${C.cyan2}" stroke-width="18" stroke-linecap="round" transform="rotate(-90)" style="filter:drop-shadow(0 0 16px rgba(0,204,242,.8))"/></g>`);
    const n = el('div', `position:absolute;left:0;right:0;top:640px;height:520px;display:flex;align-items:center;justify-content:center;font:700 400px/1 ${F.num};color:#fff;text-shadow:0 0 60px rgba(0,204,242,.5)`, r);
    return { s, rg: s.querySelector('#rg'), n }; },
  frame(o, t) { const i = Math.min(2, Math.floor(t)), lt = t - i, k = 1 + .35 * Math.exp(-lt * 9) * Math.cos(lt * 22); o.n.textContent = String(3 - i);
    o.n.style.transform = `scale(${k})`; o.n.style.opacity = 1 - P(lt, .85, 1) * (i === 2 ? 1 : 0); const len = 2 * Math.PI * 300; o.rg.style.strokeDasharray = len; o.rg.style.strokeDashoffset = len * eio(cl(lt));
    o.s.style.opacity = 1 - P(t, 2.85, 3.1); o.s.style.transform = `scale(${1 + P(t, 2.85, 3.1) * .4})`; o.s.style.transformOrigin = '540px 900px'; } });

def({ id: 'vr-06', name: 'أرقام بتلف', use: 'الرقم بيلف زي ماكينة القمار لحد ما يقف: فلوس، أو عدد عملاء، أو أي رقم عاوزه يتحس.', dur: 2.4,
  params: { value: '48,500', label: 'جنيه راحوا لغيرك' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:700px;display:flex;justify-content:center;direction:ltr', r);
    const cols = [...p.value].map((ch, i) => { const m = el('div', `position:relative;height:240px;overflow:hidden;font:700 210px/240px ${F.num};color:#fff;text-shadow:0 0 40px rgba(0,204,242,.45)`, w);
      if (!/\d/.test(ch)) { m.textContent = ch; return null; } const strip = el('div', '', m, [...Array(30)].map((_, j) => (j + (+ch) + 1) % 10).concat([+ch]).join('<br>')); return { strip, n: 31, i }; }).filter(Boolean);
    const lb = el('div', `position:absolute;left:0;right:0;top:960px;text-align:center;font:700 64px ${F.ar};color:${C.cyan2};direction:rtl`, r, p.label);
    return { w, cols, lb }; },
  frame(o, t) { o.cols.forEach((c, j) => { const x = ex(P(t, .05, .9 + j * .14)); c.strip.style.transform = `translateY(${-x * (c.n - 1) * 240}px)`; });
    const end = .9 + o.cols.length * .14, k = t > end ? 1 + .08 * Math.exp(-(t - end) * 9) * Math.cos((t - end) * 26) : 1; o.w.style.transform = `scale(${k})`;
    const g = ex(P(t, end, end + .4)); o.lb.style.opacity = g; o.lb.style.transform = `translateY(${(1 - g) * 30}px)`; const op = outFade(t, this.dur); o.w.style.opacity = op; o.lb.style.filter = `opacity(${op})`; } });

def({ id: 'vr-07', name: 'كلام بيتفك', use: 'حروف عشوائية بتتفك لحد ما الجملة تبان، زي فك تشفير. لمواضيع الأمان والبيانات.', dur: 2.4,
  params: { text: 'بياناتك متشفّرة' },
  init(r, p) { const w = el('div', `position:absolute;left:40px;right:40px;top:860px;text-align:center;direction:rtl;font:700 104px ${F.ar};color:${C.cyan2};text-shadow:0 0 30px rgba(0,204,242,.6);white-space:nowrap`, r);
    const sub = el('div', `position:absolute;left:0;right:0;top:1010px;text-align:center;font:600 34px ${F.num};color:rgba(255,255,255,.6);letter-spacing:6px;direction:ltr`, r, 'AES-256 · DECRYPTED');
    return { w, sub, ch: [...p.text] }; },
  frame(o, t) { const pool = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي#$%&*', f = Math.floor(t * 24);
    o.w.textContent = o.ch.map((c, i) => c === ' ' || t > .25 + i * .07 ? c : pool[Math.floor(rnd(f * 31 + i) * pool.length)]).join('');
    const done = t > .25 + o.ch.length * .07; o.w.style.color = done ? '#fff' : C.cyan2; o.w.style.transform = `scale(${done ? 1 + .05 * Math.exp(-(t - .25 - o.ch.length * .07) * 8) : 1})`;
    o.sub.style.opacity = P(t, 1.4, 1.7); const op = outFade(t, this.dur); o.w.style.opacity = op; o.sub.style.filter = `opacity(${op})`; } });

def({ id: 'vr-08', name: 'كلمات بتتكدس', use: 'كلمات كبيرة بتخبط في الشاشة ورا بعض وتتكدس لحد ما تملاها: «دفتر، ورق، واتساب، إكسيل… فوضى». إيقاع سريع للهوك.', dur: 3.0,
  params: { words: ['دفتر', 'ورق', 'واتساب', 'إكسيل', 'فوضى'] },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:330px;display:flex;flex-direction:column;align-items:center;gap:6px;direction:rtl', r);
    const st = [`color:#fff`, `color:transparent;-webkit-text-stroke:5px ${C.cyan2}`, `color:${C.cyan2}`, `color:#fff`, `color:#fff;background:${C.red};padding:0 40px 20px;border-radius:24px`];
    const ws = p.words.map((x, i) => el('div', `font:700 ${[190, 170, 200, 170, 230][i % 5]}px/1.12 ${F.ar};${st[i % 5]};text-shadow:${i % 5 === 1 ? 'none' : '0 10px 30px rgba(0,0,0,.45)'};white-space:nowrap`, w, x));
    return { w, ws }; },
  frame(o, t) { o.ws.forEach((e, i) => { const a = .08 + i * .32, x = ex(P(t, a, a + .28)), d = i % 2 ? 1 : -1; e.style.transform = `translateX(${d * (1 - x) * 1100}px) skewX(${d * (1 - x) * -20}deg) scale(${1 + .15 * Math.exp(-(t - a - .1) * 10) * (t > a + .1)})`; e.style.opacity = t > a ? 1 : 0; });
    const last = .08 + (o.ws.length - 1) * .32 + .12, sh = t > last && t < last + .3 ? (1 - P(t, last, last + .3)) * 18 * (rnd(Math.floor(t * 60)) - .5) * 2 : 0;
    const out = exio(P(t, this.dur - .3, this.dur)); o.w.style.transform = `translate(${sh}px,${sh * .6}px) scale(${1 - out * .3})`; o.w.style.opacity = 1 - out; } });

def({ id: 'vr-09', name: 'استفتاء', use: 'ستيكر استفتاء: سؤال واختيارين، وبعدين النسب بتتملي. اسأل المتابعين سؤال ليه علاقة بمشكلتهم.', dur: 3.0,
  params: { q: 'بتقفل حساباتك إزاي؟', a: 'دفتر 📒', b: 'سيستم 💻', pa: 32, pb: 68 },
  init(r, p) { const c = el('div', `position:absolute;left:120px;right:120px;top:640px;padding:40px;border-radius:40px;background:#fff;direction:rtl;box-shadow:0 30px 70px rgba(0,0,0,.45)`, r);
    el('div', `text-align:center;font:700 56px ${F.ar};color:#111827;margin-bottom:28px`, c, p.q);
    const opt = (tx, pc) => { const o = el('div', 'position:relative;height:110px;border-radius:24px;background:#EEF2F7;overflow:hidden;margin-top:18px', c);
      const fill = el('div', 'position:absolute;right:0;top:0;bottom:0;width:0', o); const row = el('div', `position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 32px;font:700 46px ${F.ar};color:#111827`, o, `<span>${tx}</span>`);
      const n = el('span', `font:700 44px ${F.num}`, row); return { o, fill, n, pc }; };
    return { c, A: opt(p.a, p.pa), B: opt(p.b, p.pb) }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `scale(${L(.4, 1, k)}) rotate(${(1 - k) * -6}deg)`; o.c.style.opacity = Math.min(1, k * 3) * outFade(t, this.dur);
    const tap = P(t, .95, 1.1), x = ex(P(t, 1.1, 1.9)); o.B.o.style.transform = `scale(${1 - .05 * Math.sin(Math.PI * tap)})`;
    [[o.A, 'rgba(10,36,68,.15)'], [o.B, C.cyan]].forEach(([q, col]) => { q.fill.style.width = q.pc * x + '%'; q.fill.style.background = col; q.n.textContent = t > 1.1 ? Math.round(q.pc * x) + '%' : ''; }); } });

def({ id: 'vr-10', name: '«استنى دي»', use: '«استنى دي 👇» بخط ريلز تقيل وسهم بيتنطط. حطه قبل التويست أو قبل الرقم الصادم بثانية.', dur: 2.2,
  params: { text: 'استنى دي 👇' },
  init(r, p) { const tx = el('div', `position:absolute;left:0;right:0;top:760px;text-align:center;direction:rtl;font:700 110px ${F.ar};color:#fff;text-shadow:${OUT}`, r, p.text);
    const s = svg(r, `<path id="a" d="M540 960 V1180 M460 1110 L540 1190 L620 1110" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 6px 0 rgba(0,0,0,.5))"/>`); return { tx, s, a: s.querySelector('#a') }; },
  frame(o, t) { const k = spring(P(t, 0, .4), 10); o.tx.style.transform = `scale(${k}) rotate(${Math.sin(t * 14) * 3 * (1 - P(t, .4, .9))}deg)`; o.tx.style.opacity = Math.min(1, k * 3);
    draw(o.a, ex(P(t, .25, .55))); o.s.style.transform = `translateY(${Math.abs(Math.sin(t * 7)) * 40 * P(t, .5, .7)}px)`; const op = outFade(t, this.dur); o.s.style.opacity = op; o.tx.style.filter = `opacity(${op})`; } });

def({ id: 'vr-11', name: 'عنوان جليتش', use: 'عنوان بيدخل متكسّر بألوان مفصولة ويثبت، ويتكسّر تاني لحظة. لكلمة زي «اختراق؟» أو «خطر».', dur: 1.9,
  params: { text: 'اختراق؟' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:700px;height:420px', r), mk = (c, css) => el('div', `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 260px/1 ${F.ar};color:${c};direction:rtl;white-space:nowrap;${css}`, w, p.text);
    const R = mk('#FF2D55', 'mix-blend-mode:screen'), B = mk(C.cyan, 'mix-blend-mode:screen'), sl = [...Array(5)].map((_, i) => mk('#fff', `clip-path:inset(${i * 20}% 0 ${80 - i * 20}% 0)`)); return { w, R, B, sl }; },
  frame(o, t) { const f = Math.floor(t * 24), burst = t < .55 ? 1 - P(t, 0, .55) : t > 1.15 && t < 1.35 ? 1 : t > this.dur - .3 ? P(t, this.dur - .3, this.dur) * 1.5 : 0;
    o.sl.forEach((e, i) => { e.style.transform = `translateX(${(rnd(f * 7 + i) - .5) * 260 * burst}px)`; e.style.opacity = burst > 1.2 ? (rnd(f + i) > .5 ? 1 : 0) : 1; });
    const sp = 6 + burst * 40; o.R.style.transform = `translate(${-sp + (rnd(f) - .5) * burst * 30}px,${(rnd(f * 3) - .5) * burst * 20}px)`; o.B.style.transform = `translate(${sp}px,${(rnd(f * 5) - .5) * burst * 20}px)`;
    const op = t < .05 ? 0 : t > this.dur - .1 ? 0 : 1; o.w.style.opacity = op; } });

def({ id: 'vr-12', name: 'مطر إيموجي', use: 'إيموجي بتنزل من فوق تملا الشاشة: 💸 للفلوس، 🔥 للعروض، ❤️ للفرحة. غيّره من emoji.', dur: 3.0,
  params: { emoji: '💸' },
  init(r, p) { return { d: [...Array(38)].map((_, i) => ({ e: el('div', `position:absolute;left:0;top:0;font-size:${70 + rnd(i) * 90}px;line-height:1`, r, p.emoji), x: rnd(i * 3) * 1000, a: rnd(i * 5) * 1.6, v: 900 + rnd(i * 7) * 700, sp: (rnd(i * 9) - .5) * 400 })) }; },
  frame(o, t) { o.d.forEach(q => { const tt = t - q.a; q.e.style.opacity = tt > 0 ? 1 : 0; q.e.style.transform = `translate(${q.x + Math.sin(tt * 3 + q.x) * 30}px,${-200 + tt * q.v + 300 * tt * tt}px) rotate(${q.sp * tt}deg)`; }); } });

def({ id: 'vr-13', name: 'تابع للجزء ٢', use: 'نهاية بتشد للفيديو الجاي: «تابع عشان الجزء ٢» والماوس بيدوس «متابعة» فيقلب «متابَع ✓».', dur: 3.0,
  params: { text: 'تابع عشان الجزء ٢', name: 'لوجيكا' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:640px;display:flex;flex-direction:column;align-items:center;gap:30px;direction:rtl', r);
    const av = el('div', `width:220px;height:220px;border-radius:50%;background:${C.navy};border:8px solid ${C.cyan2};display:flex;align-items:center;justify-content:center;font:700 96px ${F.num};color:${C.cyan2};box-shadow:0 0 50px rgba(0,204,242,.5)`, w, '{ }');
    el('div', `font:700 52px ${F.ar};color:#fff`, w, p.name); const tx = el('div', `font:700 74px ${F.ar};color:#fff;text-shadow:${OUT}`, w, p.text);
    const b = el('div', `position:relative;height:120px;min-width:380px;padding:0 50px;border-radius:24px;display:flex;align-items:center;justify-content:center;font:700 52px ${F.ar};box-sizing:border-box`, w);
    const cu = el('div', 'position:absolute;left:0;top:0;width:90px;height:90px;z-index:5;filter:drop-shadow(0 8px 14px rgba(0,0,0,.45))', r, cursorSvg); return { w, av, tx, b, cu }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 9); o.av.style.transform = `scale(${k})`; const x = ex(P(t, .25, .65)); o.tx.style.opacity = x; o.tx.style.transform = `translateY(${(1 - x) * 30}px)`;
    const tap = 1.45, on = t > tap; o.b.textContent = on ? 'متابَع ✓' : 'متابعة'; o.b.style.background = on ? 'rgba(255,255,255,.12)' : C.cyan; o.b.style.color = on ? '#fff' : C.navy; o.b.style.border = on ? '3px solid rgba(255,255,255,.5)' : '3px solid transparent';
    o.b.style.transform = `scale(${pop0(t, .4) * (1 - .08 * Math.sin(Math.PI * P(t, tap - .1, tap + .1)))})`;
    const m = ex(P(t, .7, tap - .05)), br = o.b.getBoundingClientRect(), rr = o.b.parentNode.parentNode.getBoundingClientRect(), s = rr.width / 1080 || 1;
    const bx = (br.left + br.width * .6 - rr.left) / s, by = (br.top + br.height * .6 - rr.top) / s; o.cu.style.transform = `translate(${L(900, bx, m) - 19}px,${L(1700, by, m) - 9}px)`; o.cu.style.opacity = P(t, .6, .8) * (1 - P(t, 2.0, 2.3));
    o.w.style.opacity = outFade(t, this.dur); } });
function pop0(t, a) { return spring(P(t, a, a + .4), 9); }

def({ id: 'vr-14', name: 'اسألني', use: 'ستيكر «اسألني» زي الستوري، وسؤال بيتكتب جواه. لفيديو بترد فيه على أسئلة الناس عن السيستمات.', dur: 3.0,
  params: { title: 'اسألني أي حاجة عن السيستمات', q: 'ينفع سيستم للمحل بتاعي؟' },
  init(r, p) { const c = el('div', `position:absolute;left:120px;right:120px;top:640px;border-radius:40px;overflow:hidden;background:#fff;direction:rtl;box-shadow:0 30px 70px rgba(0,0,0,.45)`, r);
    el('div', `padding:34px 40px;background:linear-gradient(135deg,${C.cyan},#1E5FA8);color:#fff;font:700 50px ${F.ar};text-align:center`, c, p.title);
    const f = el('div', `margin:30px;padding:28px 30px;border-radius:24px;background:#EEF2F7;font:600 44px ${F.ar};color:#111827;min-height:60px`, c); const tx = el('span', '', f), cur = el('i', `display:inline-block;width:5px;height:50px;vertical-align:-10px;margin-right:4px;background:${C.cyan}`, f);
    return { c, tx, cur, ch: [...p.q] }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8); o.c.style.transform = `scale(${L(.4, 1, k)}) rotate(${(1 - k) * 8 + Math.sin(t * 1.6) * .6}deg)`; o.c.style.opacity = Math.min(1, k * 3) * outFade(t, this.dur);
    const n = Math.floor(cl(P(t, .8, 2.2)) * o.ch.length); o.tx.textContent = o.ch.slice(0, n).join(''); o.cur.style.opacity = Math.floor(t * 3) % 2 ? 1 : 0; } });

def({ id: 'vr-15', name: 'شخبطة بالقلم', use: 'دايرة وخط بالقلم الأحمر حوالين كلمة، بيرتعشوا زي الرسم بالإيد (Stop motion). للكلمة اللي لازم تتشاف.', dur: 2.4,
  params: { text: 'مهم جداً' },
  init(r, p) { const tx = el('div', `position:absolute;left:0;right:0;top:820px;text-align:center;direction:rtl;font:700 150px ${F.ar};color:#fff;text-shadow:${OUT}`, r, p.text);
    const s = svg(r, '<path id="c" fill="none" stroke="#FF453A" stroke-width="14" stroke-linecap="round"/><path id="u" fill="none" stroke="#FF453A" stroke-width="16" stroke-linecap="round"/>'); return { tx, s, c: s.querySelector('#c'), u: s.querySelector('#u') }; },
  frame(o, t) { const b = Math.floor(t * 12), j = k => (rnd(b * 13 + k) - .5) * 12; let d = '';   // a new wobble 12 times a second, like hand-drawn frames
    for (let i = 0; i <= 40; i++) { const a = -2.6 + i / 40 * Math.PI * 2.15; d += (i ? 'L' : 'M') + (540 + Math.cos(a) * (390 + j(i)) ).toFixed(1) + ' ' + (905 + Math.sin(a) * (150 + j(i + 50))).toFixed(1); }
    o.c.setAttribute('d', d); o.u.setAttribute('d', `M${250 + j(1)} ${1100 + j(2)} Q540 ${1070 + j(3)} ${830 + j(4)} ${1105 + j(5)}`); draw(o.c, ex(P(t, .15, .7))); draw(o.u, ex(P(t, .6, .9)));
    const x = spring(P(t, 0, .4), 9); o.tx.style.transform = `scale(${x})`; const op = outFade(t, this.dur); o.s.style.opacity = op; o.tx.style.opacity = Math.min(1, x * 3) * op; } });

def({ id: 'vr-16', name: 'زوم جوّه الكلمة', use: 'انتقال: الكاميرا بتدخل جوّه حرف من الكلمة لحد ما يملا الشاشة كحلي، وبعدين يفتح على المشهد الجاي.', dur: 1.4, tr: true,
  params: { text: 'لوجيكا' },
  init(r, p) { const t = el('div', `position:absolute;left:0;right:0;top:760px;height:400px;display:flex;align-items:center;justify-content:center;font:700 300px/1 ${F.ar};color:#fff;direction:rtl;white-space:nowrap;transform-origin:528px 200px;text-shadow:0 10px 40px rgba(0,0,0,.4)`, r, p.text);
    const f = el('div', `position:absolute;inset:0;background:${C.navy}`, r); return { t, f }; },
  frame(o, t) { const z = Math.exp(L(0, Math.log(90), ex(P(t, .2, .7)) ** 2.2)); o.t.style.transform = `scale(${t < .7 ? z : 90})`; o.t.style.color = mixc(P(t, .45, .65)); o.t.style.opacity = t < .7 ? Math.min(1, t * 8) : 0;
    const h = ex(P(t, .75, 1.35)), m = `radial-gradient(circle at 50% 50%, transparent ${h * 120}%, #000 ${h * 120 + .5}%)`; o.f.style.opacity = t > .62 ? 1 : 0; o.f.style.webkitMaskImage = o.f.style.maskImage = h > 0 ? m : 'none'; } });
function mixc(x) { const a = [255, 255, 255], b = [10, 36, 68]; return `rgb(${a.map((v, i) => Math.round(L(v, b[i], x))).join(',')})`; }

def({ id: 'vr-17', name: 'توب ٣', use: '«٣ حاجات…» وأرقام كبيرة بتدخل سطر سطر، والأخير بيتعلّم. فورمات القوايم اللي الناس بتحفظها.', dur: 3.4,
  params: { title: '٣ حاجات بتضيّع فلوسك', items: ['الآجل اللي محدش فاكره', 'الرسايل اللي محدش ردّ عليها', 'المخزن اللي مش متسجّل'] },
  init(r, p) { const w = el('div', 'position:absolute;left:70px;right:70px;top:420px;direction:rtl', r);
    const hd = el('div', `font:700 78px ${F.ar};color:#fff;text-shadow:${OUT};margin-bottom:40px`, w, p.title);
    const rows = p.items.map((x, i) => { const row = el('div', 'display:flex;align-items:center;gap:30px;margin-bottom:30px', w);
      el('div', `width:150px;flex:none;font:700 150px/1 ${F.num};color:transparent;-webkit-text-stroke:4px ${C.cyan2};text-align:center`, row, String(i + 1));
      const tx = el('div', `flex:1;padding:26px 30px;border-radius:26px;background:rgba(10,36,68,.9);border:2px solid rgba(0,204,242,.35);font:700 50px ${F.ar};color:#fff`, row, x); return { row, tx }; });
    return { w, hd, rows }; },
  frame(o, t) { const h = ex(P(t, 0, .4)); o.hd.style.opacity = h; o.hd.style.transform = `translateY(${(1 - h) * -40}px)`;
    o.rows.forEach((q, i) => { const a = .45 + i * .5, x = ex(P(t, a, a + .4)); q.row.style.opacity = x; q.row.style.transform = `translateX(${(1 - x) * 300}px)`; });
    const last = o.rows[o.rows.length - 1], g = P(t, .45 + o.rows.length * .5, .65 + o.rows.length * .5); last.tx.style.background = g > .5 ? C.cyan : ''; last.tx.style.color = g > .5 ? C.navy : '#fff';
    last.row.style.transform += ` scale(${1 + .06 * Math.sin(Math.PI * g)})`; o.w.style.opacity = outFade(t, this.dur); } });

def({ id: 'vr-18', name: 'مكالمة واردة', use: 'شاشة «عميل جديد بيتصل…» والزرار الأخضر بيتنطط وبعدين بيترد. بداية حكاية: «العميل اتصل وإنت مش فاكره».', dur: 3.0,
  params: { name: 'عميل جديد', sub: 'بيتصل…' },
  init(r, p) { const w = el('div', 'position:absolute;left:80px;right:80px;top:300px;height:1320px;border-radius:60px;background:linear-gradient(180deg,rgba(18,58,104,.94),rgba(5,14,29,.96));direction:rtl;box-shadow:0 40px 100px rgba(0,0,0,.5);overflow:hidden', r);
    const av = el('div', `position:absolute;left:50%;top:200px;width:260px;height:260px;margin-left:-130px;border-radius:50%;background:${C.cyan};display:flex;align-items:center;justify-content:center;font:700 120px ${F.ar};color:${C.navy}`, w, p.name[0]);
    const rings = [0, 1].map(() => el('i', `position:absolute;left:50%;top:330px;width:260px;height:260px;margin:-130px 0 0 -130px;border-radius:50%;border:6px solid ${C.cyan2};display:block`, w));
    el('div', `position:absolute;left:0;right:0;top:520px;text-align:center;font:700 80px ${F.ar};color:#fff`, w, p.name); const sb = el('div', `position:absolute;left:0;right:0;top:630px;text-align:center;font:400 48px ${F.ar};color:${C.muted}`, w, p.sub);
    const btn = (c, x, ic) => el('div', `position:absolute;top:1040px;${x};width:190px;height:190px;border-radius:50%;background:${c};display:flex;align-items:center;justify-content:center;font:700 80px ${F.num};color:#fff`, w, ic);
    const no = btn(C.red, 'left:140px', '✕'), yes = btn(C.green, 'right:140px', '✆'); return { w, av, rings, sb, no, yes }; },
  frame(o, t) { const k = spring(P(t, 0, .5), 8), ans = 2.0; o.w.style.transform = `translateY(${(1 - k) * 600}px)`; o.w.style.opacity = Math.min(1, k * 3) * outFade(t, this.dur);
    o.rings.forEach((e, i) => { const q = ((t + i * .5) % 1); e.style.transform = `scale(${L(1, 1.7, eo(q))})`; e.style.opacity = t < ans ? 1 - q : 0; });
    o.yes.style.transform = t < ans ? `translateY(${-Math.abs(Math.sin(t * 6)) * 30}px) rotate(${Math.sin(t * 30) * 8}deg)` : `scale(${L(1, 9, ex(P(t, ans, ans + .5)))})`; o.no.style.opacity = 1 - P(t, ans, ans + .15);
    o.sb.textContent = t < ans ? 'بيتصل…' : '00:0' + Math.floor(Math.max(0, t - ans)); } });
})();
