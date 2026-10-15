"""Remove steady tonal interference (horns, whines) with an STFT mask.
A bin is 'tonal' when it sticks out >8 dB above its spectral neighbourhood for most of a ~0.8 s window
-- speech harmonics glide and don't stay put that long."""
import sys, wave, numpy as np
from numpy.lib.stride_tricks import sliding_window_view as sw
w=wave.open(sys.argv[1]); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float64)/32768
N=4096; H=1024; win=np.sqrt(np.hanning(N+1)[:N])
pad=np.concatenate([np.zeros(N),x,np.zeros(N)])
nf=(len(pad)-N)//H+1
F=np.fft.rfft(sw(pad,N)[::H][:nf]*win,axis=1)          # [T,F]
mag=np.abs(F); db=20*np.log10(mag+1e-10)
f=np.fft.rfftfreq(N,1/sr)
B=30; dp=np.pad(db,((0,0),(B,B)),mode='edge'); med=np.median(sw(dp,2*B+1,axis=1),axis=2)
prom=db-med
hit=(prom>8).astype(float)
k=int(0.8*sr/H)|1; ker=np.ones(k)/k
pers=np.apply_along_axis(lambda c: np.convolve(c,ker,'same'),0,hit)
mask=(pers>=0.55)&(prom>4)&(f[None,:]>1500)&(f[None,:]<10000)
# grow the mask by +-2 bins and +-2 frames so the tone's skirts go too
from scipy.ndimage import binary_dilation
mask=binary_dilation(mask,structure=np.ones((5,5),bool))
att=np.where(mask, np.minimum(1.0, 10**((med-db)/20)), 1.0)   # pull masked cells down to the local floor
# smooth attenuation a little in time to avoid musical noise
from scipy.ndimage import uniform_filter
att=np.clip(uniform_filter(att,size=(3,1)),0,1)
Y=F*att
y=np.zeros(len(pad)); norm=np.zeros(len(pad)); fr=np.fft.irfft(Y,n=N,axis=1)*win
for i in range(nf): y[i*H:i*H+N]+=fr[i]; norm[i*H:i*H+N]+=win**2
y=y/np.maximum(norm,1e-8); y=y[N:N+len(x)]
o=wave.open(sys.argv[2],'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes((np.clip(y,-1,1)*32767).astype('<i2').tobytes()); o.close()
cells=mask.sum(); print('tonal cells removed: %d (%.2f%% of TF plane)'%(cells,100*cells/mask.size))
