import sys, wave, json, numpy as np
w=wave.open(sys.argv[1]); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float32)/32768
# (source start, source end, gap after, label)
EDL=[
 (0.40, 2.98, .22,'L1a لو جالك الرسالة دي… تطبيقك فيه مشكلة'),
 (3.48, 4.72, .45,'L1b وغالبًا إنت مش واخد بالك'),
 (5.44, 9.55, .45,'L2 خلينا نوريك… متجر إحنا عاملينه'),
 (10.72,14.62,.35,'L3 بص على اللينك… رقم الأوردر'),
 (15.28,16.30,.30,'L4a لو غيرناه…'),
 (16.80,20.80,.25,'L4b خلينا مثلًا ٤٣… فتحلنا أوردر واحدة تانية'),
 (21.65,23.35,.55,'L4c اسمها ورقمها وعنوانها'),
 (23.66,24.75,.30,'L5a طب ده حصل إزاي؟'),
 (25.75,29.52,.45,'L5b بيجيب الأوردر بالرقم… مش بيسأل'),
 (36.38,39.65,.45,'L6 IDOR (take 2)'),
 (40.84,45.70,.25,'L7a وأي حد يقدر يكمّل… ٤٤، ٤٥'),
 (46.82,49.10,.55,'L7b بيعمل access للعملاء'),
 (50.68,51.95,.30,'L8a طب إيه الحل؟'),
 (86.47,90.02,.25,'L8b الموقع يتأكد في كل مرة (final take)'),
 (91.60,93.85,.55,'L8c لو مش صاحبه…'),
 (99.92,105.20,.30,'L9a اسأل المبرمج بتاعك'),
 (106.58,109.05,.60,'L9b ابعتلنا على واتساب'),
 (109.51,111.90,.40,'L10 Logika. متأمّن من جوّا'),
]
fi,fo=int(.008*sr),int(.03*sr)
# room tone: quietest 0.6s of the cleaned track, looped very low under the gaps
hop=int(.05*sr); win=int(.6*sr)
e=[np.sqrt(np.mean(x[i:i+win]**2)) for i in range(0,len(x)-win,hop)]; i0=int(np.argmin(e))*hop; tone=x[i0:i0+win].copy()
def roomtone(n):
    return np.zeros(n,np.float32)
def _unused(n):
    r=np.resize(tone,n); f=min(int(.02*sr),n//2)
    if f>0: r[:f]*=np.linspace(0,1,f); r[-f:]*=np.linspace(1,0,f)
    return r
parts=[]; marks=[]; t=0.0
for s,e_,gap,lab in EDL:
    seg=x[int(s*sr):int(e_*sr)].copy(); seg[:fi]*=np.linspace(0,1,fi); seg[-fo:]*=np.linspace(1,0,fo)
    marks.append({'t0':round(t,3),'t1':round(t+len(seg)/sr,3),'src':[s,e_],'label':lab})
    parts.append(seg); t+=len(seg)/sr
    g=roomtone(int(gap*sr)); parts.append(g); t+=len(g)/sr
y=np.concatenate(parts)
o=wave.open(sys.argv[2],'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes((np.clip(y,-1,1)*32767).astype('<i2').tobytes()); o.close()
json.dump(marks,open(sys.argv[3],'w'),ensure_ascii=False,indent=1)
print('edited length %.2fs (from %.2fs)'%(len(y)/sr,len(x)/sr))
for m in marks: print('%6.2f-%6.2f  %s'%(m['t0'],m['t1'],m['label']))
