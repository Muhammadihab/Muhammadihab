"""Logika sound kit, made entirely in code (no samples, no musical notes): whooshes, pops, ticks,
a metal latch, impacts, a riser and a sparkle, placed on the frame and given a little room reverb.
usage: python3 sfx.py <element id> <out.wav>        (cue lists live in CUES below)
"""
import sys, wave, numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng

def noise(n, seed=0): return rng(seed).standard_normal((n, 2)).astype(np.float32)
def filt(x, kind, f, order=2):
    f = np.atleast_1d(f) / (SR / 2); return sosfilt(butter(order, f if len(f) > 1 else f[0], kind, output='sos'), x, axis=0).astype(np.float32)
def norm(x, peak=.9): return x / (np.abs(x).max() + 1e-9) * peak
def pan(x, p):
    """equal-power pan; p is -1 (left) … 1 (right), a number or one value per sample"""
    a = (np.asarray(p, np.float32) + 1) * np.pi / 4; return np.stack([x[:, 0] * np.cos(a), x[:, 1] * np.sin(a)], 1) * 1.41
def mono(y): return np.stack([y, y], 1).astype(np.float32)

def whoosh(dur, peak=.6, lo=250, hi=3500, p0=0., p1=0., seed=1):
    """air moving past: band-passed noise layers cross-faded along a sweep, a swell to `peak`, and a low body"""
    n = int(dur * SR); t = np.linspace(0, 1, n, dtype=np.float32)
    env = np.where(t < peak, (t / peak) ** 2.4, ((1 - t) / (1 - peak)) ** 1.8)
    pos = np.where(t < peak, t / peak, 1 - (t - peak) / (1 - peak) * .7)           # where the sweep is, 0..1
    bands = np.geomspace(lo, hi, 6); x = noise(n, seed); out = np.zeros_like(x)
    for i, fc in enumerate(bands):
        w = np.exp(-((pos * 5 - i) ** 2) / .9)[:, None]; out += filt(x, 'bandpass', [fc / 1.5, fc * 1.5]) * w
    out += filt(noise(n, seed + 9), 'lowpass', 160) * 2.2 * env[:, None] ** 1.5
    return norm(pan(out * env[:, None], np.linspace(p0, p1, n)), .85)

def swell(dur, seed=4):
    """soft, dark rush for a shape that grows or morphs"""
    n = int(dur * SR); t = np.linspace(0, 1, n, dtype=np.float32); env = np.sin(np.pi * t) ** 2
    return norm(filt(noise(n, seed), 'lowpass', 900) * env[:, None], .7)

def pop(k=1.0, dur=.12, seed=12):
    """soft appear: a muted knock (like a card set down on a table) with a breath of air; no pitch, so it never beeps"""
    n = int(dur * SR); t = np.arange(n) / SR; x = noise(n, seed + int(k * 100))
    knock = filt(x, 'bandpass', [220 * k, 900 * k]) * (np.minimum(1, t / .002) * np.exp(-t * 55))[:, None]
    air = filt(x[::-1].copy(), 'bandpass', [2500, 7000]) * (np.minimum(1, t / .012) * np.exp(-t * 45))[:, None] * .25
    return norm(knock + air, .8)

def tick(k=1.0):
    """a dry UI tick"""
    n = int(.03 * SR); t = np.arange(n) / SR; y = np.sin(2 * np.pi * 3100 * k * t) * np.exp(-t * 260)
    y += filt(noise(n, 3)[:, 0:1], 'highpass', 2500)[:, 0] * np.exp(-t * 900) * .6; return mono(norm(y, .8))

def latch():
    """metal lock closing: two resonant metallic hits 28 ms apart and a small low knock"""
    n = int(.25 * SR); t = np.arange(n) / SR; out = np.zeros(n, np.float32)
    for at, g, k in ((0, 1, 1), (.028, .55, .82)):
        m = t >= at; tt = t[m] - at; burst = noise(int(m.sum()), int(at * 1e3) + 11)[:, 0] * np.exp(-tt * 600)
        ring = sum(filt(burst[:, None], 'bandpass', [f * k * .96, f * k * 1.04])[:, 0] for f in (1850, 3300, 5200, 7400))
        out[m] += (norm(ring) * np.exp(-tt * 55) + np.sin(2 * np.pi * 140 * tt) * np.exp(-tt * 70) * .5) * g
    return mono(norm(out, .9))

def impact(size=1.0, seed=5):
    """a hit with weight: falling sub, a body thump and a short crack, softly saturated"""
    n = int(.9 * SR); t = np.arange(n) / SR; f = 34 + 40 * np.exp(-t * 16); ph = 2 * np.pi * np.cumsum(f) / SR
    sub = np.sin(ph) * np.exp(-t * 5 / size); body = filt(noise(n, seed)[:, 0:1], 'lowpass', 260)[:, 0] * np.exp(-t * 14) * 2.5
    crack = filt(noise(n, seed + 1)[:, 0:1], 'highpass', 1800)[:, 0] * np.exp(-t * 70) * .5
    return mono(np.tanh(1.6 * (sub + body + crack)) * .9)

def riser(dur, seed=6):
    """air that climbs and tightens into a cut"""
    n = int(dur * SR); t = np.linspace(0, 1, n, dtype=np.float32); x = noise(n, seed); out = np.zeros_like(x)
    for i, fc in enumerate(np.geomspace(300, 7000, 7)):
        w = np.exp(-((t * 6 - i) ** 2) / .8)[:, None]; out += filt(x, 'bandpass', [fc / 1.4, fc * 1.4]) * w
    return norm(out * (t ** 2.2)[:, None], .85)

def sparkle(dur=.8, density=60, seed=8):
    """glints: many tiny high grains at random pitches (not notes) over a breath of air"""
    n = int(dur * SR); out = np.zeros((n, 2), np.float32); r = rng(seed); t = np.linspace(0, 1, n)
    for _ in range(int(density * dur)):
        at = r.beta(1.6, 2.6); g = int(.03 * SR); i = int(at * (n - g)); tt = np.arange(g) / SR
        y = np.sin(2 * np.pi * r.uniform(4200, 9500) * tt) * np.exp(-tt * r.uniform(90, 160)) * r.uniform(.3, 1); out[i:i + g] += pan(mono(y), r.uniform(-.8, .8))
    out += filt(noise(n, seed), 'highpass', 6000) * (np.sin(np.pi * t) ** 2)[:, None] * .5
    return norm(out, .7)

def place(mix, clip, at, db=0.):
    i = int(at * SR); s = max(0, -i); i = max(0, i); clip = clip[s:]; m = min(len(clip), len(mix) - i)
    if m > 0: mix[i:i + m] += clip[:m] * 10 ** (db / 20)

def room(x, wet=-15):
    """a small bright room: decaying, decorrelated noise as the impulse response"""
    n = int(.9 * SR); t = np.arange(n) / SR; ir = filt(noise(n, 21), 'lowpass', 6000) * np.exp(-t * 6)[:, None]
    ir[:int(.012 * SR)] = 0; y = np.stack([fftconvolve(x[:, c], ir[:, c])[:len(x)] for c in (0, 1)], 1)
    return x + norm(y, np.abs(x).max()) * 10 ** (wet / 20)


# ---------- more sounds for the stand-alone effects library ----------
def env_ad(n, a=.003, d=20.):
    t = np.arange(n) / SR; return (np.minimum(1, t / a) * np.exp(-t * d)).astype(np.float32)

def downer(dur=.8, seed=13):
    """air falling away: the riser played backwards with a darker tail"""
    return norm(riser(dur, seed)[::-1].copy() * 1.0, .8)

def reverse_whoosh(dur=.7, seed=14):
    """sucks in and cuts dead: good right before a hard cut"""
    return whoosh(dur, peak=.97, lo=200, hi=5000, seed=seed)

def bass_drop(dur=1.6):
    """a long falling sub with a soft knock on top"""
    n = int(dur * SR); t = np.arange(n) / SR; f = 28 + 90 * np.exp(-t * 3.2); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.tanh(2.2 * np.sin(ph)) * np.exp(-t * 1.6) * np.minimum(1, t / .01); return mono(norm(y + impact(.6)[:n, 0] * .4 if n <= int(.9 * SR) else y, .9))

def boom(seed=15):
    """a cinematic hit: impact, long sub tail and a dark rumble, in a bigger room"""
    n = int(2.2 * SR); t = np.arange(n) / SR; base = np.zeros((n, 2), np.float32); place(base, impact(1.6, seed), 0)
    base += filt(noise(n, seed), 'lowpass', 120) * (np.exp(-t * 2.2) * 1.8)[:, None]
    ir = filt(noise(int(1.8 * SR), 31), 'lowpass', 3000) * np.exp(-np.arange(int(1.8 * SR)) / SR * 3)[:, None]
    wet = np.stack([fftconvolve(base[:, c], ir[:, c])[:n] for c in (0, 1)], 1); return norm(base + norm(wet, np.abs(base).max()) * .5, .9)

def punch():
    """a short, tight hit"""
    n = int(.35 * SR); t = np.arange(n) / SR; f = 55 + 120 * np.exp(-t * 40); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t * 14) + filt(noise(n, 16)[:, 0:1], 'bandpass', [800, 4000])[:, 0] * np.exp(-t * 120) * .6; return mono(norm(np.tanh(2 * y), .9))

def power_down(dur=1.0):
    """a machine losing power: a hum whose pitch and level fall to nothing"""
    n = int(dur * SR); t = np.arange(n) / SR; f = 140 * (1 - t / dur) ** 1.6 + 8; ph = 2 * np.pi * np.cumsum(f) / SR
    y = sum(np.sin(ph * h) / h for h in (1, 2, 3, 5)) * (1 - t / dur) ** .8; y += filt(noise(n, 17)[:, 0:1], 'lowpass', 2000)[:, 0] * .08 * (1 - t / dur)
    return mono(norm(y, .8))

def glitch(dur=.6, seed=18):
    """digital stutter: chopped bursts of noise and buzz at random rates"""
    n = int(dur * SR); r = rng(seed); out = np.zeros((n, 2), np.float32); i = 0
    while i < n:
        g = int(r.uniform(.012, .06) * SR); seg = noise(g, int(r.integers(1e6)))
        if r.random() < .5: tt = np.arange(g) / SR; seg = mono(np.sign(np.sin(2 * np.pi * r.uniform(80, 900) * tt)) * .6)
        else: seg = filt(seg, 'bandpass', sorted(r.uniform(300, 9000, 2)) if True else None)
        out[i:i + g] += seg[:n - i] * (r.random() > .2) * r.uniform(.4, 1); i += g + int(r.uniform(0, .02) * SR)
    return norm(pan(out, np.sin(np.linspace(0, 9, n)) * .5), .75)

def static(dur=.8, seed=19):
    """TV static with a flutter"""
    n = int(dur * SR); t = np.arange(n) / SR; x = filt(noise(n, seed), 'highpass', 400)
    return norm(x * (.7 + .3 * np.sign(np.sin(2 * np.pi * 13 * t)))[:, None] * np.minimum(1, (dur - t) / .1)[:, None], .6)

def click():
    """a mouse click: press and release"""
    n = int(.12 * SR); out = np.zeros(n, np.float32)
    for at, g, f in ((0, 1, 4200), (.055, .5, 3300)):
        i = int(at * SR); m = n - i; tt = np.arange(m) / SR; out[i:] += (filt(noise(m, int(f))[:, 0:1], 'bandpass', [f * .7, f * 1.3])[:, 0] * np.exp(-tt * 400) + np.sin(2 * np.pi * 900 * tt) * np.exp(-tt * 300) * .3) * g
    return mono(norm(out, .8))

def typing(dur=1.4, seed=20):
    """keys on a keyboard at a human pace, the space bar heavier"""
    n = int(dur * SR); out = np.zeros((n, 2), np.float32); r = rng(seed); t = .02
    while t < dur - .08:
        k = int(t * SR); m = int(.06 * SR); tt = np.arange(m) / SR; big = r.random() < .15
        f = r.uniform(1800, 3200) * (.6 if big else 1); y = filt(noise(m, int(t * 1e4))[:, 0:1], 'bandpass', [f * .6, f * 1.4])[:, 0] * np.exp(-tt * (160 if big else 260))
        y += np.sin(2 * np.pi * (180 if big else 320) * tt) * np.exp(-tt * 90) * .35; out[k:k + m] += pan(mono(y * r.uniform(.5, 1)), r.uniform(-.3, .3))[:n - k]
        t += r.uniform(.07, .16) + (r.random() < .12) * .2
    return norm(out, .8)

def unlock():
    """a lock opening: a slide, then the latch letting go"""
    out = np.zeros((int(.45 * SR), 2), np.float32); place(out, filt(noise(int(.18 * SR), 22), 'bandpass', [1500, 6000]) * env_ad(int(.18 * SR), .05, 18)[:, None] * .4, 0)
    place(out, latch()[::-1].copy() * .6, .14); place(out, latch(), .24, -4); return norm(out, .85)

def swipe(seed=23):
    """a finger swiping a phone screen"""
    return norm(whoosh(.22, .35, 1500, 7000, -.4, .4, seed) * .8, .7)

def vibrate():
    """a phone buzzing twice on a table"""
    n = int(1.0 * SR); t = np.arange(n) / SR; gate = ((t < .35) | ((t > .5) & (t < .85))).astype(np.float32)
    y = np.sign(np.sin(2 * np.pi * 172 * t)) * (.6 + .4 * np.sin(2 * np.pi * 31 * t)); y = filt(y[:, None], 'lowpass', 1500)[:, 0] * gate
    y += filt(noise(n, 24)[:, 0:1], 'bandpass', [300, 1200])[:, 0] * gate * .3; return mono(norm(y, .7))

def shutter():
    """a camera shutter: mirror up, curtain, mirror down"""
    out = np.zeros((int(.3 * SR), 2), np.float32)
    for at, g, f in ((0, 1, 2500), (.035, .6, 5200), (.09, .8, 1800)): m = int(.08 * SR); place(out, filt(noise(m, int(f)), 'bandpass', [f * .6, f * 1.5]) * env_ad(m, .001, 140)[:, None] * g, at)
    return norm(out, .85)

def scanner(dur=1.2):
    """a scan line passing: a band of noise sweeping up with a fast pulse"""
    n = int(dur * SR); t = np.linspace(0, 1, n); x = noise(n, 25); out = np.zeros_like(x)
    for i, fc in enumerate(np.geomspace(400, 6000, 6)): out += filt(x, 'bandpass', [fc / 1.3, fc * 1.3]) * np.exp(-((t * 5 - i) ** 2) / .5)[:, None]
    return norm(out * (.55 + .45 * np.sign(np.sin(2 * np.pi * 24 * t * dur)))[:, None] * np.sin(np.pi * t)[:, None], .7)

def error_buzz():
    """two short low buzzes: «no»"""
    n = int(.5 * SR); t = np.arange(n) / SR; gate = ((t < .14) | ((t > .2) & (t < .34))).astype(np.float32)
    y = np.sign(np.sin(2 * np.pi * 95 * t)) * gate; return mono(norm(filt(y[:, None], 'lowpass', 900)[:, 0], .7))

def heartbeat():
    """lub-dub"""
    out = np.zeros((int(1.0 * SR), 2), np.float32); place(out, impact(.35, 26) * .9, 0); place(out, impact(.3, 27) * .6, .22); return norm(out, .85)

def coins(dur=.9, seed=28):
    """coins falling: many short inharmonic metal grains"""
    n = int(dur * SR); out = np.zeros((n, 2), np.float32); r = rng(seed)
    for _ in range(26):
        i = int(r.beta(1.2, 2.5) * (n - int(.12 * SR))); m = int(.12 * SR); tt = np.arange(m) / SR; f = r.uniform(2400, 6200)
        y = sum(np.sin(2 * np.pi * f * h * tt) * np.exp(-tt * r.uniform(30, 70) * h) for h in (1, 2.76, 5.4)) * r.uniform(.3, 1); out[i:i + m] += pan(mono(y), r.uniform(-.6, .6))
    return norm(out, .75)

def scratch(seed=29):
    """a record scratch: noise through a band that whips back and forth"""
    n = int(.5 * SR); t = np.arange(n) / SR; x = noise(n, seed); out = np.zeros_like(x)
    pos = .5 + .5 * np.sin(2 * np.pi * 7 * t ** 1.2)
    for i, fc in enumerate(np.geomspace(300, 4000, 6)): out += filt(x, 'bandpass', [fc / 1.3, fc * 1.3]) * np.exp(-((pos * 5 - i) ** 2) / .6)[:, None]
    return norm(out * env_ad(n, .005, 4)[:, None], .8)

def clock_ticks(dur=3.0):
    """a clock: tick, tock"""
    out = np.zeros((int(dur * SR), 2), np.float32)
    for i in range(int(dur * 2)): place(out, tick(1.0 if i % 2 == 0 else .7), i * .5 + .02, 0 if i % 2 == 0 else -3)
    return norm(out, .8)

def paper(dur=.5, seed=30):
    """a page turned or a sheet slid"""
    n = int(dur * SR); t = np.linspace(0, 1, n); x = filt(noise(n, seed), 'bandpass', [900, 7000])
    crack = (rng(seed).random(n) > .997).astype(np.float32) * 3; return norm(x * (np.sin(np.pi * t) ** 1.5)[:, None] + filt(mono(crack), 'highpass', 2000), .7)

# id: (name, when to use it, recipe)
KIT = {
  'sx-01': ('Whoosh سريع', 'حركة سريعة أو انتقال قصير', lambda: whoosh(.35, .55)),
  'sx-02': ('Whoosh تقيل', 'حاجة كبيرة بتعدّي، أو زوم كاميرا بطيء', lambda: whoosh(.9, .5, 120, 1800, seed=31)),
  'sx-03': ('Whip', 'سحبة كاميرا خاطفة بين مشهدين', lambda: whoosh(.18, .5, 600, 7000, seed=32)),
  'sx-04': ('Whoosh يمين لشمال', 'حاجة بتعدّي الشاشة من ناحية لناحية', lambda: whoosh(.6, .5, 250, 3500, .9, -.9, 33)),
  'sx-05': ('Whoosh عكسي', 'بيتسحب لجوّه ويقطع: قبل قطعة قوية', lambda: reverse_whoosh()),
  'sx-06': ('خبطة تقيلة', 'كلمة كبيرة بتنزل، أو ختم، أو لحظة صدمة', lambda: impact(1.3)),
  'sx-07': ('خبطة خفيفة', 'كارت بيتحط، أو عنصر بيوصل مكانه', lambda: impact(.45, 34)),
  'sx-08': ('Boom سينمائي', 'أكبر لحظة في الفيديو: الكشف أو اللوجو', lambda: boom()),
  'sx-09': ('Bass drop', 'بعد سكون قبل الحل، أو بداية الهوك', lambda: bass_drop()),
  'sx-10': ('Punch', 'ضربة قصيرة على كل رقم أو كلمة مهمة', lambda: punch()),
  'sx-11': ('Riser قصير', 'قبل الضربة بنص ثانية', lambda: riser(.6)),
  'sx-12': ('Riser طويل', 'توتر بيزيد قبل الكشف', lambda: riser(2.0, 35)),
  'sx-13': ('Downer', 'بعد الضربة، أو «الحاجة وقعت»', lambda: downer()),
  'sx-14': ('شاشة بتطفي', 'الموبايل فصل، أو السيستم وقع', lambda: power_down()),
  'sx-15': ('جليتش', 'اختراق، أو خطأ، أو شاشة بتتكسر', lambda: glitch()),
  'sx-16': ('تشويش', 'الإشارة قطعت، أو قبل كشف', lambda: static()),
  'sx-17': ('تكّة', 'حاجة صغيرة بتظهر، أو رسالة جديدة', lambda: tick()),
  'sx-18': ('كليك ماوس', 'ماوس بيدوس على زرار', lambda: click()),
  'sx-19': ('كيبورد', 'حد بيكتب، أو بحث، أو رسالة بتتكتب', lambda: typing()),
  'sx-20': ('قفل بيتقفل', 'متأمّن: القفل بيتقفل', lambda: latch()),
  'sx-21': ('قفل بيتفتح', 'دخول آمن بكود، أو حاجة بتتفتح', lambda: unlock()),
  'sx-22': ('Swipe', 'صباع بيسحب على شاشة الموبايل', lambda: swipe()),
  'sx-23': ('موبايل بيرن', 'إشعار، أو عميل بيتصل', lambda: vibrate()),
  'sx-24': ('شتر كاميرا', 'سكرين شوت، أو صورة اتاخدت', lambda: shutter()),
  'sx-25': ('سكانر', 'السيستم بيفحص، أو خط مسح بيعدّي', lambda: scanner()),
  'sx-26': ('لمعة نجاح', 'اتفقنا، أو اتحل، أو صح', lambda: sparkle()),
  'sx-27': ('غلط', 'رفض، أو خطأ، أو «لأ»', lambda: error_buzz()),
  'sx-28': ('نبض قلب', 'توتر، أو لحظة قبل القرار', lambda: heartbeat()),
  'sx-29': ('فلوس', 'فلوس داخلة، أو رقم مبيعات', lambda: coins()),
  'sx-30': ('Record scratch', '«استنى!»: وقفة كوميدي قبل التويست', lambda: scratch()),
  'sx-31': ('ساعة', 'الوقت بيعدّي، أو «فاضل قد إيه؟»', lambda: clock_ticks()),
  'sx-32': ('ورق', 'دفتر، أو فاتورة ورق، أو صفحة بتتقلب', lambda: paper()),
}

K = {'W': whoosh, 'S': swell, 'P': pop, 'T': tick, 'L': latch, 'I': impact, 'R': riser, 'G': sparkle}
# cue = (kind, time, dB, {args}); a whoosh peaks `peak` of the way into its length
CUES = {
  'hq-06': (6.0, [('S', 0.0, -20, dict(dur=1.25)), *[('T', .10 + i * .19, -13 + i * .4, dict(k=1 + i * .04)) for i in range(6)],   # a small tick on every message over a quiet rising rush
            ('W', 1.12, -7, dict(dur=.5, peak=.55, lo=200, hi=3000)), ('T', 1.6, -8, {}), ('S', 1.88, -12, dict(dur=.7)),
            ('W', 2.05, -15, dict(dur=.6, peak=.5, p0=-.4, p1=.6, seed=3)), ('W', 2.75, -10, dict(dur=.75, peak=.55, p0=.7, p1=-.7, seed=5)),
            ('I', 3.45, -18, dict(size=.6)), ('G', 3.47, -9, dict(dur=.9)), ('T', 3.78, -7, dict(k=1.1)), ('L', 4.15, -3, {}), ('I', 4.16, -15, dict(size=.5)),
            ('R', 4.27, -8, dict(dur=.5)), ('I', 4.77, -2, dict(size=1.3)), ('G', 5.1, -15, dict(dur=.7, density=40))]),
  'hq-01': (2.8, [('W', 0.0, -9, dict(dur=.32, peak=.9, lo=300, hi=4500, p0=-.9, p1=0)), ('W', 0.0, -9, dict(dur=.32, peak=.9, lo=320, hi=4800, p0=.9, p1=0, seed=2)),
            ('I', .30, -2, {}), ('G', .31, -13, dict(dur=.6, density=80)), ('S', .55, -17, dict(dur=.4)),
            ('L', 1.05, -2, {}), ('I', 1.06, -13, dict(size=.5)), ('W', 1.22, -17, dict(dur=.5, peak=.4, lo=600, hi=5000)), ('G', 1.6, -15, dict(dur=.7, density=35))]),
  'hq-02': (2.6, []),   # captions stay silent: a sound on every word gets tiring fast
  'hq-03': (1.9, [('W', 0.0, -8, dict(dur=.4, peak=.92, lo=250, hi=4000, p0=-.7, p1=.7)), ('I', .38, -3, {}), ('G', .45, -16, dict(dur=.5)),
            ('S', .48, -18, dict(dur=.35)), ('W', 1.56, -12, dict(dur=.36, peak=.3, lo=300, hi=3500, p0=0, p1=.6))]),
  'hq-04': (3.2, [('S', 1.0, -11, dict(dur=.7)), ('W', 1.05, -15, dict(dur=.6, peak=.5, lo=300, hi=2500)),
            ('G', 2.05, -10, dict(dur=.8)), ('T', 2.25, -10, dict(k=1.15))]),
  'hq-05': (.9, [('W', 0.0, -3, dict(dur=.9, peak=.5, lo=180, hi=4200, p0=.8, p1=-.8)), ('I', .45, -16, dict(size=.6))]),
}

X = lambda id: KIT[id][2]()   # any sound from the effects library by its id
CUES.update({
  'vr-01': (6.0, []),
  'vr-02': (2.6, [('X', 0.0, -14, dict(id='sx-22')), ('X', .12, -12, dict(id='sx-07'))]),
  'vr-03': (2.6, [('X', .3, -16, dict(id='sx-01')), ('X', .78, -8, dict(id='sx-07')), ('X', .8, -10, dict(id='sx-17')), ('X', 1.0, -16, dict(id='sx-22'))]),
  'vr-04': (3.0, [('X', 0.0, -12, dict(id='sx-07')), ('X', .33, -11, dict(id='sx-19'))]),
  'vr-05': (3.1, [('X', 0.0, -5, dict(id='sx-10')), ('X', 1.0, -5, dict(id='sx-10')), ('X', 2.0, -4, dict(id='sx-10')), ('X', 2.45, -12, dict(id='sx-11'))]),
  'vr-06': (2.4, [*[('T', .06 + (1 - (1 - i / 16) ** 2) * 1.4, -12 + i * .3, dict(k=1 + i * .02)) for i in range(16)], ('X', 1.62, -5, dict(id='sx-10')), ('X', 1.66, -12, dict(id='sx-29'))]),
  'vr-07': (2.4, [('X', .02, -12, dict(id='sx-15')), ('X', .5, -16, dict(id='sx-25')), ('X', 1.38, -8, dict(id='sx-17')), ('X', 1.4, -13, dict(id='sx-26'))]),
  'vr-08': (3.0, [*[('X', .12 + i * .32, -6 - (i % 2) * 2, dict(id='sx-10')) for i in range(5)], ('X', 1.4, -4, dict(id='sx-06'))]),
  'vr-09': (3.0, [('X', 0.0, -13, dict(id='sx-07')), ('X', .98, -6, dict(id='sx-18')), ('X', 1.12, -15, dict(id='sx-01')), ('X', 1.9, -14, dict(id='sx-26'))]),
  'vr-10': (2.2, [('X', 0.0, -6, dict(id='sx-30'))]),
  'vr-11': (1.9, [('X', 0.0, -7, dict(id='sx-15')), ('X', .5, -8, dict(id='sx-10')), ('X', 1.15, -12, dict(id='sx-16')), ('X', 1.6, -10, dict(id='sx-15'))]),
  'vr-12': (3.0, [('X', .15, -9, dict(id='sx-29')), ('X', .9, -12, dict(id='sx-29'))]),
  'vr-13': (3.0, [('X', 0.0, -12, dict(id='sx-07')), ('X', 1.43, -4, dict(id='sx-18')), ('X', 1.47, -11, dict(id='sx-26'))]),
  'vr-14': (3.0, [('X', 0.0, -12, dict(id='sx-07')), ('X', .78, -11, dict(id='sx-19'))]),
  'vr-15': (2.4, [('X', .12, -9, dict(id='sx-32')), ('X', .58, -12, dict(id='sx-32'))]),
  'vr-16': (1.4, [('X', .02, -6, dict(id='sx-05')), ('X', .7, -3, dict(id='sx-10')), ('X', .75, -10, dict(id='sx-01'))]),
  'vr-17': (3.4, [('X', 0.0, -14, dict(id='sx-07')), *[('X', .42 + i * .5, -14, dict(id='sx-01')) for i in range(3)], ('X', 1.98, -8, dict(id='sx-10'))]),
  'vr-18': (3.0, [('X', .1, -6, dict(id='sx-23')), ('X', 1.1, -6, dict(id='sx-23')), ('X', 2.0, -8, dict(id='sx-22')), ('X', 2.05, -12, dict(id='sx-07'))]),
})
K['X'] = X

# ---------- sound for every element of the first two library versions (and hq-07 … hq-10) ----------
def _w(at, dur, db=-12, peak=.5, lo=250, hi=3500, p0=0., p1=0.): return ('W', at, db, dict(dur=dur, peak=peak, lo=lo, hi=hi, p0=p0, p1=p1, seed=int(at * 97 + dur * 13)))
def _x(at, id, db=-10): return ('X', at, db, dict(id=id))
def _ticks(times, db=-13): return [('T', a, db, dict(k=1 + i * .03)) for i, a in enumerate(times)]
DUR = {}   # filled from the element list when the cues are built (python3 sfx.py --all reads lib-durations.json)
MORE = {
  'mg-01': [_w(0, .6, -11, .85), _x(.5, 'sx-07', -12), ('L', .95, -3, {}), ('G', 1.0, -15, dict(dur=.6))],
  'mg-02': [_w(0, .65, -13, .8), _x(.6, 'sx-17', -10)],
  'mg-03': [],
  'mg-04': [_w(0, .36, -9, .92, 300, 4500), _x(.34, 'sx-10', -4)],
  'mg-05': _ticks([.1 + (1 - (1 - i / 14) ** 2) * 1.15 for i in range(14)]) + [_x(1.3, 'sx-10', -6), _x(1.32, 'sx-29', -13)],
  'mg-06': [_w(0, .16, -14, .95, 300, 3000), _x(.13, 'sx-06', -3)],
  'mg-07': [_w(0, .45, -18, .8, 600, 5000), _x(.68, 'sx-17', -9), _x(.7, 'sx-26', -11)],
  'mg-08': [_x(0, 'sx-22', -12), _x(.25, 'sx-17', -9)],
  'mg-09': [_x(.05, 'sx-19', -16), _x(.7, 'sx-17', -10), _x(1.4, 'sx-17', -10)],
  'mg-10': [_x(0, 'sx-22', -12), _x(.3, 'sx-07', -10), _x(.7, 'sx-26', -14)],
  'mg-11': [_w(0, .5, -13, .7, 300, 3000, .8, 0), _w(2.25, .35, -17, .3, 300, 3000, 0, .8)],
  'mg-12': [_w(0, .6, -14, .8), *_ticks([.5 + i * .07 for i in range(7)], -16), _x(1.4, 'sx-26', -15)],
  'mg-13': [_x(0, 'sx-32', -10), _x(.5, 'sx-32', -13)],
  'mg-14': [_w(0, .7, -10, .85, 200, 3000), _x(.55, 'sx-07', -8), _x(.85, 'sx-26', -12)],
  'mg-15': [_x(0, 'sx-07', -12), _x(.25, 'sx-27', -9), _x(.55, 'sx-15', -16), ('L', 1.17, -3, {}), _x(1.2, 'sx-26', -15)],
  'mg-16': _ticks([.4, .95, 1.5], -9) + [_x(1.6, 'sx-26', -15)],
  'mg-17': [_x(0, 'sx-07', -13), _x(.55, 'sx-22', -9), _x(.95, 'sx-10', -6)],
  'mg-18': _ticks([.05 + i * .26 for i in range(8)], -11) + [_x(2.1, 'sx-10', -6)],
  'mg-19': [_x(.3, 'sx-25', -14), _x(1.65, 'sx-17', -9), _x(1.66, 'sx-26', -12)],
  'mg-20': [_x(.1, 'sx-19', -11)],
  'mg-21': [_x(.42, 'sx-32', -10)],
  'mg-22': [_w(0, .45, -16, .8)] + _ticks([x for j in range(3) for x in (.5 + j * .45, .68 + j * .45)], -12),
  'mg-23': _ticks([.2 + (1 - (1 - i / 18) ** 2) * 1.25 for i in range(18)], -15) + [_x(1.4, 'sx-10', -7)],
  'mg-24': [_x(.3, 'sx-14', -10), _x(1.5, 'sx-27', -10)],
  'mg-25': [('G', 0, -9, dict(dur=1.8, density=40))],
  'mg-26': _ticks([.4, 1.1, 1.8], -9) + [_w(.4, 1.6, -20, .5, 400, 2500)],
  'mg-27': [_w(0, .5, -12, .85, 400, 5000), _x(.4, 'sx-10', -6)],
  'mg-28': [_x(0, 'sx-07', -8), ('G', .05, -8, dict(dur=1.8, density=90))],
  'mg-29': [('R', .2, -14, dict(dur=1.3)), _x(1.5, 'sx-17', -9), _x(1.52, 'sx-26', -12)],
  'mg-30': [_w(0, .4, -12, .7, 300, 4000, -.6, 0), _x(.15, 'sx-10', -8)],
  'ui-01': [_w(0, .9, -9, .8, 150, 2500), _x(.85, 'sx-07', -9)],
  'ui-02': [_x(0, 'sx-07', -13), _x(.35, 'sx-19', -11), _x(1.12, 'sx-18', -8), _w(1.3, .4, -18, .4, 600, 4000)],
  'ui-03': [_w(0, .5, -14, .8)] + _ticks([.4 + i * .22 for i in range(4)], -12) + [_x(1.3, 'sx-26', -14)],
  'ui-04': [_x(.95, 'sx-18', -6), _w(1.2, 1.0, -12, .5, 250, 2500, .6, -.6), _x(2.3, 'sx-07', -8), _x(2.35, 'sx-26', -13)],
  'ui-05': [_x(0, 'sx-32', -10)] + _ticks([.45 + i * .3 for i in range(3)], -12) + [_x(1.4, 'sx-29', -14), _x(2.1, 'sx-06', -5)],
  'ui-06': [_x(0, 'sx-22', -12), _x(.3, 'sx-17', -8)],
  'ui-07': _ticks([.4 + i * .35 for i in range(4)], -11) + [_x(1.12, 'sx-27', -11)],
  'ui-08': [_w(0, .8, -20, .7, 800, 5000), _x(.85, 'sx-18', -5)],
  'ui-09': [_x(.6, 'sx-18', -6), _x(.8, 'sx-25', -16), _x(1.6, 'sx-17', -8), _x(1.62, 'sx-26', -12)],
  'ui-10': [_x(.6, 'sx-19', -11), _x(1.35, 'sx-22', -13)],
  'ui-11': _ticks([.5 + i * .22 for i in range(4)], -9) + [_x(1.5, 'sx-21', -4), _x(1.6, 'sx-26', -12)],
  'ui-12': _ticks([.4 + i * .22 for i in range(5)], -12),
  'tr-05': [_x(0, 'sx-10', -4), _w(0, .5, -16, .1, 2000, 9000)],
  'tr-06': [_x(0, 'sx-15', -6)],
  'tr-08': [_x(-.6, 'sx-05', -6), _x(.35, 'sx-10', -5)],
  'tr-21': [_x(0, 'sx-15', -16), _w(0, 1.0, -14, .5)],
  'tr-22': [_w(0, .8, -10, .5, 1500, 9000)],
  'tr-24': [_x(0, 'sx-25', -8)],
  'tr-27': [_x(.2, 'sx-25', -12), _x(1.0, 'sx-17', -8), _w(1.0, .4, -14, .4)],
  'tr-28': [_x(0, 'sx-19', -14), _w(0, 1.2, -13, .5, 200, 3000)],
  'tr-29': [_w(0, .9, -9, .45), _x(.42, 'sx-10', -6)],
  'tr-30': [_w(0, 1.2, -9, .5, 120, 1500)],
  'fx-05': [_x(0, 'sx-30', -10), _x(.3, 'sx-16', -18)],
  'fx-06': [_x(0, 'sx-15', -16), _x(1.6, 'sx-15', -18)],
  'fx-09': [_x(0, 'sx-14', -6)],
  'fx-16': [_x(0, 'sx-28', -6), _x(1.0, 'sx-28', -7)],
  'fx-18': [_x(0, 'sx-06', -5)],
  'fx-21': [_x(0, 'sx-16', -8)],
  'fx-29': [_x(0, 'sx-25', -14), _x(1.5, 'sx-25', -16)],
  'hq-07': [_w(0, .32, -14, .95, 300, 3000), _x(.32, 'sx-06', -2), ('G', .34, -17, dict(dur=.4, density=60))],
  'hq-08': [_x(0, 'sx-07', -12), ('S', .45, -14, dict(dur=.6)), _w(1.05, .45, -18, .5, 1500, 8000), _x(1.53, 'sx-18', -5), _x(1.9, 'sx-19', -15)],
  'hq-09': [_w(0, .32, -9, .9, 300, 4500, -.8, 0), _w(0, .32, -9, .9, 320, 4800, .8, 0), _x(.32, 'sx-08', -4), _x(1.2, 'sx-26', -13)],
  'hq-10': [_x(0, 'sx-22', -11), _x(.3, 'sx-17', -9), _x(.72, 'sx-17', -13), _w(2.35, .4, -15, .3, 500, 5000)],
}
def auto_cues(eid, dur):
    """a cue list for elements without one: transitions get a whoosh centred on their middle, ambient overlays stay silent"""
    if eid in MORE: return MORE[eid]
    if eid.startswith('tr-'): return [_w(0, dur, -9, .5, 220, 3800, .5 * (-1) ** int(eid[-1]), -.5 * (-1) ** int(eid[-1]))]
    return []

def build(eid):
    dur, cues = CUES[eid]; mix = np.zeros((int(dur * SR) + SR, 2), np.float32)
    for kind, at, db, kw in cues: place(mix, K[kind](**kw), at, db)
    mix = room(mix)[:int(dur * SR)]; return np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.2) * .9

def write(path, x):
    w = wave.open(path, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()); w.close()

if __name__ == '__main__':
    if sys.argv[1] == '--kit':   # python3 sfx.py --kit <outDir>: every sound in KIT as <id>.wav, with a little room
        import os, json; os.makedirs(sys.argv[2], exist_ok=True); meta = []
        for k, (name, use, fn) in KIT.items():
            x = fn(); x = room(np.concatenate([x, np.zeros((int(.25 * SR), 2), np.float32)]), -18); x = norm(x, .89); r = 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9); x = x * 10 ** (min(0, -19 - r) / 20)   # loud buzzes get turned down to sit with the rest
            write(os.path.join(sys.argv[2], k + '.wav'), x)
            env = np.abs(x).max(1); b = max(1, len(env) // 48); meta.append(dict(id=k, name=name, use=use, dur=round(len(x) / SR, 2), wave=[round(float(env[i:i + b].max()), 2) for i in range(0, b * 48, b)]))
            print(k, name, round(len(x) / SR, 2))
        open(os.path.join(sys.argv[2], 'sfx-list.json'), 'w').write(json.dumps(meta, ensure_ascii=False)); sys.exit()
    if sys.argv[1] == '--all':   # python3 sfx.py --all <durations.json> <outDir>: a sound for every element that has one
        import os, json; durs = json.load(open(sys.argv[2])); os.makedirs(sys.argv[3], exist_ok=True)
        for eid, d in durs.items():
            cues = CUES[eid][1] if eid in CUES else auto_cues(eid, d)
            if not cues: continue
            CUES[eid] = (d, cues); write(os.path.join(sys.argv[3], eid + '.wav'), build(eid)); print(eid)
        sys.exit()
    eid, out = sys.argv[1:3]; x = build(eid)
    w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes()); print(out, round(len(x) / SR, 2), 's')
