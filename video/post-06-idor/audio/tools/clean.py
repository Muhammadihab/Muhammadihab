import sys, wave, numpy as np
from pyrnnoise import RNNoise
def rd(p):
    w=wave.open(p); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float32)/32768; return x,w.getframerate()
def wr(p,x,sr):
    w=wave.open(p,'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes()); w.close()
hp,sr=rd(sys.argv[1])
rn=RNNoise(sr); out=[]; probs=[]
for p,f in rn.denoise_chunk((hp*32767).astype(np.int16), partial=True):
    out.append(np.asarray(f).reshape(-1)); probs.append(float(np.mean(p)))
y=np.concatenate(out).astype(np.float32)/32768
# align (RNNoise adds a small fixed delay)
n=min(len(y),len(hp)); seg=slice(int(5*sr),int(15*sr))
best=max(range(0,2000,10),key=lambda d: float(np.dot(hp[seg],y[d+seg.start:d+seg.stop])))
best=max(range(max(0,best-10),best+10),key=lambda d: float(np.dot(hp[seg],y[d+seg.start:d+seg.stop])))
y=y[best:]; n=min(len(y),len(hp)); y=y[:n]; hp=hp[:n]
print('rnnoise delay samples',best)
mix=0.88*y+0.12*hp
wr(sys.argv[2],mix,sr); wr(sys.argv[3],y,sr)
