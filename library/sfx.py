"""Sound design for library elements: real samples (sound/) placed on the frame, plus procedural whooshes and low hits.
usage: python3 sfx.py <element id> <out.wav>      (cue lists live in CUES below)
"""
import sys, subprocess, wave, numpy as np, os
SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
# sample name -> (file, where its hit is inside the file, in seconds)
S = {'pop': ('button-2.wav', 0.0), 'tap': ('button-1.wav', 0.0), 'click': ('scifi-click.mp3', 0.375),
     'win': ('correct-woosh.mp3', 0.5), 'ticks': ('spin-clicks.mp3', 0.0)}

def load(name, rate=1.0):
    f, _ = S[name]; r = subprocess.check_output(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(HERE, 'sound', f), '-af', f'asetrate={int(SR * rate)},aresample={SR}', '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'])
    return np.frombuffer(r, '<i2').astype(np.float32).reshape(-1, 2) / 32768

def whoosh(dur, peak=.6, lo=300, hi=3000, seed=1):
    """filtered noise that swells to `peak` (fraction of dur) and sweeps from lo to hi Hz and back"""
    n = int(dur * SR); rng = np.random.default_rng(seed); x = rng.standard_normal((n, 2)).astype(np.float32)
    t = np.linspace(0, 1, n); env = np.where(t < peak, (t / peak) ** 2.2, ((1 - t) / (1 - peak)) ** 1.6)
    fc = lo + (hi - lo) * np.where(t < peak, t / peak, 1 - (t - peak) / (1 - peak) * .6); out = np.zeros_like(x); y = np.zeros(2, np.float32)
    a = np.exp(-2 * np.pi * fc / SR)   # one-pole low-pass with a moving cutoff, then a high-pass by subtraction of a slower one
    z = np.zeros(2, np.float32)
    for i in range(n): y = a[i] * y + (1 - a[i]) * x[i]; z = .995 * z + .005 * y; out[i] = y - z
    out *= env[:, None]; return out / (np.abs(out).max() + 1e-9) * .8

def hit(dur=.6, f0=70, f1=38):
    """low sine thump with a click on top"""
    n = int(dur * SR); t = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-t * 18); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * np.exp(-t * 7) + .25 * np.random.default_rng(3).standard_normal(n) * np.exp(-t * 90); y = y / np.abs(y).max() * .9
    return np.stack([y, y], 1).astype(np.float32)

def place(mix, clip, at, db=0.0, anchor=0.0):
    i = int((at - anchor) * SR); s = max(0, -i); i = max(0, i); clip = clip[s:]; m = min(len(clip), len(mix) - i)
    if m > 0: mix[i:i + m] += clip[:m] * 10 ** (db / 20)

CUES = {
  # hq-06: messages pop in, the camera whips out, the message becomes a card, the card closes, the lock snaps, the camera dives in
  'hq-06': (6.0, [('pop', .10, -8, 1.0), ('pop', .29, -6, 1.06), ('pop', .48, -8, .96), ('pop', .67, -8, 1.1), ('pop', .86, -9, 1.0), ('pop', 1.05, -9, 1.12),
                  ('W', 1.15, .45, -10, .55, 250, 2600), ('click', 1.6, -6, 1.0), ('W', 1.9, .7, -14, .5, 400, 3500), ('pop', 2.5, -10, .9),
                  ('W', 2.05, .6, -15, .5, 200, 1800), ('W', 2.75, .7, -12, .55, 250, 2400), ('win', 3.45, -5, 1.0), ('tap', 3.78, -6, 1.0),
                  ('click', 4.15, -3, .85), ('H', 4.16, -14), ('W', 4.25, .55, -8, .85, 200, 5000), ('H', 4.78, -4)]),
  # hq-01: braces slam, sparks, the lock grows, the shackle draws and snaps, the words come in
  'hq-01': (2.8, [('W', 0.0, .32, -9, .9, 300, 4000), ('H', .3, -4), ('pop', .38, -10, .8), ('W', .55, .4, -16, .7, 800, 5000),
                  ('click', 1.05, -2, .9), ('H', 1.06, -12), ('win', 1.3, -9, 1.0)]),
}

if __name__ == '__main__':
    eid, out = sys.argv[1:3]; dur, cues = CUES[eid]; mix = np.zeros((int(dur * SR) + SR, 2), np.float32)
    for c in cues:
        if c[0] == 'W': _, at, d, db, pk, lo, hi = c; place(mix, whoosh(d, pk, lo, hi, seed=int(at * 100)), at, db)
        elif c[0] == 'H': _, at, db = c; place(mix, hit(), at, db)
        else: name, at, db, rate = c; place(mix, load(name, rate), at, db, S[name][1] / rate)
    mix = mix[:int(dur * SR)]; mix /= max(1, np.abs(mix).max() / .95)
    w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes()); print(out, dur, 's')
