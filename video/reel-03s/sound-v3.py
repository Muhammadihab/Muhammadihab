"""Sound for the «٠.٣ ثانية» v3 (the version written so nobody leaves halfway).
usage: python3 sound-v3.py <out.wav>
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../library'))
import numpy as np, sfx
from sfx import place, K, write, SR
DUR = 36.0
W = lambda at, d, db, pk=.5, lo=200, hi=3500, p0=0, p1=0: ('W', at, db, dict(dur=d, peak=pk, lo=lo, hi=hi, p0=p0, p1=p1, seed=int(at * 37)))
X = lambda at, id, db: ('X', at, db, dict(id=id))
T = lambda at, db=-8, k=1.1: ('T', at, db, dict(k=k))
G = lambda at, db=-14, d=.5: ('G', at, db, dict(dur=d))
C = [# cold open: the disaster
     X(0, 'sx-28', -6), X(1.0, 'sx-28', -7), X(2.0, 'sx-28', -8), X(.1, 'sx-23', -13), X(0, 'sx-16', -22),
     # rewind back to the press
     X(2.4, 'sx-15', -6), X(2.5, 'sx-30', -6), W(3.1, .5, -18, .5, 500, 4000), X(3.68, 'sx-18', -4), X(3.72, 'sx-09', -10), ('X', 3.8, -21, dict(id='sx-31')),
     W(4.35, .9, -6, .5, 180, 4200, .8, -.8), X(4.8, 'sx-10', -8), ('S', 4.8, -21, dict(dur=20.4)),
     # camera rushes between the gates
     W(9.2, .9, -11, .6), W(14.0, .9, -11, .6), W(19.1, .9, -11, .6), W(24.6, .9, -10, .7, 200, 5000), W(28.6, .8, -10, .4, 150, 2500),
     # 1 double tap
     X(5.9, 'sx-18', -7), X(6.05, 'sx-18', -9), X(7.0, 'sx-27', -12), T(7.4), G(7.42),
     # 2 out of stock
     X(10.7, 'sx-27', -12), W(11.6, .7, -14, .5, 400, 3000, -.6, .6), T(12.4), G(12.42),
     # the hook in the middle
     X(14.6, 'sx-07', -10), ('R', 14.7, -12, dict(dur=.6)),
     # 3 eavesdropper
     X(15.8, 'sx-25', -15), X(17.2, 'sx-15', -13), T(17.3), G(17.32),
     # 4 the impostor, in slow motion
     X(20.5, 'sx-28', -6), X(21.3, 'sx-28', -6), X(22.1, 'sx-28', -6), W(20.6, 2.5, -14, .9, 300, 2500, -.8, 0), X(23.08, 'sx-06', -3), X(23.1, 'sx-27', -10),
     W(23.15, .9, -15, .2, 300, 2500, 0, -.9), G(23.3, -12, .7),
     # payoff: back to the news
     X(25.0, 'sx-15', -7), X(25.2, 'sx-30', -8), X(26.0, 'sx-28', -7), X(26.8, 'sx-06', -6), X(26.85, 'sx-23', -14), X(28.3, 'sx-15', -8),
     # the map
     *[('T', 29.1 + i * .5, -10, dict(k=1 + i * .05)) for i in range(2)], *[('T', 29.7 + i * .08, -8, dict(k=1.1 + i * .05)) for i in range(3)], G(29.75, -9, 1.0), X(30.6, 'sx-10', -8),
     # the end and the loop
     X(32.4, 'sx-08', -6), G(33.6, -14, .8), W(35.2, .5, -16, .4, 400, 4000)]
mix = np.zeros((int((DUR + 1) * SR), 2), np.float32)
for kind, at, db, kw in C: place(mix, K[kind](**kw), at, db)
mix = sfx.room(mix)[:int(DUR * SR)]; write(sys.argv[1], mix / (np.abs(mix).max() + 1e-9) * .9); print(sys.argv[1])
