"""Synthesises the SFX track from the cue list in timeline.json (written by render.mjs).
usage: python3 sfx.py timeline.json out.wav
"""
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.002, r=None, curve=8.0):
    x = np.linspace(0, 1, n)
    e = np.exp(-curve * x) if r is None else np.clip(1 - x / r, 0, 1)
    att = max(1, int(a * SR))
    e[:att] *= np.linspace(0, 1, att)
    return e


def sweep(f0, f1, d, shape=np.sin):
    t = t_(d)
    f = np.geomspace(f0, f1, len(t))
    return shape(2 * np.pi * np.cumsum(f) / SR)


def lowpass(x, cutoff):
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x); s = 0.0
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def noise(d):
    return rng.uniform(-1, 1, int(d * SR))


def click():
    n = noise(.012); return (n - lowpass(n, 3000)) * env(len(n), curve=12) * .9 + np.sin(2*np.pi*2600*t_(.012)) * env(int(.012*SR), curve=10) * .3

def tick():
    return np.sin(2*np.pi*1900*t_(.035)) * env(int(.035*SR), curve=9) * .5

def type_():
    d = .02; n = noise(d); f = rng.uniform(2500, 4500)
    return (n - lowpass(n, f)) * env(len(n), curve=14) * .5

def pop():
    s = sweep(260, 950, .09) * env(int(.09*SR), curve=6); return s * .7

def whoosh(d=.42, lo=300, hi=5000):
    n = noise(d); x = np.linspace(0, 1, len(n))
    cut = lo + (hi - lo) * np.sin(np.pi * x) ** 2
    e = np.sin(np.pi * x) ** 1.5
    return lowpass(n, cut) * e * 1.2

def swish():
    return whoosh(.2, 800, 8000) * .8

def bass():
    d = .8; return sweep(85, 42, d) * env(int(d*SR), curve=4) * .95

def thoom():
    d = .9; s = sweep(75, 38, d) * env(int(d*SR), curve=3.5)
    n = lowpass(noise(d), 600) * env(int(d*SR), curve=20)
    return s * .95 + n * .5

def glitch():
    d = .32; t = t_(d); out = np.zeros_like(t)
    seg = int(.02 * SR)
    for i in range(0, len(t), seg):
        f = rng.choice([180, 360, 720, 1440, 90])
        sq = np.sign(np.sin(2 * np.pi * f * t[i:i+seg]))
        out[i:i+seg] = sq * (rng.uniform(.2, .7) if rng.random() > .25 else 0)
    out = np.round(out * 4) / 4
    return out * .35

def blip():
    a = np.sin(2*np.pi*880*t_(.07)) * env(int(.07*SR), curve=5)
    b = np.sin(2*np.pi*1320*t_(.12)) * env(int(.12*SR), curve=5)
    return np.concatenate([a, b]) * .45

def buzz():
    d = .28; t = t_(d); sq = np.sign(np.sin(2*np.pi*110*t)) + .5*np.sign(np.sin(2*np.pi*116*t))
    return lowpass(sq, 1800) * env(len(t), r=1.0) * .35

def thunk():
    d = .18; return (sweep(140, 55, d) * .9 + lowpass(noise(d), 900) * .4) * env(int(d*SR), curve=10)

def bell(freqs, d, curve=4.0, gap=0.0):
    out = np.zeros(int((d + gap * len(freqs)) * SR))
    for i, f in enumerate(freqs):
        t = t_(d); s = (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*2*f*t)) * env(len(t), curve=curve)
        o = int(i * gap * SR); out[o:o+len(s)] += s
    return out

def chime():
    return bell([1046.5, 1318.5, 1568], .7, 5, .06) * .22

def success():
    return bell([523.25, 659.25, 784, 1046.5], 1.3, 3.2, .09) * .22

def ding():
    return bell([1568], .7, 5) * .32

def lock():
    a = click() * 1.2; b = click() * .9
    r = (np.sin(2*np.pi*2300*t_(.15)) + .6*np.sin(2*np.pi*3400*t_(.15))) * env(int(.15*SR), curve=18) * .25
    out = np.zeros(int(.2*SR)); out[:len(a)] += a; o = int(.05*SR); out[o:o+len(b)] += b; out[:len(r)] += r
    return out

def riser():
    d = 1.4; x = np.linspace(0, 1, int(d*SR))
    s = sweep(180, 1400, d) * .25 + lowpass(noise(d), 400 + 6000 * x) * .6
    return s * x ** 2 * .8


GEN = dict(click=click, tick=tick, type=type_, pop=pop, whoosh=whoosh, swish=swish, bass=bass, thoom=thoom,
           glitch=glitch, blip=blip, buzz=buzz, thunk=thunk, chime=chime, success=success, ding=ding, lock=lock, riser=riser)

tl = json.load(open(sys.argv[1]))
dur = tl['DUR']
L = np.zeros(int(dur * SR) + SR); R = np.zeros_like(L)
for t, name, gain in tl['SFX']:
    s = GEN[name]() * gain
    pan = rng.uniform(-.25, .25)
    o = int(t * SR); n = min(len(s), len(L) - o)
    L[o:o+n] += s[:n] * (1 - pan); R[o:o+n] += s[:n] * (1 + pan)
L, R = L[:int(dur*SR)], R[:int(dur*SR)]
peak = max(np.abs(L).max(), np.abs(R).max())
g = 0.6 / peak  # leave headroom for the voiceover
pcm = (np.stack([L, R], 1) * g * 32767).astype('<i2')
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx ok', len(tl['SFX']), 'cues')
