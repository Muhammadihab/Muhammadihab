"""Sound for the CRM reel v10: the voiceover, every library element's own sound at the moment it appears,
and the sounds of the chat world (messages, clock, sinking). Effects duck under the voice; -14 LUFS.
usage: python3 mix.py <voice.wav> <video.mp4> <out.mp4>
"""
import sys, os, json, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '../../../library'))
import sfx
from sfx import SR, place, K, CUES, auto_cues, write

DUR = 47.4
# (element, when it starts) — the same list as reel.js; hq-06 is re-timed there, so its sounds are placed by hand below
EL = [('hq-03', .81), ('hq-03', 12.22), ('hq-10', 14.3), ('vr-06', 16.35), ('hq-05', 18.75), ('ui-06', 25.35), ('hq-03', 27.85),
      ('ui-07', 29.5), ('hq-07', 32.31), ('ui-09', 33.55), ('vr-11', 35.45), ('hq-01', 36.75), ('hq-08', 39.2), ('hq-04', 41.95), ('hq-09', 44.9), ('fx-16', 29.45), ('fx-16', 31.45)]
X = lambda id: ('X', id)
W = lambda at, d, db, pk=.5, lo=250, hi=3500, p0=0, p1=0: ('W', at, db, dict(dur=d, peak=pk, lo=lo, hi=hi, p0=p0, p1=p1, seed=int(at * 31)))
EXTRA = [('X', .02, -12, dict(id='sx-07')), W(2.3, 1.0, -16, .4, 200, 2500), ('T', 5.17, -9, {}), ('T', 5.63, -8, dict(k=1.1)),
         ('X', 6.8, -20, dict(id='sx-31')), ('T', 9.0, -10, {}), ('T', 9.87, -10, {}),
         *[('T', 10.45 + i * .14, -15 + i * .3, dict(k=1 + i * .03)) for i in range(14)], ('X', 11.2, -13, dict(id='sx-13')), W(13.85, .7, -14, .5, 300, 3000),
         ('X', 15.3, -15, dict(id='sx-13')),
         W(19.75, .6, -12, .5, 200, 3000), ('S', 22.1, -12, dict(dur=.8)), W(23.2, .5, -15, .5, 250, 2600, -.4, .5), W(25.0, 2.6, -15, .5, 200, 2200, .7, -.7),
         ('X', 27.6, -10, dict(id='sx-07')), ('X', 29.42, -7, dict(id='sx-06'))]

def build():
    mix = np.zeros((int((DUR + 1) * SR), 2), np.float32); durs = json.load(open(os.path.join(HERE, 'durs.json')))   # element lengths, read from the library
    for eid, at in EL:
        dur = durs[eid]
        cues = CUES[eid][1] if eid in CUES else auto_cues(eid, dur)
        for kind, t, db, kw in cues: place(mix, K[kind](**kw), at + t, db)
    for kind, t, db, kw in EXTRA: place(mix, K[kind](**kw), t, db)
    mix = sfx.room(mix)[:int(DUR * SR)]; return mix / (np.abs(mix).max() + 1e-9) * .9

if __name__ == '__main__':
    voice, video, out = sys.argv[1:4]; tmp = os.path.splitext(out)[0]; write(tmp + '_fx.wav', build())   # working files sit next to the output
    fc = ("[0:a]aformat=channel_layouts=stereo,asplit=2[vo][k];[1:a]volume=-5dB[fx0];[fx0][k]sidechaincompress=threshold=0.02:ratio=4:attack=8:release=250[fx];"
          "[vo][fx]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[m]")
    subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', voice, '-i', tmp + '_fx.wav', '-filter_complex', fc, '-map', '[m]', '-ar', '48000', tmp + '_mix.wav'], check=True)
    subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', video, '-i', tmp + '_mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
    print(out)
