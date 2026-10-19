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

K = {'W': whoosh, 'S': swell, 'P': pop, 'T': tick, 'L': latch, 'I': impact, 'R': riser, 'G': sparkle}
# cue = (kind, time, dB, {args}); a whoosh peaks `peak` of the way into its length
CUES = {
  'hq-06': (6.0, [('S', 0.0, -16, dict(dur=1.25)),   # one quiet rising rush under the piling messages, no hit per message
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

def build(eid):
    dur, cues = CUES[eid]; mix = np.zeros((int(dur * SR) + SR, 2), np.float32)
    for kind, at, db, kw in cues: place(mix, K[kind](**kw), at, db)
    mix = room(mix)[:int(dur * SR)]; return np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.2) * .9

if __name__ == '__main__':
    eid, out = sys.argv[1:3]; x = build(eid)
    w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype('<i2').tobytes()); print(out, round(len(x) / SR, 2), 's')
