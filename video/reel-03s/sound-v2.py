"""Sound for the «٠.٣ ثانية» v2: press, the sweep in, a problem and its fix at each gate, the twist, the map lighting up, the logo.
usage: python3 sound-v2.py <out.wav>
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../library'))
import numpy as np, sfx
from sfx import place, K, write, SR
DUR = 35.0
W = lambda at, d, db, pk=.5, lo=200, hi=3500, p0=0, p1=0: ('W', at, db, dict(dur=d, peak=pk, lo=lo, hi=hi, p0=p0, p1=p1, seed=int(at * 37)))
X = lambda at, id, db: ('X', at, db, dict(id=id))
C = [X(1.08, 'sx-18', -4), X(1.12, 'sx-09', -10), ('X', 1.2, -20, dict(id='sx-31')), W(2.15, .9, -6, .5, 180, 4200, .8, -.8), X(2.62, 'sx-10', -8),
     ('S', 2.7, -21, dict(dur=23.5)),
     # gates: the camera rushes between them
     W(7.6, .9, -11, .6), W(12.3, .9, -11, .6), W(21.4, .9, -11, .6), W(25.8, .9, -10, .7, 200, 5000),
     # 1 impostor: slides in, is thrown out
     W(4.0, 1.2, -16, .8, 300, 2500, -.8, 0), X(5.88, 'sx-06', -5), X(5.9, 'sx-27', -10), W(5.95, .9, -15, .2, 300, 2500, 0, -.9),
     # 2 eavesdropper: the eye opens, reads nonsense
     X(9.1, 'sx-25', -15), X(10.55, 'sx-15', -13), X(10.6, 'sx-17', -8), ('G', 10.62, -15, dict(dur=.5)),
     # the twist
     X(12.75, 'sx-15', -6), X(12.9, 'sx-30', -8), X(13.0, 'sx-16', -16), X(14.6, 'sx-28', -8), X(15.4, 'sx-06', -6), X(15.6, 'sx-23', -14), X(17.0, 'sx-15', -8), X(17.1, 'sx-05', -14),
     # 3 out of stock, rerouted
     X(17.9, 'sx-27', -12), W(18.8, .7, -14, .5, 400, 3000, -.6, .6), X(19.55, 'sx-17', -8), ('G', 19.6, -14, dict(dur=.5)),
     # 4 double tap, cancelled
     X(22.8, 'sx-18', -8), X(22.95, 'sx-18', -10), X(23.9, 'sx-27', -12), X(24.4, 'sx-17', -8), ('G', 24.42, -15, dict(dur=.4)),
     # the map
     W(26.4, .8, -10, .4, 150, 2500), *[('T', 27.0 + i * .5, -10, dict(k=1 + i * .05)) for i in range(2)], *[('T', 27.7 + i * .08, -8, dict(k=1.1 + i * .05)) for i in range(3)],
     ('G', 27.75, -9, dict(dur=1.0)), X(28.6, 'sx-10', -8),
     # the end and the loop back to the phone
     X(31.2, 'sx-08', -6), ('G', 32.4, -14, dict(dur=.8)), W(34.2, .5, -16, .4, 400, 4000)]
mix = np.zeros((int((DUR + 1) * SR), 2), np.float32)
for kind, at, db, kw in C: place(mix, K[kind](**kw), at, db)
mix = sfx.room(mix)[:int(DUR * SR)]; write(sys.argv[1], mix / (np.abs(mix).max() + 1e-9) * .9); print(sys.argv[1])
