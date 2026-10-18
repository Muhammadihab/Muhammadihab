"""Builds the CRM reel around the voiceover: tightens pauses, places each line, estimates word times,
and writes crm.sync.js (scene starts on the 100 BPM grid, takeovers on the spoken words, word-timed captions).
usage: python3 sync_crm.py <voice.wav> <out_voice.wav> <out_sync.js>
"""
import sys, json, math, subprocess, wave, re
import numpy as np

SR = 48000; TEMPO = 1.05; BT = .6

def read(p):
    w = wave.open(p); sr = w.getframerate(); ch = w.getnchannels()
    x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768
    return (x.reshape(-1, ch).mean(1) if ch > 1 else x), sr

def write(p, x, sr):
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())

def db_frames(x, sr, hop=.01):
    h = int(hop * sr); n = len(x) // h
    return 20 * np.log10(np.sqrt((x[:n * h].reshape(n, h) ** 2).mean(1)) + 1e-9), h

def tighten(x, sr, keep=.14, minsil=.18, thr=-42):
    db, h = db_frames(x, sr); sil = db < thr
    nz = np.where(~sil)[0]; a, b = max(0, nz[0] - 2), min(len(sil), nz[-1] + 4)
    out, s0, i = [], a, a
    while i < b:
        if sil[i]:
            j = i
            while j < b and sil[j]: j += 1
            if (j - i) * h / sr > minsil:
                k = int(keep * sr) // 2
                out += [x[s0 * h:i * h], x[i * h:i * h + k], x[j * h - k:j * h]]; s0 = j
            i = j
        else: i += 1
    out.append(x[s0 * h:b * h]); return np.concatenate(out)

def word_times(z, sr, words):
    """spread words over the voiced frames, weighted by letters"""
    db, h = db_frames(z, sr); v = db > db.max() - 32
    cum = np.cumsum(v); tot = cum[-1]
    wts = [len(re.sub(r'[^\w]', '', w)) + 1 for w in words]; c = np.cumsum([0] + wts[:-1]) / sum(wts)
    return [float(np.searchsorted(cum, f * tot) * h / sr) for f in c]

# script lines: source span in the take, text with chunk breaks '|'
LINES = [
 ('p1', 0, 2.69, 'أيوه… | أنا رسالة «بكام؟»'),
 ('p2a', 2.69, 5.85, 'اتبعتت للمحل | يوم الخميس | الساعة تلاتة…'),
 ('p2b', 5.85, 8.44, 'ووصلت. | صحّين كمان.'),
 ('p3', 8.44, 11.9, 'أول ساعة قلت… | أكيد مشغولين.'),
 ('p4', 11.9, 15.0, 'بعدها يوم… | يومين…'),
 ('p5', 15.0, 17.4, 'وأنا بغرق | تحت رسايل الجروب.'),
 ('p6', 17.4, 21.45, 'لحد ما العميل… | كلّم حد تاني.'),
 ('p7', 21.45, 26.37, 'ده كان أوردر | بتمانية وأربعين ألف… | كان بتاعك.'),
 ('p8', 26.37, 29.77, 'بس مع سيستم عملاء… | الحكاية بتفرق.'),
 ('p9', 29.77, 33.65, 'كل رسالة بتبقى كارت | باسم صاحبها… | بيمشي معاك | خطوة بخطوة…'),
 ('p10', 33.65, 36.85, 'والسيستم بيفكّرك | تكلّمه قبل ما يسيبك.'),
 ('p11', 36.85, 40.04, 'ولو البيّاع ساب الشغل… | وحاول ياخد العملاء معاه؟'),
 ('p12', 40.04, 43.6, 'السيستم يمنعه… | وانت تقفل حسابه بضغطة.'),
 ('p13', 43.6, 46.6, 'ولو مش مصدّق… | حاول تسرقه بنفسك.'),
 ('p14', 46.6, 48.63, 'عاوز سيستم | زي ده لشغلك؟'),
 ('p15', 48.63, 50.2, 'كلّمنا على واتساب.'),
 ('p16', 50.2, 99, 'كل «بكام؟»… عميل. | متسيبهوش يغرق. | لوجيكا.'),
]
src, out_wav, out_js = sys.argv[1:4]
x, sr = read(src)
L = {}
for key, a, b, text in LINES:
    y = tighten(x[int(a * sr):int(min(b, len(x) / sr) * sr)], sr); write('/tmp/_s.wav', y, sr)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', '/tmp/_s.wav', '-af', f'atempo={TEMPO},aresample={SR}', '/tmp/_t.wav'], check=True)
    z, _ = read('/tmp/_t.wav'); words = text.replace('|', ' ').split()
    L[key] = dict(z=z, d=len(z) / SR, text=text, words=words, wt=word_times(z, SR, words))

up = lambda t: math.ceil(t / BT - 1e-6) * BT          # next beat
place = {}
def put(key, t): place[key] = t; return t + L[key]['d']
def word(key, w):  # absolute time of a word in a placed line
    i = next(k for k, s in enumerate(L[key]['words']) if w in s); return place[key] + L[key]['wt'][i]

T, TKO = {}, []
e = put('p1', .1); tb = word('p1', 'بكام'); TKO.append([tb, tb + 1.2, 'بكام؟', 'wa', 'رسالة واحدة… بس مهمة'])
T['list'] = up(max(e, tb + 1.2)); e = put('p2a', T['list'] + .1); e = put('p2b', e + .2)
T['sink'] = up(e - .3); e = put('p3', T['sink'] + .2); e = put('p4', e + .25); e = put('p5', e + .2)
t = up(e + .1); TKO.append([t, t + 1.2, 'يوم ٣', 'deep', 'ومحدش رد']); T['comp'] = t + 1.2
e = put('p6', T['comp'] + .15); e = put('p7', e + .15); tw = word('p7', 'بتمانية') - .05
TKO.append([tw, tw + 1.2, '٤٨,٥٠٠', 'red', 'جنيه راحوا لغيرك'])
T['split'] = up(e); e = put('p8', T['split'] + .1)
T['zab'] = up(max(e - .2, T['split'] + 1.8)); e = put('p9', T['zab'] + .1)
T['pipe'] = max(up(word('p9', 'بيمشي') - .3), T['zab'] + 1.8)
T['fol'] = up(max(e, T['pipe'] + 1.5)); e = put('p10', T['fol'] + .15)
t = up(max(e + .1, T['fol'] + 2.0)); TKO.append([t, t + 1.2, 'اتفقنا ✓', 'green', '٤٨,٥٠٠ جنيه رجعوا ليك']); T['sec'] = t + 1.2
e = put('p11', T['sec'] + .2); T['alert'] = word('p11', 'وحاول'); e = put('p12', e + .15)
T['stamp'] = word('p12', 'يمنعه'); T['click'] = word('p12', 'بضغطة')
T['steal'] = up(e + .2); e = put('p13', T['steal'] + .15)
t = up(max(e + .1, T['steal'] + 2.4)); TKO.append([t, t + 1.2, '٥ من ٥', 'cyan', 'محاولة سرقة اتمنعت']); T['cta'] = t + 1.2
e = put('p14', T['cta'] + .15); e = put('p15', e + .15); T['lg2'] = place['p15']
T['end'] = up(e + .1); e = put('p16', T['end'] + .15); T['logo'] = word('p16', 'لوجيكا')
T['DUR'] = up(e + 1.2)

bus = np.zeros(int((T['DUR'] + 1) * SR))
for k, t in place.items():
    z = L[k]['z']; o = int(t * SR); bus[o:o + len(z)] += z
write(out_wav, bus[:int(T['DUR'] * SR)], SR)

caps = []   # [t0, t1, [[word, t], ...]]
for k in place:
    if k == 'p16': continue
    t0 = place[k]; ws = L[k]['words']; wt = [t0 + w for w in L[k]['wt']]; i = 0
    for chunk in L[k]['text'].split('|'):
        n = len(chunk.split()); caps.append([wt[i] - .05, None, [[w, wt[i + j]] for j, w in enumerate(chunk.split())]]); i += n
    caps[-1][1] = t0 + L[k]['d'] + .25
for a, b in zip(caps, caps[1:]):
    if a[1] is None: a[1] = b[0]
    a[1] = min(a[1], b[0])
r = lambda v: round(v, 3)
sync = dict(T={k: r(v) for k, v in T.items()}, tko=[[r(a), r(b), *rest] for a, b, *rest in TKO],
            caps=[[r(a), r(b), [[w, r(t)] for w, t in ws]] for a, b, ws in caps])
open(out_js, 'w').write('// generated by vo/sync_crm.py from the voiceover\nwindow.SYNC=' + json.dumps(sync, ensure_ascii=False) + ';\n')
print(json.dumps(sync['T'], ensure_ascii=False)); print('lines', {k: round(v, 2) for k, v in place.items()})
