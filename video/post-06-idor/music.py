"""Procedural music bed for the reel: tense minor-key pulse during the problem,
lifts to a brighter progression at the fix, swells on the logo.
usage: python3 music.py <duration_s> <fix_time_s> <end_time_s> out.wav"""
import sys, wave
import numpy as np

SR = 48000
DUR, FIX, END = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
BPM = 104; BEAT = 60 / BPM; BAR = 4 * BEAT
n = int(DUR * SR); t = np.arange(n) / SR
rng = np.random.default_rng(3)
L = np.zeros(n); R = np.zeros(n)

def midi(m): return 440 * 2 ** ((m - 69) / 12)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= n: return
    k = min(len(sig), n - i)
    L[i:i + k] += sig[:k] * gain * (1 - pan) ; R[i:i + k] += sig[:k] * gain * (1 + pan)

def env_adsr(length, a, d, s, r):
    N = int(length * SR); e = np.ones(N) * s
    A, D, Rr = int(a * SR), int(d * SR), int(r * SR)
    e[:A] = np.linspace(0, 1, max(A, 1)); e[A:A + D] = np.linspace(1, s, max(D, 1))[:len(e[A:A + D])]
    if Rr: e[-Rr:] *= np.linspace(1, 0, Rr)
    return e

def lowpass(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y

def pad(notes, length):
    tt = np.arange(int(length * SR)) / SR; sig = np.zeros(len(tt))
    for m in notes:
        for det in (-0.08, 0.0, 0.08):                      # detuned saw stack
            f = midi(m) * 2 ** (det / 12)
            sig += 2 * ((tt * f + rng.random()) % 1) - 1
    sig = np.convolve(sig, np.ones(24) / 24, 'same')        # soften the saws
    return sig / (3 * len(notes)) * env_adsr(length, .6, .4, .85, .8)

def pluck(m, length=.35):
    tt = np.arange(int(length * SR)) / SR
    return (np.sin(2 * np.pi * midi(m) * tt) + .3 * np.sin(4 * np.pi * midi(m) * tt)) * np.exp(-tt * 11)

def kick():
    tt = np.arange(int(.35 * SR)) / SR; f = 50 + 70 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)

def hat():
    x = rng.uniform(-1, 1, int(.05 * SR)); x = x - lowpass(x, 6000)
    return x * np.exp(-np.arange(len(x)) / SR * 70)

# chord progressions (MIDI) — Am F Dm E for tension, then C G Am F for the fix
TENSE = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]]
BRIGHT = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
ARP_T = [[69, 72, 76, 72], [65, 69, 72, 69], [62, 65, 69, 65], [64, 68, 71, 68]]
ARP_B = [[72, 76, 79, 76], [67, 71, 74, 71], [69, 72, 76, 72], [65, 69, 72, 69]]

bar = 0; tb = 0.0
while tb < DUR:
    fixed = tb >= FIX - 0.01
    k = bar % 4
    chord = (BRIGHT if fixed else TENSE)[k]; arp = (ARP_B if fixed else ARP_T)[k]
    if tb < END:
        add(pad(chord, BAR + .8), tb, .55 if fixed else .5)
        add(pad([chord[0] - 12], BAR + .8), tb, .5)        # bass note under the pad
        intro = tb < 4.2
        for b in range(4):
            bt = tb + b * BEAT
            if bt >= END: break
            add(kick(), bt, .55 if not intro else .3)
            if not intro:
                add(hat(), bt + BEAT / 2, .18, .2)
                for s16 in range(2):
                    add(pluck(arp[(b * 2 + s16) % 4]), bt + s16 * BEAT / 2, .16 if fixed else .12, -.25 + .5 * (s16 % 2))
    bar += 1; tb += BAR

# final swell: big bright chord on the logo
add(pad([60, 64, 67, 72], DUR - END + .2), END, .9)
add(pad([48], DUR - END + .2), END, .6)

mix = np.stack([L, R], 1)
# gentle fade in/out and normalise to leave headroom
fi = int(.3 * SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
fo = int(1.2 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None]
mix /= np.abs(mix).max() + 1e-9; mix *= .7
w = wave.open(sys.argv[4], 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix * 32767).astype('<i2').tobytes()); w.close()
print('music ok', DUR, 's')
