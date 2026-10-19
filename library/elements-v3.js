/* =====================================================================
   مكتبة لوجيكا · النسخة المحسّنة (hq): نفس الأفكار بحِرفة أعلى.
   منحنيات أسرع في الأول وأهدى في الآخر، واستعداد قبل الحركة، وحاجات بتكمّل بعدها،
   وتحوّل أشكال، وتوهّج بطبقات. التصدير بيضيف موشن بلور (MB=8 node render.mjs …).
   ===================================================================== */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, svg, draw, spring, eo, eio, P, L, cl, rnd, BRACE_L, BRACE_R, outFade, WA, panel } = H;
const def = o => LIB.push(o);
const ex = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);                     // expo out: fast start, long settle
const exio = x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
const back = (x, s = 1.7) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const mix = (a, b, x) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(L(v, B[i], x))).join(',')})`; };
const shake = (t, at, amp = 14) => t > at && t < at + .25 ? (1 - P(t, at, at + .25)) * amp * (rnd(Math.floor(t * 60)) - .5) * 2 : 0;
const GLOW = '<filter id="gl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16" result="b"/><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="c"/><feMerge><feMergeNode in="b"/><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

/* ---------- hq-01 · قفل الأقواس ---------- */
def({ id: 'hq-01', cat: 'hq', name: 'قفل الأقواس · محسّن', use: 'توقيع لوجيكا بالمستوى الجديد: الأقواس بتخبط بقوة، والقفل بيتشكّل من نقطة ويتقفل بكليك، وبعدين «متأمّن من جوّا».', dur: 2.8, blend: 'alpha',
  params: { tag: 'متأمّن من جوّا' },
  init(r, p) {
    const s = svg(r, `<defs>${GLOW}<linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="bc"><rect id="bcr"/></clipPath></defs>
      <g id="all"><circle id="fl" cx="540" cy="900" r="260" fill="url(#fg)"/><g id="lines"></g>
        <g id="L"><path d="${BRACE_L}" class="br"/></g><g id="R"><path d="${BRACE_R}" class="br"/></g>
        <circle id="r1" cx="540" cy="900" fill="none" stroke="${C.cyan2}"/><circle id="r2" cx="540" cy="900" fill="none" stroke="#fff"/><g id="sp"></g>
        <g id="lk"><g id="lki"><path id="shk" fill="none" stroke="${C.cyan2}" stroke-width="22" stroke-linecap="round" filter="url(#gl)"/>
          <rect id="bd" fill="${C.navy}" stroke="${C.cyan2}" stroke-width="9" filter="url(#gl)"/><rect id="shn" fill="url(#sh)" clip-path="url(#bc)"/>
          <g id="kh"><circle r="20" cy="-6" fill="${C.cyan2}"/><rect x="-8" y="2" width="16" height="44" rx="8" fill="${C.cyan2}"/></g></g></g></g>
      <defs><radialGradient id="fg"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="#9FEFFF" stop-opacity=".45"/><stop offset="1" stop-color="#3FD6F5" stop-opacity="0"/></radialGradient></defs>`);
    s.querySelectorAll('.br').forEach(e => { e.setAttribute('fill', 'none'); e.setAttribute('stroke', C.cyan2); e.setAttribute('stroke-width', 20); e.setAttribute('stroke-linecap', 'round'); e.setAttribute('filter', 'url(#gl)'); });
    const $ = i => s.querySelector('#' + i);
    const lines = [...Array(10)].map((_, i) => { const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('stroke', i % 3 ? '#fff' : C.cyan2); l.setAttribute('stroke-linecap', 'round'); l.setAttribute('stroke-width', 4 + rnd(i) * 6); $('lines').appendChild(l); return { l, y: 620 + rnd(i * 3) * 560, side: i % 2 ? 1 : -1, len: 140 + rnd(i * 5) * 260 }; });
    const sp = [...Array(22)].map((_, i) => { const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('stroke', i % 4 ? C.cyan2 : '#fff'); l.setAttribute('stroke-width', 6); l.setAttribute('stroke-linecap', 'round'); $('sp').appendChild(l); return { l, a: i / 22 * Math.PI * 2 + rnd(i) * .2, v: 300 + rnd(i * 7) * 260 }; });
    const tag = el('div', `position:absolute;left:0;right:0;top:1300px;display:flex;justify-content:center;gap:24px;direction:rtl;font:700 96px ${F.ar};color:#fff;text-shadow:0 0 40px rgba(0,204,242,.55)`, r);
    const ws = p.tag.split(' ').map(w => { const m = el('span', 'display:inline-block;overflow:hidden;padding:8px 4px 18px', tag); return el('span', 'display:inline-block', m, w); });
    const sub = el('div', `position:absolute;left:0;right:0;top:1460px;text-align:center;font:700 34px ${F.num};color:${C.cyan2};direction:ltr`, r, 'L O G I K A');
    return { s, $, lines, sp, ws, sub, tag }; },
  frame(o, t) { const $ = o.$, imp = .3, snap = 1.05;
    // braces: slam in on an expo curve, squash on impact, settle with a spring
    const a = ex(P(t, 0, imp + .02) * 1.0), sq = t > imp ? 1 - .22 * Math.exp(-(t - imp) * 9) * Math.cos((t - imp) * 30) : 1;
    const lx = L(-420, 148, a), rx = L(1340, 932, a);
    $('L').setAttribute('transform', `translate(${lx + 92} 900) scale(${sq} ${2 - sq}) translate(-92 -320)`); $('R').setAttribute('transform', `translate(${rx - 92} 900) scale(${sq} ${2 - sq}) translate(92 -320)`);
    const vel = t < imp ? 1 - P(t, 0, imp) : 0;
    o.lines.forEach(q => { const x0 = q.side < 0 ? lx + 40 : rx - 40; q.l.setAttribute('x1', x0); q.l.setAttribute('x2', x0 + q.side * q.len * vel * 2.2); q.l.setAttribute('y1', q.y); q.l.setAttribute('y2', q.y); q.l.style.opacity = vel > .05 ? vel : 0; });
    const f = P(t, imp, imp + .3); $('fl').style.opacity = f > 0 ? Math.pow(1 - f, 2) : 0; $('fl').setAttribute('r', L(120, 420, ex(f)));
    [[$('r1'), imp, 12], [$('r2'), snap, 8]].forEach(([c, s0, w]) => { const x = P(t, s0, s0 + .6); c.setAttribute('r', L(40, 560, ex(x))); c.setAttribute('stroke-width', L(w, 1, x)); c.style.opacity = x > 0 && x < 1 ? 1 - x : 0; });
    o.sp.forEach(q => { const x = P(t, imp, imp + .5), d0 = 60 + ex(x) * q.v, d1 = d0 + 50 * (1 - x); q.l.setAttribute('x1', 540 + Math.cos(q.a) * d0); q.l.setAttribute('y1', 900 + Math.sin(q.a) * d0); q.l.setAttribute('x2', 540 + Math.cos(q.a) * d1); q.l.setAttribute('y2', 900 + Math.sin(q.a) * d1); q.l.style.opacity = x > 0 && x < 1 ? 1 - x : 0; });
    // lock: a dot that grows into the body, the shackle draws itself, then snaps shut
    const b = P(t, .36, .72), bb = back(cl(b), 2.2), bw = L(36, 250, bb), bh = L(36, 200, bb), br = L(18, 44, b);
    const bd = $('bd'); bd.setAttribute('x', -bw / 2); bd.setAttribute('y', -bh / 2 + 30); bd.setAttribute('width', bw); bd.setAttribute('height', bh); bd.setAttribute('rx', br); bd.style.opacity = t > .36 ? 1 : 0;
    const bcr = $('bcr'); ['x', 'y', 'width', 'height', 'rx'].forEach(k => bcr.setAttribute(k, bd.getAttribute(k)));
    const lift = t < snap ? 46 : L(46, 0, ex(P(t, snap, snap + .08))); $('shk').setAttribute('d', `M-74 ${-70 + 30} V${-118 - lift} a74 74 0 0 1 148 0 V${t < snap ? -96 - lift : -70 + 30}`);
    draw($('shk'), ex(P(t, .55, .9))); $('shk').style.opacity = t > .55 ? 1 : 0;
    const sqz = t > snap ? 1 - .1 * Math.exp(-(t - snap) * 10) * Math.cos((t - snap) * 34) : 1; $('lki').setAttribute('transform', `scale(${2 - sqz} ${sqz})`);
    const k = spring(P(t, snap + .02, snap + .3), 12); $('kh').setAttribute('transform', `translate(0 30) scale(${k})`);
    const sh = P(t, 1.3, 1.75); $('shn').setAttribute('x', L(-260, 160, ex(sh)) - 60); $('shn').setAttribute('y', -100); $('shn').setAttribute('width', 120); $('shn').setAttribute('height', 300); $('shn').style.opacity = sh > 0 && sh < 1 ? 1 : 0;
    const sx = shake(t, imp, 16) + shake(t, snap, 8), push = L(1, 1.05, eio(P(t, 0, this.dur)));
    $('lk').setAttribute('transform', `translate(540 900)`); $('all').setAttribute('transform', `translate(${540 + sx} ${900 + sx * .6}) scale(${push}) translate(-540 -900)`);
    o.ws.forEach((w, i) => { const x = ex(P(t, 1.25 + i * .12, 1.85 + i * .12)); w.style.transform = `translateY(${(1 - x) * 115}%) rotate(${(1 - x) * 8}deg)`; w.style.filter = `blur(${(1 - x) * 6}px)`; });
    const g = P(t, 1.6, 2.2); o.sub.style.opacity = g; o.sub.style.letterSpacing = L(26, 8, ex(g)) + 'px';
    const out = exio(P(t, this.dur - .3, this.dur)); o.s.style.opacity = 1 - out; o.s.style.transform = `scale(${1 - out * .12})`; o.tag.style.opacity = 1 - out; o.sub.style.opacity = g * (1 - out); } });

/* ---------- hq-02 · كابشن ببرواز بيتنقل ---------- */
def({ id: 'hq-02', cat: 'hq', name: 'كابشن · محسّن', use: 'الكلمات بتطلع من تحت ماسك، وبرواز سماوي بيتنقل من كلمة للي بعدها وهي بتتقال. الكابشن الأساسي بالمستوى الجديد.', dur: 2.6, blend: 'alpha',
  params: { text: 'كل رسالة بتبقى كارت', y: 1280 },
  init(r, p) { const row = el('div', `position:absolute;left:40px;right:40px;top:${p.y}px;display:flex;justify-content:center;gap:26px;direction:rtl;font:700 92px/1.25 ${F.ar}`, r);
    const pill = el('div', `position:absolute;top:0;height:100%;border-radius:26px;background:${C.cyan};box-shadow:0 12px 40px rgba(0,204,242,.5);z-index:0`, row);
    const ws = p.text.split(' ').map(w => { const m = el('span', 'position:relative;z-index:1;display:inline-block;overflow:hidden;padding:4px 18px 16px', row); return { m, w: el('span', 'display:inline-block;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.55)', m, w) }; });
    return { row, pill, ws }; },
  frame(o, t) { const n = o.ws.length, at = i => .1 + i * .34, out = P(t, this.dur - .4, this.dur);
    o.ws.forEach((q, i) => { const x = ex(P(t, at(i), at(i) + .45)), y = exio(P(t, this.dur - .4 + i * .05, this.dur - .1 + i * .05));
      q.w.style.transform = `translateY(${(1 - x) * 110 + y * 110}%) rotate(${(1 - x) * 10}deg) scale(${L(1.2, 1, x)})`; });
    let cur = 0; for (let i = 1; i < n; i++) if (t > at(i) - .06) cur = i;
    const rb = o.row.getBoundingClientRect(), box = i => { const b = o.ws[i].m.getBoundingClientRect(), s = rb.width / o.row.offsetWidth || 1; return [(b.left - rb.left) / s, b.width / s]; };
    const [x0, w0] = box(Math.max(0, cur - 1)), [x1, w1] = box(cur), m = cur === 0 ? 1 : ex(P(t, at(cur) - .06, at(cur) + .3));
    const st = ex(P(t, at(0), at(0) + .35)) * (1 - exio(out)); o.pill.style.left = L(x0, x1, m) + 'px'; o.pill.style.width = L(w0, w1, m) + 'px';
    o.pill.style.transform = `scale(${st}) scaleX(${1 + .08 * Math.sin(Math.PI * m)})`; o.pill.style.opacity = st > .01 ? 1 : 0;
    o.ws.forEach((q, i) => q.w.style.color = i === cur && st > .5 ? C.navy : '#fff'); o.ws.forEach((q, i) => q.w.style.textShadow = i === cur && st > .5 ? 'none' : '0 4px 18px rgba(0,0,0,.55)'); } });

/* ---------- hq-03 · كلمة كبيرة بتتجمع من شرايح ---------- */
def({ id: 'hq-03', cat: 'hq', name: 'كلمة كبيرة · محسّنة', use: 'الكلمة بتيجي ٤ شرايح من الناحيتين وتتقفل على بعض بضربة، وظلال ألوان بتتجمع فيها. للحظة المهمة: «بكام؟» أو «صفر» أو «اتفقنا».', dur: 1.9, blend: 'alpha',
  params: { text: 'بكام؟', sub: 'رسالة واحدة… بس مهمة' },
  init(r, p) { const w = el('div', 'position:absolute;left:0;right:0;top:640px;height:460px', r), N = 4, mk = (css, c) => el('div', `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;direction:rtl;font:700 330px/1 ${F.ar};white-space:nowrap;color:${c};${css}`, w, p.text);
    const ghosts = [mk('mix-blend-mode:screen', C.cyan), mk('mix-blend-mode:screen', '#FF3B6B')];
    const sl = [...Array(N)].map((_, i) => mk(`clip-path:inset(${i * 100 / N}% 0 ${100 - (i + 1) * 100 / N - .3}% 0);text-shadow:0 0 50px rgba(0,204,242,.35)`, '#fff'));
    const ul = el('div', `position:absolute;left:50%;top:1090px;width:520px;height:16px;margin-left:-260px;border-radius:8px;background:${C.cyan2};box-shadow:0 0 30px rgba(0,204,242,.8)`, r);
    const m = el('div', 'position:absolute;left:0;right:0;top:1140px;text-align:center;overflow:hidden;padding:6px 0 14px', r), s = el('div', `display:inline-block;font:700 64px ${F.ar};color:${C.cyan2};direction:rtl`, m, p.sub);
    return { w, ghosts, sl, ul, s }; },
  frame(o, t) { const lock = .38, out = exio(P(t, this.dur - .32, this.dur));
    o.sl.forEach((e, i) => { const d = i * .035, x = ex(P(t, d, lock)), dir = i % 2 ? 1 : -1; e.style.transform = `translateX(${dir * ((1 - x) * 900 + out * 1200)}px) skewX(${dir * (1 - x) * -18}deg)`; });
    const g = 1 - ex(P(t, .1, lock + .25)); o.ghosts.forEach((e, i) => { e.style.transform = `translate(${(i ? 1 : -1) * (g * 40 + 6 * Math.exp(-(t - lock) * 6) * (t > lock))}px,0)`; e.style.opacity = t < .1 ? 0 : (.25 + g * .55) * (1 - out); });
    const k = t > lock ? 1 + .1 * Math.exp(-(t - lock) * 8) * Math.cos((t - lock) * 24) : 1; o.w.style.transform = `scale(${k})`;
    o.ul.style.transform = `scaleX(${ex(P(t, lock, lock + .35)) * (1 - out)})`; o.s.style.transform = `translateY(${(1 - ex(P(t, lock + .1, lock + .55))) * 110 + out * 110}%)`; } });

/* ---------- hq-04 · فقاعة شات بتتحول كارت عميل ---------- */
def({ id: 'hq-04', cat: 'hq', name: 'رسالة بتتحول كارت عميل', use: 'رسالة واتساب بتنزل، وبعدين بتتمط وتتحول قدامك لكارت عميل في السيستم: «كل رسالة بتبقى كارت». قلب أي ريل CRM.', dur: 3.2, blend: 'alpha',
  params: { msg: 'بكام الأوضة؟', name: 'هدى س.', ask: 'سألت على: الأوضة', tag: 'عميل جديد', ok: 'اتسجّل في السيستم' },
  init(r, p) { const m = el('div', 'position:absolute;left:50%;top:900px;overflow:hidden;direction:rtl;transform-origin:center', r);
    const a = el('div', `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:400 58px ${F.ar};color:#111B21;white-space:nowrap`, m, p.msg + ` <span style="font-size:34px;color:#8696A0;margin-right:16px;font-family:${F.num}">9:41</span>`);
    const b = el('div', `position:absolute;inset:0;padding:44px 48px;display:flex;flex-direction:column;gap:22px;font:400 40px ${F.ar};color:#fff`, m);
    const top = el('div', 'display:flex;align-items:center;gap:26px', b), av = el('div', `width:120px;height:120px;flex:none;border-radius:50%;background:${C.cyan};color:${C.navy};display:flex;align-items:center;justify-content:center;font:700 58px ${F.ar}`, top, p.name[0]);
    const nm = el('div', 'flex:1', top, `<div style="font:700 60px ${F.ar}">${p.name}</div><div style="color:${C.muted}">${p.ask}</div>`);
    const tg = el('div', `align-self:flex-start;padding:10px 28px 14px;border-radius:99px;background:rgba(0,204,242,.18);border:2px solid rgba(0,204,242,.6);color:${C.cyan2};font:700 36px ${F.ar}`, b, p.tag);
    const okr = el('div', `display:flex;align-items:center;gap:16px;color:${C.green};font:700 38px ${F.ar}`, b, `<svg viewBox="0 0 40 40" width="48" height="48"><circle cx="20" cy="20" r="18" fill="none" stroke="${C.green}" stroke-width="4"/><path d="M11 21l6 6 12-13" fill="none" stroke="${C.green}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${p.ok}</span>`);
    const tail = el('div', 'position:absolute;left:50%;top:900px;width:40px;height:36px;transform-origin:0 0', r, '<svg viewBox="0 0 40 36" width="40" height="36"><path d="M40 0 C30 14 14 26 0 34 C18 34 34 28 40 18 Z" fill="#fff"/></svg>');
    return { m, a, b, parts: [top, tg, okr], ck: okr.querySelectorAll('circle,path'), tail }; },
  frame(o, t) { const pin = spring(P(t, 0, .55), 9), mo = P(t, 1.05, 1.65), me = exio(mo), ov = spring(mo, 7), out = exio(P(t, this.dur - .3, this.dur));
    const w = L(560, 860, ov), h = L(160, 470, me), rr = L(48, 46, me), bg = me < .5 ? mix('#FFFFFF', '#5FA8D8', me * 2) : mix('#5FA8D8', '#0F2C52', me * 2 - 1);
    o.m.style.width = w + 'px'; o.m.style.height = h + 'px'; o.m.style.borderRadius = `${rr}px ${rr}px ${L(14, 46, me)}px ${rr}px`; o.m.style.background = bg;
    o.m.style.border = `${L(0, 4, me)}px solid rgba(63,214,245,${me * .7})`; o.m.style.boxSizing = 'border-box';
    o.m.style.boxShadow = `0 30px 70px rgba(0,0,0,.4),0 0 ${L(0, 80, me)}px rgba(0,204,242,${me * .45})`;
    const sx = 1 + .06 * Math.sin(Math.PI * P(t, .95, 1.15)), sc = L(.2, 1, pin) * (1 - out * .15);
    o.m.style.transform = `translate(-50%,-50%) scale(${sc * sx},${sc / sx}) translateY(${Math.sin(t * 1.6) * 6 * P(t, 1.8, 2.4)}px)`; o.m.style.opacity = Math.min(1, pin * 3) * (1 - out);
    o.a.style.opacity = 1 - P(t, 1.0, 1.15); o.a.style.filter = `blur(${P(t, 1.0, 1.15) * 12}px)`;
    o.tail.style.transform = `translate(${-w / 2 - 14}px,${h / 2 - 34}px) scale(${pin * (1 - P(t, 1.0, 1.15))})`;
    o.parts.forEach((q, i) => { const x = ex(P(t, 1.45 + i * .18, 1.95 + i * .18)); q.style.opacity = x; q.style.transform = `translateY(${(1 - x) * 30}px)`; });
    const c = P(t, 2.05, 2.45); draw(o.ck[0], ex(c)); draw(o.ck[1], ex(P(t, 2.25, 2.55))); } });

/* ---------- hq-05 · مسحة القوس (انتقال) ---------- */
def({ id: 'hq-05', cat: 'hq', tr: true, name: 'مسحة القوس · محسّنة', use: 'انتقال توقيعنا بالمستوى الجديد: لوح كحلي بشبكة خفيفة، وحرفه قوس منوّر وراه صدى، وخطوط سرعة. نصه يغطي الشاشة كلها.', dur: .9, blend: 'alpha',
  init(r) { const d = BRACE_L.replace(/-?\d+(\.\d+)?/g, n => +n * 3), echo = (dx, op, w) => `<path d="${d}" transform="translate(${dx} 0)" fill="none" stroke="${C.cyan2}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
    const s = svg(r, `<defs>${GLOW}<pattern id="gd" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="rgba(63,214,245,.12)" stroke-width="2"/></pattern>
      <linearGradient id="pf" x1="0" x2="1"><stop offset="0" stop-color="#123A68"/><stop offset=".25" stop-color="${C.navy}"/><stop offset="1" stop-color="#061629"/></linearGradient></defs>
      <g id="g"><path d="${d} L2900 1920 L2900 0 Z" fill="url(#pf)"/><path d="${d} L2900 1920 L2900 0 Z" fill="url(#gd)"/>${echo(150, .25, 8)}${echo(80, .5, 12)}
      <path d="${d}" fill="none" stroke="${C.cyan2}" stroke-width="30" stroke-linecap="round" filter="url(#gl)"/></g><g id="ln"></g>`);
    const ln = [...Array(16)].map((_, i) => { const l = document.createElementNS('http://www.w3.org/2000/svg', 'line'); l.setAttribute('stroke', i % 3 ? '#fff' : C.cyan2); l.setAttribute('stroke-width', 3 + rnd(i) * 7); l.setAttribute('stroke-linecap', 'round'); s.querySelector('#ln').appendChild(l); return { l, y: rnd(i * 3) * 1920, len: 200 + rnd(i * 5) * 500, d: rnd(i * 7) * 120 }; });
    return { g: s.querySelector('#g'), ln }; },
  frame(o, t) { const pr = P(t, 0, this.dur), x = L(1000, -3100, L(eio(pr), exio(pr), .5)), v = Math.sin(Math.PI * P(t, 0, this.dur)); o.g.setAttribute('transform', `translate(${x} 0)`);
    o.ln.forEach(q => { const lx = x + 180 + q.d; q.l.setAttribute('x1', lx); q.l.setAttribute('x2', lx + q.len * v); q.l.setAttribute('y1', q.y); q.l.setAttribute('y2', q.y); q.l.style.opacity = v * .8; }); } });
})();

/* ---------- hq-06 · مشهد بكاميرا بتتابع اللي بيحصل ---------- */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, spring, eo, eio, P, L, cl, rnd, WA } = H;
const ex = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const mix = (a, b, x) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(L(v, B[i], x))).join(',')})`; };
// camera path: [time, x, y, zoom]; the camera eases from key to key, zoom moves in log space
const KEYS = [[0, 760, 330, 2.3], [1.15, 760, 680, 2.1], [1.55, 540, 960, 1.0], [2.05, 540, 960, 1.0], [2.65, 880, 1240, 1.9], [3.5, 205, 1240, 1.9], [3.95, 208, 1235, 2.7], [4.25, 113, 1285, 3.2], [4.75, 113, 1285, 18]];
function camAt(t) { let i = 0; while (i < KEYS.length - 1 && t > KEYS[i + 1][0]) i++; const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const x = b === a ? 1 : eio(P(t, a[0], b[0])), z = Math.exp(L(Math.log(a[3]), Math.log(b[3]), x)); return { x: L(a[1], b[1], x), y: L(a[2], b[2], x), z }; }
LIB.push({ id: 'hq-06', cat: 'hq', name: 'كاميرا بتتابع الحكاية', params: { msgs: ['لسه متاح؟', 'بكام الأوضة؟', 'فين العنوان؟', 'ممكن صور تاني؟', 'حد يرد بقا 🙏', 'عاوز أحجز النهارده'], ask: 'سألت على الأوضة' }, use: 'مشهد كامل (CRM): الكاميرا بتمشي ورا اللي بيحصل. بتزوّم على الرسايل، وتطلع تكشف اللوحة، وتتابع الكارت لحد «اتقفل»، وتدخل جوّه القفل. فيه بلور حركة زي فيديو الـ IDOR.', dur: 6.0, blend: 'scene', bg: '#000',
  init(r, p) { const ns = 'http://www.w3.org/2000/svg';
    const f = document.createElementNS(ns, 'svg'); f.setAttribute('width', 0); f.setAttribute('height', 0); f.style.position = 'absolute'; f.innerHTML = '<filter id="cmb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="cmbb" stdDeviation="0 0"/></filter>'; r.appendChild(f);
    const bg = el('div', 'position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#123A68,#06142A 75%)', r);
    const cam = el('div', 'position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0', r);
    el('div', 'position:absolute;inset:-400px;background-image:linear-gradient(rgba(63,214,245,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(63,214,245,.07) 2px,transparent 2px);background-size:60px 60px', cam);
    // chat panel
    const chat = el('div', `position:absolute;left:60px;top:150px;width:960px;height:820px;border-radius:44px;background:#0B141A;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden;direction:rtl`, cam);
    el('div', `height:110px;display:flex;align-items:center;gap:20px;padding:0 36px;background:#1F2C34;color:#fff;font:700 40px ${F.ar}`, chat, `<span style="width:70px;height:70px;border-radius:50%;background:${C.wa};padding:12px;box-sizing:border-box">${WA}</span>واتساب الشغل<span style="margin-right:auto;background:${C.red};border-radius:99px;padding:4px 20px;font:700 32px ${F.num}">99+</span>`);
    const msgs = p.msgs;
    const bub = msgs.map((m, i) => el('div', `position:absolute;right:${i === 1 ? 60 : 60}px;top:${150 + i * 112}px;padding:18px 30px;border-radius:30px 30px 30px 8px;background:#202C33;color:#E9EDEF;font:400 40px ${F.ar};white-space:nowrap;box-shadow:0 6px 16px rgba(0,0,0,.3)`, chat, m));
    bub[1].style.visibility = 'hidden';
    // pipeline board
    const board = el('div', 'position:absolute;left:40px;top:1060px;width:1000px;height:640px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;direction:rtl', cam);
    ['جديد', 'بنتفاوض', 'اتقفل'].forEach((n, i) => { const c = el('div', 'background:rgba(244,247,251,.96);border-radius:30px;padding:22px 16px;display:flex;flex-direction:column;gap:16px;box-shadow:0 24px 50px rgba(0,0,0,.35)', board);
      el('div', `font:700 36px ${F.ar};color:${C.navy};display:flex;justify-content:space-between;align-items:center;height:48px`, c, `${n}<i style="width:22px;height:22px;border-radius:50%;display:block;background:${['#00CCF2', '#FFB020', '#30D158'][i]}"></i>`);
      [...Array(i === 1 ? 1 : 0)].forEach((_, j) => el('div', 'height:130px;border-radius:20px;background:#fff;box-shadow:0 4px 14px rgba(10,36,68,.08);padding:20px;box-sizing:border-box', c, `<div style="height:22px;width:${60 + rnd(i * 3 + j) * 30}%;border-radius:11px;background:#DDE6F0"></div><div style="height:18px;width:${40 + rnd(i * 5 + j) * 30}%;border-radius:9px;background:#EBF0F6;margin-top:16px"></div>`)); });
    // the message that becomes a customer card (lives on the camera layer so it can travel)
    const mv = el('div', `position:absolute;overflow:hidden;direction:rtl;box-sizing:border-box;z-index:5`, cam);
    const ma = el('div', `position:absolute;inset:0;display:flex;align-items:center;padding:0 30px;color:#E9EDEF;font:400 40px ${F.ar};white-space:nowrap`, mv, msgs[1]);
    const mb = el('div', `position:absolute;inset:0;padding:18px 22px;color:${C.navy};font:400 24px ${F.ar}`, mv,
      `<div style="display:flex;align-items:center;gap:12px"><i style="width:52px;height:52px;flex:none;border-radius:50%;background:${C.cyan};display:flex;align-items:center;justify-content:center;font:700 28px ${F.ar};font-style:normal">ه</i><div style="white-space:nowrap"><b style="font-size:30px;display:block">هدى س.</b>${p.ask}</div></div>`);
    const lk = el('div', `position:absolute;left:14px;bottom:12px;width:46px;height:46px;border-radius:12px;background:${C.navy};display:flex;align-items:center;justify-content:center`, mv,
      `<svg viewBox="-40 -50 80 100" width="26" height="32"><rect x="-30" y="-6" width="60" height="46" rx="9" fill="${C.cyan2}"/><path id="cs" d="M-18 -6 V-24 a18 18 0 0 1 36 0 V-14" fill="none" stroke="${C.cyan2}" stroke-width="9" stroke-linecap="round"/></svg>`);
    const ok = el('div', `position:absolute;right:16px;bottom:14px;padding:4px 14px;border-radius:99px;background:#E6F9EC;color:#1FA34A;font:700 22px ${F.ar}`, mv, 'اتفقنا ✓');
    const end = el('div', `position:absolute;inset:0;background:${C.navy};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px`, r);
    const et = el('div', `font:700 104px ${F.ar};color:#fff;direction:rtl;text-shadow:0 0 40px rgba(0,204,242,.6);overflow:hidden;padding:8px 10px 20px`, end), ew = el('div', 'display:inline-block', et, 'متأمّن من جوّا');
    const es = el('div', `font:700 36px ${F.num};color:${C.cyan2};letter-spacing:10px;direction:ltr`, end, '{ LOGIKA }');
    return { cam, bub, mv, ma, mb, lk, cs: lk.querySelector('#cs'), ok, end, ew, es, blur: f.querySelector('#cmbb') }; },
  frame(o, t) {
    o.bub.forEach((b, i) => { if (i === 1) return; const a = .1 + i * .19, k = spring(P(t, a, a + .4), 9); b.style.opacity = Math.min(1, k * 2); b.style.transform = `translateY(${(1 - k) * 40}px) scale(${L(.7, 1, k)})`; b.style.transformOrigin = 'right bottom'; });
    // message -> card -> «جديد» -> «اتقفل»
    const bw = o.bub[1].offsetWidth || 360, bubR = [1020 - 60 - bw, 150 + 150 + 112, bw, 80], cardN = [748, 1150, 264, 170], cardD = [76, 1150, 264, 170];
    const a1 = .29, k1 = spring(P(t, a1, a1 + .4), 9), m = ex(P(t, 1.9, 2.55)), g = eio(P(t, 2.75, 3.45));
    let [x, y, w, h] = bubR.map((v, i) => L(v, cardN[i], m)); if (g > 0) { x = L(cardN[0], cardD[0], g); y = L(cardN[1], cardD[1], g) - Math.sin(Math.PI * g) * 120; }
    o.mv.style.left = x + 'px'; o.mv.style.top = y + 'px'; o.mv.style.width = w + 'px'; o.mv.style.height = h + 'px';
    o.mv.style.borderRadius = `${L(30, 22, m)}px ${L(30, 22, m)}px ${L(8, 22, m)}px ${L(30, 22, m)}px`; o.mv.style.background = m < .5 ? mix('#202C33', '#6FA9CF', m * 2) : mix('#6FA9CF', '#FFFFFF', m * 2 - 1);
    const hl = P(t, 1.55, 1.75) * (1 - m); o.mv.style.boxShadow = `0 0 0 ${4 * (hl + m)}px ${t > 3.45 ? C.green : C.cyan}, 0 ${L(6, 30, m)}px ${L(16, 50, m)}px rgba(0,0,0,${L(.3, .4, m)})`;
    o.mv.style.opacity = Math.min(1, k1 * 2); o.mv.style.transform = `scale(${L(.7, 1, k1) * (1 + .08 * Math.sin(Math.PI * P(t, 3.45, 3.7)))}) rotate(${Math.sin(Math.PI * g) * -5}deg)`;
    o.ma.style.opacity = 1 - P(t, 1.9, 2.05); o.mb.style.opacity = P(t, 2.25, 2.5); o.ok.style.opacity = P(t, 3.5, 3.7); o.ok.style.transform = `scale(${spring(P(t, 3.5, 3.8), 10)})`;
    o.lk.style.opacity = P(t, 3.75, 3.9); o.lk.style.transform = `scale(${spring(P(t, 3.75, 4.05), 10)})`; o.cs.setAttribute('d', t < 4.15 ? 'M-18 -6 V-34 a18 18 0 0 1 36 0 V-24' : 'M-18 -6 V-24 a18 18 0 0 1 36 0 V-6');
    // camera + blur from its own speed
    const c = camAt(t), pc = camAt(Math.max(0, t - 1 / 30));
    o.cam.style.transform = `translate(540px,960px) scale(${c.z}) translate(${-c.x}px,${-c.y}px)`;
    const vx = Math.abs(c.x - pc.x) * c.z, vy = Math.abs(c.y - pc.y) * c.z, vz = Math.abs(Math.log(c.z / pc.z)) * 260, bx = cl(vx * .25 + vz * .4, 0, 14), by = cl(vy * .25 + vz * .6, 0, 14);
    o.blur.setAttribute('stdDeviation', `${(bx / c.z).toFixed(2)} ${(by / c.z).toFixed(2)}`); o.cam.style.filter = bx > .4 || by > .4 ? 'url(#cmb)' : '';
    const e = P(t, 4.6, 4.8); o.end.style.opacity = e; o.ew.style.transform = `translateY(${(1 - ex(P(t, 4.8, 5.3))) * 115}%)`; o.es.style.opacity = P(t, 5.1, 5.5); o.es.style.letterSpacing = L(26, 10, ex(P(t, 5.1, 5.7))) + 'px'; } });
})();

/* ---------- hq-07 … hq-10: the most used pieces, rebuilt ---------- */
(function () {
const { LIB, C, F, H } = window.LOGIKA_LIB;
const { el, svg, draw, spring, eio, P, L, cl, rnd, BRACE_L, BRACE_R, WA } = H;
const ex = x => x >= 1 ? 1 : x <= 0 ? 0 : 1 - Math.pow(2, -10 * x);
const exio = x => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
const def = o => LIB.push(Object.assign({ cat: 'hq', blend: 'alpha' }, o));
const shake = (t, at, amp) => t > at && t < at + .3 ? (1 - P(t, at, at + .3)) * amp * (rnd(Math.floor(t * 60) + at * 100) - .5) * 2 : 0;
const GLOW = '<filter id="gl2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16" result="b"/><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="c"/><feMerge><feMergeNode in="b"/><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

def({ id: 'hq-07', name: 'ختم · محسّن', use: 'الختم بيتشال لفوق، وبعدين ينزل بخبطة وحبر بيطرطش، وعليه ملمس حبر حقيقي. «اتمنع» أو «اتقفل» أو «اتدفع».', dur: 2.0,
  params: { text: 'اتمنع', color: '#FF453A' },
  init(r, p) { const s = svg(r, `<defs><filter id="ink" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" result="d"/>
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="7" result="sp"/><feColorMatrix in="sp" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" result="holes"/><feComposite in="d" in2="holes" operator="in"/></filter></defs>
      <g id="sh"><g id="st" filter="url(#ink)"><rect id="bx" fill="none" stroke="${p.color}" stroke-width="16" rx="30"/><text id="tx" text-anchor="middle" font-family='${F.ar}' font-weight="700" font-size="190" fill="${p.color}">${p.text}</text></g><g id="spl"></g></g>`);
    const $ = i => s.querySelector('#' + i), spl = [...Array(16)].map((_, i) => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('fill', p.color); $('spl').appendChild(c); return { c, a: rnd(i) * Math.PI * 2, d: 260 + rnd(i * 3) * 220, r: 4 + rnd(i * 5) * 12 }; });
    return { s, $, spl, p }; },
  frame(o, t) { const $ = o.$, tx = $('tx'), bb = tx.getBBox(); if (bb.width) { const bx = $('bx'); bx.setAttribute('x', bb.x - 60); bx.setAttribute('y', bb.y - 10); bx.setAttribute('width', bb.width + 120); bx.setAttribute('height', bb.height + 30); }
    const hit = .32, lift = ex(P(t, 0, .22)), fall = Math.pow(P(t, .22, hit), 2.5), sc = t < hit ? L(1, 2.2, lift) - (L(1, 2.2, lift) - 1) * fall : 1 + .06 * Math.exp(-(t - hit) * 10) * Math.cos((t - hit) * 30);
    tx.setAttribute('x', 0); tx.setAttribute('y', 66); const sx = shake(t, hit, 18);
    $('sh').setAttribute('transform', `translate(${540 + sx} ${930 + sx * .6}) rotate(-12) scale(${sc})`); $('st').style.opacity = t < hit ? L(0, .55, lift) : 1;
    o.spl.forEach(q => { const x = ex(P(t, hit, hit + .35)); q.c.setAttribute('cx', Math.cos(q.a) * q.d * x); q.c.setAttribute('cy', Math.sin(q.a) * q.d * .6 * x); q.c.setAttribute('r', t > hit ? q.r * (1 - P(t, hit + .2, hit + .6) * .4) : 0); });
    o.s.style.opacity = 1 - exio(P(t, this.dur - .25, this.dur)); } });

def({ id: 'hq-08', name: 'زرار واتساب · محسّن', use: 'أيقونة واتساب بتنزل وتتمط لزرار برتقاني، والماوس بيدوس عليه بموجة، والرقم بيتكتب تحته. الـ CTA بالمستوى الجديد.', dur: 3.0,
  params: { text: 'ابعتلنا على واتساب', num: '+20 122 641 2843', y: 1120 },
  init(r, p) { const w = el('div', `position:absolute;left:0;right:0;top:${p.y}px;height:170px;display:flex;justify-content:center`, r);
    const b = el('div', `position:relative;height:160px;border-radius:80px;background:${C.orange};overflow:hidden;box-shadow:0 24px 70px rgba(245,106,57,.55);display:flex;align-items:center;justify-content:center;gap:22px;direction:rtl;color:#fff;font:700 58px ${F.ar}`, w);
    const ic = el('span', 'width:76px;height:76px;flex:none;display:block', b, WA), tx = el('span', 'white-space:nowrap;display:inline-block', b, p.text);
    const sh = el('i', 'position:absolute;top:-30px;bottom:-30px;width:150px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent);transform:skewX(-20deg);display:block', b);
    const rp = el('i', 'position:absolute;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:rgba(255,255,255,.55);display:block;left:65%;top:55%', b);
    const n = el('div', `position:absolute;left:0;right:0;top:${p.y + 200}px;text-align:center;font:700 52px ${F.num};color:#fff;direction:ltr;text-shadow:0 4px 20px rgba(0,0,0,.5)`, r);
    const cu = el('div', 'position:absolute;left:0;top:0;width:90px;height:90px;z-index:5;filter:drop-shadow(0 8px 14px rgba(0,0,0,.45))', r, '<svg viewBox="0 0 24 24" width="90" height="90"><path d="M5 2.5l13.5 12.2-6.1.6 3.6 7.1-2.8 1.4-3.6-7.2L5 21z" fill="#fff" stroke="#0A2444" stroke-width="1.4" stroke-linejoin="round"/></svg>');
    return { b, ic, tx, sh, rp, n, cu, p }; },
  frame(o, t) { const k = spring(P(t, 0, .45), 9), m = ex(P(t, .45, 1.0)), w = L(160, 760, m); o.b.style.width = w + 'px'; o.b.style.transform = `translateY(${(1 - k) * -300}px) scale(${L(.3, 1, k) * (1 - .07 * Math.sin(Math.PI * P(t, 1.5, 1.68)))})`; o.b.style.opacity = Math.min(1, k * 3);
    o.tx.style.opacity = P(t, .7, .95); o.tx.style.transform = `translateX(${(1 - ex(P(t, .7, 1.1))) * -40}px)`; o.tx.style.display = m > .2 ? 'inline-block' : 'none';
    o.sh.style.left = (P(t, 1.05, 1.5) * (w + 300) - 200) + 'px'; const rq = P(t, 1.55, 2.1); o.rp.style.transform = `scale(${L(.2, 18, ex(rq))})`; o.rp.style.opacity = rq > 0 && rq < 1 ? (1 - rq) * .8 : 0;
    const s = o.p.num, c = Math.floor(cl(P(t, 1.9, 2.6)) * s.length); o.n.textContent = s.slice(0, c);
    const cm = ex(P(t, 1.0, 1.5)), cx = L(960, 640, cm), cy = L(1720, o.p.y + 100, cm); o.cu.style.transform = `translate(${cx - 19}px,${cy - 9}px) scale(${t > 1.5 && t < 1.68 ? .85 : 1})`; o.cu.style.opacity = P(t, .9, 1.05) * (1 - P(t, 2.1, 2.4));
    const op = 1 - exio(P(t, this.dur - .25, this.dur)); o.b.parentNode.style.opacity = op; o.n.style.opacity = op; } });

def({ id: 'hq-09', name: 'نهاية لوجيكا · محسّنة', use: 'الأقواس بتخبط من الجنبين، واللوجو بيطلع من بلور ونور بيعدّي عليه، و«متأمّن من جوّا» كلمة كلمة. آخر ٣ ثواني في أي فيديو.', dur: 3.2,
  params: { tag: 'متأمّن من جوّا' },
  init(r, p) { const s = svg(r, `<defs>${GLOW}</defs><g id="L"><path d="${BRACE_L}"/></g><g id="R"><path d="${BRACE_R}"/></g><circle id="rg" cx="540" cy="900" fill="none" stroke="${C.cyan2}"/>`);
    s.querySelectorAll('path').forEach(e => { e.setAttribute('fill', 'none'); e.setAttribute('stroke', C.cyan2); e.setAttribute('stroke-width', 18); e.setAttribute('stroke-linecap', 'round'); e.setAttribute('filter', 'url(#gl2)'); });
    const lw = el('div', 'position:absolute;left:50%;top:740px;width:560px;margin-left:-280px;overflow:hidden', r), img = el('img', 'display:block;width:560px', lw); img.src = window.LOGIKA_LOGO || '';
    const sh = el('i', 'position:absolute;top:-40px;bottom:-40px;width:160px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg);mix-blend-mode:overlay;display:block', lw);
    const tag = el('div', `position:absolute;left:0;right:0;top:1150px;display:flex;justify-content:center;gap:22px;direction:rtl;font:700 76px ${F.ar};color:${C.cyan2};text-shadow:0 0 30px rgba(0,204,242,.5)`, r);
    const ws = p.tag.split(' ').map(x => { const m = el('span', 'display:inline-block;overflow:hidden;padding:6px 2px 14px', tag); return el('span', 'display:inline-block', m, x); });
    return { s, L: s.querySelector('#L'), R: s.querySelector('#R'), rg: s.querySelector('#rg'), lw, img, sh, ws, tag }; },
  frame(o, t) { const hit = .32, a = ex(P(t, 0, hit)), sq = t > hit ? 1 - .2 * Math.exp(-(t - hit) * 9) * Math.cos((t - hit) * 30) : 1, sx = shake(t, hit, 14);
    o.L.setAttribute('transform', `translate(${L(-400, 120, a) + 92 + sx} 900) scale(${sq} ${2 - sq}) translate(-92 -320)`); o.R.setAttribute('transform', `translate(${L(1480, 960, a) - 92 + sx} 900) scale(${sq} ${2 - sq}) translate(92 -320)`);
    const q = P(t, hit, hit + .7); o.rg.setAttribute('r', L(60, 600, ex(q))); o.rg.setAttribute('stroke-width', L(12, 1, q)); o.rg.style.opacity = q > 0 && q < 1 ? 1 - q : 0;
    const g = ex(P(t, .45, 1.1)); o.img.style.transform = `scale(${L(1.4, 1, g)})`; o.img.style.filter = `blur(${(1 - g) * 24}px)`; o.img.style.opacity = g;
    o.sh.style.left = (P(t, 1.2, 1.75) * 900 - 250) + 'px'; o.ws.forEach((w, i) => { const x = ex(P(t, 1.25 + i * .12, 1.85 + i * .12)); w.style.transform = `translateY(${(1 - x) * 115}%)`; });
    const op = 1 - exio(P(t, this.dur - .3, this.dur)); o.s.style.opacity = op; o.lw.style.opacity = op; o.tag.style.opacity = op; } });

def({ id: 'hq-10', name: 'إشعار · محسّن', use: 'إشعار بينزل من فوق بميلة 3D خفيفة، وإشعار تاني بيبان وراه، وبعدين يتسحب لفوق. للرسايل والعملاء الجداد.', dur: 2.8,
  params: { title: 'واتساب', body: 'هدى س.: بكام الأوضة؟', body2: 'عميل جديد: لسه متاح؟', y: 150 },
  init(r, p) { const st = el('div', 'position:absolute;inset:0;perspective:1400px', r), card = (body, z) => { const c = el('div', `position:absolute;left:60px;right:60px;top:${p.y}px;display:flex;gap:26px;align-items:center;padding:30px 34px;border-radius:44px;direction:rtl;background:rgba(30,36,48,.94);box-shadow:0 30px 70px rgba(0,0,0,.45);transform-origin:center top;z-index:${z}`, st);
      el('div', `width:96px;height:96px;border-radius:24px;background:${C.wa};flex:none;padding:16px;box-sizing:border-box`, c, WA);
      el('div', `flex:1;min-width:0;color:#fff;font:400 40px ${F.ar}`, c, `<div style="display:flex;justify-content:space-between;color:#AEB4BE;font-size:32px"><b style="color:#fff;font-weight:600">${p.title}</b><span>الآن</span></div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${body}</div>`); return c; };
    return { a: card(p.body, 2), b: card(p.body2, 1) }; },
  frame(o, t) { const k = spring(P(t, 0, .7), 7), out = exio(P(t, this.dur - .45, this.dur));
    o.a.style.transform = `translateY(${(1 - k) * -380 - out * 420}px) rotateX(${(1 - k) * 35}deg) scale(${L(.85, 1, k)})`; o.a.style.opacity = Math.min(1, k * 3); o.a.style.filter = `blur(${Math.max(0, 1 - k * 1.4) * 10}px)`;
    const k2 = spring(P(t, .7, 1.3), 8); o.b.style.transform = `translateY(${L(-60, 34, k2) - out * 420}px) scale(${L(.85, .94, k2)})`; o.b.style.opacity = t > .7 ? Math.min(.8, k2 * 2) : 0; o.b.style.filter = 'brightness(.75)'; } });
})();
