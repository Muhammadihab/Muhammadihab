"""Builds a two-part music bed: track A until the story turns, track B (looped if short) after it.
usage: python3 music_bed.py <out.wav> <dur> <switch_t> <A.wav> <A_offset> <B.wav> <B_offset> [B_starts_at]
Each track is levelled to the same loudness; A fades out into the switch, B fades in, the end fades out.
"""
import sys, subprocess, numpy as np, wave

SR = 48000
def load(p, off):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-ss', str(off), '-i', p, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'])
    x = np.frombuffer(raw, '<i2').astype(np.float32).reshape(-1, 2) / 32768
    return x / (np.sqrt((x ** 2).mean()) + 1e-9) * .1      # same RMS for both tracks

out, dur, sw, A, aoff, B, boff = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4], float(sys.argv[5]), sys.argv[6], float(sys.argv[7])
bstart = float(sys.argv[8]) if len(sys.argv) > 8 else sw
n = int(dur * SR); bed = np.zeros((n, 2), np.float32)
a = load(A, aoff)[:int((sw + .6) * SR)]; ramp = lambda k: np.linspace(0, 1, k)[:, None]
fa = int(.6 * SR); a[-fa:] *= ramp(fa)[::-1]; bed[:len(a)] += a[:n]
b = load(B, boff); o = int(bstart * SR); need = n - o
b = np.tile(b, (int(np.ceil(need / len(b))), 1))[:need]; fb = int(.25 * SR); b[:fb] *= ramp(fb); bed[o:] += b
fo = int(1.5 * SR); bed[-fo:] *= ramp(fo)[::-1]
w = wave.open(out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(bed, -1, 1) * 32767).astype('<i2').tobytes())
