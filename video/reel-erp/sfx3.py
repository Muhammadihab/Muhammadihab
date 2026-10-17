"""Sound kit v2 for the ERP reel: musical plucks, airy moves, cinematic impacts, a two-mood bed and a reverb bus.
usage: python3 sfx2.py timeline.json out.wav
"""
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(11)


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=.004, curve=6.0):
    x = np.linspace(0, 1, max(n, 1)); e = np.exp(-curve * x)
    k = max(1, int(a * SR)); e[:k] *= np.linspace(0, 1, k)
    return e


def fft_band(x, lo=0, hi=SR / 2, slope=1.6):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo > 0: g *= 1 / (1 + (lo / np.maximum(f, 1)) ** (2 * slope))
    if hi < SR / 2: g *= 1 / (1 + (f / hi) ** (2 * slope))
    return np.fft.irfft(X * g, len(x))


def lp_sweep(x, f0, f1):
    """one-pole lowpass with an exponential cutoff sweep (short signals only)"""
    fc = np.geomspace(f0, f1, len(x)); a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def noise(d):
    return rng.uniform(-1, 1, int(d * SR))


def sine_sweep(f0, f1, d):
    f = np.geomspace(f0, f1, int(d * SR)); return np.sin(2 * np.pi * np.cumsum(f) / SR)


# ---------------- voices ----------------
def pluck(f, d=.9, bright=.55):
    n = int(d * SR); p = max(2, int(SR / f)); buf = fft_band(rng.uniform(-1, 1, p * 4), 0, 1200 + 5000 * bright)[:p]
    out = np.empty(n); b = buf.copy()
    for i in range(n):
        j = i % p; v = b[j]; out[i] = v; b[j] = .5 * (v + b[(j + 1) % p]) * .996
    body = np.sin(2 * np.pi * f * t_(d)) * env(n, curve=5) * .35
    return (out * .9 + body) * env(n, a=.002, curve=3.2) * .55


def softclick():
    n = noise(.03); c = fft_band(n, 900, 5000) * env(len(n), a=.0005, curve=18)
    th = np.sin(2 * np.pi * 140 * t_(.03)) * env(int(.03 * SR), curve=12) * .4
    return (c * .6 + th) * .8


def vib(d=.55):
    t = t_(d); s = np.sign(np.sin(2 * np.pi * 172 * t)) * .6 + np.sin(2 * np.pi * 86 * t) * .4
    gate = ((t % .27) < .2).astype(float); gate = fft_band(gate, 0, 60)
    return fft_band(s, 60, 700) * gate * .5


def air(d=.45, f0=500, f1=6000):
    n = noise(d); x = np.linspace(0, 1, len(n))
    y = lp_sweep(n, f0, f1) - lp_sweep(n, f0 * .4, f1 * .4) * .6
    return y * np.sin(np.pi * x) ** 1.4 * 1.4


def flip():
    a = air(.24, 900, 7000); c = softclick(); a[:len(c)] += c * .6; return a * .9


def riser(d=1.6):
    x = np.linspace(0, 1, int(d * SR))
    s = sine_sweep(110, 880, d) * .25 + lp_sweep(noise(d), 300, 9000) * .55
    return s * x ** 2.2 * .9


def impact():
    d = 2.2; sub = sine_sweep(72, 30, d) * env(int(d * SR), a=.002, curve=2.6)
    burst = fft_band(noise(.25), 0, 2400) * env(int(.25 * SR), a=.001, curve=9)
    out = sub * 1.0; out[:len(burst)] += burst * .7
    return out * .95


def whistle_fall(d=.55):
    return sine_sweep(1500, 260, d) * np.sin(np.pi * np.linspace(0, 1, int(d * SR))) ** .7 * .16


def crt():
    d = .9; w = sine_sweep(3200, 140, d) * env(int(d * SR), curve=4) * .14
    th = sine_sweep(120, 40, .4) * env(int(.4 * SR), curve=6) * .8
    cr = np.zeros(int(d * SR)); idx = rng.integers(0, int(.35 * SR), 40); cr[idx] = rng.uniform(-.6, .6, 40); cr = fft_band(cr, 1500, 9000)
    out = w; out[:len(th)] += th; out += cr * .5
    return out


def tape(d=1.5):
    t = t_(d); x = np.linspace(0, 1, len(t))
    chirp = np.sin(2 * np.pi * np.cumsum(1400 + 900 * np.sin(2 * np.pi * 13 * t)) / SR) * .12
    hiss = fft_band(noise(d), 1500, 7000) * .25
    stop = sine_sweep(600, 40, .35) * env(int(.35 * SR), curve=2) * .35
    out = (chirp + hiss) * np.minimum(1, x * 6) * (1 - x ** 6)
    out[-len(stop):] += stop
    return out


def swell(d=1.4):
    x = np.linspace(0, 1, int(d * SR)); t = t_(d)
    ch = sum(np.sin(2 * np.pi * f * t) for f in (880, 1108.7, 1318.5, 1760)) * .05
    nz = lp_sweep(noise(d), 400, 8000) * .25
    return (ch + nz) * x ** 2.5


def bubble():
    d = .12; s = sine_sweep(520, 1150, d) * env(int(d * SR), a=.004, curve=7); return s * .45


def roll():
    n = noise(.012); return fft_band(n, 2500, 6000) * env(len(n), a=.0005, curve=14) * .5


def heart():
    out = np.zeros(int(.55 * SR))
    for o, g in ((0, 1.0), (.2, .65)):
        b = sine_sweep(62, 38, .2) * env(int(.2 * SR), a=.004, curve=6) * g; i = int(o * SR); out[i:i + len(b)] += b
    return out


def glitchsoft():
    d = .3; t = t_(d); out = np.zeros_like(t); seg = int(.018 * SR)
    for i in range(0, len(t), seg):
        f = rng.choice([220, 440, 880, 330]); out[i:i + seg] = np.sign(np.sin(2 * np.pi * f * t[i:i + seg])) * (rng.uniform(.2, .6) if rng.random() > .3 else 0)
    return fft_band(out, 0, 3500) * .3


def sting():
    d = 2.6; t = t_(d); out = np.zeros_like(t)
    for f in (440, 554.4, 659.3, 987.8, 1318.5):
        mod = np.sin(2 * np.pi * f * 2 * t) * env(len(t), curve=4) * 1.2
        out += np.sin(2 * np.pi * f * t + mod) * env(len(t), a=.01, curve=2.2) * .09
    sw = swell(.7); out[:len(sw)] += sw[::-1] * .0
    return out


def tap():
    return softclick() * 1.2



# ---------------- v3: softer, cleaner replacements ----------------
def mallet(f, d=.9, bright=.5):
    t = t_(d); n = len(t)
    s = np.sin(2*np.pi*f*t) * env(n, a=.003, curve=4.5) + np.sin(2*np.pi*f*3.98*t) * env(n, a=.002, curve=14) * .18 * bright
    s += np.sin(2*np.pi*f*2*t) * env(n, a=.003, curve=8) * .12
    return s * .5


def haptic():  # a muted phone buzz: two soft low taps, no square-wave rasp
    out = np.zeros(int(.4 * SR))
    for o in (0, .16):
        b = np.sin(2*np.pi*150*t_(.09)) * np.sin(np.pi*np.linspace(0, 1, int(.09*SR))) * .5
        i = int(o*SR); out[i:i+len(b)] += b
    return fft_band(out, 80, 400) * .8


def swish(d=.38, center=1400):
    n = noise(d); x = np.linspace(0, 1, len(n))
    b = fft_band(n, center * .45, center * 1.8, 1.2)
    return b * np.sin(np.pi * x) ** 2.2 * .55


def softflip():
    a = swish(.22, 1800); c = mallet(1760, .12, .2) * .25; a[:len(c)] += c; return a


def softimpact():
    d = 1.6; sub = sine_sweep(62, 34, d) * env(int(d*SR), a=.004, curve=3.2)
    body = fft_band(noise(.12), 60, 900) * env(int(.12*SR), a=.002, curve=10) * .35
    out = sub * .8; out[:len(body)] += body
    return out


def tape2(d=1.4):
    t = t_(d); x = np.linspace(0, 1, len(t))
    f = 520 + 180 * np.sin(2*np.pi*7*t)
    s = np.sin(2*np.pi*np.cumsum(f * (1 - .55*x))/SR) * .14
    s = fft_band(s, 150, 2500)
    return s * np.sin(np.pi * x) ** .8 + swish(d, 900) * .35


def crt2():
    d = .7; s = sine_sweep(900, 90, d) * env(int(d*SR), curve=5) * .12
    th = sine_sweep(110, 40, .35) * env(int(.35*SR), curve=6) * .7
    s[:len(th)] += th; return s


def soft_tick():
    return mallet(1318.5, .08, .1) * .3


def nothing():
    return np.zeros(10)

PENT = [220, 261.6, 293.7, 329.6, 392.0]           # A minor pentatonic
MAJ = [440, 554.4, 659.3, 880, 1108.7, 1318.5]       # A major


def note_minor(k):
    return PENT[k % 5] * (2 ** (k // 5)) * (1 if k < 15 else 1)


GEN = dict(softclick=softclick, vib=haptic, air=lambda: swish(.42, 1200), flip=softflip, riser=riser, impact=softimpact, whistle=nothing,
           crt=crt2, tape=tape2, swell=swell, bubble=bubble, roll=soft_tick, heart=heart, glitch=nothing, sting=sting, tap=tap)

# ---------------- bed ----------------
def saw(f, t):
    return 2 * ((f * t) % 1) - 1


def bed_tense(d, rise_to):
    t = t_(d); x = np.linspace(0, 1, len(t))
    dr = sum(np.sin(2*np.pi*f*(1+dt)*t) for f in (110, 164.8, 220) for dt in (-.003, .003)) / 6
    dr = fft_band(dr, 70, 700) * (.2 + .8 * x ** 1.5) * (.75 + .25*np.sin(2*np.pi*2*t))
    pulse = np.zeros_like(t); p = 0.0; i = 0
    while p < d:  # ticking clock that speeds up
        k = int(p * SR); tk = mallet(1046.5, .06, .1)
        pulse[k:k + len(tk)] += tk[:len(pulse) - k] * .22; p += .5 - .26 * (p / d); i += 1
    return dr * .5 + pulse


def bed_calm(d):
    t = t_(d); x = np.linspace(0, 1, len(t))
    pad = sum(np.sin(2*np.pi*f*(1+dt)*t) + .3*np.sin(4*np.pi*f*(1+dt)*t) for f in (220, 277.2, 329.6, 440) for dt in (-.003, .003)) / 8
    lfo = .7 + .3 * np.sin(2 * np.pi * .25 * t)
    pad = fft_band(pad, 80, 1600) * lfo
    fade = np.minimum(1, x * d / 1.2)
    return pad * .32 * fade


def reverb(x, dur=2.4, wet=.28, seed=3):
    r = np.random.default_rng(seed); n = int(dur * SR)
    ir = r.uniform(-1, 1, n) * np.exp(-np.linspace(0, 7, n)); ir = fft_band(ir, 200, 6000); ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n; F = 1 << (m - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:len(x)]
    return x * (1 - wet) + y * wet * 1.6


tl = json.load(open(sys.argv[1])); dur = tl['DUR']; Ltot = int(dur * SR) + SR
Lb = np.zeros(Ltot); Rb = np.zeros(Ltot)


def add(sig, t, gain, pan=0.0, L=None, R=None):
    L = Lb if L is None else L; R = Rb if R is None else R
    o = int(t * SR); n = min(len(sig), Ltot - o)
    if n <= 0: return
    L[o:o + n] += sig[:n] * gain * (1 - pan); R[o:o + n] += sig[:n] * gain * (1 + pan)


for cue in tl['SFX']:
    t, name, gain = cue[:3]; pan = cue[3] if len(cue) > 3 else float(rng.uniform(-.2, .2))
    if name == 'roll' and int(round(t * 1000)) % 3: continue
    if name.startswith('pm'): sig = mallet(note_minor(int(name[2:])), .7, .5)
    elif name.startswith('pM'): sig = mallet(MAJ[int(name[2:]) % len(MAJ)], 1.3, .7)
    elif name == 'airLR':
        sig = swish(.5, 1300) * 1.2; pan = 0; n = len(sig); pl = np.linspace(-.8, .8, n)
        o = int(t * SR); m = min(n, Ltot - o); Lb[o:o + m] += sig[:m] * gain * (1 - pl[:m]); Rb[o:o + m] += sig[:m] * gain * (1 + pl[:m]); continue
    else: sig = GEN[name]()
    add(sig, t, gain, pan)

# reverb bus on the effects
Lb = reverb(Lb, 2.2, .22, 3); Rb = reverb(Rb, 2.2, .22, 4)

# bed
BL = np.zeros(Ltot); BR = np.zeros(Ltot)
for a, b, mood in tl['BED']:
    d = b - a
    sig = bed_tense(d, 1) if mood == 'tense' else bed_calm(d)
    fo = int(.06 * SR); sig[-fo:] *= np.linspace(1, 0, fo)
    add(sig, a, .55, -.08, BL, BR); add(np.roll(sig, int(.011 * SR)), a, .55, .08, BL, BR)
BL = reverb(BL, 3.0, .35, 5); BR = reverb(BR, 3.0, .35, 6)

L = (Lb + BL * .5)[:int(dur * SR)]; R = (Rb + BR * .5)[:int(dur * SR)]
# gentle top-end roll-off and soft clip: easy on the ears
L = fft_band(L, 35, 9500); R = fft_band(R, 35, 9500)
peak = max(np.abs(L).max(), np.abs(R).max()); L, R = L / peak * .9, R / peak * .9
L, R = np.tanh(L * 1.2) / np.tanh(1.2), np.tanh(R * 1.2) / np.tanh(1.2)
pcm = (np.stack([L, R], 1) * .7 * 32767).astype('<i2')
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('sfx3 ok', len(tl['SFX']), 'cues')
