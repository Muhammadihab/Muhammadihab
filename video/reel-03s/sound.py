"""Sound for the «٠.٣ ثانية» prototype: press, time stops, the dive, the tunnel, a check at every gate.
usage: python3 sound.py <out.wav>
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../library'))
import numpy as np, sfx
from sfx import place, K, write, SR
DUR = 14.0
W = lambda at, d, db, pk=.5, lo=200, hi=3500: ('W', at, db, dict(dur=d, peak=pk, lo=lo, hi=hi, seed=int(at * 37)))
X = lambda at, id, db: ('X', at, db, dict(id=id))
CUES = [X(.02, 'sx-07', -14), X(1.04, 'sx-18', -4), X(1.2, 'sx-09', -9), ('X', 1.3, -17, dict(id='sx-31')), ('R', 1.9, -8, dict(dur=.85)), X(2.75, 'sx-08', -5),
        ('S', 3.0, -20, dict(dur=11.0)), W(3.0, 1.3, -11, .55), W(6.2, 1.1, -12, .55, 250, 4000), W(9.2, 1.0, -12, .55, 250, 4000), W(12.0, 2.0, -9, .7, 200, 5000)]
for at in (5.3, 8.3, 11.1, 13.5): CUES += [('T', at, -7, dict(k=1.1)), ('G', at + .02, -14, dict(dur=.6, density=50))]
CUES += [X(8.32, 'sx-15', -18)]
mix = np.zeros((int((DUR + 1) * SR), 2), np.float32)
for kind, at, db, kw in CUES: place(mix, K[kind](**kw), at, db)
mix = sfx.room(mix)[:int(DUR * SR)]; write(sys.argv[1], mix / (np.abs(mix).max() + 1e-9) * .9); print(sys.argv[1])
