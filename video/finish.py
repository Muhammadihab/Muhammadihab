"""Final mix and edit for one reel variant: cuts picture, voice and effects with the same segments,
then lays ONE continuous music bed over the edited timeline (so a cold open never chops the music),
carves room for the voice and ducks the music under it.
usage: python3 finish.py <erp|crm> <variant: full|cut|hookB|hookC> <out.mp4> [nomusic]
"""
import sys, json, subprocess, os, numpy as np, wave

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
SR = 48000
SP = os.environ.get('STEMS', '/tmp/claude-0/-home-user-Muhammadihab/fbe3b44f-ab48-5b4b-b63d-da610b194d47/scratchpad')
UP = '/root/.claude/uploads/fbe3b44f-ab48-5b4b-b63d-da610b194d47/'
REELS = {
    'erp': dict(video=f'{HERE}/reel-erp/reel-erp-v12-music.mp4', voice=f'{SP}/vo/vo_placed.wav', sfx=f'{SP}/mus/sfx_erp.wav', dur=39.0,
                A=UP + '3c306272-lnplusmusic-suspense-tension-suspenseful-tense-323181.mp3', a_off=0,
                B=UP + '83999423-jonasblakewood-background-music-618629.mp3', b_off=8, turn=15.6, b_at=16.8),
    'crm': dict(video=f'{HERE}/reel-crm/reel-crm-v9.mp4', voice=f'{SP}/vo/crm3_vo.wav', sfx=f'{SP}/mus/sfx_crm.wav', dur=47.4,
                A=UP + 'e3768a34-maheralhilo-cool-suspense-pizzicato-full-206157.mp3', a_off=0,
                B=UP + 'c37cdbbf-looperman-l-4228984-0318218-funky-pick-bass-groove-2-100-bpm.wav', b_off=0, turn=19.2, b_at=19.2),
}
from cutdown import CUTS  # noqa: E402  (segment lists live in one place)

def load(p, off=0, ch=2):
    raw = subprocess.check_output(['ffmpeg', '-loglevel', 'error', '-ss', str(off), '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 's16le', '-'])
    return np.frombuffer(raw, '<i2').astype(np.float32).reshape(-1, ch) / 32768

def save(p, x):
    w = wave.open(p, 'wb'); w.setnchannels(x.shape[1]); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())

def cut(x, segs):
    parts = []
    for a, b in segs:
        y = x[int(a * SR):int(b * SR)].copy(); f = int(.008 * SR)
        y[:f] *= np.linspace(0, 1, f)[:, None]; y[-f:] *= np.linspace(1, 0, f)[:, None]; parts.append(y)
    return np.concatenate(parts)

def to_new(t, segs):
    """position of master time t in the edit (last segment that contains it)"""
    pos, hit = 0, None
    for a, b in segs:
        if a <= t <= b: hit = pos + t - a
        pos += b - a
    return hit

kind, variant, out = sys.argv[1:4]
R = REELS[kind]
segs = [(0, R['dur'])] if variant == 'full' else CUTS[kind if variant == 'cut' else f'{kind}-{variant}']
dur = sum(b - a for a, b in segs)
voice = cut(load(R['voice'], ch=1), segs); sfx = cut(load(R['sfx']), segs)

# one continuous bed: A until the story turns, B after it
turn, b_at = to_new(R['turn'], segs), to_new(R['b_at'], segs)
n = int(dur * SR); norm = lambda x: x / (np.sqrt((x ** 2).mean()) + 1e-9) * .1
bed = np.zeros((n, 2), np.float32)
A = norm(load(R['A'], R['a_off']))[:int((turn + .6) * SR)]; f = int(.6 * SR); A[-f:] *= np.linspace(1, 0, f)[:, None]
bed[:min(n, len(A))] += A[:n]
o = int(b_at * SR); B = norm(load(R['B'], R['b_off'])); B = np.tile(B, (n // len(B) + 2, 1))[:n - o]
f = int(.25 * SR); B[:f] *= np.linspace(0, 1, f)[:, None]; bed[o:] += B
f = int(1.5 * SR); bed[-f:] *= np.linspace(1, 0, f)[:, None]
MUSIC = sys.argv[4:5] != ['nomusic']
if not MUSIC: bed[:] = 0   # voice and effects only

tmp = f'/tmp/finish_{kind}_{variant}'
for name, x in (('voice', voice), ('sfx', sfx), ('bed', bed)): save(f'{tmp}_{name}.wav', x[:n])
# music: cut the voice band, sit low, duck hard and fast under speech, come back in the gaps
fc = (f"[0:a]pan=stereo|c0=c0|c1=c0,asplit=3[vo][k1][k2];"
      f"[1:a]volume={-8 if MUSIC else -5}dB[fx0];[fx0][k1]sidechaincompress=threshold=0.02:ratio=4:attack=10:release=250[fx];"
      f"[2:a]equalizer=f=2500:t=q:w=1.4:g=-5,equalizer=f=350:t=q:w=1:g=-2,volume=-4dB[mu0];"
      f"[mu0][k2]sidechaincompress=threshold=0.015:ratio=4:attack=10:release=400[mu];"
      f"[vo][fx][mu]amix=inputs=3:normalize=0:duration=first[m]")
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{tmp}_voice.wav', '-i', f'{tmp}_sfx.wav', '-i', f'{tmp}_bed.wav',
                '-filter_complex', fc, '-map', '[m]', '-c:a', 'pcm_s24le', f'{tmp}_pre.wav'], check=True)
j = subprocess.run(['ffmpeg', '-hide_banner', '-i', f'{tmp}_pre.wav', '-af', 'loudnorm=I=-14:TP=-1:LRA=9:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
d = json.loads(j[j.rindex('{'):j.rindex('}') + 1])
ln = (f"loudnorm=I=-14:TP=-1:LRA=9:measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}"
      f":measured_thresh={d['input_thresh']}:offset={d['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{tmp}_pre.wav', '-af', ln + ',aresample=48000', '-c:a', 'pcm_s16le', f'{tmp}_mix.wav'], check=True)

vf = ''.join(f'[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{i}];' for i, (a, b) in enumerate(segs)) + \
     ''.join(f'[v{i}]' for i in range(len(segs))) + f'concat=n={len(segs)}:v=1:a=0[v];[v]fade=t=out:st={dur - .3:.2f}:d=0.3[vo]'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', R['video'], '-i', f'{tmp}_mix.wav', '-filter_complex', vf, '-map', '[vo]', '-map', '1:a',
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest',
                '-movflags', '+faststart', out], check=True)
print(out, round(dur, 1), 's', f'music turns at {turn:.1f}' if MUSIC else 'no music')
